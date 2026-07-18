# Antigravity Task Brief — Lumenora Product Catalog, Images, PDP & Hover Swap

> **Dành cho:** Antigravity (hoặc agent tương đương)  
> **Repo:** `D:\Personal_Project\Lumenora`  
> **App:** Frontend Vite + React + TypeScript + Tailwind + Zustand  
> **Brand UI:** ÉLAN / Lumenora editorial marketplace (Aesop-inspired, multi-brand beauty)  
> **Scope:** Frontend-only demo — **không** thêm database, backend API, login, order server.  
> **Data layer:** in-code (`Frontend/src/data/products.ts` + local assets).  
> **Author note:** file này do **grok** soạn — giữ footer cuối file.  
> **Catalog source of truth:** §4 (brand bible + full cards p1–p20 + image prompts). Không để Anti “tự bịa thiếu field”.

---

## 0. Mục tiêu (đọc trước khi code)

Hoàn thiện catalog beauty demo để:

1. **Mỗi sản phẩm có đủ 3 hình** (primary + hover + gallery phụ) — không tái dùng 1 ảnh generic cho nhiều SKU.
2. **ProductCard** hiện **Hover Image Swap** (rollover): default image → hover image.
3. **Product Detail Page (PDP)** đầy đủ: gallery 3 ảnh, tên, brand, sao/rating/reviews, giá, mô tả, hướng dẫn dùng, thành phần, size/volume, badges, related products, add to cart / wishlist.
4. **Shop All + Home + Cart + Wishlist + Search** dùng chung data/model mới; link card → PDP (không chỉ filter category).
5. **Hình ảnh** tải ổn định (local `/assets/generated/...`), không phụ thuộc Unsplash/ORB/URL chết.
6. **UI/UX** giữ palette editorial hiện có; không redesign toàn site, chỉ nâng cấp data + card + PDP + wiring.

### Out of scope (không làm)

- Database / CMS / auth / checkout payment gateway  
- Backend API  
- Đổi stack (Next.js, etc.) — project là **Vite React** trong `Frontend/`  
- Xóa mockup/docs lịch sử trong `docs/` hay `Mockups/` trừ khi file stub gây nhầm

---

## 1. Bối cảnh as-is (vấn đề thật trong code)

### 1.1 Stack & entry

| Item | Path / note |
|------|-------------|
| App root | `Frontend/` |
| Routes | `Frontend/src/App.tsx` — `/`, `/shop`, `/quiz`, `/cart`, `/wishlist`, `/blog` |
| **Không có route PDP** | Không có `/product/:id` hoặc `/shop/:slug` |
| Products data | `Frontend/src/data/products.ts` |
| Asset map | `Frontend/src/data/assetManifest.ts` |
| Cards | `Frontend/src/components/ui/ProductCard.tsx` |
| Shop | `Frontend/src/pages/Shop.tsx` |
| Home | `Frontend/src/pages/Home.tsx` |
| Store | `Frontend/src/store/useAppStore.ts` (cart + wishlist, zustand persist) |
| Images on disk | `Frontend/public/assets/generated/` |

### 1.2 Product model hiện tại (thiếu)

```ts
// AS-IS — quá mỏng cho PDP + hover
export interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;        // chỉ 1 ảnh
  isNew?: boolean;
  isBestSeller?: boolean;
  category: ProductCategory; // 'skin' | 'body' | 'sun' | 'fragrance'
}
```

**Thiếu:** `slug`, `images[]` / `hoverImage`, mô tả, ingredients, howToUse, size, skinType, concerns, related, shortTagline, rating UI, v.v.

### 1.3 Vấn đề sản phẩm / ảnh (phải fix)

| # | Vấn đề | Chi tiết |
|---|--------|----------|
| P1 | **1 image / product** | Không đủ cho hover swap + PDP gallery |
| P2 | **Image reuse / identity leak** | Nhiều SKU trỏ cùng file (`product-serum.png`, `product-mask.png`, `product-cleanser.png`) → user không phân biệt sản phẩm |
| P3 | **Sai asset type** | `p13` fragrance dùng `home-brand-interlude.jpg`; `p14` mist dùng `home-composition-sunscreen.jpg` — editorial ≠ packshot |
| P4 | **Rating không render** | Data có `rating`/`reviews` nhưng `ProductCard` **không hiển thị sao** |
| P5 | **Card không link PDP** | Link hiện tại: `to={`/shop?category=${product.category}`}` — sai intent; phải vào chi tiết SP |
| P6 | **Không có PDP** | Cart/wishlist/home/shop không mở được detail |
| P7 | **Home fragrance tile** | `home-contents-fragrance.jpg` được reference trong `Home.tsx` nhưng **file có thể thiếu** trên disk — cần generate hoặc fallback |
| P8 | **Catalog mỏng** | 14 products; category `sun` chỉ 1 item; `fragrance` 2 item — nên mở rộng ~18–24 SKU cho demo Shop All cân bằng |
| P9 | **Duplicate-ish SKUs** | COSRX snail “serum” vs “essence” gần trùng concept/image — phân biệt rõ name + visual + copy |
| P10 | **No hover swap** | Card chỉ 1 `<img>`; không có layer second image |

### 1.4 Logic hiện ổn (giữ nguyên hành vi)

- Shop: filter category / brand / maxPrice / q / sort + URL searchParams  
- Zustand cart (qty, remove, update) + wishlist toggle + persist `lumenora-storage`  
- Home sections: hero carousel, categories, daily edit, compositions, ritual, journal, newsletter (client-only)  
- `EditorialImg` fallback pattern trên Home  

**Không phá** filter URL contract của Shop (`category`, `q`, `sort`, `brand`, `maxPrice`).

### 1.5 Design tokens (bắt buộc giữ)

```
ivory #F4F0E8 | parchment #E8E0D2 | charcoal #181713
oxblood #6B1F2B | olive #69705A | brass #8A7452
font-serif: Playfair Display | font-sans: Inter
tracking-folio: 0.22em | max-w-editorial: 1440px
```

Tone: editorial, quiet luxury, multi-brand marketplace (không hard-sell).

---

## 2. Target Product model (thay thế as-is)

Cập nhật `Frontend/src/data/products.ts` theo schema sau (có thể chỉnh tên field nếu nhất quán toàn codebase, nhưng **đủ field bắt buộc**):

```ts
export type ProductCategory = 'skin' | 'body' | 'sun' | 'fragrance';

export interface ProductImages {
  /** Card default + PDP main (1:1 or 4:5 packshot, clean) */
  primary: string;
  /** Card hover / rollover (lifestyle angle, texture, or alt packshot) */
  hover: string;
  /** PDP gallery slot 3 (ingredient macro, in-hand, texture swipe) */
  detail: string;
}

export interface Product {
  id: string;                 // stable: 'p1' ... keep existing ids when possible
  slug: string;               // URL-safe unique: 'bamboo-ultra-hydrating-toner'
  brand: string;
  name: string;
  tagline?: string;           // 1 short line under name
  price: number;
  compareAtPrice?: number;    // optional strike-through
  currency?: 'USD';           // default USD, formatPrice keeps $X.XX
  rating: number;             // 0–5, 1 decimal
  reviews: number;
  images: ProductImages;
  /** @deprecated keep optional mirror of images.primary for gradual migration */
  image?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  category: ProductCategory;
  size?: string;              // e.g. '150 ml', '30 ml', '50 ml'
  skinTypes?: string[];       // e.g. ['Dry', 'Combination']
  concerns?: string[];        // e.g. ['Hydration', 'Barrier']
  description: string;        // 2–4 sentences, PDP long copy
  howToUse: string;           // steps or short paragraph
  ingredients: string;        // key actives + full INCI-style string OK for demo
  keyIngredients?: string[];  // chips: ['Niacinamide', 'Zinc PCA']
  relatedIds?: string[];      // other product ids for PDP rail
}
```

### Helpers cần có / cập nhật

```ts
export function formatPrice(price: number): string;
export function categoryLabel(category: ProductCategory): string;
export function findProductById(id: string): Product | undefined;
export function findProductBySlug(slug: string): Product | undefined;
export function findProductByName(name: string): Product | undefined; // keep for Home name maps
export function getProductPrimaryImage(p: Product): string; // images.primary ?? image
export function getProductHoverImage(p: Product): string;   // images.hover ?? primary
export function getRelatedProducts(p: Product, limit = 4): Product[];
```

### Store impact

`CartItem extends Product` — sau khi Product phình field, cart vẫn OK (persist old cart có thể thiếu field; acceptable for demo).  
Khi `addToCart`, đảm bảo object có `images` đầy đủ (pass full product từ catalog).

---

## 3. Hình ảnh — generate / source / lưu

### 3.1 Nguyên tắc

1. **Ưu tiên local files** dưới `Frontend/public/assets/generated/`.  
2. **Không** dùng Unsplash/hotlink random (ORB/404 history).  
3. Mỗi product **3 file riêng**, naming convention thống nhất.  
4. Style: clean beauty still-life / packshot on warm stone, linen, parchment, soft daylight — khớp brand (không neon, không stock-model selfie).  
5. Aspect: **primary & hover ~1:1 hoặc 4:5**; detail có thể 1:1.  
6. Export: **JPG quality ~82** hoặc **PNG** nếu cần alpha; max edge ~1600px (web).  
7. Update `assetManifest.ts` khi thêm file.

