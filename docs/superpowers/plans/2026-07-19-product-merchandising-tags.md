# Product Merchandising Tags Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give exactly 8 of 20 products one synchronized `NEW`, `SALE`, or `BEST SELLER` tag and show valid original/sale pricing on every product-introduction surface.

**Architecture:** Replace the legacy badge array and derived booleans with one nullable product tag, keep original pricing on variants, and normalize both through one pure merchandising helper. Shared `ProductTag` and `ProductPrice` components render the normalized data in ProductCard, Search, Quiz, and the PDP information panel, so a future API/database can replace the static catalog without changing UI contracts.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Tailwind CSS 3, Vitest 4, Testing Library.

## Global Constraints

- Each product has one of `new`, `sale`, `best-seller`, or `null`; multiple tags are not supported.
- Exactly 8 catalog products are tagged and 12 are untagged.
- Sale products require `compareAtPrice > price` on every in-stock variant.
- Non-sale products must not define `compareAtPrice`.
- Labels are exactly `NEW`, `SALE`, and `BEST SELLER`.
- Product tiles use the default variant; PDP pricing uses the selected variant.
- The tag treatment is rectangular oxblood with white uppercase text and no rounded pill.
- Malformed runtime sale data degrades to an untagged regular price and must never advertise a false sale.
- Do not add dependencies or an admin/CMS interface.
- Preserve pre-existing uncommitted changes in `Frontend/src/components/ui/ProductCard.tsx` and `Frontend/src/pages/Quiz.tsx`.
- Run every `npm` command below from `D:\Personal_Project\Lumenora\Frontend`.

## File Structure

- Create `Frontend/src/data/productMerchandising.ts`: pure tag-label, default-variant, and safe pricing normalization.
- Create `Frontend/src/data/productMerchandising.test.ts`: helper behavior and malformed-sale coverage.
- Modify `Frontend/src/data/types.ts`: single tag type and clean Product interface.
- Modify `Frontend/src/data/products.ts`: approved 8/20 assignments and two comparison prices.
- Modify `Frontend/src/data/products.test.ts`: catalog-count and pricing invariants.
- Create `Frontend/src/components/ui/ProductTag.tsx` and `.test.tsx`: shared tag presentation.
- Create `Frontend/src/components/ui/ProductPrice.tsx` and `.test.tsx`: shared regular/sale price presentation.
- Modify `Frontend/src/components/ui/ProductCard.tsx` and `.test.tsx`: shared grid-card integration.
- Modify `Frontend/src/components/layout/SearchModal.tsx` and `.test.tsx`: compact Search integration.
- Create `Frontend/src/components/product/QuizProductCard.tsx` and `.test.tsx`: isolated Quiz result tile.
- Modify `Frontend/src/pages/Quiz.tsx`: delegate each result tile to QuizProductCard.
- Modify `Frontend/src/components/product/ProductInfoPanel.tsx` and `.test.tsx`: selected-variant PDP integration.
- Modify `Frontend/src/pages/Home.tsx` and `Frontend/src/pages/Shop.tsx`: replace legacy sort/group booleans with `tag`.
- Modify `Frontend/src/data/productSelectors.ts`: replace legacy badge lookups with `tag`.

---

### Task 1: Single-Tag Catalog Model and Merchandising Normalizer

**Files:**
- Create: `Frontend/src/data/productMerchandising.ts`
- Create: `Frontend/src/data/productMerchandising.test.ts`
- Modify: `Frontend/src/data/types.ts:1-100`
- Modify: `Frontend/src/data/products.ts:1-1040`
- Modify: `Frontend/src/data/products.test.ts`

**Interfaces:**
- Consumes: existing `Product` and `ProductVariant` catalog shapes.
- Produces: `ProductTag`, `ProductMerchandising`, `PRODUCT_TAG_LABELS`, and `getProductMerchandising(product, variant?)`.

- [ ] **Step 1: Write failing helper and catalog tests**

