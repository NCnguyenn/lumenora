# Lumenora Home — Editorial Magazine Design v5

## Objective

Create one high-fidelity, full-page desktop image mockup for the existing Lumenora Home route. The redesign should read like an art and beauty magazine with commerce woven into the editorial flow. Keep the current project Hero unchanged, rebuild all content below it, and generate original luxury product photography directly inside the mockup.

The design is informed by Aesop's calm editorial pacing and tactile materiality, without copying Aesop's layout, packaging, campaign imagery, or copy. Violet Grey remains a secondary reference for decisive editorial hierarchy and commerce-to-content rhythm.

## Scope

- Deliver one straight-on, tall desktop webpage mockup at a 1440 px design width.
- Redesign only the existing Home route.
- Use only destinations supported by the six routes already running in the React project: Home, Shop, Quiz, Blog, Wishlist, and Cart.
- Do not invent or imply Product Detail, Category, About, Contact, Account, Checkout, Sustainability, Shipping, FAQ, or other pages.
- Category, product, and ritual actions all lead conceptually to the existing Shop route.
- Article actions lead conceptually to the existing Blog route.
- Do not show browser chrome, device frames, perspective presentation, hands, or a surrounding mockup scene.

## Core Creative Direction

The page uses an **Editorial Chapters** composition, but the interface must not display chapter numbers, section numbers, or the word `CHAPTER`. The name describes the pacing only.

The page should feel assembled by an art director rather than generated from an ecommerce template:

- Alternate expansive image spreads, narrow text columns, captions, hairline rules, and purposeful negative space.
- Use an asymmetric twelve-column grid and let image ratios change from one passage to the next.
- Avoid rows of equal cards, repeated three-column modules, boxed feature lists, rounded containers, and repeated centered headings.
- Allow selected imagery or type to cross the underlying grid while maintaining readable alignment.
- Preserve quiet areas. Not every part of the canvas needs imagery or copy.
- Product names, prices, and short descriptors sit outside the photography like magazine captions.

## Visual System

- Parchment: `#E8E0D2`
- Paper ivory: `#F4F0E8`
- Charcoal: `#181713`
- Oxblood: `#6B1F2B`
- Botanical olive: `#69705A`
- Oxidized brass accent: `#8A7452`
- Display typography: high-contrast editorial serif with large, restrained headlines.
- Utility typography: modern sans-serif in small uppercase labels with generous tracking.
- Details: hairline rules, squared image edges, folio-like captions, no pills, no soft UI cards, no glossy gradients.
- Photography carries richer blacks, mineral neutrals, warm glass, organic green, and controlled highlights so the page does not collapse into beige-on-beige.

## Header

- Compact parchment header separated by a thin charcoal rule.
- Centered, widely tracked `LUMENORA` wordmark.
- Primary links: `HOME`, `SHOP`, `QUIZ`, `BLOG`.
- Utility actions: Search, Wishlist, Cart.
- No additional links or pill-shaped navigation.

## Existing Hero — Preserve Unchanged

Preserve the current Hero slider's composition, imagery, dark overlay, typography, arrows, indicators, and CTA treatment from `Frontend/src/pages/Home.tsx`.

The mockup shows its first existing slide with this exact copy:

- Eyebrow: `THE SUMMER EDIT`
- Headline: `Less routine. More ritual.`
- Supporting copy: `A seasonal edit across skin, body and mind.`
- CTA: `SHOP NOW`

Do not recolor, crop into a split panel, or replace the Hero image with generated product photography.

## Editorial Flow Below the Hero

The following passages appear in this order. Their headings may be shown, but no visible numbering is permitted.

### Contents — Skin, Body, Sun

- Introduce the three existing Shop discovery themes: `SKIN`, `BODY`, and `SUN`.
- Use a staggered collage instead of three equal category tiles:
  - One large vertical skin ritual crop.
  - One low horizontal cream or body texture crop that partially offsets the first image.
  - One smaller product-and-foliage sun-care image with generous open paper around it.
