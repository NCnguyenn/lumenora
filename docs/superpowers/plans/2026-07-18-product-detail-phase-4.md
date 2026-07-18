# Product Detail Phase 4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a tested, responsive product detail route with a resilient three-image gallery, variant-aware purchase panel, complete catalog content, and product-not-found state.

**Architecture:** `ProductDetail` resolves route data and composes three focused product components. Each stateful component owns only its local concern: gallery selection/image failures, purchase selection/quantity/store actions, or native detail accordions.

**Tech Stack:** React 19, TypeScript 6, React Router 7, Zustand 5, Tailwind CSS 3, Vitest 4, React Testing Library 16.

## Global Constraints

- Canonical route is `/products/:slug`.
- Use the existing catalog, brand, selector, and Zustand APIs.
- Keep cart persistence migration in Phase 6.
- Keep Similar/Routine, lightbox, sticky mobile ATC, and SEO polish out of Phase 4.
- Product images remain local; Home image sources remain unchanged.
- Quantity is constrained to 1–10 and unavailable variants cannot be purchased.

---

### Task 1: Resilient product gallery

**Files:**
- Create: `Frontend/src/components/product/ProductGallery.tsx`
- Create: `Frontend/src/components/product/ProductGallery.test.tsx`

**Interfaces:**
- Consumes: `product: Product` and `product.images: ProductImage[]`.
- Produces: `ProductGallery({ product }: { product: Product })` with one main scene and three labelled thumbnail buttons.

- [x] **Step 1: Write the failing gallery tests**

Use `products[0]` and assert the primary main scene, three thumbnail buttons, selection of the detail scene, `aria-current`, and one-time image failure replacement:

```tsx
const { container } = render(<ProductGallery product={product} />)
expect(screen.getByRole('img', { name: product.images[0].alt })).toHaveAttribute(
  'src',
  product.images[0].src,
)
const thumbs = screen.getAllByRole('button', { name: /^View image/ })
expect(thumbs).toHaveLength(3)
fireEvent.click(thumbs[2])
expect(thumbs[2]).toHaveAttribute('aria-current', 'true')
expect(screen.getByRole('img', { name: product.images[2].alt })).toHaveAttribute(
  'src',
  product.images[2].src,
)
fireEvent.error(screen.getByRole('img', { name: product.images[2].alt }))
expect(screen.getByText('Image unavailable')).toBeInTheDocument()
expect(container.querySelector(`img[src="${product.images[2].src}"]`)).toBeNull()
```

- [x] **Step 2: Run the gallery suite and verify RED**

Run: `npm.cmd test -- src/components/product/ProductGallery.test.tsx`

Expected: FAIL because `ProductGallery.tsx` does not exist.

- [x] **Step 3: Implement ProductGallery**

Use `useState(product.images[0]?.id)` for the active id and `Set<string>` for failures. Render the active image when its id is not failed, otherwise render:

```tsx
<div role="img" aria-label={`${product.name} image unavailable`}>
  <span>Image unavailable</span>
</div>
```

Each thumbnail button uses `aria-label={`View image ${index + 1}: ${image.alt}`}`, `aria-current={isActive ? 'true' : undefined}`, and a decorative image with `alt=""`. Failed thumbnail images are replaced with a labelled neutral swatch.

- [x] **Step 4: Run the gallery suite and verify GREEN**

Run: `npm.cmd test -- src/components/product/ProductGallery.test.tsx`

Expected: all gallery tests pass.

### Task 2: Variant-aware product information panel

**Files:**
- Create: `Frontend/src/components/product/ProductInfoPanel.tsx`
- Create: `Frontend/src/components/product/ProductInfoPanel.test.tsx`

**Interfaces:**
- Consumes: `product: Product`, `useAppStore()`, and `formatPrice(price)`.
- Produces: `ProductInfoPanel({ product }: { product: Product })` with rating, variant, quantity, Add to Cart, Wishlist, and live feedback.

- [x] **Step 1: Write failing info-panel tests**

Reset the real store before each test. Assert metadata, quantity boundaries, cart quantity, and wishlist state:

```tsx
expect(screen.getByRole('heading', { name: product.name })).toBeInTheDocument()
expect(screen.getByLabelText('Rated 4.8 out of 5 from 310 reviews')).toBeInTheDocument()
expect(screen.getByText(product.variants[0].size)).toBeInTheDocument()
fireEvent.click(screen.getByRole('button', { name: 'Increase quantity' }))
fireEvent.click(screen.getByRole('button', { name: 'Add 2 to cart' }))
expect(useAppStore.getState().cart[0]).toMatchObject({ id: product.id, quantity: 2 })
fireEvent.click(screen.getByRole('button', { name: `Add ${product.name} to wishlist` }))
expect(useAppStore.getState().wishlist).toContain(product.id)
```

Click Increase at least twelve times and assert the displayed quantity is `10`; click Decrease at least twelve times and assert it is `1`.

- [x] **Step 2: Run the info-panel suite and verify RED**

Run: `npm.cmd test -- src/components/product/ProductInfoPanel.test.tsx`

Expected: FAIL because `ProductInfoPanel.tsx` does not exist.

- [x] **Step 3: Implement ProductInfoPanel**

Resolve the selected variant with:

```tsx
const initialVariant =
  product.variants.find((variant) => variant.id === product.defaultVariantId) ??
  product.variants[0]
const [selectedVariantId, setSelectedVariantId] = useState(initialVariant?.id ?? '')
const selectedVariant = product.variants.find(
  (variant) => variant.id === selectedVariantId,
)
```

Use `Math.min(10, quantity + 1)` and `Math.max(1, quantity - 1)`. For Add to Cart, create:

```tsx
const cartProduct = {
  ...product,
  price: selectedVariant.price,
  defaultVariantId: selectedVariant.id,
}
addToCart(cartProduct, quantity)
setCartMessage(`Added ${quantity} ${product.name} to cart`)
```

Render a single size label for one variant or labelled radio buttons for multiple variants. Disable unavailable radios and Add to Cart when no in-stock selected variant exists. Render the message in `role="status"` with `aria-live="polite"`.

- [x] **Step 4: Run the info-panel suite and verify GREEN**

Run: `npm.cmd test -- src/components/product/ProductInfoPanel.test.tsx`

Expected: all info-panel tests pass.

### Task 3: Complete product detail accordions

**Files:**
- Create: `Frontend/src/components/product/ProductDetailsAccordion.tsx`
- Create: `Frontend/src/components/product/ProductDetailsAccordion.test.tsx`

**Interfaces:**
- Consumes: `product: Product` and `brand?: Brand`.
- Produces: `ProductDetailsAccordion({ product, brand })` containing seven native details sections.

- [x] **Step 1: Write failing accordion tests**

Render `products[0]` and `getBrandById(product.brandId)`. Assert the seven summary names, Overview open state, description, benefits, ingredients, ordered usage steps, facts, brand story, warnings, and shipping/returns:

```tsx
expect(screen.getByText('Overview').closest('details')).toHaveAttribute('open')
expect(screen.getByText('Key ingredients')).toBeInTheDocument()
expect(screen.getByText('Full ingredients')).toBeInTheDocument()
expect(screen.getByText('How to use')).toBeInTheDocument()
expect(screen.getByText('Product facts & care')).toBeInTheDocument()
expect(screen.getByText('Brand story')).toBeInTheDocument()
expect(screen.getByText('Shipping & returns')).toBeInTheDocument()
expect(screen.getByText(product.description[0])).toBeInTheDocument()
expect(screen.getByText(product.keyIngredients[0].name)).toBeInTheDocument()
expect(screen.getByText(brand!.shortStory)).toBeInTheDocument()
```

- [x] **Step 2: Run the accordion suite and verify RED**

Run: `npm.cmd test -- src/components/product/ProductDetailsAccordion.test.tsx`

Expected: FAIL because `ProductDetailsAccordion.tsx` does not exist.

- [x] **Step 3: Implement ProductDetailsAccordion**

Create a local `DetailSection` wrapper around native `<details>` and `<summary>`. Render all required sections explicitly, use semantic `<ul>` and `<ol>` collections, and omit `texture`, `finish`, or `scent` rows when their values are absent.

- [x] **Step 4: Run the accordion suite and verify GREEN**

Run: `npm.cmd test -- src/components/product/ProductDetailsAccordion.test.tsx`

Expected: all accordion tests pass.

### Task 4: Product detail page and canonical route

**Files:**
- Create: `Frontend/src/pages/ProductDetail.tsx`
- Create: `Frontend/src/pages/ProductDetail.test.tsx`
- Modify: `Frontend/src/App.tsx`

**Interfaces:**
- Consumes: `useParams()`, `getProductBySlug`, `getBrandById`, and the three components from Tasks 1–3.
- Produces: `ProductDetail()` and the application route `products/:slug`.

- [x] **Step 1: Write failing page tests**

Use a `MemoryRouter` and `Routes` harness:

```tsx
function renderProductRoute(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="products/:slug" element={<ProductDetail />} />
      </Routes>
    </MemoryRouter>,
  )
}
```

For a valid slug, assert breadcrumb links to `/shop` and `/shop?category=skin`, main heading, three gallery buttons, Add to Cart, and accordion sections. For `/products/not-a-product`, assert `Product Not Found`, absence of the product buy box, and `Back to Shop` link to `/shop`.

- [x] **Step 2: Run the page suite and verify RED**

Run: `npm.cmd test -- src/pages/ProductDetail.test.tsx`

Expected: FAIL because `ProductDetail.tsx` and the application route do not exist.

- [x] **Step 3: Implement ProductDetail and register the route**

Resolve the product:

```tsx
const { slug } = useParams<{ slug: string }>()
const product = slug ? getProductBySlug(slug) : undefined
```

Return the complete not-found state when undefined. For a valid product, render the breadcrumb, a responsive `lg:grid-cols-12` composition with gallery `lg:col-span-7` and sticky info panel `lg:col-span-5`, followed by the details accordion. Add this route to `App.tsx`:

```tsx
<Route path="products/:slug" element={<ProductDetail />} />
```

- [x] **Step 4: Run the page suite and verify GREEN**

Run: `npm.cmd test -- src/pages/ProductDetail.test.tsx`

Expected: all page tests pass.

### Task 5: Phase 4 verification

**Files:**
- Verify all Phase 4 files and preserve unrelated files.

**Interfaces:**
- Produces fresh evidence for focused tests, full tests, lint, build, and scope.

- [x] **Step 1: Run all focused Phase 4 tests**

Run: `npm.cmd test -- src/components/product src/pages/ProductDetail.test.tsx`

Expected: all Phase 4 tests pass.

- [x] **Step 2: Run the full test suite**

Run: `npm.cmd test`

Expected: exit code 0 and no failures.

- [x] **Step 3: Run lint and production build**

Run: `npm.cmd run lint`

Expected: exit code 0.

Run: `npm.cmd run build`

Expected: exit code 0.

- [x] **Step 4: Inspect status and diff**

Run: `git status --short`

Run: `git diff --check`

Expected: only Phase 4 plan, product components/tests, ProductDetail page/test, and App route are changed; no Home asset or store migration changes.
