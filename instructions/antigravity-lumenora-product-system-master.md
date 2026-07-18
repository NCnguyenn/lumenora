# ANTIGRAVITY MASTER SPEC — Lumenora Product System

> **Dành cho:** Antigravity (hoặc agent thực thi)  
> **Repo:** `D:\Personal_Project\Lumenora`  
> **Frontend:** `Frontend/` — Vite + React 19 + TypeScript + React Router + Zustand + Tailwind + Vitest  
> **Scope:** Frontend-only demo — **không** database, backend API, auth, checkout payment  
> **Prepared by:** grok  
> **Status:** **SOURCE OF TRUTH** — supersedes và gộp hai file sau:
>
> | File cũ | Điểm mạnh đã hấp thụ |
> |---------|----------------------|
> | `antigravity-product-catalog-pdp-images.md` | Brand bible, full product cards + image prompts, as-is bug list, design tokens, dual-img markup thực dụng |
> | `antigravity-shop-all-product-system-upgrade.md` | Architecture, official/fictional policy, cart migration, image art-direction gates, Home protection, similar/routine logic, tests, phases, DoD |
>
> **Cách dùng:** Đọc toàn bộ trước khi sửa code. Không triển khai nửa vời. Hai file cũ giữ làm archive; **implement theo file này**.

---

## 0. Mục tiêu cứng (Definition of Intent)

1. Catalog **20 sản phẩm** đầy đủ (brand, size, price, rating, copy, ingredients, how-to, source metadata).  
2. Mỗi SP **3 scene ảnh local** (primary / hover / detail) — không reuse file giữa 2 SKU.  
3. **ProductCard** dùng chung: Hover Image Swap, stars, price, wishlist, quick add, link PDP.  
4. **Product Detail** route riêng cho mọi SKU.  
5. **Shop All / Home / Search / Wishlist / Cart** đồng bộ một catalog; mọi product click → PDP.  
6. **Không đụng ảnh Home đang đẹp** (hero, editorial, ritual, journal…).  
7. Cart/Wishlist persist an toàn khi đổi schema.  
8. Tests + build pass; không Unsplash/hotlink runtime.

### Out of scope

Database · Backend · Auth · Checkout thật · Admin · Inventory sync · Review submission · Redesign Home · Brand Detail phức tạp · Multi-currency live.

---

## 1. As-is (vấn đề thật trong code)

### 1.1 Stack & entry

| Item | Path |
|------|------|
| App | `Frontend/src/App.tsx` — `/`, `/shop`, `/quiz`, `/cart`, `/wishlist`, `/blog` |
| **Không có PDP** | Chưa có `/products/:slug` |
| Catalog | `Frontend/src/data/products.ts` (14 items, 1 `image`) |
| Card | `Frontend/src/components/ui/ProductCard.tsx` |
| Shop / Home / Cart / Wishlist | `Frontend/src/pages/*` |
| Search | `Frontend/src/components/layout/SearchModal.tsx` |
| Store | `Frontend/src/store/useAppStore.ts` — persist full `Product` into cart |
| Images | `Frontend/public/assets/generated/` |
| Mockups | `Mockups/product.png`, `shop-all-editorial-marketplace-4k.png`, `home-editorial-magazine-v5.png` |

### 1.2 Model as-is (quá mỏng)

```ts
export interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string; // 1 only
  isNew?: boolean;
  isBestSeller?: boolean;
  category: 'skin' | 'body' | 'sun' | 'fragrance';
}
```

### 1.3 Bug / gap list (phải đóng)

| ID | Vấn đề |
|----|--------|
| P1 | 1 image / product — không hover, không gallery |
| P2 | Image reuse (`product-serum.png`, `product-mask.png`, `product-cleanser.png` share nhiều SKU) |
| P3 | Fragrance dùng editorial sai type (`home-brand-interlude.jpg`, `home-composition-sunscreen.jpg`) |
| P4 | `rating`/`reviews` không render trên card |
| P5 | Card/Search link `?category=` thay vì product detail |
| P6 | Không có PDP route |
| P7 | Catalog 14 SKU: Skin 8, Body 3, Sun 1, Fragrance 2 — mất cân |
| P8 | COSRX snail “serum” + “essence” gần trùng concept/image |
| P9 | Home lookup bằng **tên** (`findProductByName`) — gãy khi rename |
| P10 | Cart persist **full Product object** — stale khi catalog đổi |
| P11 | Không slug, không brand entity, không source official/fictional |
| P12 | Home fragrance tile `home-contents-fragrance.jpg` có thể thiếu — **chỉ tạo nếu file không tồn tại**, không overwrite Home assets đang load |

### 1.4 Giữ nguyên (không phá)

- Shop URL params: `category`, `q`, `sort`, `brand`, `maxPrice` (+ mở rộng filter mới nếu thêm)  
- Shop sticky toolbar + editorial end band  
- Home section order, hero autoplay, reduced-motion, **mọi src ảnh Home hiện tại**  
- Zustand persist key name có thể giữ; **phải migrate** schema  
- Palette tokens (dưới)

### 1.5 Design tokens (bắt buộc)

```
ivory #F4F0E8 | parchment #E8E0D2 | charcoal #181713
oxblood #6B1F2B | olive #69705A | brass #8A7452
font-serif: Playfair Display | font-sans: Inter
tracking-folio: 0.22em | max-w-editorial: 1440px
```

Tone: editorial quiet luxury, multi-brand marketplace. UI copy **English**.

### 1.6 Pre-flight (trước khi code)

1. Đọc files §1.1  
2. `git status` — không đụng work không thuộc task  
3. Baseline: `cd Frontend` → `npm test`, `npm run lint`, `npm run build`  
4. Ghi fail sẵn có  
5. Map Home product references → target product id/slug  

---

## 2. Architecture decisions (bắt buộc)

### 2.1 No database

Static TypeScript catalog (+ optional typed JSON). Cart/wishlist localStorage.  
Cấu trúc **API-ready**: một nguồn catalog, selectors, cart chỉ lưu id.

### 2.2 Single catalog source

Home, Shop, Search, PDP, Wishlist, Cart, Similar, Routine — **cùng** `products` + helpers.  
Cấm mảng product rời trong page.

### 2.3 Canonical product URL

```
/products/:slug
```

Ví dụ: `/products/bamboo-ultra-hydrating-toner`

- Slug: unique, lowercase, kebab-case, ổn định  
- Invalid slug → **Product Not Found** UI (CTA Shop) — **không** redirect Home  
- Optional alias: `/product/:slug` → same component (nếu cần tương thích brief cũ)

### 2.4 Lookup rules

- **Bắt buộc:** `getProductById` / `getProductBySlug`  
- **Cấm** production path dựa `findProductByName` (Home phải chuyển sang id/slug)  
- Có thể giữ `findProductByName` chỉ cho migration test tạm, rồi xóa usage

### 2.5 Cart / wishlist shape (đổi từ as-is)

```ts
interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

// wishlist: string[] // product ids only
```

**Migration localStorage** (`lumenora-storage`):

- Bump persist version  
- Old cart item có `id` + full product → map `productId = id`, `variantId = defaultVariantId`, keep `quantity`  
- Drop items không còn trong catalog  
- Không crash app vì data cũ  

