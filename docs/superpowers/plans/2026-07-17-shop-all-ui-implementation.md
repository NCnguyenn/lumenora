# Shop All Editorial Marketplace UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved Shop All Editorial Marketplace mockup as an accessible, filterable, responsive React page while preserving existing product, wishlist, cart, and URL-search behavior.

**Architecture:** Keep filtering and URL synchronization in `Shop.tsx`, keep product presentation and card actions in `ProductCard.tsx`, and cover the page contract with a focused `Shop.test.tsx`. Use existing Lumenora tokens, generated images, Header, Footer, Zustand store, and React Router without adding dependencies.

**Tech Stack:** React 19, TypeScript, React Router, Tailwind CSS, lucide-react, Vitest, Testing Library.

## Global Constraints

- Use the approved Editorial Marketplace palette: ivory, parchment, charcoal, deep olive, oxblood, and brass.
- Keep the hero compact so products remain near the fold.
- Keep category, filters, count, and sort immediately discoverable in a sticky toolbar.
- Keep the default product grid at four columns on desktop and avoid promotional interruptions inside product rows.
- Use fictional/demo product imagery already present in `public/assets/generated` and preserve existing product interactions.
- Do not change the Home page or global Header/Footer behavior.

---

### Task 1: Add focused Shop All behavior tests

**Files:**
- Create: `Frontend/src/pages/Shop.test.tsx`

**Interfaces:**
- Consumes: `Shop`, `ProductCard`, `products`, and the existing app store.
- Produces: Regression coverage for toolbar, filter drawer, URL-synced category selection, sort selection, empty state, and product actions.

- [ ] **Step 1: Write the failing tests**

Create a `renderShop(initialEntry = '/shop')` helper using `MemoryRouter` and a test suite containing these assertions:

```tsx
it('renders the compact editorial hero and discovery toolbar', () => {
  renderShop()
  expect(screen.getByRole('heading', { name: 'Shop All' })).toBeInTheDocument()
  expect(screen.getByRole('tablist', { name: 'Product categories' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Open filters' })).toHaveAttribute('aria-expanded', 'false')
  expect(screen.getByRole('combobox', { name: 'Sort products' })).toHaveValue('featured')
})

it('opens filters and applies a brand filter as a removable chip', async () => {
  const user = userEvent.setup()
  renderShop()
  await user.click(screen.getByRole('button', { name: 'Open filters' }))
  expect(screen.getByRole('dialog', { name: 'Product filters' })).toBeInTheDocument()
  await user.selectOptions(screen.getByRole('combobox', { name: 'Brand' }), 'COSRX')
  await user.click(screen.getByRole('button', { name: 'Apply filters' }))
  expect(screen.getByRole('button', { name: 'Remove filter Brand: COSRX' })).toBeInTheDocument()
  expect(screen.getAllByRole('article')).toHaveLength(2)
})

it('changes category and sort through URL-backed controls', async () => {
  const user = userEvent.setup()
  renderShop('/shop?category=skin')
  expect(screen.getByRole('tab', { name: 'Skin' })).toHaveAttribute('aria-selected', 'true')
  await user.selectOptions(screen.getByRole('combobox', { name: 'Sort products' }), 'price-low')
  expect(screen.getByText('$8.00')).toBeInTheDocument()
})

it('keeps add-to-cart and wishlist actions available on product cards', async () => {
  const user = userEvent.setup()
  renderShop()
  const firstCard = screen.getAllByRole('article')[0]
  await user.click(within(firstCard).getByRole('button', { name: /Add .* to cart/i }))
  await user.click(within(firstCard).getByRole('button', { name: /Add .* to wishlist/i }))
  expect(within(firstCard).getByRole('button', { name: /Remove .* from wishlist/i })).toBeInTheDocument()
})
```

- [ ] **Step 2: Run only the new test file and verify the expected failures**

Run `npm.cmd test -- src/pages/Shop.test.tsx`. Expected: FAIL because the new filter drawer, named sort control, filter chips, and compact-toolbar labels do not exist yet.

### Task 2: Implement Shop All layout and discovery controls

**Files:**
- Modify: `Frontend/src/pages/Shop.tsx`

