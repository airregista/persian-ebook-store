"use client";

import * as React from "react";
import { Header } from "@/components/header";
import { HeroBanner } from "@/components/hero-banner";
import { CategoryNav } from "@/components/category-nav";
import { BookShelf } from "@/components/book-shelf";
import { BookCard } from "@/components/book-card";
import { Footer } from "@/components/footer";
import { BookDetailDialog } from "@/components/book-detail-dialog";
import { CheckoutDialog } from "@/components/checkout-dialog";
import { LibraryDialog } from "@/components/library-dialog";
import { SubscriptionDialog } from "@/components/subscription-dialog";
import { useBookStorage } from "@/hooks/use-book-storage";
import { MOCK_BOOKS } from "@/lib/mock-books";
import { toPersianDigits } from "@/lib/formatters";
import type { Book } from "@/types/book";
import { Search, X, BookOpen, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AudioPlayer } from "@/components/player/audio-player";
import { EbookReader } from "@/components/reader/ebook-reader";
import { usePlayer } from "@/context/player-context";

const CATEGORY_NAMES: Record<string, string> = {
  all: "همه دسته‌ها",
  "story-foreign": "داستان و رمان خارجی",
  "story-persian": "داستان و رمان فارسی",
  psychology: "روانشناسی، خودشناسی و رشد فردی",
  management: "مدیریت، بازاریابی و کسب‌وکار",
  philosophy: "فلسفه، اندیشه و منطق",
  history: "تاریخ جهان، ایران و زندگی‌نامه‌ها",
  "social-sciences": "جامعه‌شناسی، اقتصاد و علوم اجتماعی",
  audio: "کتاب‌های صوتی و پادکست",
  literature: "شعر و ادبیات کلاسیک",
  lifestyle: "سبک زندگی، سلامت و تندرستی",
  scientific: "دانش، علوم و فناوری",
  "kid-teen": "کودک و نوجوان",
  freebooks: "کتاب‌های رایگان و همگانی",
};