### 3.2 Naming convention

```
Frontend/public/assets/generated/products/{slug}/01-primary.jpg
Frontend/public/assets/generated/products/{slug}/02-hover.jpg
Frontend/public/assets/generated/products/{slug}/03-detail.jpg
```

URL public:

```
/assets/generated/products/{slug}/01-primary.jpg
/assets/generated/products/{slug}/02-hover.jpg
/assets/generated/products/{slug}/03-detail.jpg
```

Nếu Antigravity khó tạo folder lồng: flat naming cũng chấp nhận:

```
product-{slug}-primary.jpg
product-{slug}-hover.jpg
product-{slug}-detail.jpg
```

### 3.3 Content brief mỗi bộ 3 ảnh

| Slot | Nội dung | Dùng ở |
|------|----------|--------|
| **primary** | Packshot chính diện: chai/hũ rõ label, nền parchment/stone, shadow mềm | Card default, PDP main, cart thumb |
| **hover** | Góc nghiêng / texture gel-cream / nắp mở / in-hand nhẹ — **cùng product identity** | Card hover swap |
| **detail** | Macro texture, ingredient prop, hoặc application gesture | PDP gallery #3 |

**Consistency:** cùng lighting family (warm daylight), cùng brand color language; **khác angle** đủ để rollover rõ.

### 3.4 Prompt template (Imagine / image gen)

Dùng (chỉnh tên SP + form factor):

```
Premium beauty product still-life photograph, [PRODUCT NAME] by [BRAND],
[bottle/jar/tube form], soft warm daylight, ivory parchment and limestone surface,
editorial Aesop-inspired quiet luxury, shallow depth of field, no text watermark,
no logo gibberish, photorealistic, square 1:1 composition, clean negative space
```

Hover:

```
Same product [PRODUCT NAME], alternate angle, lid slightly open OR cream texture
swatch beside bottle, warm linen background, photorealistic beauty still-life, 1:1
```

Detail:

```
Macro beauty texture of [key texture: gel / cream / serum droplet / mist],
same color palette as packshot, soft daylight, photorealistic, 1:1
```

### 3.5 Fallback nếu gen fail

- Copy/adapt từ packshot generic hiện có **chỉ tạm**, nhưng **không** để 2 SKU khác nhau share primary vĩnh viễn.  
- Home editorial: giữ `EditorialImg` + fallback.  
- Missing fragrance content image: generate `home-contents-fragrance.jpg` (bottle + botanical, 3:4 or 1:1).

### 3.6 Home / Shop editorial images cần verify

| Path | Action |
|------|--------|
| `/assets/generated/home-contents-fragrance.jpg` | **Tạo nếu thiếu** |
| Existing `home-*.jpg`, `hero-marketplace-*.jpg`, `product-*.png` | Verify load; keep as fallbacks |
| Product packshots cũ | Có thể reuse làm seed style; migrate data sang per-SKU paths |

---

## 4. Catalog content — đầy đủ từng brand + từng SKU (SOURCE OF TRUTH)

> **Bắt buộc:** Anti **không được tự rút gọn** catalog này. Mỗi product block dưới đây phải map 1:1 vào `products.ts` + 3 file ảnh.  
> Copy EN (khớp UI site). Ingredients là **demo text** — không claim y khoa, không scrape INCI thật bắt buộc.  
> Image paths: `/assets/generated/products/{slug}/01-primary.jpg` | `02-hover.jpg` | `03-detail.jpg`

### 4.0 Checklist field bắt buộc / product (Anti tự verify trước khi merge)

```
id, slug, brand, name, tagline, price, rating, reviews,
images.primary, images.hover, images.detail,
isNew?, isBestSeller?, category, size,
skinTypes[], concerns[],
description, howToUse, ingredients, keyIngredients[],
relatedIds[],
packForm, packColor, productTexture, imagePromptPrimary|Hover|Detail
```

`packForm` / `packColor` / `productTexture` / `imagePrompt*` chỉ dùng khi **gen ảnh** (có thể không cần field TS riêng nếu embed trong comment hoặc bỏ sau gen; **data runtime TS** theo schema §2).

---

### 4.1 Brand bible (thương hiệu — dùng cho visual + copy)

#### Brand: Aurelle Lab

| Field | Value |
|-------|--------|
| Origin story | Clean clinical-botanical lab; barrier-first Korean-inspired routines |
| Voice | Precise, calm, scientific-soft |
| Pack language | Frosted clear / soft sage glass; minimal white + charcoal label; sans type |
| Color cues | Sage green, clear liquid, soft white caps |
| Hero textures | Watery essences, light gels |
| Products in catalog | p1, p7, p16 |

#### Brand: Harbor & Hearth

| Field | Value |
|-------|--------|
| Origin story | Nordic apothecary; forest + spa body/skin comfort |
| Voice | Warm, grounded, nature-led |
| Pack language | Amber or soft-matte white jars/bottles; kraft-adjacent labels; serif-friendly |
| Color cues | Birch beige, eucalyptus green, sea-salt grey |
| Hero textures | Gels, foaming cleansers, grainy scrubs |
| Products | p2, p5, p18 |

#### Brand: Maison Verdé

| Field | Value |
|-------|--------|
| Origin story | French botanical house; quiet luxury plant actives |
| Voice | Editorial, refined, short sentences |
| Pack language | Deep olive / cream ceramic jars; amber droppers; gold-foil sparse |
| Color cues | Mugwort green, volcanic grey, rosehip amber oil |
| Hero textures | Creams, clay masks, facial oils |
| Products | p3, p10, p17 |

#### Brand: Solenne

| Field | Value |
|-------|--------|
| Origin story | Mediterranean sun & body care; sheer protection, soft scent |
| Voice | Light, sunlit, practical luxury |
| Pack language | White tubes, soft-peach accents, clear SPF bottles, stick tubes |
| Color cues | White, soft lavender, aloe green, mineral beige |
| Hero textures | Lotions, butters, fluid SPF, gel aloe |
| Products | p4, p6, p11, p15, p20 |

#### Brand: Atelier Nocturne

| Field | Value |
|-------|--------|
| Origin story | Independent fragrance atelier; woody-fig, linen, smoke |
| Voice | Poetic, night-time, material-focused |
| Pack language | Heavy glass EDP, atomizer mist, roller oil; charcoal/black + brass |
| Color cues | Charcoal glass, linen beige, smoky brown vetiver |
| Hero textures | Liquid perfume, mist spray, oil sheen |
| Products | p13, p14, p19 |

#### Brand: COSRX (demo — recognizable K-beauty)

| Field | Value |
|-------|--------|
| Note | Keep name for demo familiarity; **do not** copy official packaging trademarks 1:1 — create **inspired** clear dropper bottles with simple black/white type, snail-mucin viscous liquid |
| Pack language | Clear PET bottle, black cap, white label block |
| Color cues | Clear viscous gel (p8 thicker), watery essence (p12 thinner) |
| Products | p8, p12 — **must look different** |

#### Brand: The Ordinary (demo — recognizable clinical)

| Field | Value |
|-------|--------|
| Note | Inspired clinical dropper; matte lab bottle, high-contrast text, no exact logo recreation |
| Pack language | Matte opaque lab bottle, pipette, clinical label |
| Color cues | White/matte grey, clear serum |
| Products | p9 |

---

### 4.2 Catalog matrix (tổng quan nhanh)