### 2.6 Language & money

- UI + product copy: English  
- Currency: USD demo (`$X.XX`)  
- Official products: market `US`, `lastVerified` date  
- Rating demo: `rating.source = "demo"` — không claim official brand ratings  

---

## 3. Official vs fictional data policy

Mỗi brand/product: `sourceType: "official" | "fictional"`.

### 3.1 Official (COSRX, The Ordinary)

- Tra cứu website chính thức trước khi chốt name/size/key ingredients/how-to  
- Viết lại bằng giọng Lumenora — **không** copy đoạn dài  
- Lưu `officialUrl`, `lastVerified`  
- Không bịa clinical claim / % hiệu quả  
- Ảnh: local only; inspired packshot OK nếu trademark packaging không clear — **không** logo méo, chữ gibberish  
- Rating UI vẫn demo trừ khi có nguồn thật  

### 3.2 Fictional (Aurelle Lab, Harbor & Hearth, Maison Verdé, Solenne, Atelier Nocturne)

- Brand story + visual identity riêng  
- Không claim dermatologist tested / clinically proven / certified organic trừ khi có nguồn (không có → không ghi)  
- Không copy tên SP đặc trưng brand thật  
- SPF fictional: không claim vượt quá field đã chốt trong catalog  

### 3.3 Rating

- Range demo 4.4–4.9  
- Review counts đa dạng, không copy-paste  
- `ratingSource: "demo"` trong data; UI chỉ hiện stars + count  

---

## 4. Data model (target)

Có thể tinh chỉnh tên field cho gọn codebase, **phải đủ semantics**.

```ts
export type ProductCategory = 'skin' | 'body' | 'sun' | 'fragrance';
export type ProductSourceType = 'official' | 'fictional';
export type RatingSource = 'official' | 'retailer' | 'demo';

export interface Brand {
  id: string;                 // 'aurelle-lab'
  name: string;
  slug: string;
  sourceType: ProductSourceType;
  shortStory: string;
  fullStory?: string;
  origin?: string;
  officialUrl?: string;
  lastVerified?: string;
}

export interface ProductImage {
  id: string;
  role: 'primary' | 'hover' | 'detail';
  src: string;                // local path only
  alt: string;
  width: number;
  height: number;
  dominantColor?: string;
  sourceUrl?: string;         // provenance if downloaded
}

export interface ProductVariant {
  id: string;
  label: string;
  size: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  inStock: boolean;
}

export interface IngredientHighlight {
  name: string;
  benefit: string;
}

export interface ProductRating {
  value: number;              // 0–5
  count: number;
  source: RatingSource;
}

export interface ProductSource {
  sourceType: ProductSourceType;
  officialUrl?: string;
  lastVerified: string;       // ISO date
  market: 'US';
  notes?: string;
}

export interface Product {
  id: string;                 // 'p1' … stable
  slug: string;
  brandId: string;
  brand: string;              // denormalized display name
  name: string;
  subtitle: string;           // tagline
  category: ProductCategory;
  productType: string;        // Toner, Serum, EDP…
  price: number;              // = default variant price
  currency: 'USD';
  defaultVariantId: string;
  variants: ProductVariant[];
  rating: ProductRating;
  images: ProductImage[];     // length >= 3, roles primary/hover/detail
  badges: Array<'new' | 'bestseller' | 'limited'>;
  shortDescription: string;
  description: string[];      // 2–4 short paragraphs
  benefits: string[];         // 3–5
  keyIngredients: IngredientHighlight[]; // 3–6
  fullIngredients: string;
  howToUse: string[];         // steps
  skinTypes: string[];
  concerns: string[];
  routineStep: string;        // Cleanse | Tone | Treat | Moisturize | Protect | Body | Fragrance
  usageTime: Array<'AM' | 'PM' | 'Anytime'>;
  texture?: string;
  finish?: string;
  scent?: string;
  warnings: string[];
  shippingNote: string;
  returnNote: string;
  relatedTags: string[];
  pairsWithTags: string[];
  /** Optional hard overrides for rails */
  relatedIds?: string[];
  pairsWithIds?: string[];
  source: ProductSource;
}
```

### 4.1 Validation rules

- 20 products; unique `id`, `slug`, `sku`  
- Exactly 3 image **scenes** (roles present); local `src` only  
- `defaultVariantId` ∈ variants; `price` = default variant  
- No Lorem/TODO/Untitled/price 0  
- Official rows: `officialUrl` + `lastVerified`  
- Fragrance: `skinTypes` may be `['All']`; scent/notes required  

### 4.2 Helpers (`productSelectors.ts` hoặc `products.ts`)

```
getProductById / getProductBySlug / getBrandById
getProductsByCategory / getProductsByBrand
searchProducts / filterProducts / sortProducts
getSimilarProducts(product, limit=4)
getRoutinePairings(product, limit=4)
formatPrice / categoryLabel
getPrimaryImage / getHoverImage
validateCatalog() // tests + dev
```

### 4.3 Pragmatic simplification allowed

Nếu model quá nặng cho thời gian: **tối thiểu bắt buộc runtime**:

`id, slug, brandId, brand, name, subtitle, category, productType, price, variants[≥1], rating, images[3], badges, shortDescription, description[], benefits[], keyIngredients[], fullIngredients, howToUse[], skinTypes, concerns, routineStep, usageTime, warnings, shippingNote, returnNote, relatedTags, pairsWithTags, source`

Không được rút xuống model as-is 1-image.

---

## 5. Brand bible

| Brand | id | sourceType | Voice / pack | Products |
|-------|-----|------------|--------------|----------|
| Aurelle Lab | `aurelle-lab` | fictional | Clinical-botanical; frosted clear, sage, white cap | p1, p7, p15, p17 |
| Harbor & Hearth | `harbor-hearth` | fictional | Nordic apothecary; amber, birch, eucalyptus | p2, p5, p18 |
| Maison Verdé | `maison-verde` | fictional | French botanical; ceramic, olive, amber oil | p3, p10, p20 |
| Solenne | `solenne` | fictional | Mediterranean sun/body; white tubes, soft gold | p4, p6, p11, p16 |
| Atelier Nocturne | `atelier-nocturne` | fictional | Night fragrance; charcoal glass, brass | p13, p14, p19 |
| COSRX | `cosrx` | official | Clear PET, black cap, simple label (inspired, no warped logo) | p8, p12 |
| The Ordinary | `the-ordinary` | official | Matte clinical dropper, high-contrast lab type | p9 |

Mỗi brand trong `brands.ts`: `shortStory` (1–2 câu) + optional `fullStory`.

---

## 6. Catalog 20 SKU — MATRIX (chốt)

**Phân bố bắt buộc: Skin 8 · Body 4 · Sun 4 · Fragrance 4.**

