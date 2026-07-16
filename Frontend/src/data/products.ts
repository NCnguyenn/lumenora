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
  category: 'skin' | 'body' | 'sun';
}

export const products: Product[] = [
  {
    id: "p1",
    brand: "GLOWCARE",
    name: "Bamboo Ultra Hydrating Toner",
    price: 45.00,
    rating: 4.8,
    reviews: 310,
    image: "/assets/generated/product-toner.png",
    isNew: true,
    category: 'skin',
  },
  {
    id: "p2",
    brand: "GLOWCARE",
    name: "Birch Moisturizing Soothing Gel",
    price: 15.00,
    rating: 4.8,
    reviews: 352,
    image: "/assets/generated/product-moisturizer.png",
    isNew: true,
    category: 'skin',
  },
  {
    id: "p3",
    brand: "GLOWCARE",
    name: "Mugwort Calming Cream",
    price: 38.50,
    rating: 4.7,
    reviews: 342,
    image: "/assets/generated/product-mask.png",
    isNew: true,
    category: 'skin',
  },
  {
    id: "p4",
    brand: "GLOWCARE",
    name: "Body Lotion Lavender Patchouli",
    price: 42.00,
    rating: 4.6,
    reviews: 28,
    image: "/assets/generated/home-feature-lotion.png",
    isNew: true,
    category: 'body',
  },
  {
    id: "p5",
    brand: "GLOWCARE",
    name: "Eucalyptus Nourishing Body Cleanser",
    price: 34.00,
    rating: 4.5,
    reviews: 439,
    image: "/assets/generated/product-cleanser.png",
    category: 'body',
  },
  {
    id: "p6",
    brand: "GLOWCARE",
    name: "Nourishing Shea Body Butter",
    price: 26.00,
    rating: 4.7,
    reviews: 34,
    image: "/assets/generated/product-mask.png",
    category: 'body',
  },
  {
    id: "p7",
    brand: "GLOWCARE",
    name: "Green Tea Deep Cleansing",
    price: 25.00,
    rating: 4.7,
    reviews: 465,
    image: "/assets/generated/product-cleanser.png",
    category: 'skin',
  },
  {
    id: "p8",
    brand: "GLOWCARE",
    name: "Advanced Snail Mucin 96% Power Repairing Essence Serum",
    price: 18.50,
    rating: 4.9,
    reviews: 413,
    image: "/assets/generated/product-serum.png",
    isBestSeller: true,
    category: 'skin',
  },
  {
    id: "p9",
    brand: "GLOWCARE",
    name: "The Ordinary Niacinamide 10% + Zinc 1%",
    price: 8.00,
    rating: 4.8,
    reviews: 114,
    image: "/assets/generated/product-serum.png",
    category: 'skin',
  },
  {
    id: "p10",
    brand: "GLOWCARE",
    name: "Volcanic Sea Clay Detox Masque",
    price: 54.00,
    rating: 4.8,
    reviews: 152,
    image: "/assets/generated/product-mask.png",
    category: 'skin',
  },
  {
    id: "p11",
    brand: "GLOWCARE",
    name: "Invisible Fluid Sunscreen SPF 50+ PA++++",
    price: 24.80,
    rating: 4.8,
    reviews: 453,
    image: "/assets/generated/product-sunscreen.png",
    category: 'sun',
  },
  {
    id: "p12",
    brand: "COSRX",
    name: "Advanced Snail 96 Mucin Power Essence",
    price: 26.00,
    rating: 4.8,
    reviews: 842,
    image: "/assets/generated/product-serum.png",
    isBestSeller: true,
    category: 'skin',
  }
];
