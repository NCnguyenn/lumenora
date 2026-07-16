# Lumenora Home Full-Page Botanical Editorial Mockup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate and validate one tall, high-fidelity desktop mockup of the full Lumenora Home page using the approved Editorial Commerce Flow while preserving the current Hero.

**Architecture:** Use built-in image generation with local project imagery as visual references. Generate a straight-on full-page UI, validate its section order, Hero fidelity, content scope, palette, and route constraints, then save the accepted PNG non-destructively under `Mockups/`.

**Tech Stack:** Built-in OpenAI image generation, local PNG reference assets, Codex image inspection, PowerShell file validation.

## Global Constraints

- Output path: `D:\Personal_Project\Lumenora\Mockups\home-botanical-editorial-full-v3.png`.
- Preserve `Mockups/home.png` and all previous generated drafts.
- Page order: Header → existing Hero → New & Noteworthy → Featured Product → Best Sellers → Why Lumenora → The Lumenora Journal → Newsletter → Footer.
- Preserve the current Hero's first slide: `THE SUMMER EDIT`, `Less routine. More ritual.`, `A seasonal edit across skin, body and mind.`, `SHOP NOW`.
- Visible destinations are limited to Home, Shop, Quiz, Blog, Wishlist, and Cart.
- Palette: parchment `#E8E0D2`, ivory `#F4F0E8`, charcoal `#181713`, burgundy `#6B1F2B`, olive `#69705A`.
- No extra routes, popup, device frame, perspective tilt, copied campaign imagery, third-party logos, or watermark.

---

### Task 1: Generate, validate, and persist the full-page mockup

**Files:**
- Read: `docs/superpowers/specs/2026-07-16-home-full-page-botanical-editorial-design.md`
- Reference: `Frontend/public/assets/generated/hero-1.png`
- Reference: `Frontend/public/assets/generated/product-toner.png`
- Reference: `Frontend/public/assets/generated/product-moisturizer.png`
- Reference: `Frontend/public/assets/generated/product-mask.png`
- Reference: `Frontend/public/assets/generated/home-feature-lotion.png`
- Reference: `Frontend/public/assets/generated/product-serum.png`
- Reference: `Frontend/public/assets/generated/product-sunscreen.png`
- Reference: `Frontend/public/assets/generated/blog-editorial-1.png`
- Reference: `Frontend/public/assets/generated/blog-editorial-3.png`
- Create: `Mockups/home-botanical-editorial-full-v3.png`

**Interfaces:**
- Consumes: approved spec, current Hero asset, existing product imagery, existing editorial imagery.
- Produces: one final PNG mockup for design review and later frontend implementation.

- [ ] **Step 1: Inspect all local reference images**

Confirm each reference file is readable and label its role:

```text
Image 1: Hero reference — preserve the current Summer Edit campaign visual.
Images 2–7: product references — retain the project's existing product families and neutral product-photography language.
Images 8–9: editorial references — retain the project's skincare-journal image language.
```

- [ ] **Step 2: Generate the full-page mockup**

Use built-in image generation with the nine local references and this prompt:

