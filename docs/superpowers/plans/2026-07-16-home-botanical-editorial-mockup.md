# Lumenora Home Botanical Editorial Mockup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce and validate one high-fidelity desktop image mockup that rebuilds the existing Lumenora Home route as Header → Hero → Footer in the approved Botanical Editorial direction.

**Architecture:** Use the built-in image generation workflow to create a straight-on, full-page website UI composition from the approved design specification. Inspect the generated bitmap for scope, hierarchy, text, and route constraints; perform one targeted regeneration if a critical acceptance criterion fails; then persist the accepted image under `Mockups/` without replacing the existing `home.png`.

**Tech Stack:** Built-in OpenAI image generation, Codex local image inspection, PNG artifact storage.

## Global Constraints

- Output is one desktop, 1440 px-wide, full-page Home mockup.
- Visible page sequence is Header → Hero → Footer only.
- Visible destinations are limited to Home, Shop, Quiz, Blog, Wishlist, and Cart.
- Exact primary text: `LUMENORA`, `BOTANICAL INTELLIGENCE`, `Skin, considered.`, `SHOP THE EDIT`, and `TAKE THE SKIN QUIZ`.
- Palette: parchment `#E8E0D2`, ivory `#F4F0E8`, charcoal `#181713`, burgundy `#6B1F2B`, olive `#69705A`.
- No third-party logos, copied campaign imagery, watermarks, device frames, perspective tilt, extra routes, or content sections.

---

### Task 1: Generate and validate the Home mockup

**Files:**
- Read: `docs/superpowers/specs/2026-07-16-home-botanical-editorial-design.md`
- Create: `Mockups/home-botanical-editorial-v2.png`

**Interfaces:**
- Consumes: the approved design specification and the existing Home route scope in `Frontend/src/App.tsx`.
- Produces: one final PNG mockup suitable for visual review and later frontend implementation.

- [ ] **Step 1: Generate the first high-fidelity image**

Use the built-in image generation tool with this production prompt:

```text
Use case: ui-mockup
Asset type: high-fidelity desktop website Home page mockup
Primary request: Completely redesign the existing Lumenora skincare Home page in an original Botanical Editorial direction informed by the editorial confidence of Violet Grey and the restrained material sensibility of Aesop. Show only a compact global header, one dominant hero, and a concise footer. Do not copy either reference website.
Scene/backdrop: straight-on full-page desktop website canvas, no browser chrome, no laptop or device frame, no perspective.
Style/medium: shippable luxury ecommerce UI mockup, precise grid, realistic typography, premium editorial art direction, not concept art.
Composition/framing: 1440px desktop proportion. Header at top. Hero uses an asymmetric 42/58 split: parchment editorial copy panel on the left and a full-height botanical skincare still-life photograph on the right. Footer begins immediately below the hero. No section exists between hero and footer.
Header: warm parchment background, thin charcoal rule, centered widely tracked wordmark "LUMENORA"; primary links "HOME", "SHOP", "QUIZ", "BLOG"; restrained search, wishlist heart, and cart bag icons. No pill navigation and no extra links.
Hero left panel: small uppercase eyebrow "BOTANICAL INTELLIGENCE"; oversized high-contrast serif headline "Skin, considered."; concise supporting copy about intentional botanical skincare; primary burgundy CTA "SHOP THE EDIT"; secondary text CTA "TAKE THE SKIN QUIZ".
Hero right panel: original premium botanical skincare editorial still life with unbranded amber glass bottles, dark stone, sculptural leaves, warm directional sunlight, controlled shadow, and tactile natural surfaces. Do not reproduce known brand packaging or campaign imagery.
Footer: charcoal background, ivory typography, Lumenora wordmark and short brand statement on the left; only links "SHOP", "QUIZ", "BLOG", "WISHLIST", "CART"; compact copyright line.
Color palette: parchment #E8E0D2, ivory #F4F0E8, charcoal #181713, burgundy #6B1F2B, olive #69705A.
Typography: elegant high-contrast editorial serif for display text; restrained modern sans-serif for navigation, labels, and buttons.
Constraints: render the specified text verbatim; readable hierarchy; generous deliberate whitespace; squared editorial blocks and hairline rules; only Header, Hero, Footer; no product grid, brand marquee, feature product, secondary banner, newsletter, carousel, popup, announcement bar, testimonials, or extra sections; no third-party logos, no trademarks, no watermark.
Avoid: rounded cards, pill menus, beige-on-beige low contrast, excessive empty space, ecommerce template look, cloned Violet Grey or Aesop layouts.
```

- [ ] **Step 2: Inspect the generated image**

Check the bitmap at original detail and confirm:

```text
PASS if all are true:
1. Page contains Header → one Hero → Footer and no other section.
2. Hero is visibly asymmetric with copy left and botanical still life right.
3. Palette visibly uses parchment, charcoal, burgundy, and olive.
4. No link implies a route outside Home, Shop, Quiz, Blog, Wishlist, or Cart.
5. No third-party logo, copied packaging, watermark, device frame, or perspective scene.
6. LUMENORA and Skin, considered. are legible.
7. Overall result looks like a practical luxury ecommerce UI, not concept art.
```

- [ ] **Step 3: Apply one targeted correction if validation fails**

If a critical criterion fails, regenerate once while repeating all invariants and adding only the failed correction. Examples:

```text
Change only the page structure: remove every module between the single hero and footer. Keep the approved header, asymmetric hero, palette, typography, imagery, and footer unchanged.
```

or

```text
Change only the text and navigation: render "LUMENORA" and "Skin, considered." clearly, and remove any visible destination outside HOME, SHOP, QUIZ, BLOG, WISHLIST, and CART. Keep the layout and imagery unchanged.
```

- [ ] **Step 4: Save the accepted PNG non-destructively**

Copy the accepted built-in output to:

```text
D:\Personal_Project\Lumenora\Mockups\home-botanical-editorial-v2.png
```

Do not overwrite `Mockups/home.png`.

- [ ] **Step 5: Verify the saved artifact**

Confirm that the saved file exists, is a readable PNG, has non-zero dimensions, and visually matches the accepted image. Report the absolute path and the production prompt used.
