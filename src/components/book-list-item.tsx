"use client";

import * as React from "react";
import type { Book } from "@/types/book";
import { formatToman } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export interface BookListItemProps {
  book: Book;
  onSelect: (id: string) => void;
  actions?: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}

export function BookListItem({
  book,
  onSelect,
  actions,
  subtitle,
  className,
}: BookListItemProps) {
  return (
    <div
      className={cn(
        "group flex gap-3.5 p-3 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-xs transition-all text-right items-center",
        className
      )}
    >
      <div
        onClick={() => onSelect(book.id)}
        className="relative w-16 sm:w-18 aspect-[3/4] rounded-lg overflow-hidden bg-muted shrink-0 cursor-pointer shadow-xs group-hover:scale-105 transition-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <span className="text-[10px] text-muted-foreground block truncate">
          {book.categoryName}
        </span>

        <Tooltip>
          <TooltipTrigger className="w-full text-right cursor-pointer outline-none">
            <h4
              onClick={() => onSelect(book.id)}
              className="text-xs sm:text-sm font-bold text-foreground line-clamp-2 cursor-pointer hover:text-primary transition-colors leading-tight"
            >
              {book.title}
            </h4>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="font-semibold text-xs">{book.title}</p>
          </TooltipContent>
        </Tooltip>

        {subtitle ? (
          subtitle
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-foreground">
              {formatToman(book.price)}
            </span>
          </div>
        )}

        {actions && (
          <div className="flex items-center gap-2 pt-1">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
