"use client";

import * as React from "react";
import { Star, Headphones, Heart, BookOpen } from "lucide-react";
import { formatToman, toPersianDigits } from "@/lib/formatters";
import type { Book } from "@/types/book";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface BookCardProps {
  book: Book;
  onSelectBook?: (id: string) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (id: string) => void;
  isPurchased?: boolean;
  onQuickAction?: (id: string) => void;
  variant?: "standard" | "carousel";
  className?: string;
}

export const BookCard = React.memo(function BookCard({
  book,
  onSelectBook,
  isWishlisted = false,
  onToggleWishlist,
  isPurchased = false,
  onQuickAction,
  variant = "standard",
  className,
}: BookCardProps) {
  const [imgError, setImgError] = React.useState(false);
  const isAudio = book.type === "audio" || (book.duration && book.duration !== "صوتی ندارد");
  const hasDiscount = book.discountPercent > 0 && book.originalPrice > book.price;

  const handleClick = () => {
    onSelectBook?.(book.id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-3 text-card-foreground card-shadow transition-all text-right cursor-pointer select-none",
        variant === "carousel"
          ? "w-[190px] sm:w-[210px] min-w-[190px] sm:min-w-[210px] max-w-[210px] shrink-0"
          : "w-full",
        className
      )}
    >
      <div>
        {/* Cover Container */}
        <div className="relative mb-3 aspect-[3/4] w-full overflow-hidden rounded-xl bg-muted">
          {!imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={book.cover}
              alt={book.title}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/60 p-3 text-center text-muted-foreground">
              <BookOpen className="mb-2 h-8 w-8 stroke-[1.5] text-primary/70" />
              <span className="line-clamp-2 text-xs font-semibold leading-tight text-foreground/80">
                {book.title}
              </span>
            </div>
          )}

          {/* Top Badges */}
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1 pointer-events-none">
            {hasDiscount && (
              <Badge
                variant="destructive"
                className="bg-destructive text-destructive-foreground text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-sm"
              >
                {toPersianDigits(book.discountPercent)}٪
              </Badge>
            )}
            {isAudio ? (
              <Badge
                variant="secondary"
                className="bg-amber-500 hover:bg-amber-500 text-white border-0 text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm"
              >
                <Headphones className="h-2.5 w-2.5" />
                <span>صوتی</span>
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-primary/90 hover:bg-primary text-primary-foreground border-0 text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm"
              >
                <BookOpen className="h-2.5 w-2.5" />
                <span>متنی</span>
              </Badge>
            )}
          </div>

          {/* Purchased Status Badge */}
          {isPurchased && (
            <div className="absolute bottom-2 left-2 rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground shadow">
              در کتابخانه
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="truncate max-w-[110px]">{book.categoryName}</span>
            <span className="flex items-center gap-0.5 font-bold text-gold">
              <Star className="h-3 w-3 fill-gold text-gold" />
              <span>{toPersianDigits(book.rating.toFixed(1))}</span>
            </span>
          </div>

          <h3 className="line-clamp-1 text-xs sm:text-sm font-bold text-foreground transition-colors group-hover:text-primary">
            {book.title}
          </h3>

          <p className="truncate text-[11px] font-medium text-muted-foreground">
            {book.author}
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-2.5">
        <div className="flex flex-col">
          <span className="text-xs font-black text-foreground">
            {formatToman(book.price)}
          </span>
          {hasDiscount && (
            <span className="text-[10px] text-muted-foreground line-through">
              {toPersianDigits(new Intl.NumberFormat("en-US").format(book.originalPrice))}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="افزودن به علاقه‌مندی‌ها"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist?.(book.id);
            }}
            className={cn(
              "rounded-lg p-1.5 transition-colors hover:bg-muted",
              isWishlisted
                ? "text-red-500 hover:text-red-600"
                : "text-muted-foreground hover:text-red-500"
            )}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-transform active:scale-125",
                isWishlisted && "fill-current"
              )}
            />
          </button>

          {isPurchased ? (
            <Button
              size="xs"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                onQuickAction?.(book.id);
              }}
              className="gap-1 text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>خوانش</span>
            </Button>
          ) : (
            <Button
              size="xs"
              variant="default"
              onClick={(e) => {
                e.stopPropagation();
                if (onQuickAction) {
                  onQuickAction(book.id);
                } else {
                  onSelectBook?.(book.id);
                }
              }}
              className="text-xs font-bold px-2.5 bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs"
            >
              خرید
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});
