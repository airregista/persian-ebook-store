"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Timer, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/book-card";
import type { Book } from "@/types/book";
import { cn } from "@/lib/utils";

export interface BookShelfProps {
  id?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: React.ReactNode;
  books: Book[];
  variant?: "default" | "deals" | "audio" | "grid";
  onSelectBook?: (id: string) => void;
  wishlistIds?: string[];
  purchasedIds?: string[];
  onToggleWishlist?: (id: string) => void;
  onQuickAction?: (id: string) => void;
  className?: string;
}

export function BookShelf({
  id,
  title,
  subtitle,
  badge,
  icon,
  books,
  variant = "default",
  onSelectBook,
  wishlistIds = [],
  purchasedIds = [],
  onToggleWishlist,
  onQuickAction,
  className,
}: BookShelfProps) {
  const shelfRef = React.useRef<HTMLDivElement>(null);

  const scrollPrev = () => {
    if (!shelfRef.current) return;
    const isRtl = document.documentElement.dir === "rtl";
    shelfRef.current.scrollBy({ left: isRtl ? 280 : -280, behavior: "smooth" });
  };

  const scrollNext = () => {
    if (!shelfRef.current) return;
    const isRtl = document.documentElement.dir === "rtl";
    shelfRef.current.scrollBy({ left: isRtl ? -280 : 280, behavior: "smooth" });
  };

  const isDeals = variant === "deals";
  const isGrid = variant === "grid";

  return (
    <section
      id={id}
      className={cn(
        "space-y-4 scroll-mt-24 transition-colors",
        isDeals &&
          "bg-gradient-to-r from-deal/10 via-destructive/5 to-deal/10 p-5 sm:p-6 rounded-3xl border border-deal/20",
        className
      )}
    >
      {/* Shelf Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {icon ? (
            <div className="flex items-center justify-center shrink-0">
              {icon}
            </div>
          ) : (
            <div
              className={cn(
                "w-2 sm:w-2.5 h-5 sm:h-6 rounded-full shrink-0",
                isDeals
                  ? "bg-deal"
                  : variant === "audio"
                  ? "bg-amber-500"
                  : "bg-primary"
              )}
            />
          )}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h2 className="text-base sm:text-xl font-extrabold text-foreground truncate">
                {title}
              </h2>
              {badge && (
                <span
                  className={cn(
                    "text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0",
                    isDeals
                      ? "bg-deal/10 text-deal"
                      : variant === "audio"
                      ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                      : "bg-primary/10 text-primary"
                  )}
                >
                  {variant === "audio" && <Volume2 className="w-3 h-3" />}
                  <span>{badge}</span>
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 truncate hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right side controls / timers */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {isDeals && (
            <div className="hidden xs:inline-flex items-center gap-1 bg-background/90 px-2 sm:px-3 py-1 rounded-xl border border-deal/30 text-[11px] sm:text-xs font-sans font-bold text-deal shadow-xs">
              <Timer className="w-3.5 h-3.5 animate-pulse text-deal shrink-0" />
              <span className="hidden sm:inline">فرصت باقی‌مانده:</span>
              <span className="bg-deal text-white px-1 sm:px-1.5 py-0.5 rounded font-bold text-[10px] sm:text-xs">۰۸</span>:
              <span className="bg-deal text-white px-1 sm:px-1.5 py-0.5 rounded font-bold text-[10px] sm:text-xs">۴۲</span>:
              <span className="bg-deal text-white px-1 sm:px-1.5 py-0.5 rounded font-bold text-[10px] sm:text-xs">۱۵</span>
            </div>
          )}

          {!isGrid && (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-xs"
                onClick={scrollPrev}
                aria-label="قبلی"
                className="size-7 rounded-full shadow-2xs border-border/70"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon-xs"
                onClick={scrollNext}
                aria-label="بعدی"
                className="size-7 rounded-full shadow-2xs border-border/70"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Books Content Container */}
      {isGrid ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5 pt-1">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              variant="standard"
              onSelectBook={onSelectBook}
              isWishlisted={wishlistIds.includes(book.id)}
              isPurchased={purchasedIds.includes(book.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickAction={onQuickAction}
            />
          ))}
        </div>
      ) : (
        <div
          ref={shelfRef}
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-3 pt-1"
        >
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              variant="carousel"
              onSelectBook={onSelectBook}
              isWishlisted={wishlistIds.includes(book.id)}
              isPurchased={purchasedIds.includes(book.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickAction={onQuickAction}
            />
          ))}
        </div>
      )}
    </section>
  );
}
