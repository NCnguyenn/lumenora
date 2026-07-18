# Lumenora Blog + Quiz Editorial Commerce Mockups Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate, verify, and save two high-fidelity full-page desktop UI mockups for Lumenora Blog and Quiz.

**Architecture:** Use the built-in image generation tool once per distinct page, with the approved Home and Shop All mockups as visual references. Inspect each output visually, make only targeted one-change iterations when needed, then copy the selected finals into `Mockups/` under stable non-destructive filenames.

**Tech Stack:** Built-in `image_gen`, local `view_image`, PowerShell filesystem checks, Git.

## Global Constraints

- Produce exactly two straight-on, tall desktop webpage images at a 9:16 portrait ratio, targeting 2160 × 3840 px.
- Use English interface copy.
- Match Lumenora's ivory, parchment, charcoal, olive, amber-glass, brass, and oxblood editorial system.
- Keep imagery at roughly 55–60% of each page and avoid conspicuous empty middle sections.
- Show no browser chrome, device frame, perspective scene, watermark, copied real-brand identity, or unsupported medical claim.
- Use the shared Header destinations `HOME`, `SHOP`, `QUIZ`, `BLOG` and shared Footer destinations `SHOP`, `QUIZ`, `BLOG`, `WISHLIST`, `CART`.
- Keep important headings, navigation labels, and primary CTA labels readable; minimize generated microcopy.
- Preserve existing mockups and save only to new filenames.

---

### Task 1: Generate and approve the Blog mockup

**Files:**
- Reference: `Mockups/home-editorial-magazine-v5.png`
- Reference: `Mockups/shop-all-editorial-marketplace-4k.png`
- Create: `Mockups/blog-editorial-commerce-full.png`

**Interfaces:**
- Consumes: the two reference mockups as style-only image inputs.
- Produces: one selected full-page Blog PNG for final cross-page QA.

- [ ] **Step 1: Generate the first Blog candidate**

Use built-in `image_gen` with both reference images and this exact prompt:

```text
Use case: ui-mockup
Asset type: high-fidelity full-page desktop website mockup
Primary request: Create a straight-on 9:16 portrait full-page desktop mockup for the Lumenora BLOG landing page. Match the supplied Lumenora Home and Shop All references in brand language, typography, palette, premium botanical photography, header, and footer treatment, while creating an original page layout. This must look implementation-ready, not like concept art.
Input images: Image 1 is a style reference for Lumenora's editorial Home page; Image 2 is a style reference for the Shop All luxury marketplace and full-page density. Do not copy their exact layouts.
Scene/backdrop: flat paper-ivory webpage canvas, no environment outside the webpage.
Style/medium: luxury botanical skincare editorial publication with restrained ecommerce integration; high-contrast serif display type, small tracked sans-serif utility type, squared images, thin rules, minimal corner radius.
Composition/framing: full page from header to footer. Compact header with centered LUMENORA wordmark, HOME / SHOP / QUIZ / BLOG navigation with BLOG active, Search / Wishlist / Cart utilities, then a compact category rail. Build a dense asymmetric twelve-column editorial flow with imagery covering 55–60% of the page and no oversized blank bands.
Page sections in order: (1) lead editorial story in a 60/40 split with a luminous natural-skin image and dark oxblood text panel; exact eyebrow "THE LUMENORA JOURNAL", exact headline "The Quiet Science of a Stronger Skin Barrier", exact CTA "READ THE STORY". (2) Latest Stories asymmetric mosaic with one wide story, two portrait stories, one compact text-led story; use readable titles "Why Snail Mucin is the Skincare Ingredient You Can't Ignore", "The Ultimate Guide to Double Cleansing", "How to Repair a Damaged Skin Barrier", "Building a Deep Hydration Routine for Dry Skin". (3) olive Ingredient Index band with four macro images and exact labels MUGWORT / SNAIL MUCIN / VOLCANIC CLAY / BIRCH. (4) Routine Desk two-column section with editorial vanity photography and compact MORNING / EVENING steps Cleanse / Treat / Moisturize / Protect. (5) MOST READ ranked list beside THE EDITOR'S SHELF amber-glass product still life with three restrained product captions and prices. (6) oxblood newsletter strip with NOTES FROM THE BEAUTY DESK, email field, SUBSCRIBE button. (7) compact charcoal footer.
Lighting/mood: warm directional window sunlight, botanical shadows, limestone, amber and frosted glass, realistic skin texture, subtle film grain; quiet, intelligent, expensive.
Color palette: #F4F0E8 ivory, #E8E0D2 parchment, #181713 charcoal, #596047 botanical olive, #6B1F2B oxblood, amber glass, oxidized brass.
Constraints: exact major labels must be readable; commerce is secondary to editorial content; original Lumenora-style packaging only; retain full header-to-footer visibility.
Avoid: equal card rows, giant empty spaces, rounded SaaS cards, glossy gradients, browser chrome, device frame, perspective, surrounding mockup scene, real brand logos, fake medical claims, watermark, illegible oversized text blocks.
```

