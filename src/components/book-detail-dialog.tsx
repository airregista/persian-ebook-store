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
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
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

  const handleOpenReader = () => {
    onOpenChange(false);
    onOpenReader?.(book);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 border-border bg-card"
      >
        {/* Top-left Close Button avoiding RTL badge overlap */}
        <DialogClose
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute top-3 left-3 z-20 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="بستن پنجره"
            />
          }
        >
          <X className="w-4 h-4" />
        </DialogClose>

        {/* Scrollable Dialog Body */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-5 flex-1 text-right">
          {/* Header Section */}
          <DialogHeader className="gap-4 text-right">
            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
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
                  <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                    {book.badge}
                  </Badge>
                )}
              </div>

              {/* Header Info */}
              <div className="flex-1 space-y-2.5 w-full text-right">
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

                <DialogTitle className="text-xl sm:text-2xl font-black text-foreground leading-snug">
                  {book.title}
                </DialogTitle>

                {/* DialogDescription with simple text only to prevent <p><div> hydration errors */}
                <DialogDescription className="text-xs text-muted-foreground">
                  مشخصات، جزئیات و نظرات کتاب {book.title}
                </DialogDescription>

                {/* Metadata Details in separate div */}
                <div className="space-y-1 text-xs sm:text-sm text-muted-foreground pt-1">
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
                </div>

                {/* Rating & Score Distribution */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-lg text-amber-600 dark:text-amber-400 font-bold text-xs sm:text-sm">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>{toPersianDigits(book.rating.toFixed(1))}</span>
                    <span className="text-[11px] font-normal text-muted-foreground">از ۵</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({toPersianDigits(book.ratingsCount)} نظر ثبت‌شده)
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>

          <Separator className="my-1 sm:my-2" />

          {/* Tabs Section */}
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex bg-muted/80 p-1 rounded-xl h-auto">
              <TabsTrigger
                value="about"
                className="py-1.5 px-3 text-xs sm:text-sm font-semibold rounded-lg"
              >
                درباره کتاب
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="py-1.5 px-3 text-xs sm:text-sm font-semibold rounded-lg"
              >
                نظرات ({toPersianDigits(reviews.length)})
              </TabsTrigger>
              <TabsTrigger
                value="similar"
                className="py-1.5 px-3 text-xs sm:text-sm font-semibold rounded-lg"
              >
                کتاب‌های مشابه ({toPersianDigits(similarBooks.length)})
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: About Book */}
            <TabsContent value="about" className="space-y-5 pt-3">
              {/* Excerpt Blockquote in Card */}
              {book.excerpt && (
                <Card className="relative bg-muted/50 border-r-4 border-r-primary border-y-0 border-l-0 rounded-xl p-4 text-foreground text-xs sm:text-sm italic leading-relaxed">
                  <div className="flex items-start gap-2">
                    <Quote className="w-4 h-4 text-primary shrink-0 -rotate-180 mt-0.5" />
                    <p>{book.excerpt}</p>
                  </div>
                </Card>
              )}

              {/* Synopsis */}
              <div className="space-y-2">
                <h4 className="text-xs sm:text-sm font-bold text-foreground">خلاصه و معرفی کتاب:</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-justify">
                  {book.synopsis}
                </p>
              </div>

              {/* Sample Paragraphs if available */}
              {book.sampleText && book.sampleText.length > 0 && (
                <Card className="p-4 bg-card border border-border/80 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>برش کوتاهی از متن کتاب:</span>
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    «{book.sampleText[0]}»
                  </p>
                </Card>
              )}

              {/* Specs Table */}
              <div className="space-y-2.5">
                <h4 className="text-xs sm:text-sm font-bold text-foreground">مشخصات اثر:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <Card className="p-3 bg-muted/40 border-border/60 flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <span className="text-muted-foreground block text-[11px]">ناشر</span>
                      <span className="font-semibold text-foreground truncate block">{book.publisher}</span>
                    </div>
                  </Card>

                  <Card className="p-3 bg-muted/40 border-border/60 flex items-center gap-2.5">
                    <Languages className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <span className="text-muted-foreground block text-[11px]">زبان</span>
                      <span className="font-semibold text-foreground">فارسی</span>
                    </div>
                  </Card>

                  {book.pages ? (
                    <Card className="p-3 bg-muted/40 border-border/60 flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <span className="text-muted-foreground block text-[11px]">تعداد صفحات</span>
                        <span className="font-semibold text-foreground">{toPersianDigits(book.pages)} صفحه</span>
                      </div>
                    </Card>
                  ) : (
                    <Card className="p-3 bg-muted/40 border-border/60 flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <span className="text-muted-foreground block text-[11px]">مدت زمان روایت</span>
                        <span className="font-semibold text-foreground">{book.duration ?? "نامشخص"}</span>
                      </div>
                    </Card>
                  )}

                  <Card className="p-3 bg-muted/40 border-border/60 flex items-center gap-2.5">
                    <Barcode className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <span className="text-muted-foreground block text-[11px]">شابک (ISBN)</span>
                      <span className="font-mono text-foreground font-semibold text-[11px] truncate block">
                        ۹۷۸-۶۰۰-{toPersianDigits(book.id.padStart(4, "0"))}-۱
                      </span>
                    </div>
                  </Card>

                  <Card className="p-3 bg-muted/40 border-border/60 flex items-center gap-2.5 col-span-2 sm:col-span-2">
                    <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <span className="text-muted-foreground block text-[11px]">فرمت عرضه</span>
                      <span className="font-semibold text-foreground">
                        {isAudio ? "فایل صوتی استودیویی (MP3)" : "متنی دیجیتال استاندارد (EPUB)"}
                      </span>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: User Reviews */}
            <TabsContent value="reviews" className="space-y-4 pt-3">
              {reviews.length > 0 ? (
                <div className="space-y-3">
                  {reviews.map((rev) => {
                    const isLiked = !!likedReviews[rev.id];
                    const likesCount = rev.likes + (isLiked ? 1 : 0);
                    return (
                      <Card
                        key={rev.id}
                        className="p-4 bg-card border-border/80 space-y-2 text-right transition-colors"
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
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => toggleReviewLike(rev.id)}
                            className={cn(
                              "h-7 gap-1.5 text-xs px-2.5 rounded-lg border cursor-pointer",
                              isLiked
                                ? "bg-primary/10 border-primary text-primary font-semibold"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{toPersianDigits(likesCount)}</span>
                          </Button>
                        </div>
                      </Card>
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
            <TabsContent value="similar" className="pt-3">
              {similarBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {similarBooks.map((sim) => (
                    <Card
                      key={sim.id}
                      onClick={() => onSelectBook?.(sim.id)}
                      className="group flex sm:flex-col items-center sm:items-start gap-3 p-3 border-border bg-card hover:border-primary/50 transition-all cursor-pointer text-right"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sim.cover}
                        alt={sim.title}
                        className="w-14 sm:w-full aspect-[3/4] object-cover rounded-lg bg-muted shrink-0"
                      />
                      <div className="flex-1 space-y-1 min-w-0 w-full">
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
                    </Card>
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
        <div className="p-4 sm:p-5 border-t border-border bg-muted/30 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
          {/* Wishlist Toggle Button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => onToggleWishlist?.(book.id)}
            className={cn(
              "w-full sm:w-auto gap-2 text-xs font-semibold cursor-pointer transition-colors justify-center",
              isWishlisted
                ? "text-red-500 border-red-200 dark:border-red-950 bg-red-500/10 hover:bg-red-500/20"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Heart
              className={cn("w-4 h-4", isWishlisted && "fill-current text-red-500")}
            />
            <span>
              {isWishlisted ? "نشان‌شده در علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
            </span>
          </Button>

          {/* Main Action Button */}
          {isPurchased ? (
            <Button
              type="button"
              onClick={handleOpenReader}
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-bold gap-2 text-xs sm:text-sm px-6 py-2.5 shadow-xs cursor-pointer justify-center"
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
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-bold gap-2 text-xs sm:text-sm px-6 py-2.5 shadow-xs cursor-pointer justify-center"
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
