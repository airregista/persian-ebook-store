"use client";

import * as React from "react";
import { CheckCircle2, BookOpen, Headphones, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatToman, toPersianDigits } from "@/lib/formatters";
import type { Book } from "@/types/book";

export interface CheckoutDialogProps {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenReader?: (book: Book) => void;
}

export function CheckoutDialog({
  book,
  open,
  onOpenChange,
  onOpenReader,
}: CheckoutDialogProps) {
  if (!book) return null;

  const isAudio = book.type === "audio" || (book.duration && book.duration !== "صوتی ندارد");
  const orderNumber = toPersianDigits(104820 + Number(book.id || 1));

  const handleStartReading = () => {
    onOpenChange(false);
    onOpenReader?.(book);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 text-center text-foreground border-border bg-card">
        <DialogHeader className="items-center text-center space-y-3">
          {/* Animated Celebration Icon */}
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center animate-in zoom-in-75 duration-300">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <DialogTitle className="text-xl font-black text-foreground">
            تبریک! خرید شما با موفقیت ثبت شد
          </DialogTitle>

          <DialogDescription className="text-xs text-muted-foreground max-w-xs">
            این کتاب به کتابخانه دیجیتال شما اضافه شد و هم‌اکنون به صورت نامحدود در دسترس شماست.
          </DialogDescription>
        </DialogHeader>

        {/* Book Summary Card */}
        <div className="mt-4 p-4 rounded-2xl bg-muted/50 border border-border/80 text-right flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={book.cover}
            alt={book.title}
            className="w-14 aspect-[3/4] object-cover rounded-lg bg-muted shadow-xs shrink-0"
          />
          <div className="flex-1 min-w-0 space-y-1">
            <h4 className="text-xs font-bold text-foreground line-clamp-1">{book.title}</h4>
            <p className="text-[11px] text-muted-foreground truncate">{book.author}</p>
            <div className="flex items-center justify-between pt-1 border-t border-border/50 text-[11px]">
              <span className="text-muted-foreground">مبلغ پرداختی:</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400">
                {formatToman(book.price)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>شماره پیگیری:</span>
              <span className="font-mono">KG-{orderNumber}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5">
          <Button
            type="button"
            onClick={handleStartReading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 py-2.5 text-sm cursor-pointer shadow-sm"
          >
            {isAudio ? (
              <>
                <Headphones className="w-4 h-4" />
                <span>ورود به پلیر و شنیدن کتاب صوتی</span>
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4" />
                <span>ورود به کتابخوان و مطالعه</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full text-xs text-muted-foreground hover:text-foreground cursor-pointer gap-1"
          >
            <span>بازگشت به فروشگاه</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
