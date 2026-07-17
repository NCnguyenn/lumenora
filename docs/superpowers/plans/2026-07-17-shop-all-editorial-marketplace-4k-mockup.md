# Shop All Editorial Marketplace 4K Mockup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce one full-page 2160 x 3840 desktop Shop All mockup that is easy to shop, visually aligned with the current Home page, and displayed directly in chat.

**Architecture:** Generate a single high-fidelity raster UI concept with the built-in image generation tool, using the approved spec as the source of truth. Inspect the result at original resolution, make at most one targeted refinement pass for material UI defects, then copy the selected final image into `Mockups/` and deliver it inline.

**Tech Stack:** Built-in `image_gen`, Codex `view_image`, PowerShell file copy, Git.

## Global Constraints

- Output exactly one final desktop full-page mockup at 2160 x 3840 pixels.
- Preserve the visual language of the current Lumenora Home page: ivory, parchment, charcoal, deep olive, oxblood, brass, editorial serif headings, and neutral sans-serif interface text.
- Prioritize product discovery and comparison over editorial decoration.
- Use 12 fictional products across a stable four-column grid and three rows.
- Use fictional brand names, fictional packaging, and no third-party logos.
- Keep the filter panel closed, All active, and Sort set to Featured.
- Show one product card in a hover state with a secondary image and visible Quick add action.
- Place the only editorial marketing block after the product grid.
- Include the existing-header visual language, newsletter, and footer.
- Do not modify application code as part of this mockup-only task.

---

### Task 1: Generate the 4K full-page mockup

**Files:**
- Reference: `docs/superpowers/specs/2026-07-17-shop-all-editorial-marketplace-mockup-design.md`
- Create after selection: `Mockups/shop-all-editorial-marketplace-4k.png`

**Interfaces:**
- Consumes: Approved design spec and current Home palette/assets.
- Produces: One built-in image-generation result suitable for visual QA.

- [ ] **Step 1: Submit the production prompt to the built-in image generator**

Use the following prompt verbatim:

```text
Use case: ui-mockup
Asset type: high-fidelity desktop e-commerce full-page mockup
Primary request: Create a polished 2160 x 3840 vertical full-page desktop website mockup for Lumenora's “Shop All” page. The experience must prioritize fast product discovery, easy comparison, clear filters, and confident purchasing while matching an elegant editorial beauty marketplace Home page.
Scene/backdrop: a complete webpage from header through footer, warm ivory #F5F1E8 and parchment #E8E0D1 surfaces, fine charcoal #25231F rules, deep olive active states, restrained oxblood and brass accents.
Header: refined Lumenora wordmark centered or clearly prominent, familiar navigation for Shop, Brands, Skin, Body, Sun, Fragrance, Journal, with Search, Account, Wishlist, and Bag controls. Keep it visually quiet and consistent with a premium multi-brand beauty marketplace.
Compact shop introduction: exactly 640 pixels tall in the represented page. Left side contains a small brass editorial eyebrow “THE COMPLETE SELECTION”, a large elegant serif heading “Shop All”, a short two-line curation statement, and “48 PRODUCTS / 12 BRANDS”. Right side contains a premium skincare still life with amber glass, cream ceramic, olive leaves, travertine, linen, soft sunlight, and a restrained oxblood textile accent.
Sticky discovery toolbar: clearly separated by fine borders. Show category tabs “ALL”, “SKIN”, “BODY”, “SUN”, “FRAGRANCE”; ALL is active in deep olive with a clear underline. Include a prominent “ALL FILTERS” button with a filter icon, “48 PRODUCTS”, and “SORT: FEATURED” with a chevron. Filter drawer remains closed.
Product grid: exactly four equal columns and three rows, 12 fictional products total, generous gutters, calm rhythm, no banners interrupting the grid. Each card shows a large premium 4K-style studio product photograph, a restrained NEW or BESTSELLER badge on only a few items, fictional brand, product name, one short benefit line, price, wishlist icon, and Quick add action. One card visibly demonstrates hover with a secondary product angle and a clear oxblood “QUICK ADD” control. All essential information remains visible without hover.
Product photography: fictional logo-free amber serum bottles, minimalist cream tubes, moisturizer jars, body cleanser bottles, sunscreen vessels, and perfume glass. Soft directional sunlight, travertine, linen, olive leaves, subtle shadows, editorial studio quality, consistent palette and scale, no real brands.
End-of-list editorial block: only after all 12 products, full-width deep charcoal or olive panel titled “The Lumenora Edit”, concise serif copy, one restrained call to action, one elegant botanical skincare image.
Footer: newsletter signup and structured footer navigation matching the Home page, charcoal background, ivory type, refined spacing.
Style/medium: realistic premium desktop UI design presentation, editorial beauty commerce, sophisticated but usable, high-end art direction, crisp grid alignment, plausible production-ready interface.
Typography: elegant high-contrast serif similar to Playfair Display for page and editorial headings; clean neutral sans-serif similar to Inter for controls, metadata, prices, and navigation.
Composition/framing: straight-on full-page desktop screenshot, no device frame, no browser chrome, entire page visible, grid lines aligned, generous margins, strong information hierarchy, text large enough to evaluate at full-page scale.
Lighting/mood: warm natural sunlight in photography, calm, cultivated, tactile, trustworthy.
Constraints: shopping controls must be more prominent than decoration; compact hero; filter and sort immediately discoverable; stable four-column comparison grid; no promotional interruption inside product rows; readable product names and prices; 44-pixel-equivalent interaction targets; high contrast; precise spacing.
Avoid: mobile layout, dashboard styling, glassmorphism, rounded card-heavy SaaS design, excessive shadows, neon colors, cool blue palette, real logos, copyrighted brand packaging, watermarks, browser frame, device mockup, illegible microtext, distorted product vessels, duplicated products, promotional banners between product rows.
```

