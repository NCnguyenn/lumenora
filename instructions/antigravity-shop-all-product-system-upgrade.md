# ANTIGRAVITY — SHOP ALL, PRODUCT DETAIL, PRODUCT DATA & IMAGE SYSTEM UPGRADE

## 0. Mục đích của tài liệu

Đây là tài liệu thực thi dành cho Antigravity. Hãy đọc toàn bộ tài liệu trước khi sửa bất kỳ file nào.

Mục tiêu là nâng cấp toàn diện hệ thống sản phẩm của Lumenora, tập trung vào Frontend:

- Nâng chất lượng hình ảnh của Shop All lên phong cách studio/editorial cao cấp.
- Đồng bộ đúng sản phẩm giữa Home, Shop All, Search, Wishlist, Cart và Product Detail.
- Giữ nguyên toàn bộ hình ảnh và bố cục Home đang có; không thay ảnh đẹp hiện tại của Home.
- Tạo Product Detail riêng cho từng sản phẩm.
- Mỗi sản phẩm phải có đúng tối thiểu 3 cảnh ảnh khác nhau.
- Product Card phải có hiệu ứng Hover Image Swap / Image Rollover.
- Mở rộng dữ liệu sản phẩm đầy đủ, có thương hiệu, giá, rating, mô tả, thành phần, hướng dẫn sử dụng và các thông tin cần thiết.
- Mỗi danh mục phải có ít nhất 3 sản phẩm; mục tiêu cụ thể của lần nâng cấp này là 20 sản phẩm.
- Nâng cấp logic sản phẩm tương tự và sản phẩm kết hợp trong routine.
- Giữ ứng dụng ở kiến trúc Frontend-first, chưa cần database.
- Tất cả đường dẫn sản phẩm phải dẫn tới đúng Product Detail, không quay về Home và không chỉ dẫn về trang danh mục.

Tài liệu này không phải gợi ý tùy chọn. Đây là đặc tả cần được triển khai và kiểm chứng đầy đủ.

---

## 1. Bối cảnh dự án hiện tại

Workspace:

    D:\Personal_Project\Lumenora

Frontend:

    D:\Personal_Project\Lumenora\Frontend

Stack hiện tại:

- React 19.
- TypeScript.
- React Router.
- Zustand với persist middleware.
- Tailwind CSS.
- Vite.
- Vitest và Testing Library.
- Lucide React.

Các file quan trọng cần khảo sát trước khi sửa:

- Frontend/src/App.tsx
- Frontend/src/data/products.ts
- Frontend/src/pages/Home.tsx
- Frontend/src/pages/Shop.tsx
- Frontend/src/pages/Cart.tsx
- Frontend/src/pages/Wishlist.tsx
- Frontend/src/components/ui/ProductCard.tsx
- Frontend/src/components/layout/SearchModal.tsx
- Frontend/src/store/useAppStore.ts
- Frontend/src/pages/Home.test.tsx
- Frontend/src/pages/Shop.test.tsx
- Frontend/public/assets/generated/
- Mockups/home-editorial-magazine-v5.png
- Mockups/shop-all-editorial-marketplace-4k.png
- Mockups/product.png

Hiện trạng đã biết:

- Chỉ có 14 bản ghi sản phẩm.
- Có 8 Skin, 3 Body, 1 Sun và 2 Fragrance.
- Nhiều sản phẩm đang dùng lại cùng một ảnh placeholder.
- Phần lớn ảnh sản phẩm chỉ có kích thước 1024 x 1024.
- Product chỉ có một trường image.
- Chưa có slug và chưa có route Product Detail.
- Product Card, Home, Search và Cart chưa dẫn tới một sản phẩm cụ thể.
- Home có các ảnh editorial đẹp nhưng chúng đang được khai báo riêng, không thuộc gallery sản phẩm.
- Cart đang persist toàn bộ object Product, khiến dữ liệu trong localStorage có thể bị cũ khi catalog thay đổi.
- Home đang tìm một số sản phẩm bằng tên, dễ hỏng khi đổi tên sản phẩm.

Trước khi triển khai:

1. Đọc toàn bộ các file liên quan.
2. Kiểm tra git status.
3. Không ghi đè hoặc xóa thay đổi không thuộc nhiệm vụ.
4. Chạy test hiện tại để có baseline.
5. Ghi nhận những test đang fail sẵn trước khi thay đổi.
6. Không sửa ảnh Home chỉ để làm Shop All giống mockup.

---

## 2. Quyết định kiến trúc bắt buộc

### 2.1. Chưa tạo database

Lần nâng cấp này dùng catalog tĩnh TypeScript hoặc JSON có type an toàn. Không tạo database, backend, authentication hoặc admin panel.

Lý do:

- Mục tiêu chính là Frontend.
- Catalog mục tiêu chỉ có 20 sản phẩm.
- Dữ liệu sản phẩm thay đổi ít.
- Cart và Wishlist có thể persist trong localStorage.
- Không có đơn hàng thật, tồn kho thật hoặc review do người dùng gửi.

Tuy nhiên, cấu trúc dữ liệu phải sẵn sàng chuyển sang API sau này:

- Component không được import và tự xử lý dữ liệu rải rác.
- Có một nguồn catalog duy nhất.
- Có selector/helper để truy xuất, lọc và lấy related products.
- Cart chỉ lưu productId, variantId và quantity.
- Wishlist chỉ lưu productId.

### 2.2. Nguồn dữ liệu trung tâm

Tất cả các màn hình sau phải đọc cùng một catalog:

- Home.
- Shop All.
- Search Modal.
- Product Detail.
- Wishlist.
- Cart.
- Related Products.
- Routine Pairings.

Không được tạo một mảng sản phẩm riêng trong từng page.

### 2.3. URL chuẩn của sản phẩm

Canonical route:

    /products/:slug

Ví dụ:

    /products/cosrx-advanced-snail-96-mucin-power-essence

Không dùng Product ID dạng p1 trong URL.

Slug phải:

- Duy nhất.
- Viết thường.
- Dùng dấu gạch ngang.
- Không phụ thuộc category.
- Ổn định khi giá hoặc rating thay đổi.

Route không hợp lệ phải render Product Not Found, không redirect về Home.

### 2.4. Ngôn ngữ và tiền tệ

- Nội dung giao diện và nội dung sản phẩm tiếp tục dùng tiếng Anh để thống nhất với Home hiện tại.
- Tài liệu triển khai và comment kỹ thuật có thể dùng tiếng Anh hoặc tiếng Việt.
- Giá dùng USD trong phạm vi demo.
- Product thực tế phải ghi market là US và ngày xác minh.
- Giá phải được trình bày là giá demo/snapshot, không tự nhận là giá trực tiếp theo thời gian thực.

