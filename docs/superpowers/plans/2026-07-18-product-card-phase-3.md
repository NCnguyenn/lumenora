# ProductCard Phase 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the shared ProductCard to consume the Phase 1 catalog model, show the Phase 2 primary/hover scenes and complete product metadata, and navigate to canonical PDP URLs.

**Architecture:** Modify the existing shared component in place. Use catalog selector helpers for image roles, CSS for pointer-hover crossfading, a small React error flag for failed hover images, and the existing Zustand actions until the Phase 6 store migration.

**Tech Stack:** React 19, TypeScript 6, React Router, Zustand, Tailwind CSS 3, Vitest, React Testing Library.

## Global Constraints

- Scope is limited to ProductCard and its component tests.
- Product URLs are `/products/:slug`.
- Product scenes remain local and Home image sources remain unchanged.
- Wishlist and Quick Add buttons must remain outside links.
- Keep `addToCart(product)` until Phase 6.
- Honor reduced motion and leave the primary scene visible if the hover scene fails.

---

### Task 1: ProductCard metadata, navigation, and image swap

**Files:**
- Create: `Frontend/src/components/ui/ProductCard.test.tsx`
- Modify: `Frontend/src/components/ui/ProductCard.tsx`

**Interfaces:**
- Consumes: `getPrimaryImage(product)`, `getHoverImage(product)`, `formatPrice(price)`, `Product`, `useAppStore()`.
- Produces: `ProductCard({ product, className? })` with canonical links, two-scene image rendering, rating, size, badge, Wishlist, and Quick Add.

- [ ] **Step 1: Write failing rendering and navigation tests**

Create a suite that renders `products[0]` inside `MemoryRouter`, resets the real Zustand store before each test, and asserts:

```tsx
expect(screen.getByText(product.productType)).toBeInTheDocument()
expect(screen.getByText(product.variants[0].size)).toBeInTheDocument()
expect(screen.getByLabelText('Rated 4.8 out of 5 from 310 reviews')).toBeInTheDocument()
const productLinks = screen.getAllByRole('link')
expect(productLinks).toHaveLength(2)
for (const link of productLinks) {
  expect(link).toHaveAttribute('href', `/products/${product.slug}`)
}
expect(screen.getByAltText(product.images[0].alt)).toHaveAttribute('src', product.images[0].src)
expect(document.querySelector('img[aria-hidden="true"]')).toHaveAttribute('src', product.images[1].src)
```

- [ ] **Step 2: Run the focused suite and verify RED**

Run: `npm.cmd test -- src/components/ui/ProductCard.test.tsx`

Expected: FAIL because ProductCard links to `/shop`, renders only `product.image`, and omits rating, product type, and size.

- [ ] **Step 3: Implement minimal ProductCard rendering**

Update `ProductCard.tsx` to:

```tsx
const primaryImage = getPrimaryImage(product)
const hoverImage = getHoverImage(product)
const defaultVariant =
  product.variants.find((variant) => variant.id === product.defaultVariantId) ??
  product.variants[0]
const badge = ['bestseller', 'new', 'limited'].find((value) =>
  product.badges.includes(value as Product['badges'][number]),
)
```

Render both images absolutely, link image and name to `/products/${product.slug}`, show `product.productType`, five decorative Star icons, rating value/count, `defaultVariant?.size`, price, and existing actions. Use named image-container group hover classes with `[@media(hover:hover)]`, `duration-300`, and `motion-reduce:transition-none`.

- [ ] **Step 4: Run the focused suite and verify GREEN**

Run: `npm.cmd test -- src/components/ui/ProductCard.test.tsx`

Expected: all ProductCard tests pass with no warnings.

### Task 2: Interaction structure and hover failure

**Files:**
- Modify: `Frontend/src/components/ui/ProductCard.test.tsx`
- Modify: `Frontend/src/components/ui/ProductCard.tsx`

**Interfaces:**
- Consumes: the ProductCard produced by Task 1 and the real Zustand store.
- Produces: resilient hover fallback and verified non-nested interactions.

- [ ] **Step 1: Add failing interaction and failure-path tests**

Add tests that:

```tsx
fireEvent.click(screen.getByRole('button', { name: `Add ${product.name} to wishlist` }))
expect(useAppStore.getState().wishlist).toContain(product.id)

fireEvent.click(screen.getByRole('button', { name: `Add ${product.name} to cart` }))
expect(useAppStore.getState().cart[0]).toMatchObject({ id: product.id, quantity: 1 })

for (const button of screen.getAllByRole('button')) {
  expect(button.closest('a')).toBeNull()
}

const hoverImage = document.querySelector('img[aria-hidden="true"]') as HTMLImageElement
fireEvent.error(hoverImage)
expect(document.querySelector('img[aria-hidden="true"]')).not.toBeInTheDocument()
expect(screen.getByAltText(product.images[0].alt)).toBeInTheDocument()
```

- [ ] **Step 2: Run the focused suite and verify RED**

Run: `npm.cmd test -- src/components/ui/ProductCard.test.tsx`

Expected: hover-failure test fails because the broken hover image remains mounted.

- [ ] **Step 3: Implement minimal hover error fallback**

Add component state:

```tsx
const [hoverImageFailed, setHoverImageFailed] = useState(false)
```

Render the hover image only when `!hoverImageFailed` and set the flag from its `onError` handler. Preserve the primary image and all current actions.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `npm.cmd test -- src/components/ui/ProductCard.test.tsx`

Expected: all ProductCard tests pass with no warnings.

### Task 3: Phase 3 verification

**Files:**
- Verify only; do not modify unrelated Phase 0–2 files.

**Interfaces:**
- Consumes: completed ProductCard and tests.
- Produces: fresh test, lint, build, and diff evidence.

- [ ] **Step 1: Run the complete test suite**

Run: `npm.cmd test`

Expected: exit code 0 and no failed tests.

- [ ] **Step 2: Run lint**

Run: `npm.cmd run lint`

Expected: exit code 0 and no lint errors.

- [ ] **Step 3: Run the production build**

Run: `npm.cmd run build`

Expected: exit code 0.

- [ ] **Step 4: Inspect the final diff**

Run: `git diff -- Frontend/src/components/ui/ProductCard.tsx Frontend/src/components/ui/ProductCard.test.tsx`

Expected: only Phase 3 component and test changes, with no Home image or store migration changes.