| id | Brand | Name | Cat | Price | Size | Badge | Form factor |
|----|-------|------|-----|-------|------|-------|-------------|
| p1 | Aurelle Lab | Bamboo Ultra Hydrating Toner | skin | 45.00 | 150 ml | New | Tall clear toner bottle |
| p2 | Harbor & Hearth | Birch Moisturizing Soothing Gel | skin | 15.00 | 100 ml | New | Wide glass gel jar |
| p3 | Maison Verdé | Mugwort Calming Cream | skin | 38.50 | 50 ml | New | Ceramic cream jar |
| p4 | Solenne | Body Lotion Lavender Patchouli | body | 42.00 | 250 ml | New | White lotion pump bottle |
| p5 | Harbor & Hearth | Eucalyptus Nourishing Body Cleanser | body | 34.00 | 300 ml | — | Amber body wash bottle |
| p6 | Solenne | Nourishing Shea Body Butter | body | 26.00 | 200 ml | — | Wide white butter jar |
| p7 | Aurelle Lab | Green Tea Deep Cleansing Gel | skin | 25.00 | 150 ml | — | Frosted cleanser tube/bottle |
| p8 | COSRX | Advanced Snail Mucin 96% Power Repairing Essence Serum | skin | 18.50 | 100 ml | Bestseller | Clear serum dropper (viscous) |
| p9 | The Ordinary | Niacinamide 10% + Zinc 1% | skin | 8.00 | 30 ml | — | Matte clinical dropper |
| p10 | Maison Verdé | Volcanic Sea Clay Detox Masque | skin | 54.00 | 75 ml | — | Dark clay jar |
| p11 | Solenne | Invisible Fluid Sunscreen SPF 50+ PA++++ | sun | 24.80 | 50 ml | — | White/clear fluid SPF bottle |
| p12 | COSRX | Advanced Snail 96 Mucin Power Essence | skin | 26.00 | 100 ml | Bestseller | Clear essence bottle (watery) |
| p13 | Atelier Nocturne | Cedar & Fig Eau de Parfum | fragrance | 98.00 | 50 ml | New | Heavy glass EDP |
| p14 | Atelier Nocturne | Soft Linen Hair & Body Mist | fragrance | 42.00 | 100 ml | — | Tall mist atomizer |
| p15 | Solenne | Mineral Veil Sunscreen Stick SPF 50 | sun | 22.00 | 20 g | New | Twist-up stick |
| p16 | Aurelle Lab | Rice Bran Brightening Essence | skin | 36.00 | 120 ml | New | Slim essence bottle |
| p17 | Maison Verdé | Rosehip Overnight Facial Oil | skin | 48.00 | 30 ml | — | Amber dropper oil |
| p18 | Harbor & Hearth | Sea Salt Exfoliating Body Scrub | body | 29.00 | 250 g | — | Wide scrub jar |
| p19 | Atelier Nocturne | Vetiver Smoke Perfume Oil | fragrance | 62.00 | 15 ml | — | Glass roller oil |
| p20 | Solenne | After-Sun Aloe Recovery Gel | sun | 19.00 | 150 ml | — | Clear aloe gel tube/jar |

**Counts:** skin 9 · body 4 · sun 3 · fragrance 3 · **total 20**

---

### 4.3 Full product cards (copy + image briefs — PASTE INTO DATA)

---

#### p1 — Bamboo Ultra Hydrating Toner

| Field | Value |
|-------|--------|
| id | `p1` |
| slug | `bamboo-ultra-hydrating-toner` |
| brand | `Aurelle Lab` |
| name | `Bamboo Ultra Hydrating Toner` |
| tagline | `Barrier-first hydration in one pass` |
| price | `45` |
| rating / reviews | `4.8` / `310` |
| isNew | `true` |
| category | `skin` |
| size | `150 ml` |
| skinTypes | `Dry`, `Combination`, `Dehydrated` |
| concerns | `Hydration`, `Barrier support`, `Dullness` |
| keyIngredients | `Bamboo Water`, `Panthenol`, `Glycerin` |
| relatedIds | `p16`, `p7`, `p2`, `p3` |
| packForm | Tall cylindrical frosted-clear bottle, white disc cap, thin charcoal label |
| packColor | Clear/frost + sage tint liquid |
| productTexture | Watery toner, slight slip |

**description:**  
A weightless toner-essence hybrid that reintroduces water to a depleted barrier. Bamboo water and panthenol settle thirst without film or fragrance overload — the quiet first step of an Aurelle Lab ritual.

**howToUse:**  
1. After cleansing, pour a few drops into clean palms.  
2. Press gently over face and neck — avoid rubbing hard.  
3. Layer 2–3 passes on dry days.  
4. Follow with essence or cream while skin is still damp.

**ingredients:**  
Aqua/Water, Bambusa Vulgaris Water, Glycerin, Panthenol, Sodium PCA, Allantoin, 1,2-Hexanediol, Caprylyl Glycol, Citric Acid.  
*(Demo INCI-style string — edit length OK.)*

**images paths:**  
- primary: `/assets/generated/products/bamboo-ultra-hydrating-toner/01-primary.jpg`  
- hover: `/assets/generated/products/bamboo-ultra-hydrating-toner/02-hover.jpg`  
- detail: `/assets/generated/products/bamboo-ultra-hydrating-toner/03-detail.jpg`

**imagePromptPrimary:**  
Premium skincare still-life, tall frosted clear toner bottle with pale sage liquid labeled “Bamboo Ultra Hydrating Toner / Aurelle Lab”, white cap, limestone and ivory parchment background, soft warm daylight, Aesop-like quiet luxury, square 1:1, photorealistic, no watermark, no unreadable logos.

**imagePromptHover:**  
Same bottle at 3/4 angle, cap beside bottle, droplet of watery toner on stone, warm linen edge, same lighting family, 1:1 photorealistic.

**imagePromptDetail:**  
Macro of clear hydrating toner droplets and thin liquid film on stone, soft bokeh bottle silhouette, 1:1.

---

#### p2 — Birch Moisturizing Soothing Gel

| Field | Value |
|-------|--------|
| id | `p2` |
| slug | `birch-moisturizing-soothing-gel` |
| brand | `Harbor & Hearth` |
| name | `Birch Moisturizing Soothing Gel` |
| tagline | `Nordic calm for heat-flushed skin` |
| price | `15` |
| rating / reviews | `4.8` / `352` |
| isNew | `true` |
| category | `skin` |
| size | `100 ml` |
| skinTypes | `Sensitive`, `Oily`, `Combination` |
| concerns | `Redness`, `Post-sun heat`, `Light moisture` |
| keyIngredients | `Birch Sap`, `Aloe Vera`, `Allantoin` |
| relatedIds | `p5`, `p18`, `p1`, `p20` |
| packForm | Wide low glass jar, soft matte lid |
| packColor | Clear gel, birch-beige label |
| productTexture | Transparent cooling gel |

**description:**  
A cool, water-light gel drawn from birch sap traditions. It settles warm, tight skin with aloe and allantoin — no heavy cream, no sticky finish. Built for shelves that favor forest quiet over perfume.

**howToUse:**  
1. Use morning and night after toner.  
2. Scoop a pea-size amount; warm between fingers.  
3. Pat over face; can layer under richer cream if needed.  
4. Store away from direct heat.

**ingredients:**  
Aqua, Betula Alba Juice, Aloe Barbadensis Leaf Juice, Glycerin, Allantoin, Carbomer, Sodium Hydroxide, Phenoxyethanol.

**images:**  
`/assets/generated/products/birch-moisturizing-soothing-gel/01-primary.jpg` (+ 02-hover, 03-detail)

**imagePromptPrimary:**  
Beauty still-life, wide clear jar of transparent birch soothing gel, soft beige kraft-style label “Harbor & Hearth”, limestone surface, soft daylight, 1:1 photorealistic.

**imagePromptHover:**  
Jar open, lid beside, gel texture swirl visible, birch leaf prop soft focus, same palette.

**imagePromptDetail:**  
Macro transparent gel ribbon texture, cool light, 1:1.

---

#### p3 — Mugwort Calming Cream

| Field | Value |
|-------|--------|
| id | `p3` |
| slug | `mugwort-calming-cream` |
| brand | `Maison Verdé` |
| name | `Mugwort Calming Cream` |
| tagline | `Herbal quiet for reactive days` |
| price | `38.5` |
| rating / reviews | `4.7` / `342` |
| isNew | `true` |
| category | `skin` |
| size | `50 ml` |
| skinTypes | `Sensitive`, `Dry`, `Combination` |
| concerns | `Redness`, `Comfort`, `Barrier` |
| keyIngredients | `Mugwort Extract`, `Centella`, `Squalane` |
| relatedIds | `p10`, `p17`, `p1`, `p2` |
| packForm | Small ceramic/cream jar, deep olive lid |
| packColor | Soft green-cream jar, pale green cream |
| productTexture | Medium cream, herbal soft green tint optional |

**description:**  
A composed day cream built around mugwort and centella. Squalane softens without shine. Maison Verdé’s edit for skin that prefers fewer actives and more calm.

**howToUse:**  
1. After serum/essence, take a pearl of cream.  
2. Press over cheeks, then outward.  
3. Morning under sunscreen; night as last step.  
4. Patch-test if extremely reactive.

**ingredients:**  
Aqua, Squalane, Glycerin, Artemisia Princeps Extract, Centella Asiatica Extract, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Ceramide NP, Tocopherol.

**images:** `.../mugwort-calming-cream/01|02|03...`

**imagePromptPrimary:**  
Premium cream jar, deep olive lid, soft herbal green accents, label “Mugwort Calming Cream / Maison Verdé”, parchment and stone, warm daylight, 1:1.

**imagePromptHover:**  
Jar open showing pale cream, mugwort sprig soft focus, 1:1.

**imagePromptDetail:**  
Macro cream swirl with soft green undertone, 1:1.

---

#### p4 — Body Lotion Lavender Patchouli

| Field | Value |
|-------|--------|
| id | `p4` |
| slug | `body-lotion-lavender-patchouli` |
| brand | `Solenne` |
| name | `Body Lotion Lavender Patchouli` |
| tagline | `Soft body moisture with evening calm` |
| price | `42` |
| rating / reviews | `4.6` / `28` |
| isNew | `true` |
| category | `body` |
| size | `250 ml` |
| skinTypes | `Dry`, `Normal` |
| concerns | `Dry body`, `Comfort scent` |
| keyIngredients | `Shea Butter`, `Lavender Oil`, `Patchouli` |
| relatedIds | `p6`, `p5`, `p18`, `p14` |
| packForm | Tall white pump bottle |
| packColor | Matte white, soft lavender band |
| productTexture | Opaque body lotion |

