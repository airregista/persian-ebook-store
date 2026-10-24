"use client";

import * as React from "react";
import {
  Star,
  Heart,
  BookOpen,
  Headphones,
  Building2,
  Calendar,
  Languages,
  FileText,
  Barcode,
  ThumbsUp,
  Quote,
  Clock,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatToman, toPersianDigits } from "@/lib/formatters";
import { getMockBookReviews, MOCK_BOOKS } from "@/lib/mock-books";
import type { Book, BookReview } from "@/types/book";
import { cn } from "cn";

export interface BookDetailDialogProps {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isWishlisted?: boolean;
  isPurchased?: boolean;
  onToggleWishlist?: (bookId: string) => void;
  onPurchase?: (book: Book) => void;
  onOpenReader?: (book: Book) => void;
  allBooks?: Book[];
  onSelectBook?: (bookId: string) => void;
}

export function BookDetailDialog({
  book,
  open,
  onOpenChange,
  isWishlisted = false,
  isPurchased = false,
  onToggleWishlist,
  onPurchase,
  onOpenReader,
  allBooks = MOCK_BOOKS,
  onSelectBook,
}: BookDetailDialogProps) {
  const [failedCoverId, setFailedCoverId] = React.useState<string | null>(null);
  const [likedReviews, setLikedReviews] = React.useState<Record<string, boolean>>({});

  if (!book) return null;

  const isImgError = failedCoverId === book.id;
  const isAudio = book.type === "audio" || (book.duration && book.duration !== "صوتی ندارد");
  const reviews: BookReview[] = getMockBookReviews(book.id);

  // Similar books from same category excluding current book
  const similarBooks = allBooks
    .filter((b) => b.id !== book.id && (b.category === book.category || b.type === book.type))
    .slice(0, 3);

  const toggleReviewLike = (reviewId: string) => {
    setLikedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 border-border bg-card">
        {/* Scrollable Dialog Body */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6 flex-1 text-right">
          {/* Header Section */}
          <DialogHeader className="gap-4 text-right">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              {/* Cover Image */}
              <div className="relative w-32 sm:w-36 aspect-[3/4] rounded-xl overflow-hidden bg-muted shadow-md shrink-0 self-center sm:self-start">
                {!isImgError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={book.id}
                    src={book.cover}
                    alt={book.title}
                    onError={() => setFailedCoverId(book.id)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center text-muted-foreground bg-muted">
                    <BookOpen className="w-8 h-8 text-primary/70 mb-2" />
                    <span className="text-xs line-clamp-2">{book.title}</span>
                  </div>
                )}
                {book.badge && (
                  <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    {book.badge}
                  </span>
                )}
              </div>

              {/* Header Info */}
              <div className="flex-1 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs font-bold">
                    {book.categoryName}
                  </Badge>
                  {isAudio ? (
                    <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400 gap-1 text-xs">
                      <Headphones className="w-3 h-3" />
                      <span>کتاب صوتی</span>
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-primary/40 text-primary gap-1 text-xs">
                      <BookOpen className="w-3 h-3" />
                      <span>کتاب الکترونیک</span>
                    </Badge>
                  )}
                  {book.isSpecialDeal && (
                    <Badge variant="destructive" className="text-xs font-black">
                      تخفیف ویژه {toPersianDigits(book.discountPercent)}٪
                    </Badge>
                  )}
                </div>

                <DialogTitle className="text-xl sm:text-2xl font-black text-foreground leading-tight">
                  {book.title}
                </DialogTitle>

                <DialogDescription className="text-sm text-muted-foreground space-y-1">
                  <div>
                    پدیدآور: <span className="font-semibold text-foreground">{book.author}</span>
                  </div>
                  {book.translator && (
                    <div>
                      مترجم: <span className="font-semibold text-foreground">{book.translator}</span>
                    </div>
                  )}
                  {book.narrator && (
                    <div>
                      راوی: <span className="font-semibold text-foreground">{book.narrator}</span>
                    </div>
                  )}
                  <div>
                    ناشر: <span className="font-semibold text-foreground">{book.publisher}</span>
                  </div>
                </DialogDescription>

                {/* Rating & Score Distribution */}
                <div className="flex items-center gap-4 pt-1">
                  <div className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1 rounded-lg text-amber-600 dark:text-amber-400 font-bold text-sm">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>{toPersianDigits(book.rating.toFixed(1))}</span>
                    <span className="text-xs font-normal text-muted-foreground">از ۵</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({toPersianDigits(book.ratingsCount)} نظر ثبت‌شده)
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Tabs Section */}
          <Tabs defaultValue="about" className="w-full mt-4">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto gap-4">
              <TabsTrigger
                value="about"
                className="rounded-none border-b-2 border-transparent data-[active]:border-primary data-[active]:text-primary pb-2.5 pt-1 px-3 text-sm font-bold bg-transparent shadow-none"
              >
                درباره کتاب
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[active]:border-primary data-[active]:text-primary pb-2.5 pt-1 px-3 text-sm font-bold bg-transparent shadow-none"
              >
                نظرات کاربران ({toPersianDigits(reviews.length)})
              </TabsTrigger>
              <TabsTrigger
                value="similar"
                className="rounded-none border-b-2 border-transparent data-[active]:border-primary data-[active]:text-primary pb-2.5 pt-1 px-3 text-sm font-bold bg-transparent shadow-none"
              >
                کتاب‌های مشابه ({toPersianDigits(similarBooks.length)})
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: About Book */}
            <TabsContent value="about" className="space-y-5 pt-4">
              {/* Excerpt Blockquote */}
              {book.excerpt && (
                <div className="relative bg-muted/60 border-r-4 border-primary p-4 rounded-xl text-foreground text-sm italic leading-relaxed">
                  <Quote className="w-5 h-5 text-primary/40 mb-1 inline-block -rotate-180" />
                  <p className="inline mr-1">{book.excerpt}</p>
                </div>
              )}

              {/* Synopsis */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-foreground">خلاصه و معرفی کتاب:</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-justify">
                  {book.synopsis}
                </p>
              </div>

              {/* Sample Paragraphs if available */}
              {book.sampleText && book.sampleText.length > 0 && (
                <div className="space-y-2 bg-card border border-border/80 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>برش کوتاهی از متن کتاب:</span>
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    «{book.sampleText[0]}»
                  </p>
                </div>
              )}

              {/* Specs Table */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-foreground">مشخصات اثر:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50 border border-border/50">
                    <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div>
                      <span className="text-muted-foreground block text-[11px]">ناشر</span>
                      <span className="font-semibold text-foreground">{book.publisher}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50 border border-border/50">
                    <Languages className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div>
                      <span className="text-muted-foreground block text-[11px]">زبان</span>
                      <span className="font-semibold text-foreground">فارسی</span>
                    </div>
                  </div>

                  {book.pages ? (
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50 border border-border/50">
                      <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div>
                        <span className="text-muted-foreground block text-[11px]">تعداد صفحات</span>
                        <span className="font-semibold text-foreground">{toPersianDigits(book.pages)} صفحه</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50 border border-border/50">
                      <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div>
                        <span className="text-muted-foreground block text-[11px]">مدت زمان روایت</span>
                        <span className="font-semibold text-foreground">{book.duration ?? "نامشخص"}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50 border border-border/50">
                    <Barcode className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div>
                      <span className="text-muted-foreground block text-[11px]">شابک (ISBN)</span>
                      <span className="font-mono text-foreground font-semibold">
                        ۹۷۸-۶۰۰-{toPersianDigits(book.id.padStart(4, "0"))}-۱
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50 border border-border/50">
                    <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div>
                      <span className="text-muted-foreground block text-[11px]">فرمت عرضه</span>
                      <span className="font-semibold text-foreground">
                        {isAudio ? "فایل صوتی استودیویی (MP3)" : "متنی دیجیتال استاندارد (EPUB)"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: User Reviews */}
            <TabsContent value="reviews" className="space-y-4 pt-4">
              {reviews.length > 0 ? (
                <div className="space-y-3">
                  {reviews.map((rev) => {
                    const isLiked = !!likedReviews[rev.id];
                    const likesCount = rev.likes + (isLiked ? 1 : 0);
                    return (
                      <div
                        key={rev.id}
                        className="p-4 rounded-xl bg-card border border-border space-y-2 text-right transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                              {rev.user.charAt(0)}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-foreground">{rev.user}</div>
                              <div className="text-[10px] text-muted-foreground">{rev.date}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-amber-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "w-3 h-3",
                                  i < rev.rating
                                    ? "fill-amber-500 text-amber-500"
                                    : "text-muted-foreground/30"
                                )}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                          {rev.text}
                        </p>

                        <div className="flex items-center justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => toggleReviewLike(rev.id)}
                            className={cn(
                              "inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer",
                              isLiked
                                ? "bg-primary/10 border-primary text-primary font-semibold"
                                : "hover:bg-muted text-muted-foreground border-border"
                            )}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{toPersianDigits(likesCount)}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 bg-muted/30 rounded-2xl border border-dashed border-border p-6 space-y-2">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    هنوز نظری برای این کتاب ثبت نشده است. پس از مطالعه، دیدگاه ارزشمند خود را بنویسید.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* TAB 3: Similar Books */}
            <TabsContent value="similar" className="pt-4">
              {similarBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {similarBooks.map((sim) => (
                    <div
                      key={sim.id}
                      onClick={() => onSelectBook?.(sim.id)}
                      className="group flex sm:flex-col items-center sm:items-start gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/50 transition-all cursor-pointer text-right"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sim.cover}
                        alt={sim.title}
                        className="w-14 sm:w-full aspect-[3/4] object-cover rounded-lg bg-muted"
                      />
                      <div className="flex-1 space-y-1 min-w-0">
                        <span className="text-[10px] text-muted-foreground block truncate">
                          {sim.categoryName}
                        </span>
                        <h5 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {sim.title}
                        </h5>
                        <p className="text-[11px] text-muted-foreground truncate">{sim.author}</p>
                        <div className="text-xs font-black text-foreground pt-1">
                          {formatToman(sim.price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-6">
                  کتاب مشابه دیگری در این دسته‌بندی یافت نشد.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-5 border-t border-border bg-muted/40 flex items-center justify-between gap-3">
          {/* Wishlist Toggle Button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => onToggleWishlist?.(book.id)}
            className={cn(
              "gap-2 text-xs font-semibold cursor-pointer transition-colors",
              isWishlisted
                ? "text-red-500 border-red-200 dark:border-red-950 bg-red-500/10 hover:bg-red-500/20"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Heart
              className={cn("w-4 h-4", isWishlisted && "fill-current text-red-500")}
            />
            <span className="hidden sm:inline">
              {isWishlisted ? "نشان‌شده در علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
            </span>
          </Button>

          {/* Main Action Button */}
          {isPurchased ? (
            <Button
              type="button"
              onClick={() => onOpenReader?.(book)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 text-xs sm:text-sm px-5 py-2.5 shadow-sm cursor-pointer"
            >
              {isAudio ? (
                <>
                  <Headphones className="w-4 h-4" />
                  <span>شنیدن کتاب صوتی</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  <span>مطالعه کتاب</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => onPurchase?.(book)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold gap-2 text-xs sm:text-sm px-5 py-2.5 shadow-sm cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>خرید این کتاب - {formatToman(book.price)}</span>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