export default function Home() {
  const [books, setBooks] = React.useState<Book[]>(MOCK_BOOKS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");

  // Local storage management for Wishlist & Purchased Books
  const {
    wishlistIds,
    purchasedIds,
    wishlistCount,
    purchasedCount,
    toggleWishlist,
    purchaseBook,
    isWishlisted,
    isPurchased,
  } = useBookStorage();

  // Dialog States
  const [selectedBook, setSelectedBook] = React.useState<Book | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  const [checkoutBook, setCheckoutBook] = React.useState<Book | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);

  const [isLibraryOpen, setIsLibraryOpen] = React.useState(false);
  const [libraryTab, setLibraryTab] = React.useState<"purchased" | "wishlist">("purchased");

  const [isSubscriptionOpen, setIsSubscriptionOpen] = React.useState(false);

  // Audio Player Context & Reader State
  const { playBook, currentBook } = usePlayer();
  const [readerBook, setReaderBook] = React.useState<Book | null>(null);

  // Fetch updated books from API on mount and when category changes
  React.useEffect(() => {
    const url =
      selectedCategory !== "all"
        ? `/api/books?category=${encodeURIComponent(selectedCategory)}`
        : "/api/books";

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.books) && data.books.length > 0) {
          setBooks(data.books);
        }
      })
      .catch(() => {
        // Fallback to initial MOCK_BOOKS
      });
  }, [selectedCategory]);

  const handleSelectBook = (id: string) => {
    const book = books.find((b) => b.id === id);
    if (book) {
      setSelectedBook(book);
      setIsDetailOpen(true);
    }
  };

  const handleOpenWishlist = () => {
    setLibraryTab("wishlist");
    setIsLibraryOpen(true);
  };

  const handleOpenLibrary = () => {
    setLibraryTab("purchased");
    setIsLibraryOpen(true);
  };

  const handlePurchaseBook = (book: Book) => {
    purchaseBook(book.id);
    setIsDetailOpen(false);
    setCheckoutBook(book);
    setIsCheckoutOpen(true);
  };

  const handleOpenReader = (book: Book) => {
    // Auto-close open dialogs when reader opens
    setIsDetailOpen(false);
    setIsLibraryOpen(false);
    setIsCheckoutOpen(false);

    const isAudio = book.type === "audio" || (book.duration && book.duration !== "صوتی ندارد");
    if (isAudio) {
      playBook(book);
      toast.success(`پخش کتاب صوتی «${book.title}» آغاز شد`);
    } else {
      setReaderBook(book);
    }
  };

  const handleQuickAction = (id: string) => {
    const book = books.find((b) => b.id === id);
    if (!book) return;
    const isAudio = book.type === "audio" || (book.duration && book.duration !== "صوتی ندارد");
    if (isPurchased(id)) {
      handleOpenReader(book);
    } else if (isAudio) {
      playBook(book);
      toast.info(`پخش نمونه صوتی «${book.title}»`);
    } else {
      handlePurchaseBook(book);
    }
  };

  const handleScrollToShelf = (shelfId: string) => {
    setSelectedCategory("all");
    setTimeout(() => {
      const el = document.getElementById(shelfId);
      el?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  // Search results
  const searchResults = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.translator && b.translator.toLowerCase().includes(q)) ||
        (b.narrator && b.narrator.toLowerCase().includes(q)) ||
        b.publisher.toLowerCase().includes(q) ||
        b.categoryName.toLowerCase().includes(q)
    );
  }, [books, searchQuery]);

  // Filtered books by category
  const categoryBooks = React.useMemo(() => {
    if (selectedCategory === "all") return books;
    if (selectedCategory === "audio") {
      return books.filter(
        (b) => b.type === "audio" || b.category === "audio" || (b.duration && b.duration !== "صوتی ندارد")
      );
    }
    if (selectedCategory === "deals") {
      return books.filter((b) => b.isSpecialDeal || b.discountPercent >= 40);
    }
    return books.filter(
      (b) => b.category === selectedCategory || b.categoryName === selectedCategory
    );
  }, [books, selectedCategory]);

  // Shelf data
  const bestsellers = React.useMemo(
    () => books.filter((b) => b.badge?.includes("پرفروش") || b.rating >= 4.7),
    [books]
  );

  const specialDeals = React.useMemo(
    () => books.filter((b) => b.isSpecialDeal || b.discountPercent > 0),
    [books]
  );

  const audioBooks = React.useMemo(
    () =>
      books.filter(
        (b) => b.type === "audio" || (b.duration && b.duration !== "صوتی ندارد")
      ),
    [books]
  );

  const isSearchActive = searchQuery.trim().length > 0;

  return (
    <div
      className={`min-h-screen flex flex-col bg-background text-foreground ${
        currentBook ? "pb-24" : ""
      }`}
    >
      {/* Universal Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery("")}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery("");
        }}
        wishlistCount={wishlistCount}
        libraryCount={purchasedCount}
        onOpenWishlist={handleOpenWishlist}
        onOpenLibrary={handleOpenLibrary}
        onOpenSubscription={() => setIsSubscriptionOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-10">
        {/* ACTIVE SEARCH MODE */}
        {isSearchActive ? (
          <section className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  <span>نتایج جستجو برای: «{searchQuery}»</span>
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  نمایش {toPersianDigits(searchResults.length)} عنوان کتاب مرتبط
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="text-xs gap-1.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>پاک کردن جستجو</span>
              </Button>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5">
                {searchResults.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    variant="standard"
                    onSelectBook={handleSelectBook}
                    isWishlisted={isWishlisted(book.id)}
                    isPurchased={isPurchased(book.id)}
                    onToggleWishlist={toggleWishlist}
                    onQuickAction={handleQuickAction}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 bg-muted/40 rounded-3xl border border-dashed border-border p-8">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  کتابی با این مشخصات یافت نشد
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm">
                  عنوان کتاب، نام نویسنده یا ناشر را بررسی کنید یا عبارت دیگری را جستجو نمایید.
                </p>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="text-xs mt-2"
                >
                  بازگشت به همه کتاب‌ها
                </Button>
              </div>
            )}
          </section>
        ) : (
          /* NORMAL STOREFRONT MODE */
          <div className="space-y-12">
            {/* Hero Promotional Banner */}
            <HeroBanner
              featuredBook={books[0]}
              secondaryFeaturedBook={books[1]}
              onSelectBook={handleSelectBook}
              onOpenSubscription={() => setIsSubscriptionOpen(true)}
            />

            {/* Category Navigation Bar */}
            <CategoryNav
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onScrollToShelf={handleScrollToShelf}
            />

            {/* If a single category is selected */}
            {selectedCategory !== "all" ? (
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-foreground">
                      {CATEGORY_NAMES[selectedCategory] ?? selectedCategory}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      نمایش {toPersianDigits(categoryBooks.length)} عنوان در این دسته‌بندی
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCategory("all")}
                    className="text-xs text-primary hover:text-primary-hover"
                  >
                    نمایش همه دسته‌ها
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5">
                  {categoryBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      variant="standard"
                      onSelectBook={handleSelectBook}
                      isWishlisted={isWishlisted(book.id)}
                      isPurchased={isPurchased(book.id)}
                      onToggleWishlist={toggleWishlist}
                      onQuickAction={handleQuickAction}
                    />
                  ))}
                </div>
              </section>
            ) : (
              /* All Shelves */
              <>
                {/* Shelf 1: Bestsellers */}
                <BookShelf
                  id="shelf-bestsellers"
                  title="پرفروش‌ترین کتاب‌های هفته"
                  subtitle="محبوب‌ترین آثار این هفته در کتابگرد"
                  badge="محبوب‌ترین‌ها"
                  books={bestsellers.length > 0 ? bestsellers : books}
                  variant="default"
                  onSelectBook={handleSelectBook}
                  wishlistIds={wishlistIds}
                  purchasedIds={purchasedIds}
                  onToggleWishlist={toggleWishlist}
                  onQuickAction={handleQuickAction}
                />

                {/* Shelf 2: Special Deals */}
                <BookShelf
                  id="shelf-deals"
                  title="پیشنهاد شگفت‌انگیز کتابگرد"
                  subtitle="تخفیف‌های استثنایی تا پایان امشب؛ همین حالا بخوانید"
                  badge="تخفیف ویژه"
                  books={specialDeals.length > 0 ? specialDeals : books}
                  variant="deals"
                  onSelectBook={handleSelectBook}
                  wishlistIds={wishlistIds}
                  purchasedIds={purchasedIds}
                  onToggleWishlist={toggleWishlist}
                  onQuickAction={handleQuickAction}
                />

                {/* Shelf 3: Audiobooks */}
                <div className="space-y-4">
                  {audioBooks.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-l from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                          <Headphones className="w-5 h-5" />
                        </div>
                        <div className="text-right">
                          <h3 className="text-sm font-bold text-foreground">
                            نمونه‌خوان صوتی کتابگرد
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            پیش از خرید، بخش‌هایی از برترین کتاب‌های صوتی را با صدای گویندگان صاحب‌نام بشنوید.
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          playBook(audioBooks[0]);
                          toast.info(`در حال پخش نمونه صوتی «${audioBooks[0].title}»`);
                        }}
                        className="gap-2 text-xs font-bold border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 cursor-pointer shrink-0"
                      >
                        <Headphones className="w-4 h-4" />
                        <span>شنیدن نمونه صوتی ({audioBooks[0].title})</span>
                      </Button>
                    </div>
                  )}

                  <BookShelf
                    id="shelf-audio"
                    title="تازه‌ترین کتاب‌های صوتی و روایت‌ها"
                    subtitle="روایت‌شده توسط گویندگان صاحب‌نام و استودیویی"
                    badge="کتاب‌های صوتی"
                    books={audioBooks.length > 0 ? audioBooks : books}
                    variant="audio"
                    onSelectBook={handleSelectBook}
                    wishlistIds={wishlistIds}
                    purchasedIds={purchasedIds}
                    onToggleWishlist={toggleWishlist}
                    onQuickAction={handleQuickAction}
                  />
                </div>

                {/* Shelf 4: All Catalog Grid */}
                <section className="space-y-4 pt-4 border-t border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-4">
                    <div>
                      <h2 className="text-xl font-extrabold text-foreground">
                        ویترین جامع کتاب‌های دیجیتال
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        فرمت ePub بدون قفل مزاحم + مطالعه آنلاین در مرورگر
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      نمایش{" "}
                      <span className="font-bold text-primary">
                        {toPersianDigits(books.length)}
                      </span>{" "}
                      عنوان اثر
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5">
                    {books.map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        variant="standard"
                        onSelectBook={handleSelectBook}
                        isWishlisted={isWishlisted(book.id)}
                        isPurchased={isPurchased(book.id)}
                        onToggleWishlist={toggleWishlist}
                        onQuickAction={handleQuickAction}
                      />
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        )}
      </main>

      {/* Universal Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery("");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onScrollToShelf={handleScrollToShelf}
        onOpenSubscription={() => setIsSubscriptionOpen(true)}
        onOpenLibrary={handleOpenLibrary}
        onOpenWishlist={handleOpenWishlist}
      />

      {/* Book Details Dialog */}
      <BookDetailDialog
        book={selectedBook}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        isWishlisted={selectedBook ? isWishlisted(selectedBook.id) : false}
        isPurchased={selectedBook ? isPurchased(selectedBook.id) : false}
        onToggleWishlist={toggleWishlist}
        onPurchase={handlePurchaseBook}
        onOpenReader={handleOpenReader}
        allBooks={books}
        onSelectBook={handleSelectBook}
      />

      {/* Checkout Celebration Dialog */}
      <CheckoutDialog
        book={checkoutBook}
        open={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        onOpenReader={handleOpenReader}
      />

      {/* My Library & Wishlist Dialog */}
      <LibraryDialog
        open={isLibraryOpen}
        onOpenChange={setIsLibraryOpen}
        activeTab={libraryTab}
        onTabChange={setLibraryTab}
        allBooks={books}
        purchasedIds={purchasedIds}
        wishlistIds={wishlistIds}
        onSelectBook={handleSelectBook}
        onOpenReader={handleOpenReader}
        onPurchaseBook={handlePurchaseBook}
        onRemoveWishlist={toggleWishlist}
      />

      {/* Subscription Plans Dialog */}
      <SubscriptionDialog
        open={isSubscriptionOpen}
        onOpenChange={setIsSubscriptionOpen}
      />

      {/* Docked Audio Player */}
      <AudioPlayer />

      {/* Fullscreen Interactive E-book Reader */}
      {readerBook && (
        <EbookReader
          book={readerBook}
          onClose={() => setReaderBook(null)}
        />
      )}
    </div>
  );
}