| id | Brand | Name | Cat | productType | Price | Size | Badge | Notes |
|----|-------|------|-----|-------------|-------|------|-------|-------|
| p1 | Aurelle Lab | Bamboo Ultra Hydrating Toner | skin | Toner | 45.00 | 150 ml | new | Home daily edit |
| p2 | Harbor & Hearth | Birch Moisturizing Soothing Gel | skin | Gel moisturizer | 15.00 | 100 ml | new | Home daily edit |
| p3 | Maison Verdé | Mugwort Calming Cream | skin | Cream | 38.50 | 50 ml | new | Home daily edit |
| p4 | Solenne | Body Lotion Lavender Patchouli | body | Body lotion | 42.00 | 250 ml | new | Home ritual |
| p5 | Harbor & Hearth | Eucalyptus Nourishing Body Cleanser | body | Body cleanser | 34.00 | 300 ml | — | Home ritual |
| p6 | Solenne | Nourishing Shea Body Butter | body | Body butter | 26.00 | 200 ml | — | |
| p7 | Aurelle Lab | Green Tea Deep Cleansing Gel | skin | Cleanser | 25.00 | 150 ml | — | **Rename** from short as-is name |
| p8 | COSRX | Advanced Snail 96 Mucin Power Essence | skin | Essence | 26.00 | 100 ml | bestseller | **Official**; Home composition |
| p9 | The Ordinary | Niacinamide 10% + Zinc 1% | skin | Serum | 8.00 | 30 ml | — | Official |
| p10 | Maison Verdé | Volcanic Sea Clay Detox Masque | skin | Mask | 54.00 | 75 ml | — | Home composition |
| p11 | Solenne | Invisible Fluid Sunscreen SPF 50+ PA++++ | sun | Fluid sunscreen | 24.80 | 50 ml | — | Home composition/protect |
| p12 | COSRX | Low pH Good Morning Gel Cleanser | skin | Cleanser | 14.00 | 150 ml | bestseller | **Official**; **thay** snail trùng p8 |
| p13 | Atelier Nocturne | Cedar & Fig Eau de Parfum | fragrance | EDP | 98.00 | 50 ml | new | Packshot EDP only |
| p14 | Atelier Nocturne | Soft Linen Hair & Body Mist | fragrance | Mist | 42.00 | 100 ml | — | Mist bottle only |
| p15 | Aurelle Lab | Cedar Leaf Smoothing Body Polish | body | Body scrub | 29.00 | 250 g | — | New body |
| p16 | Solenne | Mineral Veil Sun Milk SPF 50 | sun | Sun milk | 28.00 | 50 ml | new | New sun |
| p17 | Aurelle Lab | Daily Defense Sun Stick SPF 50+ | sun | Sun stick | 22.00 | 20 g | new | New sun |
| p18 | Harbor & Hearth | Aloe Mineral After-Sun Gel | sun | After-sun | 19.00 | 150 ml | — | New sun |
| p19 | Atelier Nocturne | Amber Iris Eau de Parfum | fragrance | EDP | 88.00 | 50 ml | — | New fragrance |
| p20 | Maison Verdé | Neroli Moss Eau de Parfum | fragrance | EDP | 92.00 | 50 ml | — | New fragrance |

**Removed / resolved vs as-is:**

- Drop second snail “serum” identity (old p8 long serum name): merge story into **p8 essence** OR keep one COSRX mucin SKU only.  
- Old p12 snail essence → **reassign id p12** to Low pH cleanser (update all refs).  
- Home strings that pointed at old snail serum name → map to **p8** slug/id.

### 6.1 Home product map (id/slug — không name)

| Home usage | product id | slug |
|------------|------------|------|
| Daily Edit 1 | p1 | `bamboo-ultra-hydrating-toner` |
| Daily Edit 2 | p2 | `birch-moisturizing-soothing-gel` |
| Daily Edit 3 | p3 | `mugwort-calming-cream` |
| Composition mucin | p8 | `cosrx-advanced-snail-96-mucin-power-essence` |
| Composition mask | p10 | `volcanic-sea-clay-detox-masque` |
| Composition SPF | p11 | `invisible-fluid-sunscreen-spf50` |
| Ritual cleanse | p7, p5 | green-tea…, eucalyptus… |
| Ritual treat | p8, p3 | … |
| Ritual protect | p11, p4 | … |

**Home image `src` strings: DO NOT CHANGE.** Only change **links** and product data resolution.

---

## 7. Full product content cards (SOURCE OF TRUTH copy)

> Mỗi card: map 1:1 vào `products.ts`. Ingredients demo/official-rewritten.  
> Image paths runtime:  
> `/assets/products/{slug}/01-primary.webp` (or `.jpg`)  
> `/assets/products/{slug}/02-hover.webp`  
> `/assets/products/{slug}/03-detail.webp`  
> **Không** ghi đè `public/assets/generated/home-*` hay hero.

Shipping/return demo (mọi SP trừ khi override):

- `shippingNote`: `Complimentary shipping on orders $50+ (demo policy).`  
- `returnNote`: `30-day returns on unused items (demo policy).`  
- Default warning: `For external use only. Discontinue if irritation occurs. Patch test recommended.`

### Shared image prompt negative

```
distorted packaging, duplicate bottle, extra cap, unreadable random text, warped logo,
floating object, plastic-looking material, oversaturated colors, watermark, fake UI,
hands, faces, multiple unrelated products, low resolution, blur, cut-off product
```

### Shared primary/hover/detail templates

**Primary:** Premium 4K studio product photography of [PRODUCT], centered single product, [PACK], warm ivory/pale travertine, soft directional sunlight, realistic contact shadow, editorial luxury, product 68–78% frame height, square 1:1, no hands, no people, no extra products.

**Hover:** Same exact product identical bottle/cap/label/proportions, three-quarter angle 20–45°, subtle texture/ingredient prop, same lighting & camera height, 1:1.

**Detail:** Same product in editorial ingredient/texture scene, product still visible, travertine/linen/botanical shadow, 1:1.

---

### p1 — Bamboo Ultra Hydrating Toner

| | |
|--|--|
| id / slug | `p1` / `bamboo-ultra-hydrating-toner` |
| brandId | `aurelle-lab` |
| subtitle | Barrier-first hydration in one pass |
| productType | Toner · routineStep: Tone · AM/PM |
| price / size / sku | 45 / 150 ml / `AL-TON-BAM-150` |
| rating | 4.8 · 310 · demo |
| badges | new |
| skinTypes | Dry, Combination, Dehydrated |
| concerns | Hydration, Barrier support, Dullness |
| texture / finish | Watery · Dewy soft |
| keyIngredients | Bamboo Water — refreshes barrier water content; Panthenol — comfort; Glycerin — humectant slip |
| benefits | Replenishes after cleanse; Layers without stickiness; Preps cream/serum; Quiet no-fragrance-blast finish |
| relatedTags | hydration, toner, barrier |
| pairsWithTags | cleanse, treat, moisturize |
| relatedIds | p7, p16→use p17 only if exists sun; prefer p8, p2, p3 |
| packForm | Tall frosted-clear bottle, white disc cap, charcoal thin label |
| packColor | Clear + sage-tint liquid |

**shortDescription:** A weightless toner-essence hybrid that reintroduces water to a depleted barrier.

**description:**  
- Bamboo water and panthenol settle thirst without film.  
- Built as Aurelle Lab’s first post-cleanse pass.  
- Suitable under serum and cream in multi-brand rituals.

**howToUse:**  
1. After cleansing, pour into clean palms.  
2. Press over face and neck — do not scrub.  
3. Layer 2–3 passes on dry days.  
4. Follow with essence/serum while damp.