---

## 3. Chính sách dữ liệu thật và dữ liệu hư cấu

Catalog hiện tại trộn thương hiệu thật và hư cấu. Lần nâng cấp này được phép giữ mô hình đó để không phá vỡ Home, nhưng phải phân loại rõ trong dữ liệu.

Mỗi brand và product phải có:

    sourceType: "official" | "fictional"

### 3.1. Đối với thương hiệu/sản phẩm thật

Ví dụ hiện có:

- COSRX.
- The Ordinary.

Antigravity phải:

- Tra cứu từ website chính thức của thương hiệu trước.
- Ưu tiên tên thương mại chính xác.
- Xác minh dung tích.
- Xác minh mô tả.
- Xác minh key ingredients.
- Xác minh cách dùng.
- Xác minh cảnh báo nếu có.
- Không sao chép nguyên đoạn dài từ website.
- Viết lại nội dung bằng câu chữ của Lumenora.
- Lưu officialUrl và lastVerified.
- Không tự tạo chứng nhận, thử nghiệm lâm sàng hoặc phần trăm hiệu quả.
- Nếu dùng rating/review giả lập cho demo, đánh dấu ratingSource là demo trong dữ liệu.
- Nếu dùng ảnh packshot chính thức, không hotlink; tải về local và lưu source URL trong metadata.
- Nếu quyền sử dụng ảnh không rõ, dùng ảnh AI nguyên bản theo phong cách studio cho demo nhưng không được tạo logo méo, chữ sai hoặc bao bì gây hiểu lầm.

### 3.2. Đối với thương hiệu/sản phẩm hư cấu

Các thương hiệu hư cấu hiện tại có thể tiếp tục sử dụng:

- Aurelle Lab.
- Harbor & Hearth.
- Maison Verdé.
- Solenne.
- Atelier Nocturne.

Antigravity phải tạo:

- Brand story riêng.
- Visual identity riêng.
- Nhóm sản phẩm hợp lý với định vị thương hiệu.
- Mô tả, benefits, ingredients và how-to-use nhất quán.
- Dung tích và giá hợp lý.
- Không ghi các claim y tế.
- Không ghi dermatologist tested, clinically proven, organic certified, cruelty-free certified hoặc các chứng nhận khác nếu không có nguồn.
- Không sao chép tên sản phẩm đặc trưng của thương hiệu thật.

### 3.3. Rating và review

Trang bắt buộc hiển thị sao và review count, nhưng đây là demo.

Quy tắc:

- Rating từ 4.4 đến 4.9.
- Review count hợp lý, không giống nhau hàng loạt.
- Lưu ratingSource: "demo" nếu không có nguồn.
- Không hiển thị lời khẳng định đây là rating chính thức của thương hiệu.
- Nếu sau này có review thật, có thể thay nguồn mà không sửa component.

---

## 4. Catalog mục tiêu: 20 sản phẩm

Phân bố bắt buộc:

| Category | Số lượng |
|---|---:|
| Skin | 8 |
| Body | 4 |
| Sun | 4 |
| Fragrance | 4 |
| Tổng | 20 |

Không được xóa một sản phẩm đang được Home sử dụng mà không map sang sản phẩm thay thế tương đương.

### 4.1. Skin — 8 sản phẩm

1. p1 — Aurelle Lab — Bamboo Ultra Hydrating Toner.
2. p2 — Harbor & Hearth — Birch Moisturizing Soothing Gel.
3. p3 — Maison Verdé — Mugwort Calming Cream.
4. p7 — Aurelle Lab — Green Tea Deep Cleansing Gel.
5. p8 — COSRX — Advanced Snail 96 Mucin Power Essence.
6. p9 — The Ordinary — Niacinamide 10% + Zinc 1%.
7. p10 — Maison Verdé — Volcanic Sea Clay Detox Masque.
8. p12 — COSRX — Low pH Good Morning Gel Cleanser.

Lưu ý:

- p8 và p12 hiện đang gần như trùng nhau. Phải chuẩn hóa thành hai sản phẩm khác nhau như danh sách trên.
- Sửa các tham chiếu Home theo ID hoặc slug, không tiếp tục tìm bằng tên.
- Giữ nguyên ảnh Home đang hiển thị cho các slot liên quan.

### 4.2. Body — 4 sản phẩm

1. p4 — Solenne — Lavender Patchouli Body Lotion.
2. p5 — Harbor & Hearth — Eucalyptus Nourishing Body Cleanser.
3. p6 — Solenne — Nourishing Shea Body Butter.
4. p15 — Aurelle Lab — Cedar Leaf Smoothing Body Polish.

### 4.3. Sun — 4 sản phẩm

1. p11 — Solenne — Invisible Fluid Sunscreen SPF 50+ PA++++.
2. p16 — Solenne — Mineral Veil Sun Milk SPF 50.
3. p17 — Aurelle Lab — Daily Defense Sun Stick SPF 50+.
4. p18 — Harbor & Hearth — Aloe Mineral After-Sun Gel.

Lưu ý:

- Với sản phẩm sunscreen hư cấu, không được tự tạo claim vượt quá tên SPF.
- Mô tả phải nói rõ đây là nội dung demo nếu sourceType là fictional.
- Không ghi broad spectrum, water resistant hoặc PA rating nếu thông tin đó không nằm trong product definition đã được chốt.

### 4.4. Fragrance — 4 sản phẩm

1. p13 — Atelier Nocturne — Cedar & Fig Eau de Parfum.
2. p14 — Atelier Nocturne — Soft Linen Hair & Body Mist.
3. p19 — Atelier Nocturne — Amber Iris Eau de Parfum.
4. p20 — Maison Verdé — Neroli Moss Eau de Parfum.

### 4.5. Không được tạo placeholder

Mỗi một trong 20 sản phẩm phải có dữ liệu riêng. Không được:

- Dùng Lorem Ipsum.
- Copy cùng một description cho nhiều sản phẩm.
- Copy cùng một ingredient list cho nhiều sản phẩm.
- Dùng giá 0.
- Dùng tên Untitled Product.
- Dùng ảnh serum cho cleanser hoặc perfume.
- Dùng cùng một ảnh cho hai sản phẩm khác nhau.
- Dùng URL ảnh bên ngoài trong runtime.

---

## 5. Data model bắt buộc