- Place category labels beside or below imagery as folio captions, not as large text overlays.
- Add one short editorial line that frames the categories as a considered daily practice.
- Do not include the previous four-column trust strip.

### The Daily Edit

- Use one dominant original still-life occupying roughly seven to eight of twelve columns.
- Pair it with a narrow editorial column containing the heading `THE DAILY EDIT`, a short introduction, and three product entries from the existing catalogue.
- Use these existing products and prices:
  - Bamboo Ultra Hydrating Toner — `$45.00`
  - Birch Moisturizing Soothing Gel — `$15.00`
  - Mugwort Calming Cream — `$38.50`
- Present entries as typographic lines separated by hairline rules. Do not use product cards, badges, star ratings, or wishlist buttons in this passage.
- The still-life should feature original minimal vessels on wet limestone, translucent gel, water reflections, and herbarium shadows.

### Compositions for the Skin

- Present three curated product compositions as an intentionally irregular sequence rather than a single row:
  - A wide panoramic still-life spanning most of the page width.
  - A square composition held to one side with a large margin.
  - A tall portrait composition paired with a compact text block.
- Use these existing catalogue items as the commercial anchors:
  - Advanced Snail Mucin 96% Power Repairing Essence Serum — `$18.50`
  - Volcanic Sea Clay Detox Masque — `$54.00`
  - Invisible Fluid Sunscreen SPF 50+ PA++++ — `$24.80`
- Each composition receives only a restrained title, a short sensory descriptor, and a price outside the image.
- Do not label the passage `BEST SELLERS`, do not show rankings, and do not arrange the products as equal cards.

### Brand Interlude

- Create a sparse oxblood editorial spread with the statement `Many formulas. One considered ritual.`
- Pair the statement with one close botanical macro or abstract mineral texture occupying an offset portion of the spread.
- Supporting copy explains Lumenora's point of view through botanical intelligence, guided discovery, and a unified selection, without displaying feature icons or numbered principles.
- Keep this as an on-page manifesto. Do not show an About-page CTA.

### The Ritual

- Present `CLEANSE`, `TREAT`, and `PROTECT` as three asymmetrical scenes that alternate image and copy position down the page.
- Do not prefix the labels with `01`, `02`, or `03`.
- Each scene uses original product photography and exactly two existing catalogue products:
  - `CLEANSE`: Green Tea Deep Cleansing — `$25.00`; Eucalyptus Nourishing Body Cleanser — `$34.00`.
  - `TREAT`: Advanced Snail Mucin 96% Power Repairing Essence Serum — `$18.50`; Mugwort Calming Cream — `$38.50`.
  - `PROTECT`: Invisible Fluid Sunscreen SPF 50+ PA++++ — `$24.80`; Body Lotion Lavender Patchouli — `$42.00`.
- Use one restrained `EXPLORE THE RITUAL` text link for the whole passage, conceptually pointing to the existing Shop route.
- The scenes should feel like consecutive magazine spreads, not columns in a merchandising block.

### The Lumenora Journal

- Build a publication-style ending with one dominant cover-like story and two small supporting stories.
- Use existing article titles from `Frontend/src/data/articles.ts`:
  - Primary: `Why Snail Mucin is the Skincare Ingredient You Can't Ignore`
  - Supporting: `The Ultimate Guide to Double Cleansing`
  - Supporting: `How to Repair a Damaged Skin Barrier`
- The primary story uses a large art-directed image and oversized serif headline with controlled wrapping.
- Supporting stories use smaller crops, folio captions, and hairline separators rather than cards.
- One `READ THE JOURNAL` text link points to the existing Blog route.

## Closing Notes and Footer

- Treat newsletter signup as an editor's closing note rather than a promotional banner.
- Use the exact copy:
  - Eyebrow: `NOTES FROM THE BEAUTY DESK`
  - Title: `The Edit`
  - Supporting line: `Curated beauty intelligence, delivered with intention.`
  - Field label: `EMAIL ADDRESS`
  - Action: `SUBSCRIBE`