**fullIngredients:** Aqua/Water, Bambusa Vulgaris Water, Glycerin, Panthenol, Sodium PCA, Allantoin, 1,2-Hexanediol, Caprylyl Glycol, Citric Acid.

**imagePromptPrimary:** Tall frosted toner bottle pale sage liquid “Bamboo Ultra Hydrating Toner / Aurelle Lab”, ivory travertine, soft daylight, 1:1.  
**Hover:** 3/4 angle, cap beside, watery droplet on stone.  
**Detail:** Macro toner film/droplets, bottle bokeh.

---

### p2 — Birch Moisturizing Soothing Gel

| | |
|--|--|
| id / slug | `p2` / `birch-moisturizing-soothing-gel` |
| brandId | `harbor-hearth` |
| subtitle | Nordic calm for heat-flushed skin |
| productType | Gel moisturizer · Moisturize · AM/PM |
| price / size / sku | 15 / 100 ml / `HH-GEL-BIR-100` |
| rating | 4.8 · 352 · demo · badge new |
| skinTypes | Sensitive, Oily, Combination |
| concerns | Redness, Light moisture, Comfort |
| keyIngredients | Birch Sap; Aloe Vera; Allantoin |
| packForm | Wide low glass jar, matte lid |
| texture | Transparent cooling gel |

**shortDescription:** Water-light birch gel for warm, tight skin without heavy cream.

**description:** Cool gel from birch-sap tradition with aloe comfort. Forest-quiet scent profile, no sticky film.

**howToUse:** After toner, pea-size; pat; optional richer cream over; store cool.

**fullIngredients:** Aqua, Betula Alba Juice, Aloe Barbadensis Leaf Juice, Glycerin, Allantoin, Carbomer, Sodium Hydroxide, Phenoxyethanol.

**imagePromptPrimary:** Wide clear jar transparent gel, kraft-beige “Harbor & Hearth” label, limestone, 1:1.  
**Hover:** Open jar, gel swirl, birch leaf soft focus.  
**Detail:** Macro transparent gel ribbon.

---

### p3 — Mugwort Calming Cream

| | |
|--|--|
| id / slug | `p3` / `mugwort-calming-cream` |
| brandId | `maison-verde` |
| subtitle | Herbal quiet for reactive days |
| productType | Cream · Moisturize · AM/PM |
| price / size / sku | 38.50 / 50 ml / `MV-CRM-MUG-50` |
| rating | 4.7 · 342 · demo · new |
| skinTypes | Sensitive, Dry, Combination |
| concerns | Redness, Comfort, Barrier |
| keyIngredients | Mugwort Extract; Centella; Squalane |
| packForm | Ceramic cream jar, deep olive lid |
| texture | Medium cream, soft herbal tint optional |

**shortDescription:** Day cream around mugwort and centella with squalane softness.

**howToUse:** Pearl after serum; press outward; AM under SPF; PM last cream step.

**fullIngredients:** Aqua, Squalane, Glycerin, Artemisia Princeps Extract, Centella Asiatica Extract, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Ceramide NP, Tocopherol.

**imagePromptPrimary:** Olive-lid cream jar “Maison Verdé Mugwort Calming Cream”, parchment stone, 1:1.  
**Hover:** Open jar pale cream + mugwort sprig.  
**Detail:** Macro cream swirl.

---

### p4 — Body Lotion Lavender Patchouli

| | |
|--|--|
| id / slug | `p4` / `body-lotion-lavender-patchouli` |
| brandId | `solenne` |
| subtitle | Soft body moisture with evening calm |
| productType | Body lotion · Body · Anytime |
| price / size / sku | 42 / 250 ml / `SO-LOT-LVP-250` |
| rating | 4.6 · 28 · demo · new |
| skinTypes | Dry, Normal |
| concerns | Dry body, Comfort scent |
| scent | Lavender, patchouli soft trail |
| keyIngredients | Shea Butter; Lavender Oil; Patchouli |
| packForm | Tall white pump bottle, lavender accent |

**shortDescription:** Daily body lotion with shea slip and low evening lavender–patchouli trail.

**howToUse:** On damp skin post-shower; 2 pumps limbs; more for shins/elbows; wait before dressing.

**fullIngredients:** Aqua, Butyrospermum Parkii Butter, Glycerin, Cetearyl Alcohol, Lavandula Oil, Pogostemon Cablin Oil, Tocopherol, Phenoxyethanol.

**imagePromptPrimary:** White pump lotion “Solenne”, lavender prop, linen, 1:1.  
**Hover:** Bottle + lotion swatch.  
**Detail:** Macro creamy white lotion.

---

### p5 — Eucalyptus Nourishing Body Cleanser

| | |
|--|--|
| id / slug | `p5` / `eucalyptus-nourishing-body-cleanser` |
| brandId | `harbor-hearth` |
| subtitle | Forest-clear wash without strip |
| productType | Body cleanser · Cleanse · Anytime |
| price / size / sku | 34 / 300 ml / `HH-CLN-EUC-300` |
| rating | 4.5 · 439 · demo |
| skinTypes | Normal, Dry |
| keyIngredients | Eucalyptus; Glycerin; Oat Extract |
| packForm | Tall amber bottle, green-grey label |

**shortDescription:** Eucalyptus body wash with oat softness — clean, not squeaky.

**howToUse:** Wet skin; light lather; rinse; follow lotion/butter.

**fullIngredients:** Aqua, Cocamidopropyl Betaine, Glycerin, Eucalyptus Globulus Leaf Oil, Avena Sativa Extract, Sodium Chloride, Citric Acid.

**imagePromptPrimary:** Amber body wash, eucalyptus leaves, spa stone, Harbor & Hearth, 1:1.  
**Hover:** Wet stone + foam hint.  
**Detail:** Macro gel/foam.

---

### p6 — Nourishing Shea Body Butter

| | |
|--|--|
| id / slug | `p6` / `nourishing-shea-body-butter` |
| brandId | `solenne` |
| subtitle | Dense comfort for dry limbs |
| productType | Body butter · Body · PM |
| price / size / sku | 26 / 200 ml / `SO-BUT-SHE-200` |
| rating | 4.7 · 34 · demo |
| skinTypes | Dry, Very dry |
| keyIngredients | Shea; Cocoa Butter; Vitamin E |
| packForm | Wide ivory jar |
| texture | Thick whipped butter |

**shortDescription:** Dense shea–cocoa butter that melts on contact for cracked dry air skin.

**howToUse:** Warm scoop; press dry areas; best night on damp skin; use sparingly.

**fullIngredients:** Butyrospermum Parkii Butter, Theobroma Cacao Seed Butter, Caprylic/Capric Triglyceride, Tocopherol, Helianthus Annuus Seed Oil.

**imagePromptPrimary:** Ivory butter jar Solenne, linen stone, 1:1.  
**Hover:** Open jar butter peaks.  
**Detail:** Macro whipped shea.

---

### p7 — Green Tea Deep Cleansing Gel

| | |
|--|--|
| id / slug | `p7` / `green-tea-deep-cleansing-gel` |
| brandId | `aurelle-lab` |
| subtitle | Morning clarity without tightness |
| productType | Cleanser · Cleanse · AM/PM |
| price / size / sku | 25 / 150 ml / `AL-CLN-GTE-150` |
| rating | 4.7 · 465 · demo |
| skinTypes | Oily, Combination, Normal |
| concerns | Cleanse, Congestion, Antioxidant support |
| keyIngredients | Green Tea; Betaine; Mild surfactants |
| packForm | Frosted tube/bottle, pale green gel |

