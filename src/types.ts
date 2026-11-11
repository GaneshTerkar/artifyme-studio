export type Category = "Abstract" | "Portrait" | "Landscape" | "Botanical" | "Photography";
export type Artwork = {
  id: string; title: string; artist: string; category: Category; medium: string; price: number;
  rating: number; reviews: number; image: string; imageAlt: string; ratio: string;
  featured?: boolean; description: string; dimensions: string; year: number;
};
export type SortOption = "popular" | "newest" | "price-low" | "price-high";