```ts
// productMerchandising.test.ts
import { describe, expect, it, vi } from 'vitest'
import { products } from './products'
import { getProductMerchandising } from './productMerchandising'

describe('getProductMerchandising', () => {
  it('returns the approved label and default-variant price', () => {
    const product = products.find((item) => item.id === 'p1')!
    expect(getProductMerchandising(product)).toMatchObject({
      tag: 'new', label: 'NEW', price: 45, compareAtPrice: null, isSale: false,
    })
  })

  it('returns original and sale prices for a valid sale', () => {
    const product = products.find((item) => item.id === 'p6')!
    expect(getProductMerchandising(product)).toMatchObject({
      tag: 'sale', label: 'SALE', price: 26, compareAtPrice: 32, isSale: true,
    })
  })

  it('suppresses a malformed sale at runtime', () => {
    const product = structuredClone(products.find((item) => item.id === 'p6')!)
    product.variants[0].compareAtPrice = product.variants[0].price
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    expect(getProductMerchandising(product)).toMatchObject({
      tag: null, label: null, price: 26, compareAtPrice: null, isSale: false,
    })
    expect(warning).toHaveBeenCalledOnce()
    warning.mockRestore()
  })
})
```

Add these assertions to `products.test.ts`:

```ts
const tagged = products.filter((product) => product.tag !== null)
expect(tagged).toHaveLength(8)
expect(products.filter((product) => product.tag === null)).toHaveLength(12)

for (const product of products) {
  for (const variant of product.variants) {
    if (product.tag === 'sale' && variant.inStock) {
      expect(variant.compareAtPrice).toBeGreaterThan(variant.price)
    } else {
      expect(variant.compareAtPrice).toBeUndefined()
    }
  }
}
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `npm test -- src/data/productMerchandising.test.ts src/data/products.test.ts`

Expected: FAIL because `tag` and `getProductMerchandising` do not exist.

- [ ] **Step 3: Implement the type and pure normalizer**

```ts
// types.ts
export type ProductTag = 'new' | 'sale' | 'best-seller'

// Product
tag: ProductTag | null

// Remove Product.badges, Product.isNew, and Product.isBestSeller.
```

```ts
// productMerchandising.ts
import type { Product, ProductTag, ProductVariant } from './types'

export const PRODUCT_TAG_LABELS = {
  new: 'NEW',
  sale: 'SALE',
  'best-seller': 'BEST SELLER',
} as const satisfies Record<ProductTag, string>

export interface ProductMerchandising {
  tag: ProductTag | null
  label: (typeof PRODUCT_TAG_LABELS)[ProductTag] | null
  price: number
  compareAtPrice: number | null
  isSale: boolean
}

export function getDefaultVariant(product: Product): ProductVariant | undefined {
  return product.variants.find((variant) => variant.id === product.defaultVariantId)
    ?? product.variants[0]
}

export function getProductMerchandising(
  product: Product,
  variant: ProductVariant | undefined = getDefaultVariant(product),
): ProductMerchandising {
  const price = variant?.price ?? product.price
  if (product.tag === 'sale') {
    const compareAtPrice = variant?.compareAtPrice
    if (compareAtPrice === undefined || compareAtPrice <= price) {
      if (import.meta.env.DEV) {
        console.warn(`Invalid sale pricing for product ${product.id}`)
      }
      return { tag: null, label: null, price, compareAtPrice: null, isSale: false }
    }
    return { tag: 'sale', label: 'SALE', price, compareAtPrice, isSale: true }
  }

  return {
    tag: product.tag,
    label: product.tag ? PRODUCT_TAG_LABELS[product.tag] : null,
    price,
    compareAtPrice: null,
    isSale: false,
  }
}
```

- [ ] **Step 4: Migrate the catalog to the approved assignments**

Remove every `badges` entry from `rawProducts`. Add this complete assignment map in `products.ts` and apply it as `tag` in the final `products` map:

```ts
const tagByProductId = {
  p1: 'new',
  p2: null,
  p3: null,
  p4: null,
  p5: null,
  p6: 'sale',
  p7: null,
  p8: 'best-seller',
  p9: 'best-seller',
  p10: null,
  p11: 'sale',
  p12: 'best-seller',
  p13: 'new',
  p14: null,
  p15: null,
  p16: 'new',
  p17: null,
  p18: null,
  p19: null,
  p20: null,
} as const satisfies Record<string, ProductTag | null>