**name UI:** `Green Tea Deep Cleansing Gel` (fix short as-is “Green Tea Deep Cleansing”).

**shortDescription:** Daily gel cleanser with green tea polyphenols — lifts film, leaves barrier quiet.

**howToUse:** Wet face; 30–40s massage; rinse lukewarm; optional double cleanse PM.

**fullIngredients:** Aqua, Glycerin, Camellia Sinensis Leaf Extract, Betaine, Cocamidopropyl Betaine, Sodium Cocoyl Glutamate, Citric Acid.

**imagePromptPrimary:** Frosted cleanser, pale green gel, Aurelle Lab, stone, 1:1.  
**Hover:** Foam on wet stone.  
**Detail:** Macro green tea gel + foam.

---

### p8 — COSRX Advanced Snail 96 Mucin Power Essence (official)

| | |
|--|--|
| id / slug | `p8` / `cosrx-advanced-snail-96-mucin-power-essence` |
| brandId | `cosrx` · source official |
| subtitle | Viscous repair layers for depleted skin |
| productType | Essence · Treat · AM/PM |
| price / size / sku | 26 / 100 ml / verify official size on site |
| rating | 4.8 · 842 · demo (or note demo) · **bestseller** |
| skinTypes | Dry, Combination, Normal, Dehydrated |
| concerns | Repair feel, Hydration, Texture |
| keyIngredients | Snail Secretion Filtrate; Sodium Hyaluronate |
| packForm | Clear bottle black cap — **watery-to-viscous mucin look** |
| officialUrl | https://www.cosrx.com (confirm product page; store lastVerified) |

**shortDescription:** Cult mucin essence that layers moisture into tired skin — marketplace hero SKU.

**Copy rules:** Rewrite from official facts; verify size/% claims against official page; do not invent clinical stats.

**howToUse:** After toner; palms or pump; pat; cream after; SPF by day.

**fullIngredients:** Prefer official INCI abbreviated/rewritten with verification date.

**imagePromptPrimary:** Clear K-beauty essence bottle mucin liquid, simple clinical label inspired (no trademark-perfect logo), stone, 1:1.  
**Hover:** Liquid stream / alternate angle same bottle.  
**Detail:** Macro mucin film.  
**CRITICAL:** Visual identity distinct from p12 cleanser.

**Home:** Composition serum slot may keep **existing Home image src**; product link → this slug. Do not force-replace Home composition JPG.

---

### p9 — The Ordinary Niacinamide 10% + Zinc 1% (official)

| | |
|--|--|
| id / slug | `p9` / `ordinary-niacinamide-10-zinc-1` |
| brandId | `the-ordinary` · official |
| subtitle | Clinical clarity serum, no fluff |
| productType | Serum · Treat · AM/PM |
| price / size / sku | 8 / 30 ml / verify |
| rating | 4.8 · 114 · demo |
| skinTypes | Oily, Combination |
| concerns | Blemish-prone look, Oil balance, Uneven tone look |
| keyIngredients | Niacinamide 10%; Zinc PCA 1% |
| packForm | Matte lab dropper (inspired accurate) |
| officialUrl | The Ordinary official product URL + lastVerified |

**shortDescription:** High-strength niacinamide with zinc for oilier, congestion-prone skin.

**howToUse:** After cleanse/toner; few drops; moisturizer; SPF day; caution stacking with pure vit C if sensitive.

**imagePromptPrimary:** Matte clinical dropper “Niacinamide 10% + Zinc 1%”, generic lab branding no exact logo theft, grey studio, 1:1.  
**Hover:** Dropper raised clear serum.  
**Detail:** Macro serum droplet.

---

### p10 — Volcanic Sea Clay Detox Masque

| | |
|--|--|
| id / slug | `p10` / `volcanic-sea-clay-detox-masque` |
| brandId | `maison-verde` |
| subtitle | Mineral depth. Quiet clarity. |
| productType | Mask · Treat · 1–2× weekly |
| price / size / sku | 54 / 75 ml / `MV-MSK-VSC-75` |
| rating | 4.8 · 152 · demo |
| skinTypes | Oily, Combination |
| concerns | Congestion, Pore look, Weekly reset |
| keyIngredients | Volcanic Clay; Sea Silt; Kaolin |
| packForm | Dark grey jar · dense clay paste |

**shortDescription:** Weekly mineral clay masque — rinse before bone-dry.

**howToUse:** Thin layer clean dry skin 8–10 min; rinse; hydrate after.

**fullIngredients:** Kaolin, Volcanic Ash, Sea Silt, Glycerin, Aqua, Bentonite, Caprylic/Capric Triglyceride, Tocopherol.

**imagePromptPrimary:** Dark clay jar Maison Verdé, slate, 1:1.  
**Hover:** Spatula clay.  
**Detail:** Macro wet clay.

---

### p11 — Invisible Fluid Sunscreen SPF 50+ PA++++

| | |
|--|--|
| id / slug | `p11` / `invisible-fluid-sunscreen-spf50` |
| brandId | `solenne` · fictional sun — no extra medical claims |
| subtitle | Sheer protection that disappears into the day |
| productType | Fluid sunscreen · Protect · AM |
| price / size / sku | 24.80 / 50 ml / `SO-SUN-INV-50` |
| rating | 4.8 · 453 · demo |
| skinTypes | All |
| concerns | UV daily wear, No white cast (demo story) |
| keyIngredients | UV filters (demo listed); Niacinamide; Vitamin E |
| packForm | Slim white/clear fluid bottle |
| warnings | Demo SPF product for UI only — not a real regulated sunscreen claim for sale. External use. |

**shortDescription:** Daily fluid sunscreen demo formula — invisible finish under makeup.

**howToUse:** Last AM step; generous face amount; reapply outdoors; cleanse PM.

**imagePromptPrimary:** White fluid SPF bottle Solenne, soft sunlit stone, 1:1.  
**Hover:** Milky swatch.  
**Detail:** Macro milky fluid.

---

### p12 — COSRX Low pH Good Morning Gel Cleanser (official)

| | |
|--|--|
| id / slug | `p12` / `cosrx-low-ph-good-morning-gel-cleanser` |
| brandId | `cosrx` · official |
| subtitle | Soft morning gel cleanse |
| productType | Cleanser · Cleanse · AM |
| price / size / sku | ~14 / 150 ml / verify official |
| rating | 4.7 · 520 · demo · bestseller optional |
| skinTypes | All, Sensitive-friendly story per official |
| keyIngredients | Tea Tree Oil (per official if accurate); mild acids if listed officially |
| packForm | Soft tube — **must not look like mucin bottle** |
| officialUrl | COSRX official product page + lastVerified |

**Purpose:** Breaks as-is snail duplicate. Second COSRX SKU = cleanser, not essence.

**shortDescription:** Low-pH gel cleanser for morning refresh — verify claims against official copy rewrite.

**imagePromptPrimary:** Soft plastic tube gel cleanser K-beauty clinical style, distinct from essence bottle, 1:1.  
**Hover:** Gel bead on tube tip / angled tube.  
**Detail:** Macro translucent cleanser gel.