**description:**  
A daily body lotion that drinks in quickly — shea for slip, lavender and patchouli for a low evening trail. Solenne’s body edit without heavy musk.

**howToUse:**  
1. Apply to damp skin after shower.  
2. Pump twice for limbs; more for very dry areas.  
3. Focus elbows and shins.  
4. Allow a minute before dressing.

**ingredients:**  
Aqua, Butyrospermum Parkii Butter, Glycerin, Cetearyl Alcohol, Lavandula Oil, Pogostemon Cablin Oil, Tocopherol, Phenoxyethanol.

**imagePromptPrimary:**  
White pump body lotion bottle “Solenne / Body Lotion Lavender Patchouli”, soft lavender flower prop, linen, warm light, 1:1.

**imagePromptHover:**  
Bottle + lotion swatch on hand/stone, 1:1.

**imagePromptDetail:**  
Macro creamy white lotion texture, 1:1.

---

#### p5 — Eucalyptus Nourishing Body Cleanser

| Field | Value |
|-------|--------|
| id | `p5` |
| slug | `eucalyptus-nourishing-body-cleanser` |
| brand | `Harbor & Hearth` |
| name | `Eucalyptus Nourishing Body Cleanser` |
| tagline | `Forest-clear wash without strip` |
| price | `34` |
| rating / reviews | `4.5` / `439` |
| category | `body` |
| size | `300 ml` |
| skinTypes | `Normal`, `Dry` |
| concerns | `Cleanse`, `Body comfort` |
| keyIngredients | `Eucalyptus`, `Glycerin`, `Oat Extract` |
| relatedIds | `p18`, `p2`, `p4`, `p6` |
| packForm | Tall amber plastic/glass bottle, pump or flip |
| packColor | Amber bottle, green-grey label |
| productTexture | Clear-to-green gel wash |

**description:**  
A body cleanser with eucalyptus clarity and oat softness. Foam is modest; rinse feels clean, not squeaky. Harbor & Hearth’s shower staple.

**howToUse:**  
1. Wet skin; dispense a small amount.  
2. Work into light lather with hands or cloth.  
3. Rinse thoroughly.  
4. Follow with body lotion or butter.

**ingredients:**  
Aqua, Cocamidopropyl Betaine, Glycerin, Eucalyptus Globulus Leaf Oil, Avena Sativa Extract, Sodium Chloride, Citric Acid.

**imagePromptPrimary:**  
Amber body wash bottle, eucalyptus leaves, spa stone, “Harbor & Hearth”, 1:1 photorealistic.

**imagePromptHover:**  
Bottle with wet stone and foam hint, alternate angle.

**imagePromptDetail:**  
Macro gel cleanser bubbles / translucent green gel, 1:1.

---

#### p6 — Nourishing Shea Body Butter

| Field | Value |
|-------|--------|
| id | `p6` |
| slug | `nourishing-shea-body-butter` |
| brand | `Solenne` |
| name | `Nourishing Shea Body Butter` |
| tagline | `Dense comfort for dry limbs` |
| price | `26` |
| rating / reviews | `4.7` / `34` |
| category | `body` |
| size | `200 ml` |
| skinTypes | `Dry`, `Very dry` |
| concerns | `Deep moisture`, `Rough skin` |
| keyIngredients | `Shea Butter`, `Cocoa Butter`, `Vitamin E` |
| relatedIds | `p4`, `p5`, `p18`, `p20` |
| packForm | Wide white jar |
| packColor | Ivory jar, soft gold/brass type |
| productTexture | Thick whipped butter, pale cream |

**description:**  
A dense shea-cocoa butter for skin that cracks in dry air. Melts on contact; finish is soft matte, not greasy if used sparingly.

**howToUse:**  
1. Warm a small scoop between palms.  
2. Press onto dry areas (legs, elbows).  
3. Best on damp skin at night.  
4. A little goes far.

**ingredients:**  
Butyrospermum Parkii Butter, Theobroma Cacao Seed Butter, Caprylic/Capric Triglyceride, Tocopherol, Helianthus Annuus Seed Oil.

**imagePromptPrimary:**  
Wide ivory body butter jar “Solenne”, whipped cream-colored butter visible if clear top, linen + stone, 1:1.

**imagePromptHover:**  
Open jar with butter peak texture, 1:1.

**imagePromptDetail:**  
Macro whipped shea butter peaks, 1:1.

---

#### p7 — Green Tea Deep Cleansing Gel

| Field | Value |
|-------|--------|
| id | `p7` |
| slug | `green-tea-deep-cleansing` |
| brand | `Aurelle Lab` |
| name | `Green Tea Deep Cleansing Gel` |
| tagline | `Morning clarity without tightness` |
| price | `25` |
| rating / reviews | `4.7` / `465` |
| category | `skin` |
| size | `150 ml` |
| skinTypes | `Oily`, `Combination`, `Normal` |
| concerns | `Cleanse`, `Congestion`, `Antioxidant support` |
| keyIngredients | `Green Tea`, `Betaine`, `Mild surfactants` |
| relatedIds | `p1`, `p16`, `p8`, `p9` |
| packForm | Frosted tube or pump bottle |
| packColor | Soft green translucent gel, white pack |
| productTexture | Clear green-tea gel cleanser |

**description:**  
*(Name fully: use `Green Tea Deep Cleansing Gel` in UI — fix as-is short name.)*  
A daily gel cleanser with green tea polyphenols and betaine. Lifts SPF and city film while leaving the barrier quiet — Aurelle Lab’s AM default.

**howToUse:**  
1. Wet face; emulsion a pump between hands.  
2. Massage 30–40 seconds, avoid eye orbit.  
3. Rinse lukewarm.  
4. Optional second cleanse at night with balm first.

**ingredients:**  
Aqua, Glycerin, Camellia Sinensis Leaf Extract, Betaine, Cocamidopropyl Betaine, Sodium Cocoyl Glutamate, Citric Acid.

**imagePromptPrimary:**  
Frosted cleanser bottle/tube, pale green gel, “Aurelle Lab Green Tea Deep Cleansing Gel”, clean stone, 1:1.

**imagePromptHover:**  
Product with foam on wet stone, alternate angle.

**imagePromptDetail:**  
Macro green tea gel + light foam, 1:1.

---

#### p8 — COSRX Advanced Snail Mucin 96% Power Repairing Essence Serum

| Field | Value |
|-------|--------|
| id | `p8` |
| slug | `cosrx-snail-mucin-96-serum` |
| brand | `COSRX` |
| name | `Advanced Snail Mucin 96% Power Repairing Essence Serum` |
| tagline | `Viscous repair for depleted skin` |
| price | `18.5` |
| rating / reviews | `4.9` / `413` |
| isBestSeller | `true` |
| category | `skin` |
| size | `100 ml` |
| skinTypes | `Dry`, `Combination`, `Normal` |
| concerns | `Repair`, `Hydration`, `Texture` |
| keyIngredients | `Snail Secretion Filtrate 96%`, `Sodium Hyaluronate` |
| relatedIds | `p12`, `p1`, `p3`, `p16` |
| packForm | Clear bottle, black cap, dropper or nozzle — **taller/thicker liquid look than p12** |
| packColor | Clear viscous honey-gel mucin |
| productTexture | **Thick stringy mucin gel** (visual key vs p12) |

**description:**  
A cult-density mucin serum that strings between fingers and seals moisture into tired skin. Use when the barrier feels thin and makeup clings poorly. Demo formula story for marketplace curation — not medical treatment.

**howToUse:**  
1. After toner, dispense half dropper.  
2. Spread quickly before it strings; pat to absorb.  
3. Layer cream after.  
4. AM and/or PM; pair with SPF by day.

**ingredients:**  
Snail Secretion Filtrate, Betaine, Sodium Hyaluronate, Allantoin, Carbomer, Arginine, 1,2-Hexanediol.

**CRITICAL vs p12:** thicker gel, different bottle silhouette or label block; **never same image file**.

**imagePromptPrimary:**  
Clear K-beauty style serum bottle filled with viscous translucent mucin gel, black cap, simple modern label inspired by clinical K-beauty (no trademark logo), stone background, 1:1.

**imagePromptHover:**  
Bottle + mucin stringing from dropper, 1:1.

**imagePromptDetail:**  
Macro sticky mucin gel strands, 1:1.

---

#### p9 — The Ordinary Niacinamide 10% + Zinc 1%

| Field | Value |
|-------|--------|
| id | `p9` |
| slug | `ordinary-niacinamide-10-zinc-1` |
| brand | `The Ordinary` |
| name | `Niacinamide 10% + Zinc 1%` |
| tagline | `Clinical clarity serum, no fluff` |
| price | `8` |
| rating / reviews | `4.8` / `114` |
| category | `skin` |
| size | `30 ml` |
| skinTypes | `Oily`, `Combination` |
| concerns | `Blemish-prone look`, `Oil balance`, `Uneven tone` |
| keyIngredients | `Niacinamide 10%`, `Zinc PCA 1%` |
| relatedIds | `p7`, `p8`, `p1`, `p11` |
| packForm | Matte lab dropper bottle (inspired clinical) |
| packColor | Matte opaque white/grey bottle, clear serum |
| productTexture | Watery clear serum |

