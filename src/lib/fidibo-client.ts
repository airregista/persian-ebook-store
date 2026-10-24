import type { Book, BookReview } from '@/types/book';
import { MOCK_BOOKS, MOCK_SHELVES, getMockBookReviews } from '@/lib/mock-books';

const FIDIBO_API_BASE = process.env.FIDIBO_API_BASE || 'https://api.fidibo.com';
const TIMEOUT_MS = 5000;

/**
 * Fetch helper with strict timeout for external Fidibo API.
 */
async function fetchFidiboWithTimeout(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const url = endpoint.startsWith('http') ? endpoint : `${FIDIBO_API_BASE}${endpoint}`;
    // ponytail: standard fetch + AbortSignal; swap with retry-enabled fetch if network flakiness requires it
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'FidiboProxy/1.0',
        ...(options.headers || {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

interface FidiboNamedEntity {
  id?: string | number;
  name?: string;
  title?: string;
}

interface RawFidiboBook {
  id?: string | number;
  title?: string;
  subtitle?: string;
  author?: string;
  authors?: Array<FidiboNamedEntity | string>;
  translator?: string;
  translators?: Array<FidiboNamedEntity | string>;
  narrator?: string;
  narrators?: Array<FidiboNamedEntity | string>;
  publisher?: string | { title?: string; name?: string };
  category?: string | { slug?: string; title?: string };
  categoryName?: string;
  price?: number;
  originalPrice?: number;
  campaign?: { discounted_price?: number };
  discount_price?: number;
  discount_percent?: number;
  rate?: { score?: number; count?: number };
  rating?: number;
  ratings_count?: number;
  cover?: string | { image?: string };
  image?: string;
  content_type?: string;
  type?: string;
  duration?: string;
  pages?: number;
  pages_count?: number;
  description?: string;
  synopsis?: string;
  summary?: string;
  excerpt?: string;
  sample_text?: string[];
  sampleText?: string[];
  slug?: string;
  badge?: string;
  isSpecialDeal?: boolean;
}

interface RawFidiboReview {
  id?: string | number;
  user?: string | { name?: string };
  username?: string;
  rate?: number;
  rating?: number;
  date?: string;
  created_at?: string;
  comment?: string;
  text?: string;
  body?: string;
  likes?: number;
  like_count?: number;
}

function extractNames(entities?: Array<FidiboNamedEntity | string> | string): string | undefined {
  if (!entities) return undefined;
  if (typeof entities === 'string') return entities;
  if (Array.isArray(entities)) {
    const names = entities
      .map((e) => (typeof e === 'string' ? e : e?.name || e?.title))
      .filter((n): n is string => Boolean(n));
    return names.length > 0 ? names.join('، ') : undefined;
  }
  return undefined;
}

/**
 * Maps raw Fidibo payload to strongly-typed Book entity.
 */
function mapFidiboBook(raw: RawFidiboBook): Book {
  const id = String(raw.id ?? '');
  const title = String(raw.title ?? 'بدون عنوان');

  const author =
    raw.subtitle ||
    extractNames(raw.authors) ||
    raw.author ||
    'نویسنده نامشخص';

  const translator = extractNames(raw.translators) || raw.translator;
  const narrator = extractNames(raw.narrators) || raw.narrator;

  const publisher =
    (typeof raw.publisher === 'object' ? raw.publisher?.title || raw.publisher?.name : raw.publisher) ||
    'ناشر نامشخص';

  const category =
    typeof raw.category === 'object'
      ? raw.category?.slug || 'general'
      : raw.category || 'general';

  const categoryName =
    typeof raw.category === 'object'
      ? raw.category?.title || 'عمومی'
      : raw.categoryName || 'عمومی';

  const originalPrice = Number(raw.price ?? 0);
  const discountedPrice = Number(raw.campaign?.discounted_price ?? raw.discount_price ?? originalPrice);
  const price = discountedPrice > 0 ? discountedPrice : originalPrice;

  const discountPercent =
    originalPrice > 0 && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : Number(raw.discount_percent ?? 0);

  const rating = Number(raw.rate?.score ?? raw.rating ?? 4.5);
  const ratingsCount = Number(raw.rate?.count ?? raw.ratings_count ?? 100);

  const cover =
    (typeof raw.cover === 'object' ? raw.cover?.image : raw.cover) ||
    raw.image ||
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';

  const contentType = String(raw.content_type || raw.type || '').toLowerCase();
  const type: Book['type'] =
    contentType.includes('audio') || contentType.includes('صوتی')
      ? 'audio'
      : contentType.includes('podcast') || contentType.includes('پادکست')
      ? 'podcast'
      : 'ebook';

  const duration = raw.duration || undefined;
  const pages = Number(raw.pages ?? raw.pages_count) || undefined;
  const synopsis = raw.description || raw.synopsis || raw.summary || '';
  const excerpt = raw.excerpt || undefined;
  const sampleText = Array.isArray(raw.sample_text)
    ? raw.sample_text
    : Array.isArray(raw.sampleText)
    ? raw.sampleText
    : [synopsis || excerpt || 'نمونه متنی برای این اثر ثبت نشده است.'];
  const slug = raw.slug || `book-${id}`;

  return {
    id,
    title,
    author,
    translator,
    narrator,
    publisher,
    category,
    categoryName,
    price,
    originalPrice,
    discountPercent,
    rating,
    ratingsCount,
    cover,
    badge: raw.badge || undefined,
    isSpecialDeal: Boolean(raw.isSpecialDeal ?? discountPercent > 0),
    type,
    duration,
    pages,
    synopsis,
    excerpt,
    sampleText,
    slug,
  };
}

/**
 * Maps raw review payload to BookReview.
 */
function mapFidiboReview(raw: RawFidiboReview, index: number): BookReview {
  const user =
    typeof raw.user === 'object'
      ? raw.user?.name || 'کاربر فیدیبو'
      : raw.user || raw.username || 'کاربر فیدیبو';

  return {
    id: String(raw.id ?? `rev-${index}`),
    user,
    rating: Number(raw.rate ?? raw.rating ?? 5),
    date: raw.date || raw.created_at || '۱۴۰۳/۰۸/۰۱',
    text: raw.comment || raw.text || raw.body || '',
    likes: Number(raw.likes ?? raw.like_count ?? 0),
  };
}

/**
 * Searches Fidibo API with graceful fallback to MOCK_BOOKS.
 */
export async function searchFidibo(query: string, kind?: string): Promise<Book[]> {
  const normalizedQuery = (query || '').trim().toLowerCase();

  try {
    const res = await fetchFidiboWithTimeout(
      `/v1/search?q=${encodeURIComponent(normalizedQuery)}${kind ? `&kind=${encodeURIComponent(kind)}` : ''}`
    );

    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.books || data?.items || data?.data;
      if (Array.isArray(list) && list.length > 0) {
        return list.map(mapFidiboBook);
      }
    }
  } catch {
    // Network or timeout failure gracefully falls back to mock data
  }

  return MOCK_BOOKS.filter((book) => {
    const matchesQuery =
      !normalizedQuery ||
      book.title.toLowerCase().includes(normalizedQuery) ||
      book.author.toLowerCase().includes(normalizedQuery) ||
      (book.translator && book.translator.toLowerCase().includes(normalizedQuery)) ||
      book.publisher.toLowerCase().includes(normalizedQuery) ||
      book.synopsis.toLowerCase().includes(normalizedQuery) ||
      book.categoryName.toLowerCase().includes(normalizedQuery);

    const matchesKind = !kind || book.type === kind;
    return matchesQuery && matchesKind;
  });
}

/**
 * Gets details of a specific book by id or slug with fallback to MOCK_BOOKS.
 */
export async function getFidiboBookDetails(
  id: string | number
): Promise<{ book: Book; reviews: BookReview[] } | null> {
  const idStr = String(id);

  try {
    const res = await fetchFidiboWithTimeout(`/v1/books/${encodeURIComponent(idStr)}`);
    if (res.ok) {
      const data = await res.json();
      const rawBook = data.book || data.data || data;
      if (rawBook && (rawBook.id || rawBook.title)) {
        const book = mapFidiboBook(rawBook);
        const rawReviews = data.reviews || rawBook.reviews || [];
        const reviews = Array.isArray(rawReviews)
          ? rawReviews.map(mapFidiboReview)
          : getMockBookReviews(book.id);
        return { book, reviews };
      }
    }
  } catch {
    // Network failure gracefully falls back to mock data
  }

  const book = MOCK_BOOKS.find((b) => b.id === idStr || b.slug === idStr);
  if (!book) return null;

  return {
    book,
    reviews: getMockBookReviews(book.id),
  };
}

/**
 * Gets a collection of books by shelf or category with fallback to MOCK_BOOKS.
 */
export async function getFidiboBooks(shelf?: string, category?: string): Promise<Book[]> {
  try {
    const params = new URLSearchParams();
    if (shelf) params.append('shelf', shelf);
    if (category) params.append('category', category);

    const endpoint = `/v1/books${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetchFidiboWithTimeout(endpoint);

    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.books || data?.items || data?.data;
      if (Array.isArray(list) && list.length > 0) {
        return list.map(mapFidiboBook);
      }
    }
  } catch {
    // Network failure gracefully falls back to mock data
  }

  // Shelf-specific mock matching
  if (shelf) {
    const foundShelf = MOCK_SHELVES.find((s) => s.id === shelf);
    if (foundShelf) return foundShelf.books;

    if (shelf === 'special-deals') return MOCK_BOOKS.filter((b) => b.isSpecialDeal);
    if (shelf === 'audio-books') return MOCK_BOOKS.filter((b) => b.type === 'audio');
    if (shelf === 'best-sellers') return [MOCK_BOOKS[0], MOCK_BOOKS[1], MOCK_BOOKS[4], MOCK_BOOKS[7]];
  }

  // Category-specific mock matching
  if (category) {
    const filtered = MOCK_BOOKS.filter(
      (b) => b.category.toLowerCase() === category.toLowerCase() || b.categoryName === category
    );
    if (filtered.length > 0) return filtered;
  }

  return MOCK_BOOKS;
}
