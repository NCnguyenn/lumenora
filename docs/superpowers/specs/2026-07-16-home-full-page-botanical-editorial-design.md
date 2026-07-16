# Lumenora Home Full-Page — Botanical Editorial Design v4

## Objective

Create one high-fidelity desktop, full-page image mockup for the existing Lumenora Home route. Keep the current project Hero unchanged and rebuild the Header plus every section below the Hero in an original Botanical Editorial system informed by Violet Grey and Aesop. Version 4 adds image-led category discovery, a trust strip, and a differentiated Shop the Ritual product block.

The mockup must use only content, products, articles, and destinations already present in the React project. It must not create or imply additional pages.

## Canvas and Scope

- Desktop page, 1440 px-wide design presented as one tall, straight-on website mockup.
- No browser chrome, laptop frame, perspective tilt, hands, or surrounding scene.
- Page order: Header → existing Hero → Category Discovery with Trust Strip → New & Noteworthy → Best Sellers → Shop the Ritual → Why Lumenora → The Lumenora Journal → Closing Region with Newsletter and Footer.
- Existing visible destinations only: Home, Shop, Quiz, Blog, Wishlist, and Cart.
- Do not depict Product, Checkout, Login, Profile, About, Contact, Sustainability, FAQ, Shipping, Account, Privacy, or other unimplemented routes.

## Reference Interpretation

- Violet Grey informs the decisive editorial hierarchy, commerce-and-content rhythm, concise product labels, and publication-style article presentation.
- Aesop informs deliberate whitespace, calm typographic rhythm, tactile natural materials, and restrained brand storytelling.
- The design must remain recognizably Lumenora and must not reproduce either reference site's exact layout, campaign imagery, product packaging, or copy.

## Visual System

- Parchment: `#E8E0D2`
- Ivory: `#F4F0E8`
- Charcoal: `#181713`
- Burgundy: `#6B1F2B`
- Olive: `#69705A`
- Display typography: high-contrast editorial serif.
- Utility typography: restrained modern sans-serif with small uppercase labels and generous tracking.
- Geometry: squared blocks, image-led layouts, hairline rules, and clear grid alignment.
- Avoid pill menus, excessive rounded cards, low-contrast beige-on-beige sections, and template-like ecommerce styling.

## Header

- Warm parchment background with a thin charcoal bottom rule.
- Centered, widely tracked `LUMENORA` wordmark.
- Primary links: `HOME`, `SHOP`, `QUIZ`, `BLOG`.
- Utility actions: Search, Wishlist, Cart.
- No pill-shaped navigation and no extra links.
- Keep the header compact so the existing Hero remains dominant.

## Existing Hero — Preserve Unchanged

- Preserve the current Hero slider layout, imagery, overlay treatment, typography, arrows, indicators, copy, and CTA structure from `Frontend/src/pages/Home.tsx`.
- The static mockup shows the first existing slide:
  - Eyebrow: `THE SUMMER EDIT`
  - Headline: `Less routine. More ritual.`
  - Supporting copy: `A seasonal edit across skin, body and mind.`
  - CTA: `SHOP NOW`
- Do not apply the previous split-panel `Skin, considered.` Hero concept to this full-page mockup.

## Category Discovery with Trust Strip — One Combined Block

- Place this image-led strip immediately below the existing Hero.
- Three equal-width landscape category tiles:
  1. `SKINCARE` — close-up healthy skin and a restrained skincare texture.
  2. `BODYCARE` — tactile cream texture or body-care ritual imagery.
  3. `SUNCARE` — sunscreen product among sculptural green leaves.
- Each tile uses an editorial serif label over a controlled dark bottom gradient.
- Categories represent filters within the existing Shop route; they must not imply standalone category pages.
- Use the attached user reference only for the three-tile composition and label treatment; do not copy its exact photos.

### Trust Strip within Category Discovery

- Place directly below Shop by Category as a compact white/ivory band divided into four equal columns by hairline rules.
- Use simple monochrome line icons and these exact labels:
  1. `CONSIDERED SELECTION` — `Curated Products`
  2. `GUIDED DISCOVERY` — `Skin Quiz`
  3. `EXPERT EDITORIAL` — `Informed Routines`
  4. `SEAMLESS BASKET` — `One Checkout`
- Do not claim free shipping, returns, certifications, guarantees, or other policies not implemented in the project.

## New & Noteworthy

- Ivory background and left-aligned editorial heading `NEW & NOTEWORTHY`.
- Four existing products in one clean row:
  1. Bamboo Ultra Hydrating Toner — `$45.00`
  2. Birch Moisturizing Soothing Gel — `$15.00`
  3. Mugwort Calming Cream — `$38.50`
  4. Body Lotion Lavender Patchouli — `$42.00`
- Use large product imagery, compact metadata, visible price, and restrained wishlist affordances.
- Product cards stay squared and image-led with generous spacing.

## Best Sellers

- Slightly deeper parchment field with the heading `THE MOST CONSIDERED` and subheading `BEST SELLERS`.
- Four products presented as a curated shelf edit.
- Include the two products flagged `isBestSeller` in `Frontend/src/data/products.ts`:
  - Advanced Snail Mucin 96% Power Repairing Essence Serum — `$18.50`
  - COSRX Advanced Snail 96 Mucin Power Essence — `$26.00`