export const products: Product[] = rawProducts.map((product) => ({
  ...product,
  tag: tagByProductId[product.id as keyof typeof tagByProductId],
  image: product.images.find((image) => image.role === 'primary')?.src
    ?? product.images[0]?.src
    ?? '',
}))
```

Import `ProductTag` as a type. Add `compareAtPrice: 32.00` to p6's variant and `compareAtPrice: 31.00` to p11's variant. Keep `price` at $26.00 and $24.80 respectively. Preserve the legacy `image` compatibility field in the final catalog map, but remove derived `isNew` and `isBestSeller`.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run: `npm test -- src/data/productMerchandising.test.ts src/data/products.test.ts`

Expected: both test files PASS and catalog counts report 8 tagged / 12 untagged.

- [ ] **Step 6: Commit the data boundary**

```powershell
git add Frontend/src/data/types.ts Frontend/src/data/products.ts Frontend/src/data/products.test.ts Frontend/src/data/productMerchandising.ts Frontend/src/data/productMerchandising.test.ts
git commit -m "feat: add single product merchandising tags"
```

---

### Task 2: Shared Tag and Price Components

**Files:**
- Create: `Frontend/src/components/ui/ProductTag.tsx`
- Create: `Frontend/src/components/ui/ProductTag.test.tsx`
- Create: `Frontend/src/components/ui/ProductPrice.tsx`
- Create: `Frontend/src/components/ui/ProductPrice.test.tsx`

**Interfaces:**
- Consumes: `ProductTag`, `ProductMerchandising`, and `PRODUCT_TAG_LABELS` from Task 1.
- Produces: `<ProductTag tag placement? className? />` and `<ProductPrice merchandising compact? className? />`.

- [ ] **Step 1: Write failing component tests**

```tsx
// ProductTag.test.tsx
it('renders the approved label and returns nothing for null', () => {
  const { rerender } = render(<ProductTag tag="best-seller" />)
  expect(screen.getByText('BEST SELLER')).toHaveClass('bg-oxblood', 'text-white')
  rerender(<ProductTag tag={null} />)
  expect(screen.queryByText('BEST SELLER')).not.toBeInTheDocument()
})
```

```tsx
// ProductPrice.test.tsx
it('uses semantic and accessible sale pricing', () => {
  render(<ProductPrice merchandising={{
    tag: 'sale', label: 'SALE', price: 26, compareAtPrice: 32, isSale: true,
  }} />)
  expect(screen.getByText('$32.00').closest('del')).toBeInTheDocument()
  expect(screen.getByText('$26.00')).toBeInTheDocument()
  expect(screen.getByText('Original price')).toHaveClass('sr-only')
  expect(screen.getByText('Sale price')).toHaveClass('sr-only')
})
```

- [ ] **Step 2: Run component tests and verify RED**

Run: `npm test -- src/components/ui/ProductTag.test.tsx src/components/ui/ProductPrice.test.tsx`

Expected: FAIL because both components are missing.

- [ ] **Step 3: Implement ProductTag**

```tsx
import type { ProductTag as ProductTagValue } from '../../data/types'
import { PRODUCT_TAG_LABELS } from '../../data/productMerchandising'
import { cn } from '../../lib/utils'

interface ProductTagProps {
  tag: ProductTagValue | null
  placement?: 'overlay' | 'inline'
  className?: string
}

export function ProductTag({ tag, placement = 'overlay', className }: ProductTagProps) {
  if (!tag) return null
  return (
    <span className={cn(
      'z-10 inline-flex bg-oxblood px-3 py-2 text-[10px] font-medium uppercase tracking-folio text-white',
      placement === 'overlay' && 'absolute left-3 top-3',
      className,
    )}>
      {PRODUCT_TAG_LABELS[tag]}
    </span>
  )
}
```

- [ ] **Step 4: Implement ProductPrice**

```tsx
import type { ProductMerchandising } from '../../data/productMerchandising'
import { formatPrice } from '../../data/productSelectors'
import { cn } from '../../lib/utils'

