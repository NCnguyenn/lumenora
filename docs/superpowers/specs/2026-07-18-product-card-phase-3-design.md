# ProductCard Phase 3 Design

## Scope

Implement Phase 3 from `instructions/antigravity-lumenora-product-system-master.md` by upgrading the shared `ProductCard` and adding focused component tests. The work must consume the Phase 1 catalog model and Phase 2 local image scenes without changing Home image sources, the cart persistence schema, PDP implementation, or integration work assigned to later phases.

## Chosen approach

Upgrade `Frontend/src/components/ui/ProductCard.tsx` in place. Keep the component as the shared card surface and use the existing catalog selectors rather than introducing additional product-card subcomponents in this phase.

This approach keeps the change local, follows the existing component structure, and avoids pulling Phase 4 or Phase 6 responsibilities forward.

## Product data and navigation

- Resolve the primary and hover scenes with `getPrimaryImage(product)` and `getHoverImage(product)`.
- Resolve the displayed size from the product's `defaultVariantId`. If that lookup unexpectedly fails, fall back to the first variant; if no variant exists, omit the size instead of crashing.
- Read badges from `product.badges`, rating from `product.rating`, and descriptive type from `product.productType`.
- Link both the image and product name to the canonical `/products/:slug` URL.
- Keep Wishlist and Quick Add buttons outside all links so the card contains no nested interactive controls.
- Keep the current `addToCart(product)` call until the cart schema migration in Phase 6.

## Image behavior

- Render the primary and hover images together inside the square image container to avoid a network flash during hover.
- Crossfade opacity over 300 ms when a pointer hovers the image container.
- Keep the primary image visible on touch devices where hover is unavailable.
- Apply `motion-reduce:transition-none` so reduced-motion users do not receive an animated crossfade.
- Mark the hover image as decorative with an empty alt and `aria-hidden`.
- If the hover image fails to load, hide it and leave the primary image visible.
- Use the catalog-provided width and height metadata and retain lazy loading and async decoding.

## Card content

The visual content order is:

1. Image, badge, and wishlist control.
2. Brand.
3. Product name.
4. Product type.
5. Rating value, five-star visual treatment, and review count with a complete screen-reader label.
6. Default size when available.
7. Price.
8. Quick Add.

Badge priority follows the existing behavior: `bestseller` before `new`, then `limited` when applicable.

## Accessibility and interaction

- The rating exposes `Rated {value} out of 5 from {count} reviews` as its accessible label.
- Decorative star icons and the hover image remain hidden from assistive technology.
- Wishlist retains its pressed state and descriptive add/remove label.
- Quick Add retains a descriptive product-specific label.
- Existing focus-visible styles and 44px action targets remain intact.

## Tests

Add `Frontend/src/components/ui/ProductCard.test.tsx` using React Testing Library, Vitest, and `MemoryRouter`. Tests will be written before production changes and must first fail for the expected missing behavior.

The suite covers:

- Brand, product name, product type, price, rating, review count, default size, and badge rendering.
- Canonical PDP links on both the image and name.
- Primary and hover images present in the DOM with the expected accessibility attributes.
- Wishlist toggling and Quick Add behavior through the real Zustand store.
- No interactive button nested inside a link.
- Hover-image failure leaves the primary image available.

After the focused test passes, run the complete test suite, lint, and production build. Existing Phase 0–2 working-tree changes must be preserved.
