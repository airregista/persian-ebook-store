"use client";

import * as React from "react";
import { Headphones, Percent } from "lucide-react";
import { cn } from "cn";

export interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onScrollToShelf?: (shelfId: string) => void;
}

interface CategoryItem {
  id: string;
  label: string;
  type?: "category" | "shelf";
  shelfId?: string;
  icon?: React.ReactNode;
}

const CATEGORIES: CategoryItem[] = [
  { id: "all", label: "همه دسته‌ها", type: "category" },
  { id: "literature", label: "رمان و داستان", type: "category" },
  { id: "society", label: "روانشناسی و موفقیت", type: "category" },
  { id: "philosophy", label: "فلسفه و اندیشه", type: "category" },
  { id: "art", label: "هنر و دیزاین", type: "category" },
  {
    id: "audio",
    label: "کتاب‌های صوتی",
    type: "shelf",
    shelfId: "shelf-audio",
    icon: <Headphones className="w-3.5 h-3.5" />,
  },
  {
    id: "deals",
    label: "پیشنهادهای شگفت‌انگیز",
    type: "shelf",
    shelfId: "shelf-deals",
    icon: <Percent className="w-3.5 h-3.5" />,
  },
];

export function CategoryNav({
  selectedCategory,
  onSelectCategory,
  onScrollToShelf,
}: CategoryNavProps) {
  const handleClick = (item: CategoryItem) => {
    if (item.type === "shelf" && item.shelfId && onScrollToShelf) {
      onScrollToShelf(item.shelfId);
    } else {
      onSelectCategory(item.id);
    }
  };

  return (
    <div className="w-full border-y border-border py-2.5">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth px-1">
        {CATEGORIES.map((item) => {
          const isActive = selectedCategory === item.id;
          const isAudio = item.id === "audio";
          const isDeals = item.id === "deals";

          let styleClass = "";
          if (isActive) {
            styleClass = "bg-primary text-primary-foreground shadow-xs";
          } else if (isAudio) {
            styleClass =
              "bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20";
          } else if (isDeals) {
            styleClass =
              "bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20";
          } else {
            styleClass =
              "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground";
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleClick(item)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer select-none",
                styleClass
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