---

### p13 — Cedar & Fig Eau de Parfum

| | |
|--|--|
| id / slug | `p13` / `cedar-fig-eau-de-parfum` |
| brandId | `atelier-nocturne` |
| subtitle | Woody fruit. Night air. |
| productType | EDP · Fragrance · Anytime |
| price / size / sku | 98 / 50 ml / `AN-EDP-CF-50` |
| rating | 4.9 · 67 · demo · new |
| scent | Fig, cedarwood, dry amber, musk |
| skinTypes | All |
| packForm | **Heavy glass EDP**, dark glass, brass optional |
| routineStep | Fragrance |

**shortDescription:** Independent EDP of cedar and ripe fig over soft musk.

**howToUse:** 1 spray pulse points; do not rub; store cool dark.

**fullIngredients / notes:** Alcohol Denat., Parfum, Aqua; notes cedar, fig, amber, musk.

**imagePromptPrimary:** Luxury dark glass perfume bottle, subtle fig/cedar props, Atelier Nocturne, **must be perfume bottle not abstract botanical only**, 1:1.  
**Hover:** Cap off 3/4.  
**Detail:** Macro amber liquid meniscus.

---

### p14 — Soft Linen Hair & Body Mist

| | |
|--|--|
| id / slug | `p14` / `soft-linen-hair-body-mist` |
| brandId | `atelier-nocturne` |
| subtitle | Air-dried cotton. Clean skin scent. |
| productType | Mist · Fragrance · Anytime |
| price / size / sku | 42 / 100 ml / `AN-MST-SL-100` |
| rating | 4.6 · 41 · demo |
| scent | Linen, iris, soft musk |
| packForm | Tall frosted atomizer — **not sunscreen** |

**shortDescription:** Sheer hair-and-body mist — sun on linen.

**howToUse:** Mist 20 cm from hair/body; 2–3 sprays; avoid eyes.

**imagePromptPrimary:** Tall frosted mist bottle, linen fabric, Atelier Nocturne, 1:1.  
**Hover:** Spray angle.  
**Detail:** Macro atomizer.

---

### p15 — Cedar Leaf Smoothing Body Polish

| | |
|--|--|
| id / slug | `p15` / `cedar-leaf-smoothing-body-polish` |
| brandId | `aurelle-lab` |
| subtitle | Soft grain for dull body skin |
| productType | Body scrub · Body · 1–2× weekly |
| price / size / sku | 29 / 250 g / `AL-SCR-CDR-250` |
| rating | 4.5 · 96 · demo |
| skinTypes | Normal, Rough body |
| concerns | Exfoliation, Bump look |
| keyIngredients | Fine sugar/salt grain; Cedar leaf oil; Jojoba |
| packForm | Wide jar scrub |

**shortDescription:** Weekly body polish with cedar-leaf clarity and oil slip.

**howToUse:** Wet skin shower; massage limbs; avoid broken skin/face; rinse; moisturize.

**imagePromptPrimary:** Wide scrub jar Aurelle Lab, cedar leaf, stone, 1:1.  
**Hover:** Open jar grains.  
**Detail:** Macro scrub crystals in oil.

---

### p16 — Mineral Veil Sun Milk SPF 50

| | |
|--|--|
| id / slug | `p16` / `mineral-veil-sun-milk-spf50` |
| brandId | `solenne` · fictional |
| subtitle | Soft mineral milk for daily light |
| productType | Sun milk · Protect · AM |
| price / size / sku | 28 / 50 ml / `SO-SUN-MVM-50` |
| rating | 4.6 · 140 · demo · new |
| keyIngredients | Zinc Oxide (demo); Vitamin E |
| packForm | Soft white bottle sun milk |
| warnings | Demo SPF — UI only |

**shortDescription:** Lightweight mineral sun milk for everyday wear (demo).

**howToUse:** Last AM step; blend well; reapply outdoors.

**imagePromptPrimary:** White sun milk bottle Solenne SPF 50, soft daylight, 1:1.  
**Hover:** Milk swatch.  
**Detail:** Macro milky mineral fluid.

---

### p17 — Daily Defense Sun Stick SPF 50+

| | |
|--|--|
| id / slug | `p17` / `daily-defense-sun-stick-spf50` |
| brandId | `aurelle-lab` · fictional |
| subtitle | Pocket stick for edges and reapply |
| productType | Sun stick · Protect · AM |
| price / size / sku | 22 / 20 g / `AL-SUN-STK-20` |
| rating | 4.5 · 88 · demo · new |
| packForm | Twist-up stick white |
| warnings | Demo SPF — UI only |

**shortDescription:** Portable stick for nose, cheeks, reapplication.

**howToUse:** Twist 2–3 mm; swipe high points; blend; reapply 2h outdoors.

**imagePromptPrimary:** White SPF stick Aurelle Lab, sunlit stone, 1:1.  
**Hover:** Stick extended.  
**Detail:** Macro balm surface.

---

### p18 — Aloe Mineral After-Sun Gel

| | |
|--|--|
| id / slug | `p18` / `aloe-mineral-after-sun-gel` |
| brandId | `harbor-hearth` |
| subtitle | Cool down after light |
| productType | After-sun · Body/sun care · Anytime |
| category | **sun** |
| price / size / sku | 19 / 150 ml / `HH-AS-ALO-150` |
| rating | 4.6 · 210 · demo |
| keyIngredients | Aloe Vera; Panthenol; Allantoin |
| packForm | Clear tube/jar transparent green gel |

**shortDescription:** Aloe gel for post-sun comfort — recovery, not protection.

**howToUse:** After sun, cleanse gently; apply liberally; not a sunscreen substitute.

**imagePromptPrimary:** Clear aloe gel Harbor & Hearth, 1:1.  
**Hover:** Gel swirl.  
**Detail:** Macro aloe gel clarity.

---

### p19 — Amber Iris Eau de Parfum

| | |
|--|--|
| id / slug | `p19` / `amber-iris-eau-de-parfum` |
| brandId | `atelier-nocturne` |
| subtitle | Powdered iris over warm amber |
| productType | EDP · Fragrance |
| price / size / sku | 88 / 50 ml / `AN-EDP-AI-50` |
| rating | 4.7 · 52 · demo |
| scent | Iris, amber, soft woods |
| packForm | Sculptural glass EDP, distinct silhouette from p13 |

**shortDescription:** Powdery iris EDP with warm amber dry-down — evening soft.

**howToUse:** Pulse points; light hand; store dark.

**imagePromptPrimary:** Distinct perfume bottle vs p13, iris/amber mood, Atelier Nocturne, 1:1.  
**Hover:** Alternate angle.  
**Detail:** Macro glass + liquid.

---

### p20 — Neroli Moss Eau de Parfum

| | |
|--|--|
| id / slug | `p20` / `neroli-moss-eau-de-parfum` |
| brandId | `maison-verde` |
| subtitle | Citrus bloom on forest floor |
| productType | EDP · Fragrance |
| price / size / sku | 92 / 50 ml / `MV-EDP-NM-50` |
| rating | 4.8 · 61 · demo |
| scent | Neroli, moss, light woods |
| packForm | Elegant glass EDP, olive/moss accents (Maison Verdé, not Atelier black) |

