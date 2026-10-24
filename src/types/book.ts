export type BookType = 'ebook' | 'audio' | 'podcast';

export interface Book {
  id: string;
  title: string;
  author: string;
  translator?: string;
  narrator?: string;
  publisher: string;
  category: string;
  categoryName: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  ratingsCount: number;
  cover: string;
  badge?: string;
  isSpecialDeal?: boolean;
  type: BookType;
  duration?: string;
  pages?: number;
  synopsis: string;
  excerpt?: string;
  sampleText: string[];
  slug: string;
}

export interface BookReview {
  id: string;
  user: string;
  rating: number;
  date: string;
  text: string;
  likes: number;
}

export interface Shelf {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  books: Book[];
}