- Transition into a minimal charcoal footer with the ivory `LUMENORA` wordmark and existing statement `Premium botanical skincare, crafted with intention.`
- Footer links: `SHOP`, `QUIZ`, `BLOG`, `WISHLIST`, `CART` only.
- Copyright: `© 2026 LUMENORA. ALL RIGHTS RESERVED.`
- Do not show invented policy, contact, social, account, or company links.

## Original Product Photography Art Direction

All product photography introduced below the preserved Hero is generated specifically for this mockup. It must not reproduce Aesop or another real brand's packaging.

- Packaging language: unbranded or discreetly branded Lumenora vessels; frosted glass, amber glass, ivory aluminium tubes, cream glass jars, and dark botanical labels.
- Graphic language: minimal labels with restrained typography. Avoid dense generated microtext; important product names and prices remain outside the images.
- `CLEANSE`: frosted pump bottle, light amber gel, wet limestone, water reflections, cool daylight.
- `TREAT`: amber serum bottle and clay mask jar, oxidized brass, dry mineral surface, herbarium shadows, warmer directional light.
- `PROTECT`: ivory sunscreen tube and body lotion jar, bright stone, angled sun, olive foliage, crisp but natural highlights.
- Curated compositions: sculptural still-life using stone, glass, water, metal, and botanical fragments with deliberate room for captions.
- Finish: 4K-style luxury editorial photography with realistic surface imperfections, physical contact shadows, optical depth, controlled specular highlights, and subtle film grain.
- Avoid: sterile CGI, floating products, excessive symmetry, generic beige studio sets, impossible reflections, watermarks, copied logos, and unreadable fake label copy presented as real information.

## Image Generation and Composition Strategy

- The final deliverable is one integrated full-page UI mockup; separate 4K product image files are not required for this iteration.
- Product scenes should be rendered with enough detail to read as premium 4K photography at their scale within the page.
- Use the current Home Hero asset as a strict visual reference for the preserved Hero.
- Generate the remaining product and editorial imagery as original material inside the new composition.
- Maintain one coherent photography system across all passages while varying crop, angle, scale, and negative space.
- Prefer a fresh full-page generation using the previous mockup only as a reference for Lumenora's wordmark and Hero content. Do not inherit the previous equal-card structure.

## UX Intent

- Preserve recognition through the existing Hero, then slow the user into an editorial journey rather than immediately showing a catalogue wall.
- Let category discovery establish the breadth of the range without implying new category routes.
- Introduce individual products through considered compositions, then explain the brand point of view, then expand into a complete ritual.
- End with reading and newsletter actions so commerce, education, and brand atmosphere reinforce one another.
- Maintain scanability with strong typographic anchors, visible prices, predictable text-link treatments, and generous separation between passages.

## Mockup Constraints

- High-fidelity luxury ecommerce interface, not abstract concept art.
- All important headings, product names, prices, article titles, navigation labels, and form labels must be readable.
- No visible section or chapter numbering anywhere in the interface.
- No repeated equal-width ecommerce grids below the Hero.
- No extra routes, sections, popups, badges, policy claims, or unsupported functionality.
- No copied Aesop/Violet Grey assets, product packaging, layouts, or campaign copy.
- Save the new output non-destructively as `Mockups/home-editorial-magazine-v5.png` and preserve all earlier mockups.

## Acceptance Criteria

- The Header and current first Hero slide remain recognizable and use the approved existing copy.
- The content below the Hero reads as an art magazine through asymmetric layouts, varied image ratios, captions, negative space, and non-repeating rhythms.
- `SKIN`, `BODY`, and `SUN` appear as a staggered category composition rather than three equal tiles.
- The Daily Edit, Compositions for the Skin, Brand Interlude, The Ritual, Journal, Closing Notes, and Footer appear in the approved order.
- No visible chapter numbers, section numbers, or numbered ritual labels appear.
- Product photography is original, coherent, materially realistic, and integrated directly into the mockup.
- Product and article content uses only the approved existing names and prices.
- All conceptual navigation remains within the six routes running in the project.
- The result feels distinctly art-directed and avoids the repeated card/grid structure that made v4 feel AI-generated.