Có thể điều chỉnh tên field cho phù hợp codebase, nhưng phải giữ đủ ý nghĩa sau.

~~~ts
export type ProductCategory = "skin" | "body" | "sun" | "fragrance";

export type ProductSourceType = "official" | "fictional";
export type RatingSource = "official" | "retailer" | "demo";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  sourceType: ProductSourceType;
  shortStory: string;
  fullStory: string;
  origin?: string;
  officialUrl?: string;
  lastVerified?: string;
}

export interface ProductImage {
  id: string;
  role: "primary" | "hover" | "detail";
  src: string;
  alt: string;
  width: number;
  height: number;
  dominantColor?: string;
  sourceUrl?: string;
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
  value: number;
  count: number;
  source: RatingSource;
  sourceUrl?: string;
}

export interface ProductSource {
  sourceType: ProductSourceType;
  officialUrl?: string;
  additionalUrls?: string[];
  lastVerified: string;
  market: "US";
  notes?: string;
}

export interface Product {
  id: string;
  slug: string;
  brandId: string;
  brand: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  productType: string;
  price: number;
  currency: "USD";
  defaultVariantId: string;
  variants: ProductVariant[];
  rating: ProductRating;
  images: ProductImage[];
  badges: Array<"new" | "bestseller" | "limited">;
  shortDescription: string;
  description: string[];
  benefits: string[];
  keyIngredients: IngredientHighlight[];
  fullIngredients: string;
  howToUse: string[];
  skinTypes: string[];
  concerns: string[];
  routineStep: string;
  usageTime: Array<"AM" | "PM" | "Anytime">;
  texture?: string;
  finish?: string;
  scent?: string;
  warnings: string[];
  shippingNote: string;
  returnNote: string;
  relatedTags: string[];
  pairsWithTags: string[];
  source: ProductSource;
}
~~~

### 5.1. Quy tắc dữ liệu

- Mỗi product có đúng 3 ProductImage scene khác nhau.
- images[0] có role primary.
- images[1] có role hover.
- images[2] có role detail.
- Mỗi ảnh có alt riêng, mô tả đúng cảnh.
- Mỗi product có ít nhất một variant.
- defaultVariantId phải tồn tại trong variants.
- price của product phải bằng giá variant mặc định.
- Rating từ 0 đến 5.
- Không có slug trùng.
- Không có SKU trùng.
- Mỗi product có 3–5 benefits.
- Mỗi product có 3–6 key ingredients.
- Mỗi product có 3–5 bước howToUse hoặc câu hướng dẫn rõ ràng.
- Mỗi product có ít nhất một skin type hoặc nhóm người dùng phù hợp.
- Fragrance có notes/scent rõ ràng; có thể dùng skinTypes là "All".
- Mỗi product có 2–4 đoạn description ngắn, không tạo một khối văn bản quá dài.
- Mỗi product có warnings; nếu không có cảnh báo đặc biệt, dùng cảnh báo an toàn chung phù hợp loại sản phẩm.
- Không đưa source metadata kỹ thuật ra UI chính.

### 5.2. Helpers/selectors cần có

Tạo hoặc nâng cấp các helper:

- getProductById(id).
- getProductBySlug(slug).
- getBrandById(id).
- getProductsByCategory(category).
- getProductsByBrand(brandId).
- searchProducts(query).
- filterProducts(filters).
- sortProducts(sort).
- getSimilarProducts(product, limit).
- getRoutinePairings(product, limit).
- formatPrice(price, currency).
- validateCatalog() dùng trong test hoặc development.

Không tìm sản phẩm bằng product.name.

---

## 6. Hệ thống hình ảnh: 3 cảnh ảnh cho mỗi sản phẩm

Tổng số cảnh ảnh bắt buộc:

    20 sản phẩm x 3 cảnh = 60 cảnh ảnh riêng

Derivative responsive không tính là cảnh mới. Một cảnh có thể xuất ra nhiều kích thước.

### 6.1. Ba loại ảnh

#### Ảnh 1 — Primary Studio Packshot

- Ảnh chính của Product Card và Product Detail.
- Tỷ lệ 1:1.
- Sản phẩm đặt giữa, chiếm khoảng 68–78% chiều cao khung hình.
- Phông ivory, parchment hoặc travertine nhạt.
- Ánh sáng studio mềm, có bóng đổ tự nhiên.
- Bao bì phải rõ, không bị méo.
- Không có bàn tay hoặc người mẫu.
- Không chứa nhiều sản phẩm khác.
- Phải nhận diện rõ product type.

#### Ảnh 2 — Hover Image / Alternate View

- Dùng cho Hover Image Swap.
- Tỷ lệ 1:1 và crop tương thích ảnh primary.
- Vẫn là chính sản phẩm đó với đúng bao bì, màu, nắp, label và dung tích.
- Thay đổi góc 20–45 độ, mở nắp, có texture hoặc đặt nghiêng tùy product type.
- Không thay đổi thiết kế chai giữa hai ảnh.
- Không được biến serum thành jar hoặc tube.
- Subject phải nằm gần cùng vị trí để rollover không bị nhảy bố cục.

#### Ảnh 3 — Detail / Lifestyle / Ingredient

- Dùng trong Product Detail.
- Tỷ lệ ưu tiên 1:1; có thể 4:5 nếu gallery hỗ trợ nhất quán.
- Thể hiện texture, nguyên liệu hoặc bối cảnh sử dụng.
- Vẫn phải có sản phẩm xuất hiện rõ.
- Fragrance có thể dùng botanical notes.
- Sun có thể dùng ánh nắng và bề mặt khoáng.
- Body có thể dùng linen, gỗ, hơi nước hoặc texture kem.
- Skin có thể dùng glass, water, botanical hoặc texture công thức.

### 6.2. Art direction chung

Giữ tinh thần Home hiện tại:

- Editorial luxury.
- Warm ivory.
- Parchment.
- Charcoal.
- Deep olive.
- Oxblood chỉ làm điểm nhấn.
- Brass rất tiết chế.
- Ánh sáng tự nhiên có direction.
- Travertine, linen, glass, olive leaves và botanical accents.
- Không tạo cảm giác stock photo rẻ tiền.
- Không tạo background quá bận.
- Không dùng neon, gradient tím/xanh hoặc visual công nghệ.

Mỗi brand phải có nhận diện riêng nhưng vẫn thuộc Lumenora:

