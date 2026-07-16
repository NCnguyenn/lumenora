export interface Article {
  id: string;
  category: string;
  title: string;
  author: string;
  date: string;
  image: string;
}

export const articles: Article[] = [
  {
    id: "a1",
    category: "TRENDS",
    title: "Why Snail Mucin is the Skincare Ingredient You Can't Ignore",
    author: "EMILY CHEN",
    date: "JUN 25, 2026",
    image: "/assets/generated/blog-editorial-1.png",
  },
  {
    id: "a2",
    category: "ROUTINES",
    title: "The Ultimate Guide to Double Cleansing",
    author: "LUMENORA EDITORIAL",
    date: "JUN 18, 2026",
    image: "/assets/generated/product-cleanser.png",
  },
  {
    id: "a3",
    category: "SUNCARE",
    title: "Sunscreen: Your Ultimate Defense Against Premature Aging",
    author: "DR. MICHAEL ROSS",
    date: "JUN 10, 2026",
    image: "/assets/generated/blog-editorial-2.png",
  },
  {
    id: "a4",
    category: "SKIN HEALTH",
    title: "How to Repair a Damaged Skin Barrier",
    author: "EMILY CHEN",
    date: "JUN 2, 2026",
    image: "/assets/generated/blog-editorial-3.png",
  },
  {
    id: "a5",
    category: "ROUTINES",
    title: "Building a Deep Hydration Routine for Dry Skin",
    author: "LUMENORA EDITORIAL",
    date: "MAY 20, 2026",
    image: "/assets/generated/blog-editorial-4.png",
  },
  {
    id: "a6",
    category: "INGREDIENTS",
    title: "The Detoxifying Benefits of Volcanic Clay",
    author: "DR. SARAH JENKINS",
    date: "MAY 12, 2026",
    image: "/assets/generated/blog-editorial-5.png",
  },
  {
    id: "a7",
    category: "BODYCARE",
    title: "Bodycare: Why Your Routine Shouldn't Stop at Your Neck",
    author: "EMILY CHEN",
    date: "MAY 5, 2026",
    image: "/assets/generated/blog-editorial-6.png",
  }
];