**description:**  
A high-strength niacinamide with zinc for oilier, congestion-prone skin. Minimalist packaging, maximal ingredient focus — the clinical shelf staple in the Lumenora edit.

**howToUse:**  
1. After cleansing/toner, apply a few drops.  
2. Avoid mixing with pure vitamin C in same step if sensitive.  
3. Follow with moisturizer.  
4. Use SPF daytime.

**ingredients:**  
Aqua, Niacinamide, Pentylene Glycol, Zinc PCA, Tamarindus Indica Seed Gum, Xanthan Gum, Chlorphenesin.

**imagePromptPrimary:**  
Matte clinical dropper bottle “Niacinamide 10% + Zinc 1%” inspired The Ordinary style (generic lab branding, no exact logo), grey studio, 1:1.

**imagePromptHover:**  
Dropper raised with clear serum drop, 1:1.

**imagePromptDetail:**  
Macro clear serum droplet, 1:1.

---

#### p10 — Volcanic Sea Clay Detox Masque

| Field | Value |
|-------|--------|
| id | `p10` |
| slug | `volcanic-sea-clay-detox-masque` |
| brand | `Maison Verdé` |
| name | `Volcanic Sea Clay Detox Masque` |
| tagline | `Mineral depth. Quiet clarity.` |
| price | `54` |
| rating / reviews | `4.8` / `152` |
| category | `skin` |
| size | `75 ml` |
| skinTypes | `Oily`, `Combination` |
| concerns | `Congestion`, `Pore look`, `Weekly reset` |
| keyIngredients | `Volcanic Clay`, `Sea Silt`, `Kaolin` |
| relatedIds | `p3`, `p17`, `p7`, `p9` |
| packForm | Dark grey/black jar |
| packColor | Charcoal clay product |
| productTexture | Dense grey-green clay paste |

**description:**  
A weekly clay masque with volcanic mineral and sea silt. Draws without turning skin into paper — rinse before full bone-dry. Editorial texture piece for the Maison Verdé shelf.

**howToUse:**  
1. On clean dry skin, apply thin even layer (avoid eyes).  
2. Leave 8–10 minutes; do not let crack hard.  
3. Rinse warm water; pat dry.  
4. Follow with hydrating toner and cream. 1–2× weekly.

**ingredients:**  
Kaolin, Volcanic Ash, Sea Silt, Glycerin, Aqua, Bentonite, Caprylic/Capric Triglyceride, Tocopherol.

**imagePromptPrimary:**  
Dark ceramic jar of volcanic clay mask, grey paste cue, slate stone, “Maison Verdé”, 1:1.

**imagePromptHover:**  
Open jar + clay on spatula, 1:1.

**imagePromptDetail:**  
Macro wet clay texture, mineral grit soft, 1:1.

---

#### p11 — Invisible Fluid Sunscreen SPF 50+ PA++++

| Field | Value |
|-------|--------|
| id | `p11` |
| slug | `invisible-fluid-sunscreen-spf50` |
| brand | `Solenne` |
| name | `Invisible Fluid Sunscreen SPF 50+ PA++++` |
| tagline | `Sheer protection that disappears into the day` |
| price | `24.8` |
| rating / reviews | `4.8` / `453` |
| category | `sun` |
| size | `50 ml` |
| skinTypes | `All`, `Makeup-friendly` |
| concerns | `UV protection`, `No white cast`, `Daily wear` |
| keyIngredients | `UV filters (demo)`, `Niacinamide`, `Vitamin E` |
| relatedIds | `p15`, `p20`, `p9`, `p1` |
| packForm | Slim white/clear fluid bottle with pump or nozzle |
| packColor | White pack, milky fluid |
| productTexture | Lightweight milky fluid |

**description:**  
A daily fluid sunscreen that sets invisible on medium to deep tones in our demo story — no chalky cast, plays well under skin tints. Non-negotiable last AM step.

**howToUse:**  
1. As last skincare step, dispense 1/4 teaspoon for face.  
2. Blend evenly; include ears and neck.  
3. Reapply every 2 hours outdoors.  
4. Remove thoroughly at night with cleanse.

**ingredients:**  
Aqua, Homosalate, Octocrylene (demo filters), Niacinamide, Tocopherol, Glycerin, Silica, Phenoxyethanol.  
*Demo only — not a real SPF claim for sale.*

**imagePromptPrimary:**  
White fluid sunscreen bottle SPF 50, soft sunlit stone, minimal foliage, “Solenne”, 1:1.

**imagePromptHover:**  
Bottle + milky fluid swatch no white cast on beige stone, 1:1.

**imagePromptDetail:**  
Macro milky fluid sunscreen texture, 1:1.

---

#### p12 — COSRX Advanced Snail 96 Mucin Power Essence

| Field | Value |
|-------|--------|
| id | `p12` |
| slug | `cosrx-snail-96-mucin-power-essence` |
| brand | `COSRX` |
| name | `Advanced Snail 96 Mucin Power Essence` |
| tagline | `Watery mucin layer for daily bounce` |
| price | `26` |
| rating / reviews | `4.8` / `842` |
| isBestSeller | `true` |
| category | `skin` |
| size | `100 ml` |
| skinTypes | `All`, `Dehydrated` |
| concerns | `Hydration layers`, `Glow`, `Prep for cream` |
| keyIngredients | `Snail Secretion Filtrate`, `Sodium Hyaluronate` |
| relatedIds | `p8`, `p1`, `p16`, `p2` |
| packForm | Clear essence bottle — **slimmer / different label than p8** |
| packColor | Clear **watery** liquid (not thick strings) |
| productTexture | **Runny essence** — key visual difference from p8 |

**description:**  
The lighter mucin sister: essence-weight hydration that layers under cream. Same hero filtrate family as p8, different viscosity and ritual place — essence first, serum after if stacking.

**howToUse:**  
1. After toner, pour into palms.  
2. Press until absorbed; optional 2 layers.  
3. Follow with serum or cream.  
4. AM/PM.

**ingredients:**  
Snail Secretion Filtrate, Sodium Hyaluronate, Betaine, Panthenol, 1,2-Hexanediol, Aqua.

**imagePromptPrimary:**  
Clear essence bottle with watery liquid (not thick gel), different silhouette from p8, clinical K-beauty inspired label, 1:1.

**imagePromptHover:**  
Bottle tipped with thin liquid stream, 1:1.

**imagePromptDetail:**  
Macro thin watery essence film, 1:1.

---

#### p13 — Cedar & Fig Eau de Parfum

| Field | Value |
|-------|--------|
| id | `p13` |
| slug | `cedar-fig-eau-de-parfum` |
| brand | `Atelier Nocturne` |
| name | `Cedar & Fig Eau de Parfum` |
| tagline | `Woody fruit. Night air.` |
| price | `98` |
| rating / reviews | `4.9` / `67` |
| isNew | `true` |
| category | `fragrance` |
| size | `50 ml` |
| skinTypes | `—` (fragrance) |
| concerns | `Signature scent`, `Evening wear` |
| keyIngredients | `Cedarwood`, `Fig Accord`, `Musk` (notes, not skincare) |
| relatedIds | `p14`, `p19`, `p4` |
| packForm | **Heavy glass EDP bottle**, spray atomizer, dark cap |
| packColor | Charcoal/smoky glass, brass collar optional |
| productTexture | Clear amber perfume liquid |

**description:**  
An independent eau de parfum of cedar wood and ripe fig over soft musk. Atelier Nocturne’s signature bottle for night markets and linen jackets — not a skincare still-life.

**howToUse:**  
1. Spray once on pulse points (wrist, neck).  
2. Do not rub.  
3. Optional light mist on clothing from distance.  
4. Store away from heat and light.

**ingredients / notes:**  
Alcohol Denat., Parfum/Fragrance, Aqua; notes: Italian fig, cedarwood, dry amber, musk.  
*Demo fragrance notes.*

**imagePromptPrimary:**  
Luxury perfume bottle dark glass, fig + cedar mood props subtle, charcoal and brass, “Atelier Nocturne Cedar & Fig”, limestone, cinematic soft light, 1:1 — **must be perfume bottle not abstract botanical only**.

**imagePromptHover:**  
3/4 bottle angle with spray cap off, 1:1.

**imagePromptDetail:**  
Macro glass reflection + amber liquid meniscus, 1:1.

---

#### p14 — Soft Linen Hair & Body Mist