- Fill the remaining two positions with these existing highly rated products, without displaying a bestseller badge on either card:
  - Volcanic Sea Clay Detox Masque — `$54.00`
  - Invisible Fluid Sunscreen SPF 50+ PA++++ — `$24.80`
- Maintain visible brand, name, price, rating, and restrained wishlist controls.

## Shop the Ritual

- Place directly after Best Sellers on a pale olive field.
- Use three equal editorial columns with tall lifestyle imagery, numbered labels, and two existing products per column:
  1. `01 CLEANSE`
     - Green Tea Deep Cleansing — `$25.00`
     - Eucalyptus Nourishing Body Cleanser — `$34.00`
  2. `02 TREAT`
     - Advanced Snail Mucin 96% Power Repairing Essence Serum — `$18.50`
     - Mugwort Calming Cream — `$38.50`
  3. `03 PROTECT`
     - Invisible Fluid Sunscreen SPF 50+ PA++++ — `$24.80`
     - Body Lotion Lavender Patchouli — `$42.00`
- Each column includes the same CTA `EXPLORE THE RITUAL`; every CTA represents navigation only to the existing Shop route.
- Keep this block visibly different from New & Noteworthy and Best Sellers: large lifestyle crop above compact two-product text rather than standard product cards.

## Why Lumenora

- Asymmetric 5/7 layout.
- Burgundy statement panel with the exact headline `Many formulas. One considered ritual.`
- Adjacent parchment panel contains three numbered principles:
  1. `BOTANICAL INTELLIGENCE` — considered formulas and ingredient context.
  2. `GUIDED DISCOVERY` — navigation by category, concern, and routine.
  3. `ONE SEAMLESS BASKET` — a unified shopping flow across the existing selection.
- This is an on-page brand statement and must not show an About-page link.

## The Lumenora Journal

- Publication-style editorial layout on an ivory background.
- Section heading: `THE LUMENORA JOURNAL`.
- One primary article occupying seven columns of a twelve-column content grid:
  - `Why Snail Mucin is the Skincare Ingredient You Can't Ignore`
- Two supporting articles stacked vertically in the remaining five columns:
  - `The Ultimate Guide to Double Cleansing`
  - `How to Repair a Damaged Skin Barrier`
- Use existing imagery and metadata from `Frontend/src/data/articles.ts`.
- Visible article CTA: `READ THE JOURNAL`; it represents navigation only to the existing Blog route.

## Closing Region — Newsletter and Footer as One Block

### Newsletter

- Full-width charcoal band.
- Exact eyebrow: `NOTES FROM THE BEAUTY DESK`.
- Exact title: `The Edit`.
- Supporting line: `Curated beauty intelligence, delivered with intention.`
- One email field labeled `EMAIL ADDRESS` and one `SUBSCRIBE` action.
- No popup, modal, separate signup page, or invented privacy link.

### Footer

- Charcoal background continuous with or slightly differentiated from the Newsletter.
- Ivory `LUMENORA` wordmark and the existing brand statement `Premium botanical skincare, crafted with intention.`
- Visible links only: `SHOP`, `QUIZ`, `BLOG`, `WISHLIST`, `CART`.
- Compact copyright line: `© 2026 LUMENORA. ALL RIGHTS RESERVED.`
- Do not show links to unavailable routes.

## UX Intent

- Preserve the current Hero's recognizable campaign entry point.
- Move from aspiration into image-led category discovery and concise trust signals, then into new products, proven best sellers, and the differentiated Shop the Ritual block.
- Introduce brand rationale only after the primary commerce modules.
- Use editorial content to support discovery and trust before newsletter conversion.
- Alternate image-led category discovery, ivory, olive, burgundy, parchment, and charcoal fields to create a clear scanning rhythm without visual clutter.

## Mockup Constraints

- High-fidelity luxury ecommerce UI, not abstract concept art.
- Keep product and article text readable at the rendered full-page scale.
- Use only existing Lumenora/GlowCare/COSRX product and article content described in this specification.
- No third-party campaign artwork, copied layouts, watermarks, unrelated logos, extra navigation, or extra sections.
- Save the new output non-destructively as `Mockups/home-botanical-editorial-full-v4.png`; preserve `Mockups/home.png`, `Mockups/home-botanical-editorial-full-v3.png`, and the previous Hero-only draft.

## Acceptance Criteria

- The full page visibly contains all nine approved blocks in the specified order.
- The Hero matches the current project's first slider slide rather than the earlier split Hero draft.
- Three category tiles and the four-item trust strip appear directly below the Hero.
- Product sections use existing product names and prices.
- Shop the Ritual contains the three approved ritual columns and six approved products.
- The Blog section uses the three approved existing article titles.
- Navigation and footer do not imply routes outside the six current React routes.
- The Botanical Editorial palette and typography remain coherent from Header through Footer.
- The result balances commerce, brand storytelling, and editorial content while remaining original.
