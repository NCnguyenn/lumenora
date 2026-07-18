# Product Detail Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task with verification checkpoints.

**Goal:** Rework the Lumenora product detail page so the first viewport feels denser and more luxurious on desktop while remaining clear and conversion-focused on mobile, matching the approved asymmetric-mosaic mockup.

**Architecture:** Keep the existing ProductDetail composition and product behavior intact. Add a compact highlights strip and refactor the existing gallery/info layout classes so the gallery uses an asymmetric desktop grid, the info panel has tighter editorial spacing, and the mobile sticky ATC remains the only fixed purchase control. Reuse existing selectors, product data, icons, and Tailwind tokens; avoid introducing new dependencies.

**Tech Stack:** React 19, TypeScript, React Router, Tailwind utility classes, Vitest + Testing Library, Vite.

## Global Constraints

- Preserve current product selection, quantity, cart, wishlist, JSON-LD, breadcrumb, similar-product, and routine-pairing behavior.
- Use existing Lumenora tokens (`ivory`, `parchment`, `charcoal`, `olive`, `brass`, `oxblood`) and existing typography classes.
- Keep all interactive controls keyboard-accessible with existing focus-visible patterns.
- Keep user-visible copy concise; do not add long paragraphs to the first viewport.

---

### Task 1: Add failing coverage for the denser PDP structure

**Files:**
- Modify: `Frontend/src/pages/ProductDetail.test.tsx`
- Modify: `Frontend/src/components/product/ProductInfoPanel.test.tsx`

**Interfaces:**
- Consumes: Existing `ProductDetail` and `ProductInfoPanel` render helpers.
- Produces: Regression assertions for the new highlights strip and compact purchase metadata.

- [ ] **Step 1: Write the failing tests**

Add assertions that a valid PDP exposes a `Product highlights` region containing `Why it works`, `How to use`, and `Ingredients`, and that the purchase panel exposes a concise `Free shipping over $50` note. Keep existing behavior assertions unchanged.

- [ ] **Step 2: Run the focused tests to verify they fail**

Run from `Frontend`:

```powershell
npm test -- ProductDetail.test.tsx ProductInfoPanel.test.tsx
```

Expected: the existing tests pass, and the new assertions fail because the highlights region/copy are not present yet.

- [ ] **Step 3: Commit the red tests**

```powershell
git add Frontend/src/pages/ProductDetail.test.tsx Frontend/src/components/product/ProductInfoPanel.test.tsx
git commit -m "test: specify denser product detail layout"
```

### Task 2: Implement the highlights strip and compact info spacing

**Files:**
- Create: `Frontend/src/components/product/ProductHighlights.tsx`
- Modify: `Frontend/src/pages/ProductDetail.tsx`
- Modify: `Frontend/src/components/product/ProductInfoPanel.tsx`
- Test: `Frontend/src/components/product/ProductHighlights.test.tsx`

**Interfaces:**
- Consumes: `Product` from `Frontend/src/data/products` and existing `ProductInfoPanel` state/actions.
- Produces: `ProductHighlights({ product }: { product: Product })` with an accessible `region` named `Product highlights`.

- [ ] **Step 1: Write the failing component test**

Create a focused test rendering `ProductHighlights` and assert the region plus the three short headings are present.

- [ ] **Step 2: Run the component test to verify it fails**

```powershell
npm test -- ProductHighlights.test.tsx
```

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the minimal component and info-panel copy**

Create three bordered cells using existing Lucide icons (`Sprout`, `Droplets`, `Leaf`) and short, product-derived copy. Add the component below the gallery/info hero in `ProductDetail`. Tighten only vertical margins in `ProductInfoPanel`, rename the visible shipping note to `Free shipping over $50` while keeping its source data and accessible status intact, and preserve all event handlers and labels.

- [ ] **Step 4: Run focused tests to verify they pass**

```powershell
npm test -- ProductHighlights.test.tsx ProductDetail.test.tsx ProductInfoPanel.test.tsx
```

Expected: PASS with no console errors.

- [ ] **Step 5: Commit the component change**

```powershell
git add Frontend/src/components/product/ProductHighlights.tsx Frontend/src/components/product/ProductHighlights.test.tsx Frontend/src/pages/ProductDetail.tsx Frontend/src/components/product/ProductInfoPanel.tsx
git commit -m "feat: add compact product highlights to PDP"
```

### Task 3: Match the approved asymmetric gallery and responsive layout

**Files:**
- Modify: `Frontend/src/components/product/ProductGallery.tsx`
- Modify: `Frontend/src/pages/ProductDetail.tsx`
- Modify: `Frontend/src/components/product/ProductInfoPanel.tsx`
- Test: `Frontend/src/components/product/ProductGallery.test.tsx`

**Interfaces:**
- Consumes: Existing image list and lightbox behavior.
- Produces: Desktop mosaic layout with one primary image and two secondary images; mobile retains a single active image plus horizontal thumbnails.

- [ ] **Step 1: Extend the gallery test with the layout hooks**

Assert the gallery root exposes a stable `data-gallery-layout="mosaic"` attribute and that all existing image buttons/lightbox labels remain available.

- [ ] **Step 2: Run the gallery test to verify the new assertion fails**

```powershell
npm test -- ProductGallery.test.tsx
```

Expected: FAIL only on the missing layout hook.

- [ ] **Step 3: Implement responsive mosaic classes**

Add the layout hook and use a desktop grid where the active image spans two rows while the remaining images stack in the second column; below `lg`, fall back to the current square active image and a horizontally scrollable thumbnail rail. Keep the lightbox trigger, fallback state, image error handling, and focus styles unchanged.

- [ ] **Step 4: Tighten page spacing and place highlights immediately below hero**

Adjust the `ProductDetail` wrapper and hero grid gaps/padding to reduce the large empty band while keeping the info column sticky at desktop. Place `ProductHighlights` directly after the hero grid, then keep the details accordion and product rails below it.

- [ ] **Step 5: Run focused tests**

```powershell
npm test -- ProductGallery.test.tsx ProductDetail.test.tsx ProductInfoPanel.test.tsx ProductHighlights.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit the responsive layout**

```powershell
git add Frontend/src/components/product/ProductGallery.tsx Frontend/src/pages/ProductDetail.tsx Frontend/src/components/product/ProductInfoPanel.tsx Frontend/src/components/product/ProductGallery.test.tsx
git commit -m "feat: refine responsive PDP editorial layout"
```

### Task 4: Verify the full frontend build and test suite

**Files:**
- No new files; inspect the final diff and generated build output.

- [ ] **Step 1: Run the complete test suite**

```powershell
npm test
```

Expected: all Vitest suites pass with zero failures.

- [ ] **Step 2: Run lint and production build**

```powershell
npm run lint
npm run build
```

Expected: both commands exit with code 0 and produce no TypeScript or lint errors.

- [ ] **Step 3: Review the final diff**

```powershell
git diff --stat HEAD~3..HEAD
git status --short
```

Confirm only the PDP components/tests and the implementation plan were changed, with no accidental dependency or generated-file edits.