| Field | Value |
|-------|--------|
| id | `p14` |
| slug | `soft-linen-hair-body-mist` |
| brand | `Atelier Nocturne` |
| name | `Soft Linen Hair & Body Mist` |
| tagline | `Air-dried cotton. Clean skin scent.` |
| price | `42` |
| rating / reviews | `4.6` / `41` |
| category | `fragrance` |
| size | `100 ml` |
| concerns | `Light scent`, `Hair + body` |
| keyIngredients | `Musk`, `Iris`, `Clean aldehyde accord` (notes) |
| relatedIds | `p13`, `p19`, `p4` |
| packForm | Tall clear/frost mist bottle with fine atomizer |
| packColor | Pale linen liquid, frosted glass |
| productTexture | Light alcohol mist |

**description:**  
A sheer hair-and-body mist that reads like sun on linen — iris, soft musk, air. Layer under Cedar & Fig or wear alone for daytime.

**howToUse:**  
1. Hold 20 cm from hair/body.  
2. Mist 2–3 sprays; avoid eyes.  
3. Reapply as needed.  
4. For hair, spray on brush then comb through.

**ingredients / notes:**  
Alcohol Denat., Aqua, Parfum; notes: linen, iris, soft musk, light cedar.

**imagePromptPrimary:**  
Tall frosted mist bottle, linen fabric prop, soft daylight, “Atelier Nocturne Soft Linen”, 1:1 — **not sunscreen bottle**.

**imagePromptHover:**  
Mist bottle with spray halo / alternate angle, 1:1.

**imagePromptDetail:**  
Macro atomizer head + glass, 1:1.

---

#### p15 — Mineral Veil Sunscreen Stick SPF 50

| Field | Value |
|-------|--------|
| id | `p15` |
| slug | `mineral-veil-sunscreen-stick-spf50` |
| brand | `Solenne` |
| name | `Mineral Veil Sunscreen Stick SPF 50` |
| tagline | `Pocket mineral for face edges` |
| price | `22` |
| rating / reviews | `4.5` / `88` |
| isNew | `true` |
| category | `sun` |
| size | `20 g` |
| skinTypes | `All`, `On-the-go` |
| concerns | `Reapplication`, `Ears/nose`, `Travel` |
| keyIngredients | `Zinc Oxide (demo)`, `Vitamin E` |
| relatedIds | `p11`, `p20`, `p9` |
| packForm | Twist-up sunscreen stick, white tube |
| packColor | White/soft beige stick |
| productTexture | Solid mineral balm stick |

**description:**  
A mineral stick for nose, cheeks, and reapplication over makeup. Portable Solenne sun layer when fluid bottles stay home.

**howToUse:**  
1. Twist up 2–3 mm.  
2. Swipe on high points; blend with fingers.  
3. Reapply outdoors every 2 hours.  
4. Cap tightly after use.

**ingredients:**  
Zinc Oxide (demo), Caprylic/Capric Triglyceride, Polyethylene, Tocopherol, Aqua.

**imagePromptPrimary:**  
White SPF stick tube twist-up, soft sun light, “Solenne Mineral Veil”, 1:1.

**imagePromptHover:**  
Stick extended showing balm surface, 1:1.

**imagePromptDetail:**  
Macro solid sunscreen balm surface, 1:1.

---

#### p16 — Rice Bran Brightening Essence

| Field | Value |
|-------|--------|
| id | `p16` |
| slug | `rice-bran-brightening-essence` |
| brand | `Aurelle Lab` |
| name | `Rice Bran Brightening Essence` |
| tagline | `Soft light for dull winter skin` |
| price | `36` |
| rating / reviews | `4.6` / `201` |
| isNew | `true` |
| category | `skin` |
| size | `120 ml` |
| skinTypes | `Dull`, `Normal`, `Dry` |
| concerns | `Glow`, `Uneven tone look`, `Hydration` |
| keyIngredients | `Rice Bran Extract`, `Niacinamide`, `Tranexamic acid (demo low %)` |
| relatedIds | `p1`, `p7`, `p9`, `p8` |
| packForm | Slim clear/frost essence bottle |
| packColor | Slightly milky rice water liquid |
| productTexture | Light milky essence |

**description:**  
Rice bran extract with a measured niacinamide dose for skin that looks tired under office light. Layers under moisturizer; no perfume blast.

**howToUse:**  
1. After toner, apply morning and night.  
2. Pat until absorbed.  
3. Follow with cream + SPF in AM.  
4. Introduce slowly if new to brightening actives.

**ingredients:**  
Aqua, Oryza Sativa Bran Extract, Niacinamide, Glycerin, Tranexamic Acid, Panthenol, 1,2-Hexanediol.

**imagePromptPrimary:**  
Slim essence bottle milky rice water, “Aurelle Lab Rice Bran Brightening Essence”, stone, 1:1.

**imagePromptHover:**  
Bottle + milky liquid pour/swatch, 1:1.

**imagePromptDetail:**  
Macro milky essence texture, 1:1.

---

#### p17 — Rosehip Overnight Facial Oil

| Field | Value |
|-------|--------|
| id | `p17` |
| slug | `rosehip-overnight-facial-oil` |
| brand | `Maison Verdé` |
| name | `Rosehip Overnight Facial Oil` |
| tagline | `Night oil for softness by morning` |
| price | `48` |
| rating / reviews | `4.7` / `176` |
| category | `skin` |
| size | `30 ml` |
| skinTypes | `Dry`, `Mature look`, `Normal` |
| concerns | `Nourishment`, `Overnight repair feel` |
| keyIngredients | `Rosehip Oil`, `Squalane`, `Vitamin E` |
| relatedIds | `p3`, `p10`, `p1` |
| packForm | Amber glass dropper bottle |
| packColor | Deep amber oil |
| productTexture | Dry-touch facial oil |

**description:**  
Cold-pressed rosehip character with squalane glide. Three drops at night leave skin plush by morning without pillow grease when used sparingly.

**howToUse:**  
1. After water-based serums, drop 2–3 drops into palms.  
2. Press over face and neck.  
3. Night use preferred.  
4. Can mix one drop into cream.

**ingredients:**  
Rosa Canina Fruit Oil, Squalane, Tocopherol, Helianthus Annuus Seed Oil, Rosmarinus Extract.

**imagePromptPrimary:**  
Amber dropper bottle facial oil, rosehip props soft, “Maison Verdé”, warm night-adjacent light, 1:1.

**imagePromptHover:**  
Dropper with amber oil drop, 1:1.

**imagePromptDetail:**  
Macro golden-amber oil droplet, 1:1.

---

#### p18 — Sea Salt Exfoliating Body Scrub

| Field | Value |
|-------|--------|
| id | `p18` |
| slug | `sea-salt-exfoliating-body-scrub` |
| brand | `Harbor & Hearth` |
| name | `Sea Salt Exfoliating Body Scrub` |
| tagline | `Coastal grain for dull body skin` |
| price | `29` |
| rating / reviews | `4.4` / `120` |
| category | `body` |
| size | `250 g` |
| skinTypes | `Normal`, `Rough body` |
| concerns | `Exfoliation`, `Bump look on arms` |
| keyIngredients | `Sea Salt`, `Jojoba Oil`, `Kelp` |
| relatedIds | `p5`, `p4`, `p6` |
| packForm | Wide jar with screw lid |
| packColor | Clear jar, grey-white salt scrub |
| productTexture | Coarse wet salt + oil |

**description:**  
Sea salt grains suspended in jojoba for weekly body polish. Harbor & Hearth’s shower reset — rinse well, moisturize after.

**howToUse:**  
1. On wet skin in shower, scoop and massage limbs in circles.  
2. Avoid broken skin and face.  
3. Rinse thoroughly.  
4. 1–2× weekly; follow with lotion.

**ingredients:**  
Sodium Chloride, Simmondsia Chinensis Seed Oil, Aqua, Laminaria Extract, Tocopherol, Fragrance (light marine).

**imagePromptPrimary:**  
Wide jar sea salt body scrub, salt crystals visible, stone wet look, “Harbor & Hearth”, 1:1.

**imagePromptHover:**  
Open jar + scrub on wooden spoon, 1:1.

**imagePromptDetail:**  
Macro salt crystals in oil, 1:1.

---

#### p19 — Vetiver Smoke Perfume Oil

| Field | Value |
|-------|--------|
| id | `p19` |
| slug | `vetiver-smoke-perfume-oil` |
| brand | `Atelier Nocturne` |
| name | `Vetiver Smoke Perfume Oil` |
| tagline | `Smoky root. Skin-close trail.` |
| price | `62` |
| rating / reviews | `4.7` / `54` |
| category | `fragrance` |
| size | `15 ml` |
| concerns | `Intimate scent`, `Long wear oil` |
| keyIngredients | notes: `Vetiver`, `Smoke accord`, `Guaiacwood` |
| relatedIds | `p13`, `p14` |
| packForm | Slim glass rollerball bottle |
| packColor | Dark liquid, black cap |
| productTexture | Perfume oil (roller) |

**description:**  
A concentrated perfume oil of vetiver and soft smoke — closer to skin than EDP spray. Roll on pulse; builds quietly through the evening.

**howToUse:**  
1. Roll once on wrists and neck.  
2. Optional: one pass behind ears.  
3. Do not over-apply neat oil.  
4. Layer with Cedar & Fig if desired.