- [ ] **Step 2: Wait for generation to complete**

Expected result: one portrait full-page UI mockup with a 2160 x 3840 target composition and all major sections present.

### Task 2: Perform original-resolution visual QA

**Files:**
- Inspect: generated image result from Task 1.

**Interfaces:**
- Consumes: Generated mockup.
- Produces: A pass decision or one precise refinement instruction.

- [ ] **Step 1: Inspect the generated image at original detail**

Use `view_image` with `detail: "original"` after the generated result is available as a local file. Check each item:

```text
[ ] Full page is visible without device or browser chrome.
[ ] Palette matches ivory, parchment, charcoal, olive, oxblood, and brass.
[ ] Header, compact hero, discovery toolbar, 4 x 3 product grid, editorial block, newsletter, and footer are present.
[ ] Product grid is uninterrupted and visually dominant.
[ ] All filters, product count, and Sort: Featured are discoverable.
[ ] Product cards have consistent anatomy and readable hierarchy.
[ ] Only a few restrained badges appear.
[ ] One hover/Quick add state is visible.
[ ] Product photography is fictional, premium, and coherent.
[ ] No real logos, watermark, device frame, or unrelated elements appear.
```

- [ ] **Step 2: Decide whether one targeted refinement is required**

Pass when every major structural item is present and no defect materially harms usability or visual consistency. Ignore minor fictional microcopy imperfections that do not affect layout evaluation. Refine once only if the grid, toolbar, palette, section order, or product imagery is materially wrong.

### Task 3: Apply one targeted refinement if required

**Files:**
- Inspect: first generated image.
- Produce: refined generated image only when Task 2 identifies a material defect.

**Interfaces:**
- Consumes: The first image and one QA defect statement.
- Produces: A corrected image preserving all approved invariants.

- [ ] **Step 1: Submit exactly one applicable refinement instruction**

Choose the first failing QA category and submit only its matching instruction:

**Structure or grid defect:**

```text
Correct only the page structure: show the complete desktop page without a device frame, keep the hero compact, make the discovery toolbar immediately visible, and restore an uninterrupted four-column by three-row grid containing exactly 12 products. Preserve the existing Lumenora palette, typography, fictional product photography, end-of-list editorial block, newsletter, footer, spacing, and all other approved details unchanged. No real brands, no watermarks, no browser chrome.
```

**Palette or hierarchy defect:**

```text
Correct only the color and information hierarchy: use warm ivory and parchment surfaces, charcoal text, a deep olive active category, restrained oxblood calls to action, and tiny brass editorial accents. Make product discovery controls and product information more prominent than decoration. Preserve the full-page framing, compact split hero, toolbar content, closed filter state, exact four-column by three-row grid with 12 fictional products, product photography, end-of-list editorial block, newsletter, footer, and section order unchanged. No real brands, no watermarks, no browser or device frame.
```

**Product photography defect:**

```text
Correct only the product photography: make all 12 products fictional, premium, coherent, and physically plausible, using logo-free amber glass, cream ceramic, minimalist tubes, serum droppers, moisturizer jars, sunscreen vessels, and perfume glass under warm directional studio sunlight. Preserve the entire approved UI layout, text hierarchy, palette, compact hero, discovery toolbar, closed filter state, exact four-column by three-row grid, one hover Quick add state, end-of-list editorial block, newsletter, footer, spacing, and section order unchanged. No real brands, no watermarks, no browser or device frame.
```

- [ ] **Step 2: Re-run the Task 2 checklist**

Expected result: all major structural checks pass. Do not start an open-ended redesign loop.

### Task 4: Save and deliver the selected mockup

**Files:**
- Create: `Mockups/shop-all-editorial-marketplace-4k.png`

**Interfaces:**
- Consumes: Selected generated result.
- Produces: Workspace-bound final PNG and inline chat preview.

- [ ] **Step 1: Copy the selected output into the workspace**

Read the local generated-image path returned by the built-in image tool. Call PowerShell `Copy-Item` with that returned path passed literally as `-LiteralPath` and this exact destination:

```text
D:\Personal_Project\Lumenora\Mockups\shop-all-editorial-marketplace-4k.png
```

Expected result: `Mockups/shop-all-editorial-marketplace-4k.png` exists and is non-empty.

- [ ] **Step 2: Verify the saved artifact**

Run:

```powershell
Get-Item 'D:\Personal_Project\Lumenora\Mockups\shop-all-editorial-marketplace-4k.png' | Select-Object FullName,Length
```

Expected result: the exact path is returned with a positive file size.

- [ ] **Step 3: Commit the final mockup artifact**

Run:

```powershell
git add -- 'Mockups/shop-all-editorial-marketplace-4k.png'
git commit -m "design: add Shop All editorial marketplace mockup"
```

Expected result: one commit containing the final mockup PNG and no unrelated files.

- [ ] **Step 4: Deliver in chat**

Display the final image using the absolute workspace path and report:

```text
Final asset: D:\Personal_Project\Lumenora\Mockups\shop-all-editorial-marketplace-4k.png
Generation mode: built-in image generation tool
```