**Interfaces:**
- Consumes: `products`, `ProductCategory`, `ProductCard`, URL search params, and existing product store actions.
- Produces: `Shop` page with compact split hero, sticky toolbar, accessible filter dialog, active filter chips, URL-backed sort/category controls, and editorial end block.

- [ ] **Step 1: Add filter state and derived collections**

Add state for `isFilterOpen`, `brandFilter`, and `priceMax`; derive sorted brands and filtered products with category, query, brand, and price predicates. Preserve the existing `category`, `q`, and `sort` URL parameters, and add `brand` and `maxPrice` only when active. Use these sort values: `featured`, `new`, `bestsellers`, `price-low`, and `price-high`.

- [ ] **Step 2: Replace the tall hero/search form with the compact editorial hero**

Render a bordered split hero with the `THE COMPLETE SELECTION` eyebrow, serif `Shop All` heading, curation copy, live product/brand count, and `/assets/generated/home-daily-edit.jpg` as the right-side still life. Keep header search as the existing search entry point and continue honoring `q` when reached from SearchModal.

- [ ] **Step 3: Replace the toolbar markup with accessible category, filter, count, and sort controls**

Use `role="tablist"` and `role="tab"` for category buttons. The active tab uses `bg-olive text-ivory`. Add a 44px-equivalent `Open filters` button with `SlidersHorizontal`, a labeled native `select` named `Sort products`, and a sticky ivory backdrop. Keep category changes URL-synced with `setSearchParams(..., { replace: true })`.

- [ ] **Step 4: Add the filter dialog and removable chips**

Render an inline desktop panel/dialog below the toolbar when open. Include native selects named `Category` and `Brand`, a `Price` select with `Any price`, `Under $25`, `Under $50`, and `Under $100`, plus `Clear all` and `Apply filters`. Applying updates URL params and closes the panel. Active brand and price selections render as buttons with `Remove filter ...` labels.

- [ ] **Step 5: Add the uninterrupted product grid and end-of-list editorial block**

Keep the empty state accessible and friendly. Render products in a four-column desktop grid with `ProductCard`. After the grid, add a deep-olive `The Lumenora Edit` block with concise copy, one image, and a link to best sellers. Do not insert banners between product rows.

- [ ] **Step 6: Run the focused tests and verify they pass**

Run `npm.cmd test -- src/pages/Shop.test.tsx`. Expected: all Shop tests pass.

### Task 3: Align ProductCard with the approved visual system

**Files:**
- Modify: `Frontend/src/components/ui/ProductCard.tsx`

**Interfaces:**
- Consumes: existing `Product` data and `useAppStore` actions.
- Produces: border-light editorial card with square image, restrained badge, always-visible metadata, wishlist action, and full-width Quick add interaction.

- [ ] **Step 1: Update card anatomy and affordances**

Use an open ivory card with `aspect-square` product photography, brass brand label, serif product name, category/benefit line, price, quiet wishlist button, and a full-width `Quick add` button that transitions to oxblood on hover/focus. Preserve existing accessible wishlist labels, `aria-pressed`, product links, and `addToCart(product)` behavior.

- [ ] **Step 2: Run focused Shop tests**

Run `npm.cmd test -- src/pages/Shop.test.tsx`. Expected: all product card action assertions pass.

### Task 4: Verify integration and visual build health

**Files:**
- Modify only files from Tasks 2–3.

**Interfaces:**
- Consumes: completed Shop page and card implementation.
- Produces: passing test suite, clean lint/build, and a committed implementation.

- [ ] **Step 1: Run the complete frontend checks**

Run `npm.cmd test`, `npm.cmd run lint`, and `npm.cmd run build` from `Frontend`. Expected: all tests pass, lint exits 0, and Vite emits a production build.

- [ ] **Step 2: Review the final diff for scope**

Run `git diff --check` and `git status --short`. Confirm only `Shop.tsx`, `ProductCard.tsx`, and `Shop.test.tsx` changed, aside from the implementation plan.

- [ ] **Step 3: Commit the implementation**

Run:

```powershell
git add -- 'Frontend/src/pages/Shop.tsx' 'Frontend/src/components/ui/ProductCard.tsx' 'Frontend/src/pages/Shop.test.tsx' 'docs/superpowers/plans/2026-07-17-shop-all-ui-implementation.md'
git commit -m "feat: implement Shop All editorial marketplace UI"
```