**ingredients / notes:**  
Caprylic/Capric Triglyceride, Parfum; notes: Haitian vetiver, guaiacwood, birch smoke accord, soft amber.

**imagePromptPrimary:**  
Slim dark glass roller perfume oil, brass/black cap, “Atelier Nocturne Vetiver Smoke”, moody soft light, 1:1.

**imagePromptHover:**  
Roller uncapped showing ball, 1:1.

**imagePromptDetail:**  
Macro rollerball with oil sheen, 1:1.

---

#### p20 — After-Sun Aloe Recovery Gel

| Field | Value |
|-------|--------|
| id | `p20` |
| slug | `after-sun-aloe-recovery-gel` |
| brand | `Solenne` |
| name | `After-Sun Aloe Recovery Gel` |
| tagline | `Cool down after light` |
| price | `19` |
| rating / reviews | `4.6` / `210` |
| category | `sun` |
| size | `150 ml` |
| skinTypes | `All` (body/face careful) |
| concerns | `Post-sun comfort`, `Cooling` |
| keyIngredients | `Aloe Vera`, `Panthenol`, `Allantoin` |
| relatedIds | `p11`, `p15`, `p2`, `p4` |
| packForm | Clear tube or soft jar |
| packColor | Transparent aloe green gel |
| productTexture | Cooling transparent gel |

**description:**  
Aloe-forward gel for after sun exposure — cools, softens, and layers under night body lotion. Pair with Solenne SPF by day; this is recovery, not protection.

**howToUse:**  
1. After sun exposure, cleanse gently.  
2. Apply liberally to warm skin.  
3. Reapply as needed; refrigerate for extra cool optional.  
4. Not a substitute for sunscreen.

**ingredients:**  
Aloe Barbadensis Leaf Juice, Aqua, Glycerin, Panthenol, Allantoin, Carbomer, Sodium Hydroxide.

**imagePromptPrimary:**  
Clear aloe gel tube/jar, green translucent gel, “Solenne After-Sun”, soft daylight, 1:1.

**imagePromptHover:**  
Gel squeezed / open jar swirl, 1:1.

**imagePromptDetail:**  
Macro aloe gel bubbles/clarity, 1:1.

---

### 4.4 Home name maps (phải khớp string)

Home.tsx dùng `findProductByName` — **giữ đúng name** sau rewrite:

| Home reference name | id |
|---------------------|-----|
| `Bamboo Ultra Hydrating Toner` | p1 |
| `Birch Moisturizing Soothing Gel` | p2 |
| `Mugwort Calming Cream` | p3 |
| `Advanced Snail Mucin 96% Power Repairing Essence Serum` | p8 |
| `Volcanic Sea Clay Detox Masque` | p10 |
| `Invisible Fluid Sunscreen SPF 50+ PA++++` | p11 |
| `Green Tea Deep Cleansing` **→ đổi code Home sang** `Green Tea Deep Cleansing Gel` | p7 |
| `Eucalyptus Nourishing Body Cleanser` | p5 |
| `Body Lotion Lavender Patchouli` | p4 |

Anti: update Home constants nếu rename p7.

### 4.5 Related products logic

- `relatedIds` đã hardcode mỗi card ở §4.3 — **dùng đúng list đó** trong data.  
- Fallback helper: same category nếu id missing.  
- Không related tới chính nó.

### 4.6 Image generation batch checklist (60 product images + 1 home)

| Batch | Count | Output |
|-------|-------|--------|
| p1–p20 × 3 | **60** | `products/{slug}/01|02|03` |
| home fragrance tile | **1** | `home-contents-fragrance.jpg` |
| **Total min** | **61** | local files only |

Sau gen: verify **không** trùng hash/file giữa 2 primary khác nhau.

### 4.7 Example TypeScript object (p1) — pattern cho toàn catalog

```ts
{
  id: 'p1',
  slug: 'bamboo-ultra-hydrating-toner',
  brand: 'Aurelle Lab',
  name: 'Bamboo Ultra Hydrating Toner',
  tagline: 'Barrier-first hydration in one pass',
  price: 45,
  rating: 4.8,
  reviews: 310,
  images: {
    primary: '/assets/generated/products/bamboo-ultra-hydrating-toner/01-primary.jpg',
    hover: '/assets/generated/products/bamboo-ultra-hydrating-toner/02-hover.jpg',
    detail: '/assets/generated/products/bamboo-ultra-hydrating-toner/03-detail.jpg',
  },
  image: '/assets/generated/products/bamboo-ultra-hydrating-toner/01-primary.jpg',
  isNew: true,
  category: 'skin',
  size: '150 ml',
  skinTypes: ['Dry', 'Combination', 'Dehydrated'],
  concerns: ['Hydration', 'Barrier support', 'Dullness'],
  description:
    'A weightless toner-essence hybrid that reintroduces water to a depleted barrier. Bamboo water and panthenol settle thirst without film or fragrance overload — the quiet first step of an Aurelle Lab ritual.',
  howToUse:
    '1. After cleansing, pour a few drops into clean palms.\n2. Press gently over face and neck.\n3. Layer 2–3 passes on dry days.\n4. Follow with essence or cream while skin is still damp.',
  ingredients:
    'Aqua/Water, Bambusa Vulgaris Water, Glycerin, Panthenol, Sodium PCA, Allantoin, 1,2-Hexanediol, Caprylyl Glycol, Citric Acid.',
  keyIngredients: ['Bamboo Water', 'Panthenol', 'Glycerin'],
  relatedIds: ['p16', 'p7', 'p2', 'p3'],
}
```

Anti lặp pattern này cho **p2–p20** từ bảng §4.3 (không bỏ field).

---

## 5. UI — ProductCard + Hover Image Swap

### 5.1 File

`Frontend/src/components/ui/ProductCard.tsx`

### 5.2 Behavior (bắt buộc)

**Hover Image Swap / Image Rollover**

- Default: `images.primary`  
- On hover (pointer devices): crossfade/swap sang `images.hover`  
- On mouse leave: về `primary`  
- **Touch / no-hover:** chỉ primary (không kẹt hover state)  
- `prefers-reduced-motion: reduce` → swap tức thì hoặc chỉ primary (không animation dài)  
- Preload hover: `loading="lazy"` primary; optional second img always in DOM with opacity 0 for instant swap  
- **Không** swap khi hover wishlist/quick-add button only — swap trên **image container** (`group` on article)

### 5.3 Recommended markup pattern

```tsx
<div className="group relative aspect-square overflow-hidden bg-parchment">
  <Link to={`/product/${product.slug}`} className="block h-full w-full">
    <img
      src={primary}
      alt={`${product.brand} — ${product.name}`}
      className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0 motion-reduce:transition-none"
    />
    <img
      src={hover}
      alt=""
      aria-hidden
      className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:group-hover:opacity-100"
    />
  </Link>
  {/* badges, wishlist button remain z-10 */}
</div>
```

Hoặc single-img + `onMouseEnter` set src — dual-img preferred (no flash).

### 5.4 Card content (hiển thị đủ)

1. Badge: New / Bestseller (giữ)  
2. Wishlist heart (giữ)  
3. Image area + hover swap  
4. Brand (uppercase brass)  
5. **Name** → link PDP `/product/:slug`  
6. Category label (optional keep)  
7. **Stars + rating + reviews** (HIỆN CHƯA CÓ — phải thêm)  
   - Visual stars (lucide `Star` fill) hoặc unicode; `aria-label={`Rated ${rating} out of 5 from ${reviews} reviews`}`  
8. Price (`formatPrice`)  
9. Quick add to cart (giữ)

### 5.5 Link rules

| Element | Target |
|---------|--------|
| Image + Name | `/product/${slug}` |
| **Không** link category as primary CTA | category vẫn filter được từ Shop tabs |

---

## 6. UI — Product Detail Page (PDP)

### 6.1 Routing

`Frontend/src/App.tsx`:

```tsx
<Route path="product/:slug" element={<ProductDetail />} />
```

Optional alias (nice-to-have): redirect `/products/:slug` → same.

### 6.2 New file

`Frontend/src/pages/ProductDetail.tsx`  
(Optional test: `ProductDetail.test.tsx`)

### 6.3 Layout sections (desktop → mobile stack)

1. **Breadcrumb:** Home / Shop / {Category} / {Name}  
2. **Gallery (left / top):**  
   - Main image (state: selected index 0–2)  
   - 3 thumbnails (primary, hover, detail) — click to select  
   - Keyboard: thumbs focusable  
3. **Buy box (right):**  
   - Brand  
   - H1 name  
   - Tagline  
   - Stars + rating + reviews count  
   - Price (+ compareAt if any)  
   - Size  
   - Skin types / concerns chips  
   - Qty selector (1–10)  
   - **Add to cart** (primary button, charcoal/oxblood)  
   - **Wishlist** toggle  
   - Trust microcopy (Authentic, Free shipping $50+ — optional short)  
4. **Accordion or stacked sections:**  
   - Description  
   - How to use  
   - Ingredients (key chips + full text)  
5. **Related products:** grid of `ProductCard` (4 items)

### 6.4 404 product