**shortDescription:** Neroli lifted over mossy base — botanical fragrance house entry.

**howToUse:** 1–2 sprays; avoid rubbing.

**imagePromptPrimary:** Perfume bottle moss-green accents Maison Verdé, neroli blossom soft, 1:1.  
**Hover:** Cap off.  
**Detail:** Macro glass.

---

### 7.1 Example TS shape (p1 pattern)

Implement full `Product` per §4; images array with 3 roles; single default variant. Repeat for p2–p20 from cards above. Official rows: fill `source.officialUrl` after live verify.

---

## 8. Image system (60 scenes)

### 8.1 Counts

`20 × 3 = 60` product scenes. Responsive derivatives không tính scene mới.

### 8.2 Roles

| Role | Use | Rules |
|------|-----|--------|
| primary | Card default, PDP main, cart thumb | 1:1, centered packshot, 68–78% height, no hands |
| hover | Card rollover | Same pack identity, 20–45° or lid/texture, same crop family |
| detail | PDP gallery #3 | Texture/ingredient/lifestyle **with product still visible** |

### 8.3 Continuity gate (fail = regenerate)

Same bottle/jar/tube · same label color · same cap · same proportions · same brand name spelling · no 3 different pack designs.

If AI drifts: lock primary → img2img reference for hover/detail.

### 8.4 Resolution & runtime

- Master optional 3840²  
- Runtime: WebP/AVIF preferred; JPG OK  
- Card: ~640–960 edge; PDP main ~1600  
- `width`/`height`, lazy below fold, LCP not lazy  
- **No external hotlink**

### 8.5 Paths

```
Frontend/public/assets/products/{slug}/
  01-primary.webp
  02-hover.webp
  03-detail.webp
```

**Do not delete** `Frontend/public/assets/generated/` (Home depends on it).

### 8.6 Home image policy (HARD)

| Allowed | Forbidden |
|---------|-----------|
| Change product **links** to `/products/:slug` | Replace Home hero/editorial/ritual/journal src |
| Lookup by id/slug | Force Shop packshots into Home slots |
| Create missing file **only if 404** (e.g. fragrance tile) | Overwrite working beautiful Home assets |
| Map product-specific Home stills into PDP gallery **without changing Home src** | Use multi-product composite as ProductCard primary |

Classify each Home image: product-specific | composite | category | hero | journal — only product-specific may feed PDP gallery as extra if identical product.

---

## 9. ProductCard + Hover Image Swap

**File:** `Frontend/src/components/ui/ProductCard.tsx`  
Shared: Shop, Home grids, Wishlist, Related, Routine, Search (if full card).

### 9.1 Content order

1. Image (hover swap)  
2. Badge new/bestseller  
3. Wishlist button (not inside Link)  
4. Brand  
5. Name → `/products/:slug`  
6. productType or one-line benefit  
7. Stars + value + review count (`aria-label`: `Rated 4.8 out of 5 from 310 reviews`)  
8. Default size  
9. Price  
10. Quick Add (not inside Link)

### 9.2 Hover behavior

- Default `images` role primary  
- Pointer hover on **image container**: crossfade 250–400ms → hover  
- Leave → primary  
- Dual absolute imgs preferred (no flash)  
- Preload hover near viewport  
- Hover error → stay primary  
- `prefers-reduced-motion`: instant or no anim  
- Touch: primary only, usable  
- Optional scale ≤ 1.02 — no layout shift  
- Hover img `aria-hidden`  
- Optional `imageOverride` / `surface="home"` if Home must keep a specific primary **without** changing global catalog primary for Shop  

### 9.3 Markup sketch

```tsx
<div className="group relative aspect-square overflow-hidden bg-parchment">
  <Link to={`/products/${product.slug}`} className="block h-full w-full">
    <img src={primary} alt={`${product.brand} — ${product.name}`}
      className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0 motion-reduce:transition-none" />
    <img src={hover} alt="" aria-hidden
      className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
  </Link>
  {/* badge + wishlist z-10, buttons outside Link */}
</div>
```

### 9.4 Quick Add

- Single variant → add default  
- Multi → default or mini selector  
- Feedback: cart count / toast  
- Stay on Shop; no double-fire bubbling  

---

## 10. Shop All

Keep Editorial Marketplace direction.

### 10.1 Keep

Compact hero · sticky tabs All/Skin/Body/Sun/Fragrance · filter dialog · sort · chips · empty state · end olive band · 2→4 col grid · no mid-grid banners  

### 10.2 Filters (URL-synced)

Existing: category, brand, maxPrice, q, sort.  
Expand if data ready: productType, concern, skinType, availability.

Rules: refresh-safe · back/forward · Clear all · accurate count · invalid params ignored safely.

### 10.3 Sort

featured · new · bestsellers · rating · price-low · price-high  
Deterministic tie-break: name or id.

### 10.4 Search fields

name, brand, category, productType, benefits, concerns, key ingredient names.  
Normalize trim/lowercase; results → PDP not category only.

---

## 11. Product Detail Page

**Route:** `path="products/:slug"`  
**Page:** `Frontend/src/pages/ProductDetail.tsx`  
**Optional split:** ProductGallery, ProductInfoPanel, ProductDetailsAccordion, SimilarProducts, RoutinePairings, ProductRating.

### 11.1 Desktop

Breadcrumb · Gallery ~55–60% left · Info sticky ~40–45% right · 3 thumbs · no crop cap/base  

### 11.2 Mobile

Gallery swipe/thumbs 1/3 · info below · optional sticky ATC · accordion long content  

### 11.3 Above the fold

Brand · H1 name · subtitle · stars/value/count · price · size/variant · badges · stock · shortDescription · qty · Add to cart · Wishlist · shipping note  

### 11.4 Below

Overview (description[]) · Benefits · Key ingredients · Full ingredients · How to use · Product facts · Brand short story · Shipping/returns  

### 11.5 Gallery a11y

Active thumb · keyboard · unique alt · optional lightbox (Esc, focus return) · no onError loop  

### 11.6 Variant/qty

Labelled selector · OOS disabled · price follows variant · qty 1–10 · ATC uses productId+variantId+qty  

### 11.7 Not found

Heading “Product Not Found” · Back to Shop · no blank · no silent Home redirect  

### 11.8 SEO light

`document.title` = `{Name} | Lumenora` · meta from shortDescription · optional Product JSON-LD  

---

## 12. Similar Products vs Routine Pairings

**Two different rails — not the same list.**

### 12.1 Similar — “You May Also Like”

Score:

| Signal | Points |
|--------|-------:|
| Same productType | +40 |
| Same category | +25 |
| Concern overlap each | +10 |
| Skin type overlap each | +6 |
| Ingredient/tag overlap each | +5 |
| Price within ±25% | +8 |
| Same brand | +4 |
| Bestseller | +2 |

Exclude self · sort score · tie rating then name · return 4 · fallback same category → featured.

### 12.2 Routine — “Complete the Ritual”

Use `routineStep` + `pairsWithTags` / `pairsWithIds`:

- Cleanse → Tone → Treat → Moisturize → Protect  
- Body cleanser → lotion/butter  
- Fragrance → mist/lotion scent-compatible  
- Prefer not two near-identical sunscreens in “Complete the Ritual”

