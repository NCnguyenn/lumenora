export type ProductCategory = 'skin' | 'body' | 'sun' | 'fragrance';

export interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  category: ProductCategory;
}

export const products: Product[] = [
  {
    id: 'p1',
    brand: 'Aurelle Lab',
    name: 'Bamboo Ultra Hydrating Toner',
    price: 45.0,
    rating: 4.8,
    reviews: 310,
    image: '/assets/generated/product-toner.png',
    isNew: true,
    category: 'skin',
  },
  {
    id: 'p2',
    brand: 'Harbor & Hearth',
    name: 'Birch Moisturizing Soothing Gel',
    price: 15.0,
    rating: 4.8,
    reviews: 352,
    image: '/assets/generated/product-moisturizer.png',
    isNew: true,
    category: 'skin',
  },
  {
    id: 'p3',
    brand: 'Maison Verdé',
    name: 'Mugwort Calming Cream',
    price: 38.5,
    rating: 4.7,
    reviews: 342,
    image: '/assets/generated/product-mask.png',
    isNew: true,
    category: 'skin',
  },
  {
    id: 'p4',
    brand: 'Solenne',
    name: 'Body Lotion Lavender Patchouli',
    price: 42.0,
    rating: 4.6,
    reviews: 28,
    image: '/assets/generated/home-feature-lotion.png',
    isNew: true,
    category: 'body',
  },
  {
    id: 'p5',
    brand: 'Harbor & Hearth',
    name: 'Eucalyptus Nourishing Body Cleanser',
    price: 34.0,
    rating: 4.5,
    reviews: 439,
    image: '/assets/generated/product-cleanser.png',
    category: 'body',
  },
  {
    id: 'p6',
    brand: 'Solenne',
    name: 'Nourishing Shea Body Butter',
    price: 26.0,
    rating: 4.7,
    reviews: 34,
    image: '/assets/generated/product-mask.png',
    category: 'body',
  },
  {
    id: 'p7',
    brand: 'Aurelle Lab',
    name: 'Green Tea Deep Cleansing',
    price: 25.0,
    rating: 4.7,
    reviews: 465,
    image: '/assets/generated/product-cleanser.png',
    category: 'skin',
  },
  {
    id: 'p8',
    brand: 'COSRX',
    name: 'Advanced Snail Mucin 96% Power Repairing Essence Serum',
    price: 18.5,
    rating: 4.9,
    reviews: 413,
    image: '/assets/generated/product-serum.png',
    isBestSeller: true,
    category: 'skin',
  },
  {
    id: 'p9',
    brand: 'The Ordinary',
    name: 'Niacinamide 10% + Zinc 1%',
    price: 8.0,
    rating: 4.8,
    reviews: 114,
    image: '/assets/generated/product-serum.png',
    category: 'skin',
  },
  {
    id: 'p10',
    brand: 'Maison Verdé',
    name: 'Volcanic Sea Clay Detox Masque',
    price: 54.0,
    rating: 4.8,
    reviews: 152,
    image: '/assets/generated/product-mask.png',
    category: 'skin',
  },
  {
    id: 'p11',
    brand: 'Solenne',
    name: 'Invisible Fluid Sunscreen SPF 50+ PA++++',
    price: 24.8,
    rating: 4.8,
    reviews: 453,
    image: '/assets/generated/product-sunscreen.png',
    category: 'sun',
  },
  {
    id: 'p12',
    brand: 'COSRX',
    name: 'Advanced Snail 96 Mucin Power Essence',
    price: 26.0,
    rating: 4.8,
    reviews: 842,
    image: '/assets/generated/product-serum.png',
    isBestSeller: true,
    category: 'skin',
  },
  {
    id: 'p13',
    brand: 'Atelier Nocturne',
    name: 'Cedar & Fig Eau de Parfum',
    price: 98.0,
    rating: 4.9,
    reviews: 67,
    image: '/assets/generated/home-brand-interlude.jpg',
    isNew: true,
    category: 'fragrance',
  },
  {
    id: 'p14',
    brand: 'Atelier Nocturne',
    name: 'Soft Linen Hair & Body Mist',
    price: 42.0,
    rating: 4.6,
    reviews: 41,
    image: '/assets/generated/home-composition-sunscreen.jpg',
    category: 'fragrance',
  },
];

export function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

export function findProductByName(name: string) {
  return products.find((p) => p.name === name);
}

export function categoryLabel(category: ProductCategory) {
  const labels: Record<ProductCategory, string> = {
    skin: 'Skincare',
    body: 'Body',
    sun: 'Sun Care',
    fragrance: 'Fragrance',
  };
  return labels[category];
}