Nếu `slug` không tồn tại:

- Message serif “Product not found”  
- CTA link `/shop`

### 6.5 A11y

- 1 `h1`  
- Gallery thumbs `aria-label`  
- Buttons 44px min  
- Focus rings charcoal  
- Don’t trap focus  

### 6.6 Wire all entry points to PDP

| Surface | Change |
|---------|--------|
| ProductCard | → `/product/:slug` |
| Home ProductLineItem / composition links | → PDP when product resolved |
| SearchModal product row | → PDP |
| Cart line item name/image | → PDP |
| Wishlist cards | auto via ProductCard |

---

## 7. Shop All — logic & UI adjustments

File: `Frontend/src/pages/Shop.tsx`

### Keep

- Compact hero “Shop All”  
- Sticky category tabs + filters dialog + sort  
- URL params  
- Empty state  
- Editorial end band  

### Update

1. Grid vẫn `ProductCard` — card mới = hover + stars + PDP link.  
2. Search (`q`) optional expand: match `tagline`, `keyIngredients` (nice-to-have).  
3. Product/brand counts vẫn derived.  
4. Ensure new products appear in correct tabs.  
5. Visual QA: 2-col mobile → 4-col desktop; no layout shift khi hover image.

### Tests

Update `Shop.test.tsx` nếu selectors đổi (links, star labels).  
Keep cart/wishlist action tests green.

---

## 8. Home — logic & UI adjustments

File: `Frontend/src/pages/Home.tsx`

### Keep structure

Hero, trust, categories, daily edit, bestsellers grid, compositions, brand interlude, ritual, journal, newsletter.

### Fix / upgrade

1. **Fragrance category image:** ensure `home-contents-fragrance.jpg` exists + fallback.  
2. **ProductCard instances:** inherit hover swap + stars.  
3. **Links:** Daily Edit / bestsellers / ritual product names → `/product/:slug` (not only category).  
4. `findProductByName` still works after data rewrite (names must match constants in Home).  
5. Compositions: click-through to PDP of featured product.  
6. Do **not** regress `EditorialImg` fallback behavior.

---

## 9. Cart / Wishlist / Search / Header

| File | Task |
|------|------|
| `Cart.tsx` | Thumb = primary image; name links PDP; price/qty logic unchanged |
| `Wishlist.tsx` | Uses ProductCard — auto upgrade; align tokens to ivory/charcoal if still using old `#F8F6F4` inconsistency (optional polish) |
| `SearchModal.tsx` | Navigate to `/product/:slug`; image fallback still OK |
| `Header.tsx` | No structural change; cart/wishlist counts stay |

---

## 10. assetManifest & helpers

Update `Frontend/src/data/assetManifest.ts`:

- Register new product image paths  
- Register `home-contents-fragrance` if added  
- Keep blog/quiz entries  

Optional: `Frontend/src/lib/productImages.ts` centralizing path builders.

---

## 11. Implementation order (làm đúng thứ tự)

### Phase A — Data & assets

1. Extend `Product` interface + helpers.  
2. Generate/save **3 images × N products** under `public/assets/generated/...`.  
3. Fill full product objects (existing + new).  
4. Verify no two products share the same `primary` path.  
5. Fix fragrance home tile asset.

### Phase B — Card UX

6. Implement Hover Image Swap + stars on `ProductCard`.  
7. Point links to `/product/:slug`.  
8. Manual hover QA on Shop grid.

### Phase C — PDP

9. Create `ProductDetail.tsx` + route.  
10. Gallery, buy box, accordions, related.  
11. Wire Search/Cart/Home links.

### Phase D — Polish & verify

12. `npm run build` + `npm test` in `Frontend/`.  
13. Smoke: Home → Shop filter → PDP → Add cart → Cart; Wishlist toggle.  
14. Check console: no 404 images.  
15. Reduced-motion: no janky opacity loops.  
16. Update this folder status note if needed (optional).

---

## 12. Acceptance criteria (Definition of Done)

### Data

- [ ] **20 products** p1–p20 fully filled from §4.3 (no skeleton rows)  
- [ ] Every product has `slug`, brand, tagline, `images.primary|hover|detail`  
- [ ] Every product has `description`, `howToUse`, `ingredients`, `keyIngredients`, `size`, `relatedIds`  
- [ ] Brand voice matches §4.1 (pack colors / forms unique per SKU)  
- [ ] No duplicate primary image path across products  
- [ ] Counts: skin 9 · body 4 · sun 3 · fragrance 3  
- [ ] p8 vs p12 visually + copy differentiated (viscous vs watery)

### Images

- [ ] All image URLs 200 locally (`/assets/generated/...`)  
- [ ] Hover image visibly different from primary  
- [ ] Fragrance products show perfume/mist packshots, not random editorial crop  
- [ ] `home-contents-fragrance` loads or falls back cleanly

### ProductCard

- [ ] Hover swap works on desktop pointer  
- [ ] Stars + review count visible  
- [ ] Click name/image → PDP  
- [ ] Wishlist + Quick add still work  

### PDP

- [ ] `/product/:slug` renders full detail  
- [ ] 3-image gallery selectable  
- [ ] Add to cart with quantity  
- [ ] Wishlist toggle  
- [ ] Related products show  
- [ ] Unknown slug → not-found UI  

### Shop / Home

- [ ] Filters/sort/URL still work  
- [ ] Home product entry points reach PDP  
- [ ] No regression on hero/editorial sections  

### Quality

- [ ] `npm run build` success  
- [ ] Existing tests updated and passing  
- [ ] No DB / no new backend  
- [ ] Tokens/palette respected  

---

## 13. File touch list (expected)

| Action | Path |
|--------|------|
| Modify | `Frontend/src/data/products.ts` |
| Modify | `Frontend/src/data/assetManifest.ts` |
| Modify | `Frontend/src/components/ui/ProductCard.tsx` |
| Create | `Frontend/src/pages/ProductDetail.tsx` |
| Modify | `Frontend/src/App.tsx` |
| Modify | `Frontend/src/pages/Home.tsx` |
| Modify | `Frontend/src/pages/Shop.tsx` (minimal) |
| Modify | `Frontend/src/pages/Cart.tsx` |
| Modify | `Frontend/src/components/layout/SearchModal.tsx` |
| Modify | `Frontend/src/pages/Shop.test.tsx` / `Home.test.tsx` if needed |
| Create | `Frontend/public/assets/generated/products/**` (or flat product-*-{primary,hover,detail}.*) |
| Optional create | `Frontend/src/pages/ProductDetail.test.tsx` |
| Optional polish | `Frontend/src/pages/Wishlist.tsx` tokens |

---

## 14. Commands

```bash
cd Frontend
npm.cmd install
npm.cmd run dev
npm.cmd test
npm.cmd run build
```

Dev URL typically `http://localhost:5173`.

---

## 15. Anti-patterns (không làm)

- Không quay lại hotlink Unsplash/CDN lạ cho product grid  
- Không để `ProductCard` link `?category=` thay vì PDP  
- Không dùng 1 ảnh cho 3 slots (primary=hover=detail)  
- Không thêm Mongo/Postgres/Supabase “cho đủ”  
- Không rewrite toàn bộ Home layout magazine nếu không cần  
- Không bỏ sticky Shop filters  
- Không hardcode absolute `D:\...` paths trong source — chỉ public URL `/assets/...`

---

## 16. Gợi ý copy voice (EN UI)

UI strings hiện tại **English** — giữ English cho UI:

- “Quick add”, “Add to cart”, “How to use”, “Ingredients”, “You may also like”  
- Star aria: `Rated 4.8 out of 5 from 310 reviews`  

Nội dung mô tả sản phẩm: English (khớp site). Comment trong code: EN.

---

## 17. Checklist nhanh cho Antigravity session

```
[ ] Đọc products.ts + ProductCard + App routes
[ ] Extend Product type
[ ] Generate 3 images per product → public assets
[ ] Rewrite catalog content (14 + new)
[ ] ProductCard hover swap + stars + PDP links
[ ] Build ProductDetail page + route
[ ] Wire Home / Search / Cart
[ ] Fix fragrance content image
[ ] Test build + smoke click path
[ ] Confirm no broken images in network
```

---

## 18. Reference paths (docs sẵn có — đọc khi cần, không block)

- `docs/superpowers/plans/2026-07-17-shop-all-ui-implementation.md`  
- `docs/superpowers/plans/2026-07-16-home-structured-editorial-layout-fix-implementation.md`  
- `Mockups/product.png`, `Mockups/shop-all-editorial-marketplace-4k.png`, `Mockups/home-editorial-magazine-v5.png`  
- Live aesthetic inspiration historically: Aesop editorial — **không copy** copyrighted assets  

---

## 19. Deliverable summary (khi xong, báo lại)

Antigravity báo cáo ngắn:

1. Số products sau cùng + categories count  
2. Thư mục ảnh đã tạo  
3. Route PDP example URLs  
4. Confirm hover swap implemented how  
5. `npm test` / `npm run build` result  
6. Known leftovers (nếu có)

---

**End of brief.**  
**Prepared by: grok**