interface ProductPriceProps {
  merchandising: ProductMerchandising
  compact?: boolean
  className?: string
}

export function ProductPrice({ merchandising, compact = false, className }: ProductPriceProps) {
  return (
    <div data-product-price className={cn(
      'flex flex-wrap items-baseline gap-x-2 gap-y-1 tabular-nums',
      compact ? 'text-xs' : 'text-sm', className,
    )}>
      {merchandising.isSale && merchandising.compareAtPrice !== null && (
        <del className="text-charcoal/50">
          <span className="sr-only">Original price</span>
          {formatPrice(merchandising.compareAtPrice)}
        </del>
      )}
      <span className={cn('font-medium', merchandising.isSale ? 'text-oxblood' : 'text-charcoal')}>
        {merchandising.isSale && <span className="sr-only">Sale price</span>}
        {formatPrice(merchandising.price)}
      </span>
    </div>
  )
}
```

- [ ] **Step 5: Run component tests and verify GREEN**

Run: `npm test -- src/components/ui/ProductTag.test.tsx src/components/ui/ProductPrice.test.tsx`

Expected: both files PASS.

- [ ] **Step 6: Commit the shared components**

```powershell
git add Frontend/src/components/ui/ProductTag.tsx Frontend/src/components/ui/ProductTag.test.tsx Frontend/src/components/ui/ProductPrice.tsx Frontend/src/components/ui/ProductPrice.test.tsx
git commit -m "feat: add shared product tag and price components"
```

---

### Task 3: Shared ProductCard Integration

**Files:**
- Modify: `Frontend/src/components/ui/ProductCard.tsx:16-150`
- Modify: `Frontend/src/components/ui/ProductCard.test.tsx`

**Interfaces:**
- Consumes: `getProductMerchandising`, `ProductTag`, and `ProductPrice`.
- Produces: synchronized cards used by Home, Shop, Wishlist, SimilarProducts, and RoutinePairings.

- [ ] **Step 1: Extend ProductCard tests for all tag states and sale pricing**

```tsx
it('renders sale and original prices from the default variant', () => {
  renderCard(products.find((item) => item.id === 'p6')!)
  expect(screen.getByText('SALE')).toBeInTheDocument()
  expect(screen.getByText('$32.00').closest('del')).toBeInTheDocument()
  expect(screen.getByText('$26.00')).toBeInTheDocument()
})

it('renders no tag wrapper for an untagged product', () => {
  const { container } = renderCard(products.find((item) => item.id === 'p2')!)
  expect(container.querySelector('[data-product-tag]')).toBeNull()
})
```

Change `renderCard()` to accept a product argument with the existing p1 as its default.

- [ ] **Step 2: Run ProductCard tests and verify RED**

Run: `npm test -- src/components/ui/ProductCard.test.tsx`

Expected: FAIL because the legacy badge renderer does not support sale or the shared test hook.

- [ ] **Step 3: Replace local badge/price logic with shared units**

```tsx
const merchandising = getProductMerchandising(product, defaultVariant)

// Inside the image wrapper:
<ProductTag tag={merchandising.tag} />

