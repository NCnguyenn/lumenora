# Premium Skincare Ecommerce UI/UX Analysis

**Reference site studied:** [aesop.com](https://www.aesop.com/) (live DOM inspection, 2026-07-16)  
**Method:** Chrome DevTools MCP (`chrome-devtools-mcp@latest`) — headed browser, multi-viewport screenshots, accessibility trees, computed styles, console, and network  
**Viewports:** Desktop 1440×900 · Tablet 768×1024 · Mobile 390×844  
**Pages reviewed:** Homepage · Shop listing · Product detail · Cart · Library (editorial)  
**Purpose:** Extract **general design principles** for building an **original** luxury skincare experience (e.g. Lumenora).  

> **Legal / brand boundary**  
> Do **not** copy Aesop’s logo, wordmark, product names, copy, proprietary photography, packaging graphics, or trademarks.  
> This document records **observed interaction patterns, layout systems, and abstract design principles only**, then proposes an **original visual direction** inspired by premium editorial magazines and luxury skincare packaging—not a clone of the reference brand.

---

## Research notes & limitations

| Item | Detail |
|------|--------|
| Tooling | MCP server `chrome-devtools` via `npx -y chrome-devtools-mcp@latest` |
| Challenge | Headless Chrome hit Cloudflare Turnstile; analysis used a headed, persistent profile |
| Overlays | Geo-region modal + cookie consent often masked first paint; dismissed for clean captures |
| Region | Primary captures on US English storefront; cart once redirected to HK locale in an earlier pass |
| Artifacts | Screenshots & probes under `docs/analysis-assets/` (local research only; not for redistribution of brand assets) |

**Pages successfully loaded**

| Page | URL pattern (observed) | Clean capture |
|------|------------------------|---------------|
| Homepage | `/` | Yes (desktop/tablet/mobile) |
| Shop / PLP | `/shop-all/` | Yes |
| PDP | `/hand-body/.../*.html` (example SKU path) | Yes |
| Cart | `/cart/` | Yes (empty cart state) |
| Editorial | `/library.html` | Yes |

---

## 1. Overall design direction

The reference experience reads as **museum-shop ecommerce crossed with a literary quarterly**:

- **Quiet confidence** over trend tactics: cream fields, charcoal type, almost no decorative chrome.
- **Product as object photography**: amber glass, stone, skin, and material still-life on vast negative space—not lifestyle clutter.
- **Editorial voice first**: sensory, short, slightly literary headlines; olfactory/functional descriptors as secondary product copy.
- **Squared geometry**: zero or near-zero corner radius; hairline rules; flat filled CTAs.
- **Commerce is present but understated**: price and “Add to cart” are clear, but never shouty gradients or countdown timers on core templates.
- **Architecture (SFCC / Demandware):** BEM-like class names (`c-product-main__name`, `l-header`, `h-text-size-14`) signal a mature design-system layer on a large ecommerce platform.

**Principle to keep (abstract):** *Luxury is restraint + craft + legibility.* Every surface should feel intentionally empty rather than unfinished.

---

## 2. Brand and visual identity (observed principles)

| Principle | Observation |
|-----------|-------------|
| Wordmark-as-architecture | Centered logo as the fixed visual anchor of the header; utility links flank left/right |
| Material honesty | Amber glass, matte pumps, paper labels, timber, linen—packaging language drives digital UI |
| Warm neutrals | Page ground is not pure white; it is a warm ivory/cream that softens high-contrast photography |
| Dark counterforms | Promo bars, video heroes, and footer use near-black charcoal to bookend the cream content plane |
| Sparse accent color | Rust/terracotta appears almost only on status labels (“New addition”, “Beloved formulation”) |
| Cultural layer | “Library” / editorial treats brand content like a reading room—culture as conversion, not blog spam |

**Do not replicate:** specific logo letterforms, trademarked product series names, or campaign film frames.

---

## 3. Color palette (computed / sampled)

Sampled from live computed styles (desktop), aggregated across major nodes:

| Role | Observed RGB | Approx. hex | Usage |
|------|--------------|-------------|--------|
| Page / header ground | `rgb(255, 254, 242)` | `#FFFEF2` | Body, header, PLP cards field |
| Primary text | `rgb(51, 51, 51)` | `#333333` | Dominant UI copy |
| Secondary text | `rgb(102, 102, 102)` | `#666666` | Muted labels, placeholders |
| Near-black | `rgb(0, 0, 0)` | `#000000` | Sparse pure black |
| Footer / deep charcoal | `rgb(37, 37, 37)` | `#252525` | Footer background |
| CTA fill | `rgb(51, 51, 51)` | `#333333` | Primary buttons |
| CTA label on dark | `rgb(255, 254, 242)` | `#FFFEF2` | Button text on charcoal |
| Warm panel | `rgb(235, 234, 222)` | `#EBEADE` | Soft secondary surfaces |
| Accent rust | `rgb(202, 67, 47)` | `#CA432F` | Product badges / micro labels |
| Promo bar | Dark gray (≈ `#3A3A3A`–`#4A4A4A`) | — | Global shipping / offer strip |

**Contrast notes (qualitative):** Charcoal `#333` on cream `#FFFEF2` is strong for body text. Cream text on dark video heroes is intentional and generally readable at large sizes; small light-on-dark UI needs care. Rust accents on cream pass for labels but should not be used for long body copy.

### Original palette recommendation (for a new brand)

Inspired by **editorial paper + apothecary packaging**, not the reference brand’s identity:

| Token | Hex | Role |
|-------|-----|------|
| `paper` | `#F4F0E8` | Primary page ground |
| `parchment` | `#E8E0D2` | Section bands, cards |
| `ink` | `#181713` | Primary text / primary CTA |
| `ink-soft` | `#4A453C` | Secondary text |
| `mist` | `#C9C2B4` | Rules, disabled, borders |
| `clay` | `#6B1F2B` | Sparse accent (labels, focus rings sparingly) |
| `olive` | `#69705A` | Botanical secondary (never full-bleed marketing green) |
| `ivory` | `#FBF8F2` | Elevated surfaces / inputs |

---

## 4. Typography system

### Fonts loaded (document.fonts)

| Family | Weight | Role (inferred) |
|--------|--------|-----------------|
| **SuisseIntl** | 400 | Primary UI / body |
| **SuisseIntl-Medium** | 500 | Emphasis, nav medium, buttons |
| **Zapf-Humanist** | 400 | Display / wordmark-adjacent |
| **CircularStd** | 400–700 | Product title on PDP (desktop ~24px) |

### Observed type scale (desktop, computed)

| Use | Size | Weight | Line-height | Notes |
|-----|------|--------|-------------|--------|
| Micro / footer / skip | 11–12px | 400 | ~1.5–1.6 | Uppercase skip links |
| Nav / body / controls | **14px** | 400–500 | 16.8–21px | System default UI size |
| Card title (h3) | 14px | 700 / 500 | ~15–21px | Product names in grid |
| Mid heading | 16px | 400–500 | ~27px | Category subheads |
| Page title / PDP name | **24px** | 400 | 30px | Shop h1, product h1 |
| Section display | **30px** | 400 | ~40px | Library hero, homepage sections (“A rich repertoire”) |
| SR / hero-scale | 36px | 400 | ~50px | Visually hidden homepage h1 sample |

**Rhythm principles**

1. **Narrow scale, many weights of one sans** — hierarchy is size + weight + color, not five font families.  
2. **~1.2–1.5 line-height** for UI; slightly looser for editorial paragraphs.  
3. **Sentence case** for commerce; skip links use **uppercase**.  
4. **No loud letter-spacing** on body; tracking stays near `normal`.  
5. Product storytelling favors **short sensory lines** under the product name (aromatic descriptors), not long marketing blurbs in the card.

### Original type recommendation

| Role | Direction | Fallback stack |
|------|-----------|----------------|
| Display | High-contrast editorial **serif** (magazine headline) | `"Source Serif 4", "Libre Baskerville", Georgia, serif` |
| UI / body | Neutral modern **grotesk** | `"DM Sans", "Inter", system-ui, sans-serif` |
| Micro labels | Same grotesk, 11–12px, medium, optional slight tracking | — |

Suggested scale for a new site (desktop): 12 / 14 / 16 / 20 / 28 / 40 / 56 — fewer steps than a marketing site, larger display for hero only.

---

## 5. Spacing and sizing system

Inferred from layout measurements and class utilities (`h-margin-top-3`, `h-text-size-14`, padding samples):

| Token (conceptual) | Approx. px | Evidence |
|--------------------|------------|----------|
| `space-1` | 4–5px | Button vertical padding samples (`5px 20px`) |
| `space-2` | 8–10px | Small gaps, input horizontal padding |
| `space-3` | 15px | Common section margin / hero caption padding |
| `space-4` | 20–24px | CTA horizontal padding; cart heading margins |
| `space-5` | 30–40px | Hero body padding; section breathing |
| Header height | ~116px | Desktop `header.l-header` |
| Primary CTA height | ~40px | PDP add-to-cart |
| Input / size select | ~40px hit area | PLP size dropdowns |
| Content max (cart) | ~1170px | `l-cart__heading` width sample |
| Full-bleed sections | 100vw | Heroes, library imagery |

**Rhythm rule:** Vertical spacing is **generous and even**; components rarely stack with &lt;16px between text blocks. Cards separate with air, not heavy dividers.

---

## 6. Grid and layout rules

### Desktop (1440)

- **Header:** Full-bleed cream; **centered logo**; left utility (Stores, Customer service); right utility (Email, Account, Cart); **secondary full-width category nav** under logo.  
- **Hero:** Full-bleed media (often video) with **overlaid editorial copy** and outlined CTA; carousel/video controls bottom-left.  
- **PLP:** ~**4-column** product grid; toolbar with title, filters, count, sort; product card = image + badge + wishlist + name + descriptor + size + price + solid ATC.  
- **PDP:** **Asymmetric split** — large product photography (left) / purchase column (right); size chips; full-width charcoal ATC; “Suggested partners” below.  
- **Cart:** **Two-column** empty state — message panel + secure payment panel; recommendation rail full width below.  
- **Library:** Full-bleed image hero (~318px caption band on desktop) → ivory content with section indexes.

### Tablet (768)

- Nav compresses; category strip may scroll or collapse.  
- Product grid trends toward **2–3 columns**.  
- PDP purchase column stacks earlier.

### Mobile (390)

- **Sticky top bar:** logo left; search, store, cart, hamburger right (icon-only).  
- Optional **horizontal category scroller** under header (Library).  
- **PLP:** **2-column** dense grid; Filters + Sort as large twin controls; ATC still on card.  
- **PDP:** Title + price first, then hero image, thumbnail strip, **sticky bottom ATC bar**.  
- **Homepage hero:** Media full-bleed; copy block below on dark ground; full-width outlined button.

### Breakpoint philosophy (inferred)

Not hard-coded from CSS files, but behavior suggests:

| Range | Behavior |
|-------|----------|
| &lt; ~768 | Icon header, 2-col grid, sticky ATC |
| ~768–1199 | Hybrid nav, 2–3 col grid |
| ≥ ~1200 | Dual-row header, 4-col grid, split PDP |

**Container rule:** Marketing heroes are full-bleed; commerce content often sits in a **~1170–1200px** comfortable measure.

---

## 7. Reusable component inventory

| Component | Anatomy | Interaction |
|-----------|---------|-------------|
| **Promo strip** | Single-line offer, dark ground, dismissible | Global trust / AOV nudge |
| **Global header** | Logo, dual utility rows, category nav, search | Mega-menu flyouts (expandable buttons per category) |
| **Skip links** | “SKIP TO CONTENT”, “SKIP TO FOOTER” | Keyboard first |
| **Product card** | Image, badge, wishlist, name, sensory line, size select, price, ATC | In-grid purchase without PDP |
| **Size control** | Select or chip group | Updates price on PDP |
| **Primary CTA** | Charcoal fill, cream type, square, full card width | Hover: likely darken (not flashy) |
| **Secondary CTA** | Outline on dark (hero) | Border 1px cream |
| **Breadcrumbs** | Home › Category › … | Always on PLP/PDP |
| **Wishlist / cabinet** | Bookmark icon | Add without leaving grid |
| **Badge** | Rust text, no pill fill | “New”, “Beloved…” |
| **Search** | Expandable / labeled field | Desktop “Search…” in nav |
| **Cookie / geo modal** | Centered dialog, cream panel, dark CTA | High friction if mistimed |
| **Empty cart panel** | Soft parchment block + payment trust module | Recommendations recover session |
| **Editorial hero** | Image + title + short lede | Magazine index below |
| **Footer** | Near-black, multi-column links, trust lines | Dense but structured |
| **Image carousel** | Region + slides + zoom | A11y: `roledescription="carousel"` |

---

## 8. Responsive behavior

| Pattern | Desktop | Mobile |
|---------|---------|--------|
| Navigation | Full text mega structure | Hamburger + icon utilities |
| Product density | 4-up | 2-up |
| PDP media | Side-by-side with buy box | Stacked; media dominant mid-page |
| CTA | In-column | **Sticky bottom bar** with price + label |
| Typography | 24–30px titles | Slightly reduced but still calm |
| Filters | Inline toolbar | Full-width Filters / Sort pair |
| Imagery | Multi-angle carousel | Same, with smaller thumbs |

**Mobile usability strengths**

- Sticky ATC removes scroll-to-buy friction.  
- 2-column grid keeps discovery dense without app-like clutter.  
- Icon header maximizes canvas for product.

**Mobile friction**

- Category count is high; hamburger depth may bury Fragrance / Travel / Experience.  
- Cookie + geo overlays stack badly on first visit (observed).  
- Long sensory product names wrap to 2–3 lines in narrow cards—plan line clamps.

---

## 9. Interaction and animation patterns

| Pattern | Notes |
|---------|-------|
| Hero video | Autoplay-capable with pause / mute controls (homepage) |
| Carousel | Horizontal product or hero slides; arrows on desktop |
| Hover (desktop) | Understated—expect opacity/underline rather than scale explosions |
| Expandable nav | Category buttons expose flyouts |
| Dialogs | Region selector, cookie, account popups |
| Live regions | Multiple `aria-live` polite regions in a11y tree (cart, status) |
| Scroll | Long single-page homepage (~very tall main experience region); editorial library also long |

**Principle:** Motion supports **editorial cinema** (film, slow stills), not gamified micro-interactions.

---

## 10. Ecommerce UX analysis

### Strengths

1. **PLP add-to-cart + size** — shortens path to purchase; excellent for replenishment SKUs.  
2. **Sensory secondary copy** — helps differentiate many similar bottles.  
3. **Clear price hierarchy** — price always near CTA; PDP merges price into button label (`$55.00 — Add to cart`).  
4. **Trust modules** — samples threshold, secure payment logos on cart, store locator.  
5. **Cross-sell** — “Suggested partners” / “You May Also Like” with same card language.  
6. **Wishlist** on every card without visual noise.  
7. **Empty cart recovery** — recommendations instead of a dead end.  
8. **Editorial → commerce bridge** — Library builds brand desire before SKU push.

### Weaknesses / conversion friction

1. **Geo-region modal** on first paint blocks hero and grid (major).  
2. **Cookie layers** (especially multi-locale) compete with first CTA.  
3. **Category breadth** (10+ top items) increases choice paralysis.  
4. **Video-heavy homepage** can delay LCP / attention to product.  
5. **Console/runtime errors** (chat, video player) risk broken support widgets.  
6. **Empty cart** lacks a single strong primary “Continue shopping” button in the empty panel (relies on recs + nav).  
7. **Badge language** is proprietary tone—fine for them; a new brand should invent its own taxonomy (e.g. “Edit”, “Ritual staple”) carefully.

### Funnel sketch (idealized)

```
Awareness (hero / library) → Category or Shop all → PLP card ATC
    ↘ PDP (size + sticky ATC) → Cart → Checkout
```

PLP-level ATC is a deliberate **luxury-but-efficient** pattern: still calm UI, but not anti-conversion.

---

## 11. Accessibility issues

### What works

- Skip links to content and footer.  
- Banner / main / navigation landmarks.  
- Breadcrumb `navigation` labeling.  
- Product image region with carousel semantics and zoom control names.  
- Cart control announces count (`My cart, 0 product in cart`).  
- Expandable attributes on service / category controls.

### Issues observed

| Severity | Issue |
|----------|--------|
| Medium | DevTools: **Quirks Mode** layout warning |
| Medium | **Form field without id/name** (DevTools issue) |
| Medium | Homepage **visually hidden h1** while visual hierarchy lives in non-h1 hero copy—ensure one clear h1 strategy |
| Medium | JS errors: `window.sprChat is not a function`, Flowplayer play failure — assistive tech / support chat may break |
| Low | Multiple polite live regions—risk of noisy announcements |
| Low | Dense footer / mega nav — keyboard users need clear focus states (verify in implementation) |
| Context | Overlay modals (geo/cookie) trap attention; ensure focus trap + Esc + return focus |

**For a new build:** strict Standards mode, labeled inputs, single h1 per view, focus-visible rings using ink/clay (not browser default only), dialog focus management, and reduced-motion for hero video.

---

## 12. Performance issues

### Navigation timing (Performance API, warm-ish headed session)

| Page | TTFB (ms) | FCP (ms) | DCL (ms) | Load (ms) | Doc transfer (bytes) |
|------|-----------|----------|----------|-----------|----------------------|
| Homepage | ~339 | ~396 | ~432 | ~701 | ~1.0M |
| Shop | ~476 | ~560 | ~1150 | ~1207 | ~968K |
| PDP | ~645 | ~804 | ~821 | ~2665 | ~899K |

### Cost drivers

- **Large product imagery** (2000×2000 class assets; many on PDP).  
- **Third-party / platform scripts:** reviews, cast sender, consent (OneTrust-class), analytics beacons, recommendation services.  
- **Media stack:** HLS / Flowplayer configs; console errors when video API fails.  
- **Chat / Sprinklr** errors (`sprChat`).  
- **404 / 400** resource responses in console.  
- SFCC **lazy-load fragment** architecture (many small `CDSLazyload-*` fetches)—good for progressive enhancement, chatty on network.

### Performance principles for a new site

1. Hero: one prioritized image or short muted video with poster; no dual heavy players.  
2. PLP images: responsive `srcset`, dominant color LQIP, max 2 columns worth decoded at once.  
3. Defer chat, reviews, personalization until interaction or idle.  
4. Self-host critical fonts (2 families × 2 weights max).  
5. Budget: LCP &lt; 2.5s on mid mobile; CLS near 0 (reserve media boxes).

---

## 13. Recommendations for an original luxury skincare website

These recommendations turn **abstract principles** into a build plan for a brand like **Lumenora**—editorial, botanical, modern—without imitating the reference brand’s marks or campaigns.

### 13.1 Positioning

- **Editorial apothecary**, not clinical drugstore and not loud “influencer beauty”.  
- Photography: original still-life (glass, stone, leaf, soft daylight)—commissioned or licensed stock with unique art direction.  
- Copy: short, intelligent, skin-science-aware; avoid copying reference product narratives.

### 13.2 Information architecture

| Area | Recommendation |
|------|----------------|
| Primary nav | ≤ 6 items: Shop, Rituals/Quiz, Journal, About, Cart, Account |
| Shop | Collections by concern + format; avoid 10+ equal-weight top links |
| Journal | Magazine index (materials, rituals, culture)—original essays |
| Quiz | Diagnostic entry for personalization (strength of a modern brand) |

### 13.3 Layout system

- Desktop canvas **1440** artboard; content measure **1120–1200**.  
- Grid: 12-column; PLP 4→2; PDP 7/5 split → stack.  
- Section padding: 64–96 desktop, 40–56 mobile.  
- Geometry: **2px max radius** (or 0); 1px `mist` rules; no pill nav.

### 13.4 Components to implement first

1. Global header (wordmark +  text nav + utilities)  
2. Product card (image, badge, title, 1-line benefit, price, ATC)  
3. Primary / secondary / ghost buttons  
4. PDP buy box + sticky mobile ATC  
5. Cart line items + empty state with 4 recs  
6. Journal card (image, kicker, title, deck)  
7. Footer (compact; only real routes)

### 13.5 Conversion patterns to adopt (principle-level)

- Sample / threshold messaging in a slim top bar (honest, not spammy).  
- Size variants as chips, not buried selects when ≤ 4 options.  
- Cross-sell “pairs with” using editorial tone.  
- Empty cart with recs + one primary browse CTA.

### 13.6 Patterns to improve on

| Reference friction | Better original approach |
|--------------------|--------------------------|
| Geo modal blocking first paint | Soft banner or account-level country; never center-trap before content |
| Cookie wall + promo + geo stack | Single consent sheet; defer non-essential cookies |
| Video-default homepage | Image-led hero with optional “Play film” |
| Runtime chat/video errors | Load support widgets on demand with feature detection |
| Very deep category mega-menu | Curated edit + search + quiz |

### 13.7 Accessibility & performance bar

- WCAG 2.2 AA contrast on paper/ink pairs.  
- Keyboardable mega-menu and dialogs.  
- `prefers-reduced-motion` disables hero video autoplay.  
- Font subsetting; critical CSS for header + hero.  
- Image CDN with AVIF/WebP.

### 13.8 Suggested page map (original)

1. **Home** — one hero, one featured ritual, one product edit row, journal teaser, footer.  
2. **Shop** — filters (concern, texture, scent family), 2/4-col grid.  
3. **PDP** — gallery, name, price, variants, ATC, ritual steps, ingredients accordion, pairs-with.  
4. **Cart** — lines, sample offer, checkout CTA, recs.  
5. **Journal** — editorial index + article template (long-form serif).

### 13.9 Visual direction summary (original)

> Warm paper grounds, near-black ink, clay accent, olive botanical support.  
> Serif for display moments; grotesk for commerce UI.  
> Squared components, hairline rules, object-focused photography.  
> Magazine pacing: fewer modules, more breath.  
> Commerce clarity without carnival UI.

---

## Appendix A — Page-by-page findings

### A1. Homepage

- **Hero:** Full-bleed cinematic media; dark overlay; kicker + multi-line sensory headline + outlined CTA; video controls.  
- **Header:** Dual-tier; cream ground; centered mark.  
- **Mobile:** Icon utilities; copy block under media on dark field.  
- **Console:** Flowplayer errors, quirks mode, 404s, `sprChat` TypeErrors.  
- **Perf:** Fast FCP when warm; heavy main experience height (very long scroll).

### A2. Shop / listing

- Toolbar: title “Shop all”, filters, product count (~154), sort.  
- **4-col desktop / 2-col mobile** product cards with size + ATC.  
- Badges in rust; wishlist icons.  
- Strong conversion orientation while staying quiet visually.

### A3. Product detail

- Breadcrumbs; badge; large packshot; size chips with prices; charcoal ATC including price.  
- Sample offer callout.  
- Suggested partners list.  
- Mobile sticky ATC.  
- A11y carousel + zoom controls well labeled.  
- Perf: slower load; many 2000px images + review/media scripts.

### A4. Cart

- Empty state with soft panel message.  
- Secure payment badge grid.  
- “You May Also Like” product row.  
- Earlier pass showed locale-specific cart chrome (HK) when geo differed—**always design for multi-region carefully**.

### A5. Library (editorial)

- Full-bleed lifestyle/interior photography.  
- Title + short manifesto lede.  
- Index rows (“Literature and culture →”, article counts).  
- Demonstrates brand-as-publisher model for luxury.

---

## Appendix B — Token cheat-sheet for implementation

```text
// Abstract tokens (original — do not claim as Aesop’s)
--color-paper: #F4F0E8;
--color-parchment: #E8E0D2;
--color-ink: #181713;
--color-ink-soft: #4A453C;
--color-mist: #C9C2B4;
--color-clay: #6B1F2B;
--color-olive: #69705A;
--color-ivory: #FBF8F2;

--font-display: "Source Serif 4", Georgia, serif;
--font-ui: "DM Sans", system-ui, sans-serif;

--text-xs: 0.75rem;   // 12
--text-sm: 0.875rem;  // 14
--text-md: 1rem;      // 16
--text-lg: 1.25rem;   // 20
--text-xl: 1.75rem;   // 28
--text-2xl: 2.5rem;   // 40
--text-3xl: 3.5rem;   // 56

--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 1rem;
--space-4: 1.5rem;
--space-5: 2.5rem;
--space-6: 4rem;

--radius: 0;          // or 2px
--border: 1px solid var(--color-mist);
--content-max: 72.5rem; // ~1160px
--header-h: 4.5rem;
--cta-h: 2.75rem;
```

---

## Appendix C — Capture inventory

Local research artifacts (not for public brand reuse):

- `docs/analysis-assets/screenshots/*-clean.png` — multi-viewport captures  
- `docs/analysis-assets/*-probe-clean.txt` — computed style probes  
- `docs/analysis-assets/*-a11y-clean.txt` — accessibility trees  
- `docs/analysis-assets/*-console-clean.txt` — console logs  
- `docs/analysis-assets/*-perf-clean.json` — performance summaries  
- `docs/analysis-assets/analysis-clean.json` — aggregated MCP session data  

---

## Closing

The reference site’s power is not a single color or font—it is **discipline**: warm paper, charcoal type, squared controls, object photography, sensory microcopy, and commerce controls that stay calm while remaining efficient (especially PLP ATC and sticky mobile checkout actions).

For Lumenora (or any original luxury skincare brand), inherit **only those principles**. Invent a distinct serif/sans pairing, a botanical-clay palette, original photography, and a tighter IA—then execute with better first-load performance, gentler consent/geo UX, and stricter accessibility than observed on the live reference.

---

*Document generated from Chrome DevTools MCP inspection on 2026-07-16. No application code was modified.*
