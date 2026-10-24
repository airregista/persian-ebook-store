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
      <DialogContent className="w-[95vw] sm:max-w-2xl md:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 border-border bg-card shadow-2xl rounded-2xl">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-border bg-muted/20 text-right shrink-0">
          <DialogHeader className="gap-1.5 text-right">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Library className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-black text-foreground">
                  کتابخانه من
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  مدیریت کتاب‌های خریداری‌شده و فهرست نشان‌شده‌های مورد علاقه
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Navigation Tabs */}
          <div className="mt-4">
            <Tabs
              value={activeTab}
              onValueChange={(val) => onTabChange?.(val as "purchased" | "wishlist")}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-full max-w-xs bg-muted/80 p-1 rounded-xl">
                <TabsTrigger
                  value="purchased"
                  className="gap-1.5 text-xs font-bold py-1.5 rounded-lg cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>کتاب‌های من</span>
                  <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {toPersianDigits(purchasedBooks.length)}
                  </span>
                </TabsTrigger>

                <TabsTrigger
                  value="wishlist"
                  className="gap-1.5 text-xs font-bold py-1.5 rounded-lg cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>علاقه‌مندی‌ها</span>
                  <span className="bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {toPersianDigits(wishlistBooks.length)}
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Scrollable Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 text-right">
          {activeTab === "purchased" ? (
            purchasedBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {purchasedBooks.map((book) => {
                  const isAudio =
                    book.type === "audio" || (book.duration && book.duration !== "صوتی ندارد");
                  return (
                    <div
                      key={book.id}
                      className="group flex gap-3.5 p-3 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all text-right items-center"
                    >
                      {/* Cover Image */}
                      <div
                        onClick={() => {
                          onOpenChange(false);
                          onSelectBook(book.id);
                        }}
                        className="relative w-16 sm:w-18 aspect-[3/4] rounded-lg overflow-hidden bg-muted shrink-0 cursor-pointer shadow-xs group-hover:scale-105 transition-transform"
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
                          title={book.title}
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
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1 text-[11px] px-2.5 py-1 cursor-pointer"
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
                            className="text-muted-foreground hover:text-foreground text-[11px] px-2 cursor-pointer"
                            title="مشاهده جزئیات اثر"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
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
                  className="text-xs mt-2 cursor-pointer font-bold"
                >
                  گشت‌وگذار در ویترین کتاب‌ها
                </Button>
              </div>
            )
          ) : (
            wishlistBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {wishlistBooks.map((book) => {
                  const isPurchased = purchasedIds.includes(book.id);
                  return (
                    <div
                      key={book.id}
                      className="group flex gap-3.5 p-3 rounded-2xl border border-border bg-card hover:border-red-500/30 hover:shadow-sm transition-all text-right items-center"
                    >
                      {/* Cover Image */}
                      <div
                        onClick={() => {
                          onOpenChange(false);
                          onSelectBook(book.id);
                        }}
                        className="relative w-16 sm:w-18 aspect-[3/4] rounded-lg overflow-hidden bg-muted shrink-0 cursor-pointer shadow-xs group-hover:scale-105 transition-transform"
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
                          title={book.title}
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
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1 text-[11px] cursor-pointer"
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
                              className="bg-teal-600 hover:bg-teal-700 text-white font-bold gap-1 text-[11px] cursor-pointer"
                            >
                              <ShoppingBag className="w-3 h-3" />
                              <span>خرید کتاب</span>
                            </Button>
                          )}

                          <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => onRemoveWishlist(book.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10 text-[11px] px-2 cursor-pointer"
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
                  className="text-xs mt-2 cursor-pointer font-bold"
                >
                  مشاهده ویترین کتاب‌ها
                </Button>
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