- Aurelle Lab: clear glass, pale green, bamboo/cedar accents, laboratory calm.
- Harbor & Hearth: amber glass, eucalyptus, birch, water and warm wood.
- Maison Verdé: ceramic, mineral clay, moss green and tactile cream.
- Solenne: warm ivory tubes, sunlight, pale gold and soft linen.
- Atelier Nocturne: sculptural fragrance glass, amber, oxblood shadow and dark botanical notes.
- COSRX/The Ordinary: giữ packshot chính xác nếu dùng hình chính thức; ảnh phụ phải không xuyên tạc bao bì.

### 6.3. Prompt template cho AI image generation

Antigravity có thể điều chỉnh prompt theo công cụ, nhưng phải giữ các điều kiện nhất quán.

Primary:

    Premium 4K studio product photography of [EXACT PRODUCT], centered single product,
    [PACKAGING DESCRIPTION], warm ivory and pale travertine background, soft directional
    sunlight, realistic contact shadow, editorial luxury skincare campaign, clean composition,
    label sharp and minimal, no hands, no people, no extra products, square 1:1.

Hover:

    Same exact [EXACT PRODUCT] with identical bottle, cap, label, color and proportions,
    alternate three-quarter angle, subtle [TEXTURE OR INGREDIENT] beside the product,
    same warm ivory studio, same lighting direction and camera height, realistic luxury
    ecommerce photography, square 1:1.

Detail:

    Same exact [EXACT PRODUCT] in an editorial ingredient scene with [KEY INGREDIENTS],
    visible product and realistic [TEXTURE], travertine, linen and soft botanical shadow,
    premium beauty campaign, no people, no extra branded products, high detail.

Negative prompt:

    distorted packaging, duplicate bottle, extra cap, unreadable random text, warped logo,
    floating object, plastic-looking material, oversaturated colors, watermark, fake UI,
    hands, faces, multiple unrelated products, low resolution, blur, cut-off product.

### 6.4. Tính nhất quán giữa ba ảnh

Đây là acceptance gate bắt buộc:

- Chai/hũ/tube phải giống nhau.
- Màu nhãn phải giống nhau.
- Nắp/pump/dropper phải giống nhau.
- Tỷ lệ bao bì phải giống nhau.
- Dung tích không được thay đổi giữa ảnh.
- Tên thương hiệu không được biến dạng.
- Không dùng ba thiết kế bao bì khác nhau cho cùng product.

Nếu AI không giữ được continuity:

1. Chọn ảnh primary tốt nhất.
2. Dùng primary làm image reference cho ảnh 2 và 3.
3. Chỉnh lại ảnh thay vì chấp nhận sai.
4. Không đưa ảnh lỗi vào project chỉ để đủ số lượng.

### 6.5. Độ phân giải và tối ưu

- Master ưu tiên 3840 x 3840 cho ảnh vuông.
- Lưu master chất lượng cao nếu dung lượng workspace cho phép.
- Runtime ưu tiên WebP hoặc AVIF.
- Tạo responsive sizes phù hợp, ví dụ 640, 960, 1600 và 2400.
- Không bắt card tải ảnh 4K đầy đủ.
- Primary Product Detail có thể tải 1600/2400.
- Chỉ dùng master cho zoom nếu có.
- loading="lazy" cho ảnh dưới fold.
- decoding="async".
- Ảnh LCP chính không lazy-load.
- Có width và height để tránh layout shift.
- Không hotlink URL bên ngoài.

### 6.6. Cấu trúc file đề xuất

    Frontend/public/assets/products/
      aurelle-bamboo-ultra-hydrating-toner/
        01-primary.webp
        02-hover.webp
        03-detail.webp
      cosrx-advanced-snail-96-mucin-power-essence/
        01-primary.webp
        02-hover.webp
        03-detail.webp
      ...

Nếu tạo derivative:

    01-primary-640.webp
    01-primary-960.webp
    01-primary-1600.webp
    01-primary-2400.webp

Không xóa Frontend/public/assets/generated vì Home vẫn đang dùng.

---

## 7. Quy tắc đặc biệt đối với ảnh Home

Đây là yêu cầu không được vi phạm:

    Không thay đổi các file ảnh đang render trên Home.

Bao gồm:

- Hero.
- Category imagery.
- Daily Edit.
- Compositions.
- Brand interlude.
- Ritual scenes.
- Journal/blog imagery.
- Các ảnh nền hoặc ảnh trưng bày khác.

### 7.1. Phân loại ảnh Home

Antigravity phải phân loại từng ảnh Home:

1. Product-specific: ảnh thể hiện rõ một sản phẩm catalog duy nhất.
2. Editorial composite: ảnh có nhiều sản phẩm hoặc mang tính scene.
3. Category image.
4. Hero/background.
5. Blog/journal.

Chỉ nhóm Product-specific được map vào gallery của Product Detail.

Không được đưa các nhóm sau làm primary Product Card:

- Hero/background.
- Editorial composite có nhiều sản phẩm.
- Category image.
- Blog/journal.
- Ảnh chỉ có texture và không có sản phẩm.

### 7.2. Đồng bộ Home và Shop

- Mọi product được nhắc trên Home phải tồn tại trong catalog.
- Home lookup phải dùng Product ID hoặc slug.
- Tên, brand, price và wishlist state phải lấy từ catalog.
- Click vào tên/ảnh sản phẩm trên Home phải đi tới /products/:slug.
- Click CTA cấp category vẫn đi tới /shop?category=...
- Nếu một ảnh Home product-specific phù hợp với grid, đưa nó vào một trong ba image scene của product.
- Nếu không phù hợp primary, dùng nó làm hover hoặc detail.
- Không thay src đang render trên Home.
- Không làm thay đổi layout, crop, tỷ lệ hoặc art direction của Home.

---

## 8. Product Card mới

Component ProductCard phải trở thành card dùng chung cho:

- Shop All.
- Home product grid.
- Wishlist.
- Search nếu dùng card đầy đủ.
- Related Products.
- Routine Pairings.

Có thể thêm prop surface hoặc imageOverride nếu cần giữ presentation riêng của Home, nhưng identity và route phải luôn đến cùng Product ID.

### 8.1. Nội dung card

Thứ tự hiển thị:

1. Product image.
2. Badge New/Bestseller nếu có.
3. Wishlist button.
4. Brand.
5. Product name.
6. Product type hoặc one-line benefit.
7. Rating stars và review count.
8. Size của default variant.
9. Price.
10. Quick Add.

Không giấu:

- Tên.
- Giá.
- Rating.
- Product type.

### 8.2. Hover Image Swap / Image Rollover

Hành vi bắt buộc:

- Mặc định hiển thị images[0] primary.
- Khi pointer hover vào vùng ảnh, crossfade sang images[1] hover.
- Khi pointer rời card, trở về images[0].
- Transition 250–400 ms.
- Có thể thêm scale rất nhẹ tối đa 1.02; không zoom quá mạnh.
- Không gây thay đổi kích thước card.
- Không gây layout shift.
- Không flicker ở lần hover đầu tiên.
- Preload ảnh thứ hai khi card gần viewport hoặc pointerenter lần đầu.
- Nếu ảnh hover lỗi, giữ ảnh primary.
- Nếu prefers-reduced-motion được bật, dùng chuyển đổi tức thời hoặc tắt animation.
- Trên thiết bị touch không phụ thuộc hover; vẫn hiển thị primary rõ ràng.
- Focus bằng bàn phím không được làm người dùng mất thông tin.

Gợi ý implementation:

- Hai ảnh đặt absolute chồng nhau trong cùng aspect-ratio container.
- Primary opacity 1, hover opacity 0.
- group-hover đổi opacity.
- Hover image có aria-hidden để screen reader không đọc trùng.
- Link ảnh có accessible name từ brand + product name.

### 8.3. Cấu trúc tương tác an toàn

- Không đặt button Wishlist hoặc Quick Add bên trong Link.
- Ảnh và product name dẫn tới Product Detail.
- Wishlist là button riêng.
- Quick Add là button riêng.
- Tất cả target tối thiểu 44 x 44 CSS px.
- Có focus-visible rõ.
- aria-pressed cho wishlist.
- aria-label phải chứa tên sản phẩm.

### 8.4. Quick Add

- Nếu sản phẩm chỉ có một variant, thêm default variant.
- Nếu có nhiều variant, mở một selector nhỏ hoặc chọn default rõ ràng.
- Sau khi thêm phải có feedback: toast, cart count update hoặc mini confirmation.
- Không điều hướng người dùng khỏi Shop.
- Không được add hai lần do event bubbling.

---

## 9. Shop All

Giữ visual direction Editorial Marketplace đã có, nhưng nâng cấp dữ liệu và product imagery.

### 9.1. Hero và toolbar

- Giữ hero gọn để product grid gần fold.
- Giữ palette ivory/parchment/charcoal/olive/oxblood/brass.
- Sticky discovery toolbar.
- Category tabs: All, Skin, Body, Sun, Fragrance.
- Filter button.
- Product count.
- Sort control.
- Không dùng ảnh Product Card làm hero nếu ảnh đó cần giữ cho catalog.

### 9.2. Filters

Hỗ trợ:

- Category.
- Brand.
- Product type.
- Concern.
- Skin type.
- Price.
- Availability.

Yêu cầu:

- Filter state đồng bộ vào URL.
- Refresh trang không mất filter.
- Browser Back/Forward hoạt động.
- Có active filter chips.
- Có Clear All.
- Empty state rõ ràng.
- Count chính xác sau filter.

### 9.3. Sort

Hỗ trợ:

- Featured.
- New Arrivals.
- Bestsellers.
- Rating.
- Price Low to High.
- Price High to Low.

Sort phải deterministic; nếu bằng nhau, dùng name hoặc ID làm tie-breaker để card không tự đổi vị trí.

### 9.4. Grid

- Mobile: 2 cột nếu vẫn đọc được; có thể 1 cột ở màn rất nhỏ.
- Tablet: 2–3 cột.
- Desktop: 4 cột.
- Khoảng cách ổn định.
- Không chèn banner giữa các hàng sản phẩm.
- End-of-list editorial block chỉ nằm sau grid.

### 9.5. Search

Search phải tìm theo:

- Product name.
- Brand.
- Category.
- Product type.
- Benefits.
- Concerns.
- Key ingredients.

Chuẩn hóa query:

- Trim.
- Lowercase.
- Bỏ khoảng trắng dư.
- Không crash với ký tự đặc biệt.

Search result click phải tới Product Detail, không chỉ tới category.

---

## 10. Product Detail Page

Tạo page mới, route mới và test mới.

Tên file gợi ý:

    Frontend/src/pages/ProductDetail.tsx

Các component có thể tách:

- ProductGallery.
- ProductInfoPanel.
- RatingSummary.
- VariantSelector.
- QuantitySelector.
- ProductDetailsAccordion.
- SimilarProducts.
- RoutinePairings.
- AddToCartFeedback.

Không bắt buộc dùng đúng tên, nhưng không dồn toàn bộ page thành một file quá lớn nếu có thể tách hợp lý.

### 10.1. Desktop layout

- Breadcrumb phía trên.
- Gallery bên trái khoảng 55–60%.
- Product information bên phải khoảng 40–45%.
- Info panel có thể sticky trong phạm vi section đầu.
- Ảnh primary lớn.
- Hai ảnh còn lại hiển thị dưới hoặc trong grid rõ ràng.
- Không crop mất nắp hoặc đáy sản phẩm.

### 10.2. Mobile layout

- Breadcrumb gọn.
- Gallery dạng carousel/swipe hoặc stack có thumbnail.
- Pagination indicator 1/3.
- Product info ngay sau gallery.
- Add to Cart sticky ở đáy nếu không che footer hoặc nội dung quan trọng.
- Accordion cho content dài.

### 10.3. Thông tin bắt buộc above the fold

- Brand.
- Product name.
- Subtitle.
- Rating stars.
- Rating value.
- Review count.
- Price.
- Size/variant.
- Badge.
- Stock status.
- Short description.
- Quantity.
- Add to Cart.
- Wishlist.
- Shipping note.

### 10.4. Gallery

- Hiển thị đủ cả 3 ảnh.
- Thumbnail hoặc pagination rõ ràng.
- Ảnh đang chọn có active state.
- Keyboard navigation.
- Alt text riêng.
- Zoom/lightbox nếu triển khai ổn định.
- Escape đóng lightbox.
- Focus trả lại trigger sau khi đóng.
- Ảnh lỗi có fallback nhưng không tạo vòng lặp onError.

### 10.5. Nội dung chi tiết

Mỗi sản phẩm phải có:

#### Overview

- 2–4 đoạn ngắn.
- Nói rõ sản phẩm là gì.
- Texture/finish/scent nếu phù hợp.
- Tránh medical claim.

#### Benefits

- 3–5 lợi ích.
- Dùng câu ngắn, có thể scan.

#### Key Ingredients