- [ ] **Step 2: Inspect the Blog candidate**

Open the generated image with `view_image` at original detail and verify:

- Header, hero, all five content groups, newsletter, and footer are present.
- Blog remains editorial-first and does not become a product catalogue.
- Imagery is distributed through the whole page; there is no conspicuous empty middle band.
- `LUMENORA`, `BLOG`, the lead headline, `READ THE STORY`, `MOST READ`, and `SUBSCRIBE` are readable.
- No browser frame, watermark, copied logo, distorted face, or impossible product geometry appears.

- [ ] **Step 3: Make one targeted Blog iteration only if needed**

If the candidate misses an acceptance criterion, edit/regenerate using the candidate as the target and state only the failed requirement. Example:

```text
Change only the page-density issue: fill the oversized empty band between the Ingredient Index and Routine Desk with the approved Routine Desk content and editorial imagery. Keep the header, lead story, palette, typography, remaining sections, and footer unchanged. Preserve the straight-on full-page 9:16 composition. No new sections, no watermark.
```

Reopen the revised image and repeat the Step 2 checks.

- [ ] **Step 4: Save the selected Blog image**

Copy the selected built-in generation result from its generated-images location to:

```text
D:\Personal_Project\Lumenora\Mockups\blog-editorial-commerce-full.png
```

Verify `Test-Path` returns `True` and do not overwrite any other Blog mockup.

- [ ] **Step 5: Commit the Blog mockup**

```powershell
git add -- 'Mockups/blog-editorial-commerce-full.png'
git commit -m "design: add editorial commerce blog mockup"
```

Expected: one new PNG is committed; existing `Mockups/blog.png` remains unchanged.

---

### Task 2: Generate and approve the Quiz mockup

**Files:**
- Reference: `Mockups/home-editorial-magazine-v5.png`
- Reference: `Mockups/shop-all-editorial-marketplace-4k.png`
- Create: `Mockups/quiz-editorial-commerce-full.png`

**Interfaces:**
- Consumes: the same two brand reference mockups and the approved density standard established by Task 1.
- Produces: one selected full-page Quiz PNG for final cross-page QA.

- [ ] **Step 1: Generate the first Quiz candidate**

Use built-in `image_gen` with both reference images and this exact prompt:

```text
Use case: ui-mockup
Asset type: high-fidelity full-page desktop website mockup
Primary request: Create a straight-on 9:16 portrait full-page desktop mockup for the Lumenora SKIN QUIZ landing page. Match the supplied Lumenora Home and Shop All references in brand language, typography, palette, premium botanical photography, header, and footer treatment, while creating an original component-rich quiz journey. This must look implementation-ready, not like concept art.
Input images: Image 1 is a style reference for Lumenora's editorial Home page; Image 2 is a style reference for the Shop All luxury marketplace and full-page density. Do not copy their exact layouts.
Scene/backdrop: flat paper-ivory webpage canvas, no environment outside the webpage.
Style/medium: luxury botanical skincare editorial commerce; high-contrast serif display type, small tracked sans-serif utility type, squared imagery, hairline dividers, restrained rectangular buttons, minimal corner radius.
Composition/framing: full page from header to footer. Compact header with centered LUMENORA wordmark, HOME / SHOP / QUIZ / BLOG navigation with QUIZ active, Search / Wishlist / Cart utilities. Use a compact section rhythm, imagery covering 55–60% of the page, and no oversized empty bands.
Page sections in order: (1) immersive 55/45 hero with text and quiz preview left, diverse adult woman with natural skin texture in warm window light plus amber serum and cream vessel right; exact eyebrow "PERSONALIZED FOR YOU", exact headline "Discover Your Signature Routine", exact CTAs "BEGIN ANALYSIS" and "SEE HOW IT WORKS". (2) visible compact quiz panel with QUESTION 01 OF 05, slim progress bar, exact prompt "How does your skin usually feel by midday?", four illustrated options BALANCED / DRY OR TIGHT / OILY / COMBINATION, one olive selected state, CONTINUE button. (3) HOW IT WORKS editorial strip with 01 TELL US ABOUT YOUR SKIN / 02 WE MAP YOUR PRIORITIES / 03 RECEIVE YOUR RITUAL and macro skin, serum, botanical images. (4) concern-selector mosaic titled "What would you like to focus on?" with image-backed options DEHYDRATION / SENSITIVITY / DULLNESS / TEXTURE / BREAKOUTS / FINE LINES. (5) parchment YOUR FOUR-STEP RITUAL result preview with four staggered original products labeled CLEANSE / TREAT / MOISTURIZE / PROTECT, concise rationales and visible prices, plus profile COMBINATION · DEHYDRATED · SENSITIVE. (6) trust and testimonial band with one natural portrait and exact reassurance labels 5 QUESTIONS / UNDER 2 MINUTES / PERSONALIZED ROUTINE. (7) deep olive final CTA with product still life, exact headline "Your ritual begins with understanding.", exact button START THE QUIZ. (8) compact charcoal footer.
Lighting/mood: warm directional sunlight, realistic natural skin, limestone, amber and frosted glass, botanical shadows, subtle film grain; guided, reassuring, luxurious.
Color palette: #F4F0E8 ivory, #E8E0D2 parchment, #181713 charcoal, #596047 botanical olive, #6B1F2B oxblood, amber glass, oxidized brass.
Constraints: clearly communicate start state, representative interaction, process, and four-step result; exact major labels must be readable; frame quiz as guided product discovery, not medical diagnosis; original Lumenora-style packaging only; retain full header-to-footer visibility.
Avoid: nearly empty hero, giant blank space, generic dashboard, rounded SaaS cards, equal repetitive tile grid, glossy gradients, browser chrome, device frame, perspective, surrounding mockup scene, real brand logos, medical claims, watermark, distorted face or hands.
```

