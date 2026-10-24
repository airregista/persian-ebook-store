"use client";

import * as React from "react";
import { Header } from "@/components/header";
import { HeroBanner } from "@/components/hero-banner";
import { CategoryNav } from "@/components/category-nav";
import { BookShelf } from "@/components/book-shelf";
import { BookCard } from "@/components/book-card";
import { Footer } from "@/components/footer";
import { MOCK_BOOKS } from "@/lib/mock-books";
import { toPersianDigits } from "@/lib/formatters";
import type { Book } from "@/types/book";
import { Search, X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CATEGORY_NAMES: Record<string, string> = {
  literature: "ادبیات، داستان و رمان",
  society: "روانشناسی، رشد فردی و موفقیت",
  philosophy: "فلسفه، منطق و جامعه‌شناسی",
  art: "مدیریت، طراحی و هنر",
  audio: "کتاب‌های صوتی و پادکست",
};

export default function Home() {
  const [books, setBooks] = React.useState<Book[]>(MOCK_BOOKS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [wishlist, setWishlist] = React.useState<string[]>(["2"]);
  const [purchased, setPurchased] = React.useState<string[]>(["1"]);

  // Fetch updated books from API on mount
  React.useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.books) && data.books.length > 0) {
          setBooks(data.books);
        }
      })
      .catch(() => {
        // Fallback to initial MOCK_BOOKS
      });
  }, []);

  const handleToggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      toast.success(
        exists ? "از علاقه‌مندی‌ها حذف شد" : "به لیست علاقه‌مندی‌ها اضافه شد"
      );
      return next;
    });
  };

  const handleSelectBook = (id: string) => {
    const book = books.find((b) => b.id === id);
    if (book) {
      toast.info(`کتاب «${book.title}» انتخاب شد`, {
        description: "مشاهده جزئیات کامل در گام بعدی (پلان ۰۰۴)",
      });
    }
  };

  const handleQuickAction = (id: string) => {
    if (purchased.includes(id)) {
      toast.info("باز کردن کتابخوان تحت‌وب", {
        description: "مطالعه آنلاین در گام بعدی (پلان ۰۰۵)",
      });
    } else {
      setPurchased((prev) => [...prev, id]);
      toast.success("کتاب به کتابخانه شما افزوده شد");
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
        (b) => b.type === "audio" || (b.duration && b.duration !== "صوتی ندارد")
      );
    }
    return books.filter((b) => b.category === selectedCategory);
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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Universal Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery("")}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery("");
        }}
        wishlistCount={wishlist.length}
        libraryCount={purchased.length}
        onOpenWishlist={() =>
          toast.info(`شما ${toPersianDigits(wishlist.length)} کتاب در لیست علاقه‌مندی دارید`)
        }
        onOpenLibrary={() =>
          toast.info(`شما ${toPersianDigits(purchased.length)} کتاب خریداری‌شده در کتابخانه دارید`)
        }
        onOpenSubscription={() =>
          toast.info("جشنواره اشتراک طلایی کتابگرد - تخفیف ۵۰٪")
        }
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
                    isWishlisted={wishlist.includes(book.id)}
                    isPurchased={purchased.includes(book.id)}
                    onToggleWishlist={handleToggleWishlist}
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
              onOpenSubscription={() =>
                toast.info("اشتراک طلایی کتابگرد با ۸۹٬۰۰۰ تومان")
              }
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
                      isWishlisted={wishlist.includes(book.id)}
                      isPurchased={purchased.includes(book.id)}
                      onToggleWishlist={handleToggleWishlist}
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
                  wishlistIds={wishlist}
                  purchasedIds={purchased}
                  onToggleWishlist={handleToggleWishlist}
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
                  wishlistIds={wishlist}
                  purchasedIds={purchased}
                  onToggleWishlist={handleToggleWishlist}
                  onQuickAction={handleQuickAction}
                />

                {/* Shelf 3: Audiobooks */}
                <BookShelf
                  id="shelf-audio"
                  title="تازه‌ترین کتاب‌های صوتی و روایت‌ها"
                  subtitle="روایت‌شده توسط گویندگان صاحب‌نام و استودیویی"
                  badge="کتاب‌های صوتی"
                  books={audioBooks.length > 0 ? audioBooks : books}
                  variant="audio"
                  onSelectBook={handleSelectBook}
                  wishlistIds={wishlist}
                  purchasedIds={purchased}
                  onToggleWishlist={handleToggleWishlist}
                  onQuickAction={handleQuickAction}
                />

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
                        isWishlisted={wishlist.includes(book.id)}
                        isPurchased={purchased.includes(book.id)}
                        onToggleWishlist={handleToggleWishlist}
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
        onOpenSubscription={() =>
          toast.info("طرح‌های اشتراک بی‌نهایت کتابگرد")
        }
        onOpenLibrary={() =>
          toast.info(`کتابخانه شما: ${toPersianDigits(purchased.length)} کتاب`)
        }
        onOpenWishlist={() =>
          toast.info(`علاقه‌مندی‌های شما: ${toPersianDigits(wishlist.length)} کتاب`)
        }
      />
    </div>
  );
}