- 3–6 thành phần nổi bật.
- Mỗi thành phần có một câu giải thích vai trò.
- Với sản phẩm thật phải theo nguồn chính thức.

#### Full Ingredients

- Có danh sách đầy đủ.
- Với sản phẩm thật phải dùng nguồn chính thức và lưu ngày xác minh.
- Với sản phẩm hư cấu phải ghi dữ liệu demo trong source metadata.
- Không hiển thị placeholder.

#### How To Use

- Các bước theo thứ tự.
- Lượng dùng nếu có.
- Thời điểm AM/PM.
- Vị trí trong routine.
- Cảnh báo patch test hoặc tránh mắt nếu phù hợp.

#### Product Facts

- Category.
- Product type.
- Skin types.
- Concerns.
- Routine step.
- Texture.
- Finish.
- Scent nếu có.
- Size.
- Country/origin chỉ khi có dữ liệu.

#### Brand

- Brand name.
- Short brand story.
- Link official nếu là brand thật.
- Không tạo Brand Detail page trong scope này trừ khi rất đơn giản và không làm chậm nhiệm vụ chính.

#### Shipping & Returns

- Nội dung demo thống nhất với Cart.
- Không ghi chính sách mâu thuẫn giữa Product Detail và Footer.

### 10.6. Variant và quantity

- Variant selector có accessible label.
- Out-of-stock variant bị disabled.
- Đổi variant cập nhật giá, size và SKU.
- Quantity tối thiểu 1.
- Có giới hạn hợp lý, ví dụ 10.
- Add to Cart dùng selected variant và quantity.
- Không add nếu variant out of stock.

### 10.7. Product Not Found

Khi slug không tồn tại:

- Hiển thị heading Product Not Found.
- Có nút Back to Shop.
- HTTP status thực tế không bắt buộc trong SPA, nhưng UI không được blank.
- Không redirect âm thầm về Home.
- Không crash.

### 10.8. SEO cơ bản

Nếu stack hiện tại cho phép mà không cần dependency nặng:

- document title theo Product Name | Lumenora.
- meta description từ shortDescription.
- canonical path.
- Product JSON-LD có name, image, brand, offers và rating khi dữ liệu phù hợp.

Không chặn nhiệm vụ chính chỉ vì chưa có SSR.

---

## 11. Similar Products và Routine Pairings

Đây là hai logic khác nhau. Không được dùng cùng một danh sách ngẫu nhiên.

### 11.1. Similar Products

Mục đích: đưa ra sản phẩm thay thế tương tự.

Chấm điểm đề xuất:

| Điều kiện | Điểm |
|---|---:|
| Cùng productType | +40 |
| Cùng category | +25 |
| Mỗi concern trùng | +10 |
| Mỗi skin type trùng | +6 |
| Mỗi key ingredient/tag trùng | +5 |
| Giá nằm trong ±25% | +8 |
| Cùng brand | +4 |
| Bestseller | +2 |

Quy tắc:

- Loại sản phẩm hiện tại.
- Loại duplicate ID.
- Sort điểm giảm dần.
- Tie-breaker bằng rating rồi product name.
- Trả về 4 sản phẩm trên desktop.
- Nếu không đủ, fallback cùng category.
- Nếu vẫn không đủ, dùng featured products khác category.

### 11.2. Routine Pairings

Mục đích: sản phẩm bổ trợ trong routine.

Ví dụ:

- Cleanser → toner/essence → serum → moisturizer → sunscreen.
- Body cleanser → body lotion/body butter.
- Fragrance → body mist hoặc body lotion có scent tương thích.
- Sunscreen không nên pair với một sunscreen gần giống nếu section mang tên Complete the Ritual.

Sử dụng:

- routineStep.
- pairsWithTags.
- category compatibility.
- Không trả lại chính sản phẩm hiện tại.

### 11.3. UI

- Similar Products: heading You May Also Like.
- Routine Pairings: heading Complete the Ritual.
- Dùng ProductCard chung.
- Card click tới Product Detail.
- Không hiển thị cùng một product ở cả hai section nếu có thể tránh.

---

## 12. Cart, Wishlist và Zustand store

### 12.1. State mới

Cart item không lưu toàn bộ Product.

~~~ts
interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}
~~~

Wishlist:

~~~ts
wishlist: string[] // product IDs
~~~

### 12.2. Migration localStorage

Store hiện tại đã persist object Product. Khi đổi schema:

- Thêm version cho persist store.
- Viết migrate để đọc cart cũ.
- Chuyển item.id thành productId.
- Chọn defaultVariantId nếu variant cũ không tồn tại.
- Giữ quantity hợp lệ.
- Bỏ item chỉ khi product không còn tồn tại và migration không thể map.
- Không làm app crash vì localStorage cũ.

### 12.3. Cart page

- Resolve Product từ productId.
- Hiển thị primary image.
- Tên sản phẩm dẫn tới /products/:slug.
- Hiển thị variant/size.
- Giá lấy từ selected variant hiện tại.
- Quantity update hoạt động.
- Remove hoạt động.
- Subtotal đúng.
- Empty state dẫn tới /shop.

### 12.4. Wishlist page

- Resolve Product từ ID.
- Product Card có hover swap.
- Product click tới Product Detail.
- Remove wishlist hoạt động.
- Nếu ID cũ không còn trong catalog, bỏ qua an toàn thay vì crash.

---

## 13. Home integration

Không redesign Home trong nhiệm vụ này.

Chỉ sửa logic cần thiết:

- Lookup product bằng ID/slug.
- Tất cả tên sản phẩm click tới Product Detail.
- Giá, brand và wishlist/cart actions lấy từ catalog.
- Giữ nguyên các section.
- Giữ nguyên thứ tự section.
- Giữ nguyên tất cả src ảnh hiện tại.
- Giữ nguyên hero autoplay/reduced-motion behavior.
- Giữ nguyên responsive layout.
- Không thay các ảnh Home bằng ảnh mới được tạo cho Shop nếu việc đó làm thay đổi hình ảnh hiện tại.

Đối với ProductCard đang xuất hiện trên Home:

- Nếu component chung được nâng cấp hover swap, phải đảm bảo ảnh primary hiện tại của Home không bị đổi ngoài ý muốn.
- Có thể truyền imageOverride hoặc surface="home".
- Hover image có thể dùng gallery mới nếu không phá visual.
- Product identity, route, price, rating và state vẫn phải lấy từ catalog.

---

## 14. Search integration

Search Modal hiện đang dẫn product result về Shop category. Phải sửa:

- Mỗi result đi tới /products/:slug.
- Result hiển thị primary image, brand, name, price và rating nếu đủ chỗ.
- Popular products lấy từ bestseller/featured selector.
- Popular search tags phải phản ánh catalog thật.
- Loại hoặc thay Lip oil nếu catalog không có lip product.
- Search không phân biệt hoa thường.
- Close modal khi navigate.
- Focus management và Escape vẫn hoạt động.

---

## 15. UI/UX và accessibility

### 15.1. Visual consistency

- Giữ font, màu, spacing và editorial mood của Home.
- Product Detail không được trông như một template ecommerce khác.
- Không dùng rounded card quá nhiều nếu design system hiện tại vuông/biên mảnh.
- Không dùng shadow nặng.
- Không dùng màu CTA ngoài palette hiện tại.
- Product image là trung tâm; UI không được cạnh tranh với hình ảnh.

### 15.2. Responsive

Kiểm tra tối thiểu:

- 375 x 812.
- 768 x 1024.
- 1440 x 900.
- 1920 x 1080.

Không có:

- Horizontal overflow.
- Button bị cắt.
- Text đè ảnh.
- Sticky toolbar che breadcrumb.
- Sticky Add to Cart che footer.
- Product image méo.

### 15.3. Accessibility

- Semantic heading order.
- Breadcrumb nav có aria-label.
- Product grid dùng list hoặc article hợp lý.
- Buttons có accessible name.
- Stars có text tương đương, ví dụ 4.8 out of 5.
- Không dùng màu đơn thuần để thể hiện active state.
- Contrast đạt mức đọc được.
- Focus visible rõ.
- Touch target ít nhất 44 px.
- Gallery keyboard accessible.
- Lightbox có focus trap nếu dùng.
- Respect prefers-reduced-motion.
- Alt text không lặp keyword spam.

---

## 16. Error handling và fallback

Phải xử lý:

- Slug không tồn tại.
- Product image lỗi.
- Hover image lỗi.
- Product thiếu variant mặc định.
- Cart chứa product ID cũ.
- Wishlist chứa product ID cũ.
- Search không có kết quả.
- Filter không có kết quả.
- URL filter không hợp lệ.
- Rating count bằng 0.
- officialUrl không có.

Nguyên tắc:

- Không crash toàn page.
- Không redirect về Home để che lỗi.
- Không dùng một ảnh serum chung cho mọi lỗi.
- Fallback image phải trung tính và chỉ dùng cuối cùng.
- Development mode có thể log catalog validation errors.
- Production UI phải thân thiện và không lộ stack trace.

---

## 17. Testing bắt buộc

Triển khai theo hướng test-first hoặc ít nhất phải thêm regression tests trước khi kết luận hoàn thành.

### 17.1. Catalog tests

Kiểm tra:

- Có đúng 20 sản phẩm.
- Skin 8, Body 4, Sun 4, Fragrance 4.
- Không trùng ID.
- Không trùng slug.
- Không trùng SKU.
- Mỗi product có đúng tối thiểu 3 scene images.
- Roles primary/hover/detail tồn tại.
- Mỗi ảnh có alt.
- Mỗi src là local path.
- Không có giá 0.
- Rating hợp lệ.
- defaultVariantId hợp lệ.
- Real products có officialUrl và lastVerified.
- Không có placeholder/TODO/TBD/Lorem.

### 17.2. ProductCard tests

Kiểm tra:

- Render brand/name/price/rating.
- Image link tới đúng /products/:slug.
- Product name link tới đúng /products/:slug.
- Wishlist toggle.
- Quick Add.
- Hover image tồn tại trong markup hoặc được load đúng.
- Primary fallback khi hover image lỗi.
- Không nested interactive controls.

JSDOM không mô phỏng CSS hover đầy đủ; test DOM roles/src/classes, sau đó kiểm tra browser visual.

### 17.3. Product Detail tests

Kiểm tra:

- Route slug hợp lệ render đúng product.
- Route slug không hợp lệ render Product Not Found.
- Render đủ 3 gallery images.
- Render brand, name, price, rating, review count.
- Render description.
- Render benefits.
- Render ingredients.
- Render how to use.
- Variant selection.
- Quantity update.
- Add to Cart đúng productId/variantId/quantity.
- Wishlist toggle.
- Similar Products không chứa product hiện tại.
- Related card dẫn tới Product Detail.

### 17.4. Integration tests

Kiểm tra:

- Home product click → Product Detail.
- Shop card click → Product Detail.
- Search result click → Product Detail.
- Wishlist card click → Product Detail.
- Cart product click → Product Detail.
- Back về Shop giữ URL filter.
- Cart migration không crash.

### 17.5. Existing tests

- Cập nhật test cũ nếu expectation route thay đổi hợp lệ.
- Không xóa test chỉ vì test fail.
- Không làm giảm coverage hành vi Home/Shop hiện có.

---

## 18. Trình tự triển khai đề xuất

### Phase 0 — Audit và baseline

- [ ] Đọc code và docs.
- [ ] Kiểm tra git status.
- [ ] Chạy npm test.
- [ ] Chạy npm run lint.
- [ ] Chạy npm run build.
- [ ] Ghi nhận lỗi có sẵn.
- [ ] Lập map Home asset → product/editorial role.

### Phase 1 — Catalog và selectors

- [ ] Mở rộng type Product.
- [ ] Tạo Brand data.
- [ ] Chuẩn hóa 14 product cũ.
- [ ] Tạo thêm p15–p20.
- [ ] Giải quyết duplicate COSRX.
- [ ] Thêm source metadata.
- [ ] Thêm catalog validation.
- [ ] Thêm selector/helper.
- [ ] Viết catalog tests.

### Phase 2 — 60 image scenes

- [ ] Tạo image direction cho từng brand.
- [ ] Tạo primary cho 20 products.
- [ ] Tạo hover cho 20 products.
- [ ] Tạo detail cho 20 products.
- [ ] Kiểm tra continuity.
- [ ] Loại ảnh lỗi/chữ méo.
- [ ] Tối ưu WebP/AVIF.
- [ ] Tạo responsive variants nếu cần.
- [ ] Gắn alt text.
- [ ] Không thay Home assets.

### Phase 3 — Product Card

- [ ] Dùng images[0]/images[1].
- [ ] Hover Image Swap.
- [ ] Rating UI.
- [ ] Size/price.
- [ ] Wishlist.
- [ ] Quick Add.
- [ ] Link slug.
- [ ] Reduced motion.
- [ ] Touch fallback.
- [ ] ProductCard tests.