// In the price area:
<ProductPrice merchandising={merchandising} />
```

Remove the local badge-priority search, inline badge label ternary, and direct `formatPrice(product.price)` call. Preserve the user's existing `px-4 pb-4 pt-4` card padding change.

- [ ] **Step 4: Run ProductCard tests and verify GREEN**

Run: `npm test -- src/components/ui/ProductCard.test.tsx`

Expected: all ProductCard tests PASS.

- [ ] **Step 5: Commit only the feature hunks**

Stage the ProductCard test and only the ProductCard merchandising hunks; do not stage the pre-existing padding hunk.

```powershell
git add Frontend/src/components/ui/ProductCard.test.tsx
git diff -- Frontend/src/components/ui/ProductCard.tsx
git add -p Frontend/src/components/ui/ProductCard.tsx
git commit -m "feat: synchronize product card merchandising"
```

---

### Task 4: Search and Quiz Product Tiles

**Files:**
- Modify: `Frontend/src/components/layout/SearchModal.tsx:137-169`
- Modify: `Frontend/src/components/layout/SearchModal.test.tsx`
- Create: `Frontend/src/components/product/QuizProductCard.tsx`
- Create: `Frontend/src/components/product/QuizProductCard.test.tsx`
- Modify: `Frontend/src/pages/Quiz.tsx:383-412`

**Interfaces:**
- Consumes: shared merchandising helper/components and existing Quiz navigation callback.
- Produces: compact synchronized product discovery tiles in Search and Quiz.

- [ ] **Step 1: Add failing Search and Quiz tile tests**

For SearchModal, search for “Shea” and assert `SALE`, `$32.00` inside `<del>`, and `$26.00`. For QuizProductCard, render p11 and assert `SALE`, `$31.00` inside `<del>`, `$24.80`, and navigation to `/products/invisible-fluid-sunscreen-spf50` after click.

```tsx
render(<MemoryRouter><QuizProductCard product={p11} stepNumber={4} stepName="Protect" /></MemoryRouter>)
expect(screen.getByText('SALE')).toBeInTheDocument()
expect(screen.getByText('$31.00').closest('del')).toBeInTheDocument()
expect(screen.getByText('$24.80')).toBeInTheDocument()
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `npm test -- src/components/layout/SearchModal.test.tsx src/components/product/QuizProductCard.test.tsx`

Expected: FAIL because Search uses direct price output and QuizProductCard is missing.

- [ ] **Step 3: Integrate shared units into SearchModal**

Inside the result map, resolve `const merchandising = getProductMerchandising(product)`. Add `<ProductTag tag={merchandising.tag} />` inside the relative image wrapper and replace the price paragraph with `<ProductPrice merchandising={merchandising} compact className="mt-0.5" />`.

- [ ] **Step 4: Implement QuizProductCard and delegate from Quiz**

Create a focused component that keeps the current Quiz layout, calls `getProductMerchandising(product)`, renders ProductTag inside its image wrapper, renders ProductPrice in the footer, and uses `<Link to={\`/products/${product.slug}\`}>` for semantic navigation. Replace only the current `ritual.products.map` card body with `<QuizProductCard>` calls. Preserve all unrelated uncommitted Quiz design and image changes.

```tsx
{ritual.products.map((product, index) => (
  <QuizProductCard
    key={product.id}
    product={product}
    stepNumber={index + 1}
    stepName={stepNames[index] ?? product.routineStep}
  />
))}
```

- [ ] **Step 5: Run Search and Quiz tests and verify GREEN**

Run: `npm test -- src/components/layout/SearchModal.test.tsx src/components/product/QuizProductCard.test.tsx`

Expected: both files PASS.

- [ ] **Step 6: Commit only the feature hunks**

Use patch staging for `Quiz.tsx` so its pre-existing design changes remain unstaged.

```powershell
git add Frontend/src/components/layout/SearchModal.tsx Frontend/src/components/layout/SearchModal.test.tsx Frontend/src/components/product/QuizProductCard.tsx Frontend/src/components/product/QuizProductCard.test.tsx
git add -p Frontend/src/pages/Quiz.tsx
git commit -m "feat: synchronize search and quiz merchandising"
```

---

### Task 5: PDP Integration and Legacy Consumer Migration

**Files:**
- Modify: `Frontend/src/components/product/ProductInfoPanel.tsx:13-135`
- Modify: `Frontend/src/components/product/ProductInfoPanel.test.tsx`
- Modify: `Frontend/src/pages/Home.tsx:437-439`
- Modify: `Frontend/src/pages/Shop.tsx:100-112`
- Modify: `Frontend/src/data/productSelectors.ts:80-105,175-185,288-300`

