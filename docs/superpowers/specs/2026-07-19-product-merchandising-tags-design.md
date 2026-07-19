# Product Merchandising Tags Design

**Date:** 2026-07-19

**Status:** Approved

## Goal

Add one optional merchandising tag to each product and render that tag consistently anywhere the interface introduces a product. Supported labels are `NEW`, `SALE`, and `BEST SELLER`. Sale products also show an original price crossed out beside the active sale price.

## Scope

The feature applies to every product-discovery surface in the current application:

- Home product shelf
- Shop grid
- Wishlist grid
- Search modal product tiles
- Quiz ritual result cards
- Product-detail similar-product and routine rails
- Product-detail primary information panel

Cart totals continue to use the active variant price, including a sale price, but the cart does not display a merchandising tag because it is a transactional surface rather than a product-introduction surface.

## Data Model

Replace the current multi-value badge model with a nullable, single-value tag:

```ts
export type ProductTag = 'new' | 'sale' | 'best-seller';

export interface Product {
  // Existing product fields remain unchanged.
  tag: ProductTag | null;
}

export interface ProductVariant {
  // Existing variant fields remain unchanged.
  price: number;
  compareAtPrice?: number;
}
```

`Product.tag` is the only source of truth for merchandising status. The legacy `badges`, `isNew`, and `isBestSeller` fields are removed, and sorting/filtering code reads `tag` directly.

This shape is migration-friendly. A future database can store a nullable enum or constrained string in `products.tag`, while `product_variants.price` and nullable `product_variants.compare_at_price` preserve variant-level pricing. An API can return the same values without changing the presentation interfaces.

## Business Rules

- A product has exactly one supported tag or `null`.
- A `null` tag renders no badge and reserves no badge space.
- A product tagged `sale` must have `compareAtPrice > price` on every in-stock variant.
- Products tagged `new`, tagged `best-seller`, or untagged must not define `compareAtPrice`.
- Product-card pricing uses the default variant.
- Product-detail pricing uses the currently selected variant.
- Cart totals use the current variant `price`, which is the payable sale price when a product is on sale.
- Tags are merchandising data, not values inferred from ratings, dates, or prices. This keeps editorial decisions explicit and portable to a future CMS or database.
- If malformed sale data reaches the UI at runtime, the merchandising helper returns an untagged regular-price presentation and emits a development warning. It never displays a `SALE` label without a valid original price.

## Catalog Assignment

Exactly 8 of the 20 catalog products have a tag. The other 12 use `tag: null`.

| Product | Tag | Current price | Original price |
|---|---|---:|---:|
| p1 — Bamboo Ultra Hydrating Toner | `new` | $45.00 | — |
| p13 — Cedar & Fig Eau de Parfum | `new` | $98.00 | — |
| p16 — Mineral Veil Sun Milk SPF 50 | `new` | $28.00 | — |
| p8 — Advanced Snail 96 Mucin Power Essence | `best-seller` | $25.00 | — |
| p9 — Niacinamide 10% + Zinc 1% | `best-seller` | $8.00 | — |
| p12 — Low pH Good Morning Gel Cleanser | `best-seller` | $14.00 | — |
| p6 — Nourishing Shea Body Butter | `sale` | $26.00 | $32.00 |
| p11 — Invisible Fluid Sunscreen SPF 50+ PA++++ | `sale` | $24.80 | $31.00 |

## Presentation Architecture

Three focused presentation units keep all surfaces synchronized:

### `getProductMerchandising(product, variant?)`

A pure helper resolves the effective variant and returns normalized display data:

```ts
interface ProductMerchandising {
  tag: ProductTag | null;
  label: 'NEW' | 'SALE' | 'BEST SELLER' | null;
  price: number;
  compareAtPrice: number | null;
  isSale: boolean;
}
```

When no variant is supplied, it resolves the default variant, falling back to the first variant in the same way as the existing card and buy-box logic. `compareAtPrice` is exposed only when `tag === 'sale'` and the stored comparison price is greater than the current price. For malformed sale data, the helper returns `tag: null`, `label: null`, `compareAtPrice: null`, and `isSale: false`, preserving the current price without advertising a false discount.

