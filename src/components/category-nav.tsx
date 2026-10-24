"use client";

import * as React from "react";
import {
  Percent,
  Headphones,
  BookOpen,
  Brain,
  Briefcase,
  Compass,
  Landmark,
  Users,
  Feather,
  HeartPulse,
  Cpu,
  Smile,
  Gift,
  LayoutGrid,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CATEGORIES, CategoryDefinition } from "@/lib/constants";

export interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onScrollToShelf?: (shelfId: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  all: <LayoutGrid className="w-3.5 h-3.5" />,
  deals: <Percent className="w-3.5 h-3.5" />,
  audio: <Headphones className="w-3.5 h-3.5" />,
  "story-foreign": <BookOpen className="w-3.5 h-3.5" />,
  "story-persian": <BookOpen className="w-3.5 h-3.5" />,
  psychology: <Brain className="w-3.5 h-3.5" />,
  management: <Briefcase className="w-3.5 h-3.5" />,
  philosophy: <Compass className="w-3.5 h-3.5" />,
  history: <Landmark className="w-3.5 h-3.5" />,
  "social-sciences": <Users className="w-3.5 h-3.5" />,
  literature: <Feather className="w-3.5 h-3.5" />,
  lifestyle: <HeartPulse className="w-3.5 h-3.5" />,
  scientific: <Cpu className="w-3.5 h-3.5" />,
  "kid-teen": <Smile className="w-3.5 h-3.5" />,
  freebooks: <Gift className="w-3.5 h-3.5" />,
};

export function CategoryNav({
  selectedCategory,
  onSelectCategory,
  onScrollToShelf,
}: CategoryNavProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleClick = (item: CategoryDefinition) => {
    if (item.type === "shelf" && item.shelfId && onScrollToShelf) {
      onScrollToShelf(item.shelfId);
    } else {
      onSelectCategory(item.id);
    }
  };

  const scrollRight = () => {
    // In RTL layout: scrolling rightwards moves back to earlier categories
    if (!scrollContainerRef.current) return;
    const isRtl = document.documentElement.dir === "rtl";
    scrollContainerRef.current.scrollBy({
      left: isRtl ? 220 : -220,
      behavior: "smooth",
    });
  };

  const scrollLeft = () => {
    // In RTL layout: scrolling leftwards moves ahead to further categories
    if (!scrollContainerRef.current) return;
    const isRtl = document.documentElement.dir === "rtl";
    scrollContainerRef.current.scrollBy({
      left: isRtl ? -220 : 220,
      behavior: "smooth",
    });
  };

  return (
    <nav
      aria-label="دسته‌بندی‌های موضوعی کتابگرد"
      className="relative w-full border-y border-border py-2 bg-background/80 backdrop-blur-md transition-colors"
    >
      <div className="relative flex items-center max-w-7xl mx-auto px-1 sm:px-2 gap-1">
        {/* Right scroll button (visible on mobile and desktop) */}
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          onClick={scrollRight}
          aria-label="مشاهده دسته‌های قبل"
          title="مشاهده دسته‌های قبل"
          className="rounded-full text-muted-foreground hover:text-foreground hover:bg-muted size-7 shrink-0 cursor-pointer shadow-2xs border-border/60"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* Scrollable container with fully hidden browser scrollbar */}
        <div
          ref={scrollContainerRef}
          className="flex-1 flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 px-1 scroll-smooth select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {CATEGORIES.map((item) => {
            const isActive = selectedCategory === item.id;
            const isAudio = item.id === "audio";
            const isDeals = item.id === "deals";
            const isFree = item.id === "freebooks";

            return (
              <Button
                key={item.id}
                type="button"
                variant={isActive ? "default" : "secondary"}
                size="sm"
                onClick={() => handleClick(item)}
                className={cn(
                  "h-8 rounded-full px-3 text-xs font-semibold gap-1.5 shrink-0 transition-all cursor-pointer border",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground font-bold shadow-xs hover:bg-primary-hover"
                    : "border-border/50 bg-secondary/70 hover:bg-secondary text-secondary-foreground hover:border-border",
                  !isActive && isDeals && "border-deal/30 text-deal hover:bg-destructive/10 hover:border-deal/50",
                  !isActive && isAudio && "border-gold/30 text-gold hover:bg-gold/10 hover:border-gold/50",
                  !isActive && isFree && "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50"
                )}
              >
                <span className="shrink-0">{CATEGORY_ICONS[item.id]}</span>
                <span className="whitespace-nowrap">{item.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Left scroll button (visible on mobile and desktop) */}
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          onClick={scrollLeft}
          aria-label="مشاهده دسته‌های بعد"
          title="مشاهده دسته‌های بعد"
          className="rounded-full text-muted-foreground hover:text-foreground hover:bg-muted size-7 shrink-0 cursor-pointer shadow-2xs border-border/60"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
    </nav>
  );
}
