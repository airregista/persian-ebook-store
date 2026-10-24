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
} from "lucide-react";
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
  {
    id: "all",
    label: "همه دسته‌ها",
    type: "category",
    icon: <LayoutGrid className="w-3.5 h-3.5" />,
  },
  {
    id: "deals",
    label: "پیشنهاد شگفت‌انگیز",
    type: "shelf",
    shelfId: "shelf-deals",
    icon: <Percent className="w-3.5 h-3.5 text-red-500" />,
  },
  {
    id: "audio",
    label: "کتاب‌های صوتی",
    type: "shelf",
    shelfId: "shelf-audio",
    icon: <Headphones className="w-3.5 h-3.5 text-amber-500" />,
  },
  {
    id: "story-foreign",
    label: "داستان و رمان خارجی",
    type: "category",
    icon: <BookOpen className="w-3.5 h-3.5" />,
  },
  {
    id: "story-persian",
    label: "داستان و رمان فارسی",
    type: "category",
    icon: <BookOpen className="w-3.5 h-3.5" />,
  },
  {
    id: "psychology",
    label: "روانشناسی و تحول فردی",
    type: "category",
    icon: <Brain className="w-3.5 h-3.5" />,
  },
  {
    id: "management",
    label: "مدیریت و کسب‌وکار",
    type: "category",
    icon: <Briefcase className="w-3.5 h-3.5" />,
  },
  {
    id: "philosophy",
    label: "فلسفه و اندیشه",
    type: "category",
    icon: <Compass className="w-3.5 h-3.5" />,
  },
  {
    id: "history",
    label: "تاریخ و زندگی‌نامه",
    type: "category",
    icon: <Landmark className="w-3.5 h-3.5" />,
  },
  {
    id: "social-sciences",
    label: "جامعه‌شناسی و علوم اجتماعی",
    type: "category",
    icon: <Users className="w-3.5 h-3.5" />,
  },
  {
    id: "literature",
    label: "شعر و ادبیات کلاسیک",
    type: "category",
    icon: <Feather className="w-3.5 h-3.5" />,
  },
  {
    id: "lifestyle",
    label: "سبک زندگی و سلامت",
    type: "category",
    icon: <HeartPulse className="w-3.5 h-3.5" />,
  },
  {
    id: "scientific",
    label: "علمی و فناوری",
    type: "category",
    icon: <Cpu className="w-3.5 h-3.5" />,
  },
  {
    id: "kid-teen",
    label: "کودک و نوجوان",
    type: "category",
    icon: <Smile className="w-3.5 h-3.5" />,
  },
  {
    id: "freebooks",
    label: "کتاب‌های رایگان",
    type: "category",
    icon: <Gift className="w-3.5 h-3.5 text-emerald-500" />,
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
    <nav
      aria-label="دسته‌بندی‌های موضوعی کتابگرد"
      className="w-full border-y border-border py-2.5 bg-background/50 backdrop-blur-xs"
    >
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth px-1">
        {CATEGORIES.map((item) => {
          const isActive = selectedCategory === item.id;
          const isAudio = item.id === "audio";
          const isDeals = item.id === "deals";
          const isFree = item.id === "freebooks";

          let styleClass = "";
          if (isActive) {
            styleClass = "bg-primary text-primary-foreground shadow-xs font-bold";
          } else if (isAudio) {
            styleClass =
              "bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20";
          } else if (isDeals) {
            styleClass =
              "bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20";
          } else if (isFree) {
            styleClass =
              "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20";
          } else {
            styleClass =
              "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground";
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleClick(item)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer select-none shrink-0",
                styleClass
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
