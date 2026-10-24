"use client";

import * as React from "react";
import {
  Library,
  Heart,
  BookOpen,
  Headphones,
  ShoppingBag,
  Trash2,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatToman, toPersianDigits } from "@/lib/formatters";
import type { Book } from "@/types/book";

export interface LibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeTab?: "purchased" | "wishlist";
  onTabChange?: (tab: "purchased" | "wishlist") => void;
  allBooks: Book[];
  purchasedIds: string[];
  wishlistIds: string[];
  onSelectBook: (bookId: string) => void;
  onOpenReader: (book: Book) => void;
  onPurchaseBook: (book: Book) => void;
  onRemoveWishlist: (bookId: string) => void;
}

export function LibraryDialog({
  open,
  onOpenChange,
  activeTab = "purchased",
  onTabChange,
  allBooks,
  purchasedIds,
  wishlistIds,
  onSelectBook,
  onOpenReader,
  onPurchaseBook,
  onRemoveWishlist,
}: LibraryDialogProps) {
  const purchasedBooks = allBooks.filter((b) => purchasedIds.includes(b.id));
  const wishlistBooks = allBooks.filter((b) => wishlistIds.includes(b.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[88vh] overflow-hidden flex flex-col p-0 gap-0 border-border bg-card">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-border bg-muted/30">
          <DialogHeader className="gap-1.5 text-right">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Library className="w-5 h-5" />
              </div>
              <DialogTitle className="text-lg sm:text-xl font-black text-foreground">
                کتابخانه من
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              مدیریت و دسترسی به کتاب‌های خریداری‌شده و لیست علاقه‌مندی‌ها
            </DialogDescription>
          </DialogHeader>

          {/* Tabs Controller */}
          <Tabs
            value={activeTab}
            onValueChange={(val) => onTabChange?.(val as "purchased" | "wishlist")}
            className="w-full mt-4"
          >
            <TabsList className="grid grid-cols-2 w-full max-w-sm bg-muted/80 p-1 rounded-xl">
              <TabsTrigger
                value="purchased"
                className="gap-1.5 text-xs font-bold py-1.5 rounded-lg"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>کتاب‌های من</span>
                <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.2 rounded-full">
                  {toPersianDigits(purchasedBooks.length)}
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="wishlist"
                className="gap-1.5 text-xs font-bold py-1.5 rounded-lg"
              >
                <Heart className="w-3.5 h-3.5" />
                <span>لیست علاقه‌مندی‌ها</span>
                <span className="bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] px-1.5 py-0.2 rounded-full">
                  {toPersianDigits(wishlistBooks.length)}
                </span>
              </TabsTrigger>
            </TabsList>

            {/* Content Body */}
            <div className="overflow-y-auto max-h-[55vh] mt-4 text-right">
              {/* TAB 1: Purchased Books */}
              <TabsContent value="purchased" className="m-0">
                {purchasedBooks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {purchasedBooks.map((book) => {
                      const isAudio = book.type === "audio" || (book.duration && book.duration !== "صوتی ندارد");
                      return (
                        <div
                          key={book.id}
                          className="group flex gap-3 p-3 rounded-2xl border border-border bg-card hover:border-primary/40 transition-all text-right items-center"
                        >
                          {/* Cover Image */}
                          <div
                            onClick={() => {
                              onOpenChange(false);
                              onSelectBook(book.id);
                            }}
                            className="relative w-16 aspect-[3/4] rounded-lg overflow-hidden bg-muted shrink-0 cursor-pointer shadow-xs group-hover:scale-105 transition-transform"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={book.cover}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Info & CTA */}
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                {book.categoryName}
                              </Badge>
                              {isAudio ? (
                                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                                  <Headphones className="w-3 h-3" />
                                  صوتی
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-primary flex items-center gap-0.5">
                                  <BookOpen className="w-3 h-3" />
                                  متنی
                                </span>
                              )}
                            </div>

                            <h4
                              onClick={() => {
                                onOpenChange(false);
                                onSelectBook(book.id);
                              }}
                              className="text-xs sm:text-sm font-bold text-foreground line-clamp-1 cursor-pointer hover:text-primary transition-colors"
                            >
                              {book.title}
                            </h4>

                            <p className="text-[11px] text-muted-foreground truncate">
                              {book.author}
                            </p>

                            <div className="flex items-center gap-2 pt-1">
                              <Button
                                size="xs"
                                onClick={() => {
                                  onOpenChange(false);
                                  onOpenReader(book);
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1 text-[11px] px-2.5 py-1"
                              >
                                {isAudio ? (
                                  <>
                                    <Headphones className="w-3 h-3" />
                                    <span>شنیدن صوتی</span>
                                  </>
                                ) : (
                                  <>
                                    <BookOpen className="w-3 h-3" />
                                    <span>مطالعه کتاب</span>
                                  </>
                                )}
                              </Button>

                              <Button
                                size="xs"
                                variant="ghost"
                                onClick={() => {
                                  onOpenChange(false);
                                  onSelectBook(book.id);
                                }}
                                className="text-muted-foreground hover:text-foreground text-[11px] px-2"
                                title="مشاهده جزئیات اثر"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-14 bg-muted/20 rounded-3xl border border-dashed border-border p-8 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-muted mx-auto flex items-center justify-center text-muted-foreground">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">
                      شما هنوز کتابی به کتابخانه خود اضافه نکرده‌اید
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      از میان هزاران عنوان کتاب الکترونیک و صوتی در کتابگرد، آثار مورد علاقه خود را انتخاب کنید.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => onOpenChange(false)}
                      className="text-xs mt-2"
                    >
                      گشت‌وگذار در ویترین کتاب‌ها
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* TAB 2: Wishlist Books */}
              <TabsContent value="wishlist" className="m-0">
                {wishlistBooks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {wishlistBooks.map((book) => {
                      const isPurchased = purchasedIds.includes(book.id);
                      return (
                        <div
                          key={book.id}
                          className="group flex gap-3 p-3 rounded-2xl border border-border bg-card hover:border-red-500/30 transition-all text-right items-center"
                        >
                          {/* Cover Image */}
                          <div
                            onClick={() => {
                              onOpenChange(false);
                              onSelectBook(book.id);
                            }}
                            className="relative w-16 aspect-[3/4] rounded-lg overflow-hidden bg-muted shrink-0 cursor-pointer shadow-xs group-hover:scale-105 transition-transform"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={book.cover}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Info & Actions */}
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <span className="text-[10px] text-muted-foreground block truncate">
                              {book.categoryName}
                            </span>

                            <h4
                              onClick={() => {
                                onOpenChange(false);
                                onSelectBook(book.id);
                              }}
                              className="text-xs sm:text-sm font-bold text-foreground line-clamp-1 cursor-pointer hover:text-primary transition-colors"
                            >
                              {book.title}
                            </h4>

                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-foreground">
                                {formatToman(book.price)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                              {isPurchased ? (
                                <Button
                                  size="xs"
                                  onClick={() => {
                                    onOpenChange(false);
                                    onOpenReader(book);
                                  }}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1 text-[11px]"
                                >
                                  <BookOpen className="w-3 h-3" />
                                  <span>در کتابخانه شما</span>
                                </Button>
                              ) : (
                                <Button
                                  size="xs"
                                  onClick={() => {
                                    onOpenChange(false);
                                    onPurchaseBook(book);
                                  }}
                                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold gap-1 text-[11px]"
                                >
                                  <ShoppingBag className="w-3 h-3" />
                                  <span>خرید کتاب</span>
                                </Button>
                              )}

                              <Button
                                size="xs"
                                variant="ghost"
                                onClick={() => onRemoveWishlist(book.id)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-500/10 text-[11px] px-2"
                                title="حذف از لیست علاقه‌مندی‌ها"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-14 bg-muted/20 rounded-3xl border border-dashed border-border p-8 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 mx-auto flex items-center justify-center text-red-500">
                      <Heart className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">
                      لیست علاقه‌مندی‌های شما خالی است
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      برای نشان‌کردن کتاب‌ها و بررسی آن‌ها در آینده، روی علامت قلب در کارت کتاب‌ها کلیک کنید.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => onOpenChange(false)}
                      className="text-xs mt-2"
                    >
                      مشاهده ویترین کتاب‌ها
                    </Button>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