**Interfaces:**
- Consumes: single product tag and selected ProductVariant.
- Produces: variant-aware PDP pricing and tag-based sorting/scoring with no legacy sources.

- [ ] **Step 1: Write failing ProductInfoPanel tests**

```tsx
it('shows the shared sale tag and selected-variant prices', () => {
  renderPanel(products.find((item) => item.id === 'p6')!)
  expect(screen.getByText('SALE')).toBeInTheDocument()
  expect(screen.getByText('$32.00').closest('del')).toBeInTheDocument()
  expect(screen.getByText('$26.00')).toBeInTheDocument()
})
```

Keep existing add-to-cart, quantity, wishlist, and sticky-CTA assertions unchanged.

- [ ] **Step 2: Run PDP tests and verify RED**

Run: `npm test -- src/components/product/ProductInfoPanel.test.tsx`

Expected: FAIL because the panel still maps `badges` and renders one direct price.

- [ ] **Step 3: Integrate selected-variant merchandising into ProductInfoPanel**

```tsx
const merchandising = getProductMerchandising(product, selectedVariant)

<div className="mt-6 flex flex-wrap items-center gap-3">
  <ProductPrice merchandising={merchandising} className="text-xl" />
  <ProductTag tag={merchandising.tag} placement="inline" />
</div>
```

Remove `badgeLabels`, the local badge map, and the direct price paragraph.

- [ ] **Step 4: Replace legacy badge/boolean consumers**

Use these exact predicates:

```ts
product.tag === 'new'
product.tag === 'best-seller'
```

Update Home shelf grouping, Shop sort options, and ProductSelectors scoring. Keep existing ordering tie-breakers unchanged.

- [ ] **Step 5: Run PDP and selector/catalog tests and verify GREEN**

Run: `npm test -- src/components/product/ProductInfoPanel.test.tsx src/data/products.test.ts`

Expected: all focused tests PASS and TypeScript has no `badges`, `isNew`, or `isBestSeller` consumer.

- [ ] **Step 6: Commit the PDP and consumer migration**

```powershell
git add Frontend/src/components/product/ProductInfoPanel.tsx Frontend/src/components/product/ProductInfoPanel.test.tsx Frontend/src/pages/Home.tsx Frontend/src/pages/Shop.tsx Frontend/src/data/productSelectors.ts
git commit -m "feat: migrate product merchandising consumers"
```

---

### Task 6: Full Verification and Visual Regression Check

**Files:**
- Modify only files implicated by verification failures.

**Interfaces:**
- Consumes: complete implementation from Tasks 1-5.
- Produces: passing repository checks and verified responsive behavior.

- [ ] **Step 1: Prove legacy sources are gone**

Run:

```powershell
Get-ChildItem Frontend/src -Recurse -File -Include *.ts,*.tsx | Select-String -Pattern '\.badges|badges:|\.isNew|\.isBestSeller'
```

Expected: no output.

- [ ] **Step 2: Run the full unit test suite**

Run: `npm test`

Expected: exit code 0 with all test files passing.

- [ ] **Step 3: Run lint**

Run: `npm run lint`

Expected: exit code 0 and no lint errors.

- [ ] **Step 4: Run the production build**

Run: `npm run build`

Expected: TypeScript and Vite complete with exit code 0 and generate `dist`.

- [ ] **Step 5: Check representative responsive surfaces**

At mobile and desktop widths, inspect p1, p6, p8, p11, and one untagged product on Home/Shop, Search, Quiz results, and PDP. Verify the tag remains top-left, wishlist remains top-right, untagged tiles reserve no gap, and both sale prices remain readable.

- [ ] **Step 6: Record final status without staging user-owned changes**

Run: `git status --short` and `git diff --check`.

Expected: no whitespace errors. Pre-existing ProductCard padding, Quiz redesign, and generated Quiz images remain preserved. If implementation commits were intentionally skipped because the working tree is shared, report the exact modified files instead of staging user-owned hunks.
