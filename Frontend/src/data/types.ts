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
  relatedIds?: string[];
  pairsWithIds?: string[];
  source: ProductSource;
  
  // Backward compatibility fields for Home, Shop, Search, Cart
  image: string;
  isNew: boolean;
  isBestSeller: boolean;
}