### `ProductTag`

`ProductTag` accepts a nullable `ProductTag` value. It returns `null` for an untagged product and otherwise maps the value through one centralized label configuration.

The product-card treatment matches the supplied reference:

- rectangular oxblood background
- white uppercase text
- folio letter spacing
- top-left overlay on the image
- sufficient stacking order to remain visible over both primary and hover images
- no rounded pill styling

The wishlist control remains top-right, so the two controls do not overlap. The product-detail information panel uses the same component inline in the buy information rather than positioning it over the gallery.

### `ProductPrice`

`ProductPrice` accepts normalized merchandising data plus an optional class name or compact mode. Normal products show one formatted price. Sale products show:

- original price in a semantic `<del>` element, visually muted
- current sale price as the primary price
- screen-reader labels “Original price” and “Sale price”

Compact mode supports Search and Quiz without duplicating pricing rules. ProductCard and ProductInfoPanel use the regular treatment.

## Data Flow

```text
products.ts now / API or database later
  -> Product + selected/default ProductVariant
  -> getProductMerchandising()
  -> ProductTag + ProductPrice
  -> Home / Shop / Wishlist / Search / Quiz / PDP / product rails
```

Home, Shop, Wishlist, and both PDP rails already share `ProductCard`, so one ProductCard integration covers those surfaces. SearchModal and Quiz retain their purpose-built layouts but consume the same helper and presentation components. ProductInfoPanel passes the selected variant so its price changes correctly after a variant selection.

## Catalog Validation

Extend catalog validation and its tests to enforce:

- exactly 20 products remain in the demo catalog
- exactly 8 products have a non-null tag and exactly 12 are untagged
- only the three supported tag values are accepted by the TypeScript model
- every sale product has a valid higher comparison price on each in-stock variant
- non-sale products do not carry comparison prices
- each product price continues to match its default variant price

Invalid sale data is a test failure and a catalog validation error; the interface must not silently present a false discount.

## Accessibility and Responsive Behavior

- Tag text remains visible text rather than relying on color alone.
- Sale prices expose explicit original-price and sale-price labels to assistive technology.
- The original price uses `<del>` so the price relationship remains semantic.
- The top-left tag and top-right wishlist control must not overlap at supported mobile and desktop widths.
- An untagged product renders no empty badge wrapper.
- Tag and price typography may scale by surface, but labels, colors, and pricing meaning remain consistent.

## Testing Strategy

Use Vitest and Testing Library to cover:

- merchandising helper output for untagged, new, best-seller, valid sale, and malformed sale data
- ProductTag labels and its null-render behavior
- ProductPrice regular and sale markup, formatting, and accessible labels
- ProductCard tag overlay, sale pricing, and untagged rendering
- SearchModal tag and compact sale pricing
- Quiz ritual card tag and compact sale pricing
- ProductInfoPanel tag rendering and selected-variant pricing
- catalog assignment count and all sale invariants

Run the full project checks after the focused tests:

```powershell
npm test
npm run lint
npm run build
```

## Acceptance Criteria

- Exactly 8 catalog products display one tag; the other 12 display none.
- The selected tag assignment matches the approved catalog table.
- `NEW`, `SALE`, and `BEST SELLER` use the shared oxblood reference treatment.
- p6 consistently shows $32.00 crossed out beside $26.00.
- p11 consistently shows $31.00 crossed out beside $24.80.
- Every in-scope product-introduction surface derives tag and price presentation from shared logic.
- Product-detail pricing follows the selected variant.
- No legacy badge or derived `isNew`/`isBestSeller` source remains.
- Catalog validation, component tests, lint, and production build pass.

## Out of Scope

- Admin or CMS interfaces for editing tags
- Automated tag assignment from launch dates, sales, ratings, or order volume
- Multiple simultaneous tags on one product
- Discount percentages, countdown timers, coupon logic, or promotional scheduling
- Displaying merchandising tags in the cart
