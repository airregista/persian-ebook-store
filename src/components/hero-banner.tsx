"use client";

import * as React from "react";
import {
  Flame,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Headphones,
  Tablet,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Book } from "@/types/book";

export interface HeroBannerProps {
  featuredBook?: Book;
  secondaryFeaturedBook?: Book;
  onSelectBook?: (id: string) => void;
  onOpenSubscription?: () => void;
}

export function HeroBanner({
  featuredBook,
  secondaryFeaturedBook,
  onSelectBook,
  onOpenSubscription,
}: HeroBannerProps) {
  const book1Id = featuredBook?.id ?? "1";
  const book1Cover =
    featuredBook?.cover ??
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80";
  const book1Title = featuredBook?.title ?? "در ستایش بطالت";

  const book2Id = secondaryFeaturedBook?.id ?? "2";
  const book2Cover =
    secondaryFeaturedBook?.cover ??
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80";
  const book2Title = secondaryFeaturedBook?.title ?? "جامعه فرسودگی";

  return (
    <section className="space-y-6">
      {/* Hero Banner Box */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 text-white min-h-[320px] flex items-center border border-white/10">
        {/* Ambient subtle glow background */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-teal-200 text-xs font-bold tracking-wide border border-white/10">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>جشنواره بزرگ مطالعه پاییزه کتابگرد</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
            جهانی از کتاب‌ها در جیب شما؛ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-teal-100 to-amber-300">
              متنی و صوتی در یک نگاه
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl">
            با اپلیکیشن تحت‌وب کتابگرد، بدون نیاز به نصب نرم‌افزار، جدیدترین
            رمان‌ها، کتاب‌های روانشناسی و پرفروش‌های جهان را آنلاین یا آفلاین ورق
            بزنید یا با صدای گویندگان برجسته بشنوید.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              variant="default"
              size="lg"
              onClick={() => onSelectBook?.(book1Id)}
              className="px-5 sm:px-6 h-10 sm:h-11 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-transform hover:scale-105"
            >
              <span>کتاب برگزیده ماه</span>
              <ArrowLeft className="w-4 h-4" />
            </Button>

            {onOpenSubscription && (
              <Button
                variant="outline"
                size="lg"
                onClick={onOpenSubscription}
                className="px-4 sm:px-5 h-10 sm:h-11 bg-white/10 hover:bg-white/20 text-white border-white/20 hover:text-white rounded-xl font-semibold text-xs sm:text-sm transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>دریافت اشتراک طلایی</span>
              </Button>
            )}
          </div>
        </div>

        {/* Floating Book Stack Showcase (lg screens) */}
        <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 gap-4 items-center">
          <div
            role="button"
            tabIndex={0}
            onClick={() => onSelectBook?.(book1Id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectBook?.(book1Id);
              }
            }}
            className="w-40 xl:w-44 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl rotate-[-6deg] hover:rotate-0 transition-transform duration-300 border-2 border-white/30 cursor-pointer bg-slate-800"
            title={book1Title}
            aria-label={`مشاهده کتاب ${book1Title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={book1Cover}
              alt={book1Title}
              className="w-full h-full object-cover"
            />
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => onSelectBook?.(book2Id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectBook?.(book2Id);
              }
            }}
            className="w-44 xl:w-48 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl rotate-[3deg] hover:rotate-0 transition-transform duration-300 border-2 border-white/30 cursor-pointer z-10 bg-slate-800"
            title={book2Title}
            aria-label={`مشاهده کتاب ${book2Title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={book2Cover}
              alt={book2Title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Feature / Trust Badges Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-card text-card-foreground p-3.5 sm:p-4 rounded-2xl border border-border flex items-center gap-3 card-shadow">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground">خرید قانونی و فوری</div>
            <div className="text-[11px] text-muted-foreground">تحت قرارداد رسمی با ناشران</div>
          </div>
        </div>

        <div className="bg-card text-card-foreground p-3.5 sm:p-4 rounded-2xl border border-border flex items-center gap-3 card-shadow">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground">کتاب صوتی استودیویی</div>
            <div className="text-[11px] text-muted-foreground">با روایت گویندگان حرفه‌ای</div>
          </div>
        </div>

        <div className="bg-card text-card-foreground p-3.5 sm:p-4 rounded-2xl border border-border flex items-center gap-3 card-shadow">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Tablet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground">کتابخوان درون‌مرورگر</div>
            <div className="text-[11px] text-muted-foreground">سازگار با موبایل، تبلت و وب</div>
          </div>
        </div>

        <div className="bg-card text-card-foreground p-3.5 sm:p-4 rounded-2xl border border-border flex items-center gap-3 card-shadow">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground">صرفه‌جویی تا ۷۰٪</div>
            <div className="text-[11px] text-muted-foreground">قیمت اقتصادی نسبت به نسخه چاپی</div>
          </div>
        </div>
      </div>
    </section>
  );
}