### Phase 4 — Product Detail

- [ ] Route /products/:slug.
- [ ] ProductDetail page.
- [ ] Gallery 3 ảnh.
- [ ] Product info panel.
- [ ] Variant/quantity.
- [ ] Wishlist/Add to Cart.
- [ ] Overview/benefits.
- [ ] Ingredients.
- [ ] How to use.
- [ ] Product facts.
- [ ] Brand story.
- [ ] Shipping/returns.
- [ ] Product Not Found.
- [ ] Responsive mobile/desktop.
- [ ] Product Detail tests.

### Phase 5 — Related logic

- [ ] Similar scoring.
- [ ] Routine pairings.
- [ ] Fallback logic.
- [ ] Không duplicate/current product.
- [ ] Related tests.

### Phase 6 — Cross-page integration

- [ ] Home links.
- [ ] Shop links.
- [ ] Search links.
- [ ] Wishlist links.
- [ ] Cart links.
- [ ] Persist migration.
- [ ] URL/filter preservation.
- [ ] Integration tests.

### Phase 7 — UX và performance

- [ ] Image preload strategy.
- [ ] Lazy loading.
- [ ] No layout shift.
- [ ] Keyboard audit.
- [ ] Reduced motion audit.
- [ ] Mobile sticky CTA.
- [ ] Empty/error states.
- [ ] Meta title/description.

### Phase 8 — Verification

- [ ] npm test.
- [ ] npm run lint.
- [ ] npm run build.
- [ ] git diff --check.
- [ ] Visual QA ở 375, 768, 1440 và 1920.
- [ ] Kiểm tra browser console.
- [ ] Kiểm tra broken image/network 404.
- [ ] Kiểm tra direct URL refresh cho Product Detail.
- [ ] Kiểm tra Home không thay ảnh.

---

## 19. File/component structure đề xuất

Không bắt buộc chính xác tuyệt đối, nhưng nên gần với:

    Frontend/src/
      components/
        product/
          ProductGallery.tsx
          ProductInfoPanel.tsx
          ProductRating.tsx
          ProductDetailsAccordion.tsx
          SimilarProducts.tsx
          RoutinePairings.tsx
        ui/
          ProductCard.tsx
      data/
        brands.ts
        products.ts
        productSelectors.ts
      pages/
        Home.tsx
        Shop.tsx
        ProductDetail.tsx
        ProductDetail.test.tsx
        Cart.tsx
        Wishlist.tsx
      store/
        useAppStore.ts
      public/assets/products/
        [product-slug]/

Tránh:

- Một ProductDetail.tsx dài hàng nghìn dòng.
- Selector nằm lẫn trong JSX.
- Related logic nằm trong render.
- Import trực tiếp product array ở mọi component.
- Data source bị copy.

---

## 20. Tiêu chí nghiệm thu cuối cùng

Nhiệm vụ chỉ được coi là hoàn thành khi tất cả điều kiện sau đúng:

### Catalog

- [ ] Có 20 sản phẩm.
- [ ] Mỗi category có ít nhất 3; phân bố mục tiêu 8/4/4/4.
- [ ] Không duplicate product.
- [ ] Không placeholder.
- [ ] Real product data có nguồn.
- [ ] Fictional product data nhất quán và không claim sai.

### Images

- [ ] Mỗi product có 3 scene ảnh khác nhau.
- [ ] Tổng cộng ít nhất 60 scene ảnh.
- [ ] Không hai product dùng cùng ảnh.
- [ ] Primary/hover continuity đạt.
- [ ] Không watermark.
- [ ] Không chữ AI méo.
- [ ] Runtime không hotlink.
- [ ] Card không tải master 4K không cần thiết.
- [ ] Home images không thay đổi.

### Product Card

- [ ] Hover Image Swap hoạt động.
- [ ] Touch vẫn sử dụng được.
- [ ] Rating/price/name/brand rõ.
- [ ] Wishlist hoạt động.
- [ ] Quick Add hoạt động.
- [ ] Link đúng Product Detail.

### Product Detail

- [ ] Có route riêng cho mọi product.
- [ ] Hiển thị đủ 3 ảnh.
- [ ] Có brand/name/rating/reviews/price.
- [ ] Có description.
- [ ] Có benefits.
- [ ] Có ingredients.
- [ ] Có how to use.
- [ ] Có product facts.
- [ ] Có brand information.
- [ ] Có variant/quantity.
- [ ] Có wishlist/add cart.
- [ ] Có Similar Products.
- [ ] Có Complete the Ritual.
- [ ] Invalid slug không về Home.

### Integration

- [ ] Home → Product Detail.
- [ ] Shop → Product Detail.
- [ ] Search → Product Detail.
- [ ] Wishlist → Product Detail.
- [ ] Cart → Product Detail.
- [ ] Store migration không làm mất app.
- [ ] Filter URL hoạt động.

### Quality

- [ ] Test pass.
- [ ] Lint pass.
- [ ] Build pass.
- [ ] Không console error.
- [ ] Không broken image.
- [ ] Không horizontal overflow.
- [ ] Keyboard/focus hoạt động.
- [ ] prefers-reduced-motion được tôn trọng.
- [ ] Visual phù hợp Home.

---

## 21. Những việc ngoài phạm vi

Không thực hiện trong lần nâng cấp này trừ khi người dùng yêu cầu riêng:

- Database.
- Backend API thật.
- Admin dashboard.
- Đăng nhập/đăng ký.
- Checkout/payment thật.
- Order management.
- Review submission thật.
- Inventory sync thật.
- Multi-currency live conversion.
- Brand Detail pages phức tạp.
- Redesign toàn bộ Home.

Không được dùng các hạng mục ngoài phạm vi làm lý do trì hoãn Product Detail, ảnh hoặc cross-page logic.

---

## 22. Quy tắc bàn giao của Antigravity

Khi hoàn thành, Antigravity phải báo cáo:

1. Danh sách file đã sửa/tạo.
2. Danh sách 20 products.
3. Số lượng image scenes thực tế.
4. Những product dùng nguồn official và URL nguồn.
5. Những product là fictional.
6. Cách Hover Image Swap được triển khai.
7. Cách related scoring hoạt động.
8. Cách migrate localStorage cũ.
9. Kết quả test/lint/build với exit code.
10. Các vấn đề còn lại nếu có.
11. Screenshot desktop/mobile của Shop và Product Detail.
12. Xác nhận rõ rằng Home images không bị thay.

Không được tuyên bố hoàn thành nếu chưa chạy verification.

codex