Exclude self · avoid same product in both rails when possible · ProductCard → PDP.

Hardcoded `relatedIds` / `pairsWithIds` on product can seed/override scorer for demo control.

---

## 13. Cart, Wishlist, Search, Home wiring

| Surface | Required |
|---------|----------|
| Cart | Resolve productId; primary img; name→PDP; size; live price; qty; remove; subtotal; empty→/shop |
| Wishlist | Resolve ids; ProductCard hover; remove; skip missing ids safely |
| SearchModal | Results → `/products/:slug`; show brand/name/price; popular from bestsellers; remove fake tags (e.g. Lip oil if no SKU); close on navigate |
| Home | id/slug lookup; product clicks → PDP; category CTA → `/shop?category=`; **no Home image src changes** |
| Header counts | Unchanged logic, driven by new cart shape |

---

## 14. UI/UX & a11y

- Same editorial system as Home (square edges, light borders, no heavy shadow, no neon CTA)  
- Breakpoints QA: 375 / 768 / 1440 / 1920  
- No horizontal overflow; 44px targets; focus-visible; heading order; stars text alternative; reduced-motion  

---

## 15. Error handling

Handle: bad slug · image fail · hover fail · missing default variant · stale cart/wishlist ids · empty search/filter · invalid URL filters · rating 0 · missing officialUrl  

Principles: no full-page crash · no serum-for-all fallback · neutral last-resort image · no stack traces in prod UI · dev `validateCatalog` logs  

---

## 16. Testing (mandatory)

### 16.1 Catalog

20 products · 8/4/4/4 · unique id/slug/sku · 3 scenes each · local paths · price>0 · valid rating · defaultVariant · official has URL+date · no Lorem/TODO  

### 16.2 ProductCard

brand/name/price/rating · links `/products/:slug` · wishlist · quick add · hover img in DOM · no nested interactive  

### 16.3 PDP

valid slug · not found · gallery 3 · content sections · ATC ids · wishlist · similar excludes self  

### 16.4 Integration

Home/Shop/Search/Wishlist/Cart → PDP · filters survive back · cart migration  

### 16.5 Existing

Update Home/Shop tests for new routes/names; don’t delete coverage to greenwash.

Commands:

```bash
cd Frontend
npm.cmd test
npm.cmd run lint
npm.cmd run build
```

---

## 17. Implementation phases

### Phase 0 — Baseline

- [ ] Read code + this spec  
- [ ] git status  
- [ ] test/lint/build baseline  
- [ ] Home asset role map  

### Phase 1 — Catalog & selectors

- [ ] `brands.ts` + Product types  
- [ ] 20 products full fields  
- [ ] Resolve COSRX: p8 essence, p12 cleanser  
- [ ] selectors + validateCatalog  
- [ ] catalog tests  

### Phase 2 — 60 images

- [ ] Generate primary/hover/detail  
- [ ] Continuity QA  
- [ ] Optimize WebP  
- [ ] Wire paths — **no Home overwrite**  

### Phase 3 — ProductCard

- [ ] Hover swap + stars + size + links  
- [ ] tests  

### Phase 4 — PDP

- [ ] Route + page + gallery + buy box + accordions  
- [ ] not found + tests  

### Phase 5 — Similar + Routine

- [ ] scoring helpers + UI rails  

### Phase 6 — Integration

- [ ] Home id/slug + links  
- [ ] Shop/Search/Cart/Wishlist  
- [ ] store migrate  

### Phase 7 — UX polish

- [ ] a11y, motion, sticky ATC, meta  

### Phase 8 — Verify

- [ ] test/lint/build  
- [ ] visual 375–1920  
- [ ] network no 404 images  
- [ ] Home visual unchanged  

---

## 18. Suggested file structure

```
Frontend/src/
  components/
    product/          # gallery, info, accordion, similar, routine
    ui/ProductCard.tsx
  data/
    brands.ts
    products.ts
    productSelectors.ts
  pages/
    ProductDetail.tsx
    ProductDetail.test.tsx
    Home.tsx | Shop.tsx | Cart.tsx | Wishlist.tsx
  store/useAppStore.ts
Frontend/public/assets/products/{slug}/01|02|03...
```

---

## 19. Acceptance checklist (ship gate)

### Catalog

- [ ] 20 products · 8/4/4/4  
- [ ] Full fields per §4/§7 — no placeholder  
- [ ] Official vs fictional correct  

### Images

- [ ] 60 local scenes · unique primaries  
- [ ] Continuity primary/hover  
- [ ] Home assets unchanged  

### Card

- [ ] Hover swap · stars · wishlist · quick add · PDP links  

### PDP

- [ ] Full content · 3 images · ATC · wishlist · similar · ritual · not found  

### Integration

- [ ] All surfaces → PDP  
- [ ] Cart migration safe  
- [ ] Filters URL  

### Quality

- [ ] test · lint · build  
- [ ] no console/image 404  
- [ ] a11y + reduced-motion  

---

## 20. Handoff report (Anti must return)

1. Files created/modified  
2. Full 20-product list (id, slug, brand, category)  
3. Image scene count + path root  
4. Official products + officialUrl + lastVerified  
5. Route examples  
6. Cart migration notes  
7. Confirm Home images untouched  
8. test/lint/build results  
9. Known leftovers  

---

## 21. Conflict resolution log (merged decisions)

| Topic | product-catalog-pdp-images | shop-all-product-system | **Master decision** |
|-------|---------------------------|-------------------------|---------------------|
| Route | `/product/:slug` | `/products/:slug` | **`/products/:slug`** (+ optional alias) |
| Catalog mix | 9/4/3/3 + different new SKUs | **8/4/4/4** | **8/4/4/4** |
| Second COSRX | Second snail | **Low pH cleanser p12** | **Low pH cleanser** |
| New fragrance | Vetiver oil | Amber Iris + Neroli Moss | **Amber Iris + Neroli Moss** |
| Body #4 | Sea salt scrub Harbor | Cedar polish Aurelle | **Cedar polish Aurelle p15** |
| After-sun | Solenne sun | Harbor sun p18 | **Harbor p18** |
| Images dir | `/assets/generated/products/` | `/assets/products/` | **`/assets/products/{slug}/`** for product scenes; **keep** `generated/` for Home |
| Cart | Full Product ok | **id+variantId only** | **id+variantId + migrate** |
| Home images | Fix missing fragrance | **Never change Home** | **Never overwrite; create only if missing** |
| Related | relatedIds only | Similar score + Routine | **Both: scorer + optional hard ids** |
| Model | Flat images.primary | ProductImage[] + variants | **Full shop-all model** |
| Content depth | Full prompts p1–p20 | Architecture-heavy | **Architecture + full cards** |

---

## 22. Anti-patterns

- Hotlink Unsplash/CDN  
- Card link to category only  
- Same file for two SKUs or three identical scenes  
- Lookup by product name in production UI  
- Persist full Product in cart without migration  
- Rewrite Home layout/images “for consistency”  
- Medical/cert claims without source  
- Green tests by deleting assertions  
- Half-filled products “fill later”  

---

**End of master spec.**  
**Prepared by: grok**  
**Read this file first. Implement this file only.**
