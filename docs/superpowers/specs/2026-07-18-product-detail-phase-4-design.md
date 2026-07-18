# Product Detail Phase 4 Design

## Scope

Implement Phase 4 from `instructions/antigravity-lumenora-product-system-master.md`: add the canonical `/products/:slug` route, a responsive product detail page, a three-scene gallery, a purchase panel, accessible detail accordions, a product-not-found state, and focused tests.

Phase 4 consumes the completed catalog, selectors, images, and ProductCard links. It does not implement Similar Products or Routine Pairings (Phase 5), cart persistence migration or cross-surface integration (Phase 6), or lightbox, sticky mobile Add to Cart, and SEO polish (Phase 7).

## Component architecture

Create four focused units:

- `Frontend/src/pages/ProductDetail.tsx` resolves the route slug, renders the breadcrumb and responsive page composition, and selects the valid or not-found state.
- `Frontend/src/components/product/ProductGallery.tsx` owns the active image and failed-image state for the three catalog scenes.
- `Frontend/src/components/product/ProductInfoPanel.tsx` owns selected variant, quantity, cart feedback, and purchase/wishlist interactions.
- `Frontend/src/components/product/ProductDetailsAccordion.tsx` renders structured catalog content and brand information below the fold.

Add `path="products/:slug"` beneath the existing shared Layout route in `Frontend/src/App.tsx`.

## Data flow

`ProductDetail` reads `slug` with `useParams()` and resolves it with `getProductBySlug(slug)`. A valid product is passed to the three product components. The brand story is resolved with `getBrandById(product.brandId)` and passed to the details component.

The default variant is selected by `defaultVariantId`, falling back to the first variant. If no variant exists, the page remains readable but Add to Cart is disabled. Price and size follow the selected variant.

The existing store API remains in place until Phase 6. Add to Cart calls `addToCart(cartProduct, quantity)`, where `cartProduct` is a shallow product copy whose `price` and `defaultVariantId` reflect the selected variant. This preserves the selected variant for the later migration while retaining current behavior. The present catalog contains one variant per product, so the current store's product-id merging limitation does not affect Phase 4.

## Page layout

The page uses the existing ivory, parchment, charcoal, oxblood, olive, and brass editorial system.

Desktop uses a two-column layout with the gallery at roughly 55–60% and a sticky information panel at roughly 40–45%. Mobile stacks the gallery before product information. The page uses square edges, light borders, and no heavy shadows.

The breadcrumb links to Shop and the product category, followed by the current product name as plain text.

## Product gallery

- Render all three catalog scenes as thumbnail buttons.
- The primary scene is active initially.
- Selecting a thumbnail updates the main image.
- Native buttons provide keyboard support; the active button uses `aria-current="true"` and a visible border state.
- The main image uses catalog alt, width, and height metadata and is not lazily loaded because it is the page's principal visual.
- Thumbnail images are decorative within labelled buttons.
- When an image fails, record its id once and replace that image with a neutral parchment placeholder reading `Image unavailable`; do not retry through an `onError` loop.
- No lightbox or swipe library is added in Phase 4.

## Product information panel

The above-the-fold order is:

1. Brand and badges.
2. Product name and subtitle.
3. Accessible five-star treatment, numeric rating, and review count.
4. Variant-aware price.
5. Size/variant selector and stock state.
6. Short description.
7. Quantity control constrained to 1–10.
8. Add to Cart and Wishlist controls.
9. Shipping note.

One-variant products show the selected size without unnecessary choice controls. Multiple variants render labelled radio buttons, and out-of-stock variants are disabled. Add to Cart is disabled when no valid in-stock variant is selected. After a successful add, an `aria-live="polite"` status reports the quantity and product name. Wishlist retains `aria-pressed` and descriptive add/remove labels.

## Detail accordions

Use native `<details>/<summary>` elements for predictable keyboard and screen-reader behavior. The Overview section is open initially; the remaining sections start closed.

Sections are:

- Overview: description paragraphs and benefits.
- Key ingredients: ingredient names and benefits.
- Full ingredients.
- How to use: ordered steps.
- Product facts and care: product type, routine step, usage time, skin types, concerns, texture, finish, scent, and warnings when present.
- Brand story: brand short story and full story when present.
- Shipping and returns.

Empty optional facts are omitted rather than rendered as blank labels.

## Product not found

An absent or invalid slug renders a complete in-layout state with heading `Product Not Found`, explanatory copy, and a `Back to Shop` link to `/shop`. It does not redirect to Home and does not render a blank page.

## Testing

Create `Frontend/src/pages/ProductDetail.test.tsx` with React Testing Library, Vitest, and a `MemoryRouter`/`Routes` harness.

Tests cover:

- A valid slug renders brand, product name, price, rating, size, and key content sections.
- The gallery renders three thumbnail controls and changes the active/main scene.
- An image error produces the neutral placeholder without an error loop.
- Quantity stays within 1–10 and Add to Cart sends the chosen quantity through the real Zustand store.
- Wishlist toggles through the real store.
- An invalid slug renders `Product Not Found` and the Shop CTA.
- The application route is registered at `/products/:slug`.

After focused RED/GREEN cycles, run the full test suite, lint, and production build. Existing Home assets and later-phase store/selectors must remain unchanged.