```text
Use case: ui-mockup
Asset type: high-fidelity tall desktop website Home page mockup
Input images: Image 1 is the Hero reference and must anchor the current Hero visual; Images 2–7 are existing Lumenora product references; Images 8–9 are existing Lumenora journal references.
Primary request: Design one complete, straight-on, full-page desktop Home page for LUMENORA using the approved Botanical Editorial Commerce Flow. Keep the existing Summer Edit Hero composition and campaign content, then completely redesign the sections below it with an original editorial-commerce rhythm informed by Violet Grey and Aesop without copying either website.
Style/medium: shippable luxury skincare ecommerce UI, publication-quality grid, high-fidelity typography, practical web layout, not concept art.
Composition/framing: very tall 1440px desktop page shown straight-on. No browser chrome, device frame, perspective, hands, or surrounding scene. Show every approved section in one continuous page.
Header: compact warm parchment bar; centered widely tracked wordmark "LUMENORA"; links "HOME", "SHOP", "QUIZ", "BLOG"; search, wishlist heart, and cart bag icons; thin charcoal rule; no pill navigation.
Hero: preserve the current project's full-width dark botanical campaign Hero using Image 1. Exact text: "THE SUMMER EDIT", "Less routine. More ritual.", "A seasonal edit across skin, body and mind.", "SHOP NOW". Retain elegant centered white type, dark overlay, subtle slider arrows, and line indicators.
Section 1: ivory "NEW & NOTEWORTHY" with one row of four square product cards using Images 2–5. Show exact product names and prices: "Bamboo Ultra Hydrating Toner" "$45.00"; "Birch Moisturizing Soothing Gel" "$15.00"; "Mugwort Calming Cream" "$38.50"; "Body Lotion Lavender Patchouli" "$42.00".
Section 2: full-width two-column Featured Product. Olive-and-stone editorial image of Body Lotion Lavender Patchouli on the left; copy on the right: "FEATURED FORMULA", "Body Lotion Lavender Patchouli", "$42.00", "4.6 (28 reviews)", "ADD TO BAG", "VIEW DETAILS".
Section 3: deeper parchment "THE MOST CONSIDERED" / "BEST SELLERS" shelf with four product cards: Advanced Snail Mucin 96% Power Repairing Essence Serum "$18.50"; COSRX Advanced Snail 96 Mucin Power Essence "$26.00"; Volcanic Sea Clay Detox Masque "$54.00"; Invisible Fluid Sunscreen SPF 50+ PA++++ "$24.80". Best-seller badges only on the first two.
Section 4: asymmetric Why Lumenora block. Burgundy statement panel with exact headline "Many formulas. One considered ritual." Adjacent parchment panel with three numbered principles: "BOTANICAL INTELLIGENCE", "GUIDED DISCOVERY", "ONE SEAMLESS BASKET".
Section 5: ivory publication-style "THE LUMENORA JOURNAL" on a twelve-column grid. Large seven-column article with Image 8 and title "Why Snail Mucin is the Skincare Ingredient You Can't Ignore". Five-column side stack with "The Ultimate Guide to Double Cleansing" and Image 9 plus "How to Repair a Damaged Skin Barrier". CTA "READ THE JOURNAL".
Section 6: charcoal newsletter band with "NOTES FROM THE BEAUTY DESK", large serif "The Edit", line "Curated beauty intelligence, delivered with intention.", field "EMAIL ADDRESS", action "SUBSCRIBE".
Footer: charcoal field with ivory "LUMENORA", brand statement "Premium botanical skincare, crafted with intention.", links only "SHOP", "QUIZ", "BLOG", "WISHLIST", "CART", and copyright "© 2026 LUMENORA. ALL RIGHTS RESERVED.".
Color palette: parchment #E8E0D2, ivory #F4F0E8, charcoal #181713, burgundy #6B1F2B, olive #69705A.
Typography: elegant high-contrast editorial serif for large headings; restrained modern sans-serif for labels, prices, navigation, metadata, and buttons.
Constraints: exact section order; preserve the existing Hero rather than using a split Hero; readable hierarchy; squared image-led cards; hairline rules; generous but controlled whitespace; use only existing routes and approved content; no About, Contact, FAQ, Profile, Login, Checkout, Sustainability, Shipping, Account, or Privacy links; no product-detail page implication; no extra section, carousel below Hero, popup, testimonial, logo strip, announcement bar, copied layout, third-party campaign, watermark, or gibberish filler text.
Avoid: previous split-panel "Skin, considered." Hero, rounded-card template styling, pill menus, beige-on-beige low contrast, oversized empty areas, cloned Violet Grey layout, cloned Aesop layout.
```

- [ ] **Step 3: Validate the generated image**

Check the output at original detail. Accept only if all conditions hold:

```text
1. All nine blocks appear in the approved order.
2. The Hero uses the existing Summer Edit visual and copy, not the previous split Hero.
3. Product, brand-story, journal, newsletter, and footer blocks are visually distinct.
4. Visible navigation does not imply a route outside Home, Shop, Quiz, Blog, Wishlist, or Cart.
5. The palette visibly includes parchment, ivory, charcoal, burgundy, and olive.
6. No third-party logo, device frame, perspective presentation, copied campaign, or watermark appears.
7. The image reads as one practical tall desktop page rather than a collage of disconnected screens.
```

- [ ] **Step 4: Apply one targeted correction if a critical condition fails**

Regenerate once with every original invariant plus only the failed correction. For a Hero failure, use:

```text
Change only the Hero: replace it with the current Summer Edit full-width campaign Hero from Image 1 and render "THE SUMMER EDIT", "Less routine. More ritual.", "A seasonal edit across skin, body and mind.", and "SHOP NOW". Keep all other approved sections unchanged and in the same order.
```

For a section-order or scope failure, use:

```text
Change only page structure: enforce Header → current Summer Edit Hero → New & Noteworthy → Featured Product → Best Sellers → Why Lumenora → The Lumenora Journal → Newsletter → Footer. Remove every unapproved module and route label. Keep the approved palette, imagery, typography, and content unchanged.
```

- [ ] **Step 5: Save the accepted image non-destructively**

Copy the accepted built-in output to:

```text
D:\Personal_Project\Lumenora\Mockups\home-botanical-editorial-full-v3.png
```

- [ ] **Step 6: Verify the saved PNG**

Confirm that the target exists, is a readable PNG, has non-zero width and height, and is not byte-identical to `Mockups/home.png`. Report the absolute path and the final production prompt.
