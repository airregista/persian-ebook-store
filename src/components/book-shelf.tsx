"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Timer, Volume2 } from "lucide-react";
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
    shelfRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  const scrollNext = () => {
    shelfRef.current?.scrollBy({ left: -300, behavior: "smooth" });
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {icon ? (
            <div className="flex items-center justify-center shrink-0">
              {icon}
            </div>
          ) : (
            <div
              className={cn(
                "w-2.5 h-6 rounded-full shrink-0",
                isDeals
                  ? "bg-deal"
                  : variant === "audio"
                  ? "bg-amber-500"
                  : "bg-primary"
              )}
            />
          )}

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-foreground">
                {title}
              </h2>
              {badge && (
                <span
                  className={cn(
                    "text-xs font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1",
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
              <p className="text-xs text-muted-foreground mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right side controls / timers */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          {isDeals && (
            <div className="inline-flex items-center gap-1.5 bg-background/90 px-3 py-1.5 rounded-xl border border-deal/30 text-xs font-sans font-bold text-deal shadow-xs">
              <Timer className="w-3.5 h-3.5 animate-pulse text-deal shrink-0" />
              <span>فرصت باقی‌مانده:</span>
              <span className="bg-deal text-white px-1.5 py-0.5 rounded font-bold">۰۸</span> :
              <span className="bg-deal text-white px-1.5 py-0.5 rounded font-bold">۴۲</span> :
              <span className="bg-deal text-white px-1.5 py-0.5 rounded font-bold">۱۵</span>
            </div>
          )}

          {!isGrid && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={scrollPrev}
                className="p-2 rounded-xl bg-card border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shadow-xs cursor-pointer"
                aria-label="قبلی"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                className="p-2 rounded-xl bg-card border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shadow-xs cursor-pointer"
                aria-label="بعدی"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
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