- [ ] **Step 2: Inspect the Quiz candidate**

Open the generated image with `view_image` at original detail and verify:

- Header, interactive question preview, How It Works, concern mosaic, four-step result, testimonial/trust band, final CTA, and footer are present.
- The page explains what happens before, during, and after the quiz.
- Imagery and components fill the full page without a conspicuous empty middle band.
- `LUMENORA`, `QUIZ`, `Discover Your Signature Routine`, `QUESTION 01 OF 05`, `YOUR FOUR-STEP RITUAL`, and `START THE QUIZ` are readable.
- No medical diagnosis language, browser frame, watermark, copied logo, distorted face/hands, or impossible product geometry appears.

- [ ] **Step 3: Make one targeted Quiz iteration only if needed**

If the candidate misses an acceptance criterion, edit/regenerate using the candidate as the target and state only the failed requirement. Example:

```text
Change only the quiz-interaction clarity: enlarge the QUESTION 01 OF 05 panel and make all four answer options visibly selectable while keeping the hero, imagery, section order, palette, typography, result preview, final CTA, and footer unchanged. Preserve the straight-on full-page 9:16 composition. No new sections, no watermark.
```

Reopen the revised image and repeat the Step 2 checks.

- [ ] **Step 4: Save the selected Quiz image**

Copy the selected built-in generation result from its generated-images location to:

```text
D:\Personal_Project\Lumenora\Mockups\quiz-editorial-commerce-full.png
```

Verify `Test-Path` returns `True` and do not overwrite any other Quiz mockup.

- [ ] **Step 5: Commit the Quiz mockup**

```powershell
git add -- 'Mockups/quiz-editorial-commerce-full.png'
git commit -m "design: add editorial commerce quiz mockup"
```

Expected: one new PNG is committed; existing `Mockups/quiz.png` remains unchanged.

---

### Task 3: Cross-page visual verification

**Files:**
- Verify: `Mockups/blog-editorial-commerce-full.png`
- Verify: `Mockups/quiz-editorial-commerce-full.png`
- Reference: `Mockups/home-editorial-magazine-v5.png`
- Reference: `Mockups/shop-all-editorial-marketplace-4k.png`

**Interfaces:**
- Consumes: final images from Tasks 1 and 2.
- Produces: a verified two-image mockup set ready for user review.

- [ ] **Step 1: Verify file existence and dimensions**

Run a read-only PowerShell check using `System.Drawing.Image.FromFile()` for both final paths.

Expected:

- Both paths exist.
- Both files decode as PNG images.
- Both images have a portrait ratio within 1% of 9:16.
- Neither file is zero bytes.

- [ ] **Step 2: Compare the four pages visually**

Open Home, Shop All, Blog, and Quiz with `view_image`. Confirm the new pages share:

- The same recognizable Lumenora wordmark and editorial serif/sans hierarchy.
- The ivory/parchment/charcoal foundation with olive, amber, brass, and oxblood accents.
- Warm botanical skincare photography and squared editorial crops.
- Comparable content density and a coherent header/footer family.

Also confirm Blog and Quiz are visibly distinct in information architecture and hero treatment.

- [ ] **Step 3: Verify the worktree contains only intended deliverables**

```powershell
git status --short
```

Expected: no uncommitted generated image or temporary file remains from this plan. Pre-existing unrelated user changes, if any, remain untouched.

- [ ] **Step 4: Report the outputs**

Return clickable absolute links to both PNG files, render both images inline, state that built-in image generation was used, and include the two exact generation prompts from Tasks 1 and 2 in the handoff summary.
