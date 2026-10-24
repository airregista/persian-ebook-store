"use client";

import * as React from "react";
import {
  BookMarked,
  LayoutGrid,
  ChevronDown,
  Search,
  X,
  Crown,
  Heart,
  Library,
  Book,
  Brain,
  Compass,
  Palette,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { toPersianDigits } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  all: <LayoutGrid className="w-4 h-4 text-primary" />,
  "story-foreign": <Book className="w-4 h-4 text-primary" />,
  "story-persian": <Book className="w-4 h-4 text-primary" />,
  psychology: <Brain className="w-4 h-4 text-primary" />,
  management: <Palette className="w-4 h-4 text-primary" />,
  philosophy: <Compass className="w-4 h-4 text-primary" />,
  history: <Book className="w-4 h-4 text-primary" />,
  "social-sciences": <Compass className="w-4 h-4 text-primary" />,
  literature: <Book className="w-4 h-4 text-primary" />,
  lifestyle: <Heart className="w-4 h-4 text-primary" />,
  scientific: <Sparkles className="w-4 h-4 text-primary" />,
  "kid-teen": <Sparkles className="w-4 h-4 text-primary" />,
  freebooks: <Sparkles className="w-4 h-4" />,
};

export interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onClearSearch?: () => void;
  onSelectCategory?: (category: string) => void;
  wishlistCount?: number;
  libraryCount?: number;
  onOpenWishlist?: () => void;
  onOpenLibrary?: () => void;
  onOpenSubscription?: () => void;
}

export function Header({
  searchQuery = "",
  onSearchChange,
  onClearSearch,
  onSelectCategory,
  wishlistCount = 0,
  libraryCount = 0,
  onOpenWishlist,
  onOpenLibrary,
  onOpenSubscription,
}: HeaderProps) {
  const [isCategoryOpen, setIsCategoryOpen] = React.useState(false);
  const categoryMenuRef = React.useRef<HTMLDivElement>(null);

  // Close flyout when clicking outside or pressing Escape
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleCategoryClick = (category: string) => {
    setIsCategoryOpen(false);
    onSelectCategory?.(category);
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Announcement Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-primary to-emerald-600 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 sm:gap-3 transition-colors">
        <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-[11px] font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>جشنواره پاییزه</span>
        </span>
        <span className="truncate max-w-[280px] sm:max-w-none">
          جشنواره بزرگ مطالعه پاییزه کتابگرد | ۳۰ روز دسترسی نامحدود به بیش از ۴۰٬۰۰۰ عنوان متنی و صوتی فقط با ۸۹٬۰۰۰ تومان
        </span>
        {onOpenSubscription && (
          <button
            type="button"
            onClick={onOpenSubscription}
            className="underline hover:text-white/80 font-bold mr-1 text-[11px] hidden sm:inline cursor-pointer"
          >
            مشاهده جزئیات
          </button>
        )}
      </div>

      {/* Main Glass Header */}
      <div className="backdrop-blur-md bg-background/95 border-b border-border transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between gap-4 lg:gap-6">
            {/* Right: Logo & Mega-category trigger */}
            <div className="flex items-center gap-4 lg:gap-6">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectCategory?.("all");
                  if (onClearSearch) onClearSearch();
                }}
                className="flex items-center gap-2.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-teal-400 flex items-center justify-center text-primary-foreground shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
                  <BookMarked className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tight text-foreground">
                    کتابگَرد
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium -mt-1 hidden sm:inline">
                    فروشگاه کتاب و کتابخوان همراه
                  </span>
                </div>
              </a>

              {/* Category Dropdown Button */}
              <div className="relative hidden lg:block" ref={categoryMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  aria-expanded={isCategoryOpen}
                  aria-haspopup="true"
                  aria-label="دسته‌بندی موضوعی کتاب‌ها"
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 rounded-xl text-foreground/80 hover:text-primary hover:bg-muted font-medium text-sm transition-colors cursor-pointer",
                    isCategoryOpen && "bg-muted text-primary"
                  )}
                >
                  <LayoutGrid className="w-4 h-4 text-primary" />
                  <span>دسته‌بندی‌ها</span>
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 text-muted-foreground transition-transform duration-200",
                      isCategoryOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* Category Flyout Menu */}
                {isCategoryOpen && (
                  <div className="absolute top-full right-0 mt-2 w-80 max-h-[80vh] overflow-y-auto bg-popover text-popover-foreground rounded-2xl shadow-xl border border-border p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="text-[11px] font-bold text-muted-foreground px-3 py-1.5 uppercase">
                      موضوعات و دسته‌بندی‌ها
                    </div>

                    {CATEGORIES.filter((c) => c.type === "category").map((cat) => {
                      const isFree = cat.id === "freebooks";
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleCategoryClick(cat.id)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-colors text-right cursor-pointer",
                            isFree
                              ? "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 font-bold"
                              : "text-foreground hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          {CATEGORY_ICONS[cat.id] ?? <Book className="w-4 h-4 text-primary" />}
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Center: Universal Search Input */}
            <div className="flex-1 max-w-xl relative hidden md:block">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  placeholder="جستجوی عنوان کتاب، نویسنده، مترجم، ناشر یا گوینده..."
                  className="w-full bg-muted/70 hover:bg-muted focus:bg-background text-sm text-foreground placeholder:text-muted-foreground pr-11 pl-10 py-2.5 rounded-full border border-border/60 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                />
                <Search className="w-4 h-4 text-muted-foreground absolute right-4 pointer-events-none" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={onClearSearch}
                    className="absolute left-3.5 p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors cursor-pointer"
                    aria-label="پاک کردن جستجو"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Left: User Actions, Library, Cart & Subscription CTA */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Subscription CTA Pill */}
              <button
                type="button"
                onClick={onOpenSubscription}
                aria-label="اشتراک طلایی کتابگرد"
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-full text-xs font-bold shadow-xs shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer"
              >
                <Crown className="w-4 h-4" />
                <span>اشتراک کتابگرد</span>
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={onOpenWishlist}
                className="relative p-2.5 rounded-xl hover:bg-muted text-foreground/80 hover:text-primary transition-colors cursor-pointer"
                title="علاقه‌مندی‌ها"
                aria-label="علاقه‌مندی‌ها"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {toPersianDigits(wishlistCount)}
                  </span>
                )}
              </button>

              {/* My Library Button */}
              <button
                type="button"
                onClick={onOpenLibrary}
                className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-accent text-accent-foreground hover:bg-accent/80 font-semibold text-xs transition-colors cursor-pointer"
                title="کتابخانه من"
                aria-label="کتابخانه من"
              >
                <Library className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline">کتابخانه من</span>
                {libraryCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {toPersianDigits(libraryCount)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Row (visible on small screens) */}
          <div className="pb-3 md:hidden">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="جستجوی کتاب، نویسنده، مترجم..."
                className="w-full bg-muted/80 focus:bg-background text-sm text-foreground placeholder:text-muted-foreground pr-10 pl-9 py-2 rounded-xl border border-border/60 focus:border-primary outline-none"
              />
              <Search className="w-4 h-4 text-muted-foreground absolute right-3.5 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={onClearSearch}
                  className="absolute left-2.5 p-1 text-muted-foreground hover:text-foreground"
                  aria-label="پاک کردن جستجو"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
