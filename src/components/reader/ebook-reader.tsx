"use client";

import * as React from "react";
import { ArrowRight, BookOpen, Check } from "lucide-react";
import type { Book } from "@/types/book";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toPersianDigits } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export interface EbookReaderProps {
  book: Book;
  onClose: () => void;
}

export type ReaderTheme = "day" | "sepia" | "night";

interface ThemeConfig {
  name: string;
  bg: string;
  text: string;
  headerBg: string;
  border: string;
  mutedText: string;
  cardBg: string;
}

const THEME_CONFIG: Record<ReaderTheme, ThemeConfig> = {
  day: {
    name: "روز",
    bg: "bg-background",
    text: "text-foreground",
    headerBg: "bg-background/95",
    border: "border-border",
    mutedText: "text-muted-foreground",
    cardBg: "bg-zinc-50 border-border",
  },
  sepia: {
    name: "کاغذی",
    bg: "bg-reader-sepia-bg",
    text: "text-reader-sepia-fg",
    headerBg: "bg-reader-sepia-bg/95",
    border: "border-reader-sepia-border",
    mutedText: "text-reader-sepia-muted",
    cardBg: "bg-reader-sepia-card border-reader-sepia-border",
  },
  night: {
    name: "شب",
    bg: "bg-reader-dark-bg",
    text: "text-reader-dark-fg",
    headerBg: "bg-reader-dark-bg/95",
    border: "border-zinc-800",
    mutedText: "text-zinc-400",
    cardBg: "bg-zinc-900 border-zinc-800",
  },
};

export function EbookReader({ book, onClose }: EbookReaderProps) {
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [fontSize, setFontSize] = React.useState(18);
  const [theme, setTheme] = React.useState<ReaderTheme>("day");
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Close reader on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Track scroll percentage
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const total = el.scrollHeight - el.clientHeight;
    if (total > 0) {
      const pct = Math.min(100, Math.max(0, (el.scrollTop / total) * 100));
      setScrollProgress(Math.round(pct));
    } else {
      setScrollProgress(0);
    }
  };

  const currentTheme = THEME_CONFIG[theme];

  // Chapters & Paragraphs generation
  const chapters = React.useMemo(() => {
    const sample = Array.isArray(book.sampleText) ? book.sampleText : [];

    if (sample.length > 0) {
      return [
        {
          title: `بخش نخست: در پیرامون «${book.title}»`,
          paragraphs: [
            book.excerpt ? `«${book.excerpt}»` : "",
            sample[0],
          ].filter(Boolean),
        },
        {
          title: "فصل اول: سرآغاز متن",
          paragraphs: sample.slice(1).length > 0
            ? sample.slice(1)
            : [
                book.synopsis,
                `کتاب «${book.title}» اثری ارزشمند از ${book.author} است که در حوزه ${book.categoryName} منتشر شده است. نویسنده با زبانی شیوا و کاوشی ژرف، خواننده را به تأمل در ابعاد متن دعوت می‌کند.`,
              ],
        },
        {
          title: "فصل دوم: افق‌های اندیشه و روایت",
          paragraphs: [
            book.synopsis,
            `مطالعه این اثر ارزشمند از انتشارات ${book.publisher}، گامی است استوار در درک مفاهیم محوری اثر که خواننده را تا پایان با خود همراه می‌سازد.`,
            `نسخه الکترونیک استاندارد، امکان مطالعه متوالی و تنظیمات بهینه‌سازی خوانش را برای شما به ارمغان آورده است.`,
          ],
        },
      ];
    }

    // Fallback when sampleText is empty
    return [
      {
        title: `پیش‌درآمد: آشنایی با اثر «${book.title}»`,
        paragraphs: [
          book.excerpt ? `«${book.excerpt}»` : "",
          book.synopsis,
        ].filter(Boolean),
      },
      {
        title: "فصل اول: سرآغاز گفتار",
        paragraphs: [
          `اثر «${book.title}» نگاشته ${book.author} از برجسته‌ترین آثار در موضوع ${book.categoryName} به شمار می‌رود. نویسنده با بیانی روشن و ساختاری منسجم، به طرح پرسش‌ها و بررسی جنبه‌های گوناگون موضوع پرداخته است.`,
          book.synopsis,
          `این اثر با دقت نظری درخور توجه توسط نشر ${book.publisher} به چاپ رسیده و مخاطب را در جریان یک سیر فکری پرمحتوا قرار می‌دهد.`,
        ],
      },
      {
        title: "فصل دوم: ژرفای معنا و فرجام روایت",
        paragraphs: [
          `در ادامه این اثر، نویسنده به شرح جزئیاتی می‌پردازد که درک عمیق‌تری از پیام کلی کتاب را برای خواننده ممکن می‌سازد. زبان اثر در عین سادگی، حامل مفاهیمی تفکربرانگیز است.`,
          book.synopsis,
          `پایان‌بندی این بخش، سرآغازی است بر کنکاش بیشتر در جهان اندیشه‌ای اثر.`,
        ],
      },
    ];
  }, [book]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`کتابخوان درون‌مرورگر برای «${book.title}»`}
      className={cn(
        "fixed inset-0 z-50 flex flex-col font-sans transition-colors duration-200 select-text",
        currentTheme.bg,
        currentTheme.text
      )}
    >
      {/* Progress bar at the very top */}
      <div className="w-full h-1 shrink-0 bg-transparent">
        <Progress
          value={scrollProgress}
          className="h-1 w-full rounded-none gap-0"
          aria-label={`پیشرفت مطالعه: ${toPersianDigits(scrollProgress)} درصد`}
        />
      </div>

      {/* Header Bar */}
      <header
        className={cn(
          "shrink-0 flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 border-b backdrop-blur-md transition-colors",
          currentTheme.headerBg,
          currentTheme.border
        )}
      >
        {/* Right: Close button with book title and author */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="خروج از کتابخوان"
            title="خروج از کتابخوان (Esc)"
            className="size-9 rounded-full cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 shrink-0"
          >
            <ArrowRight className="size-5" />
          </Button>

          <div className="min-w-0 space-y-0.5 text-right">
            <h2
              className="text-xs sm:text-sm font-black truncate max-w-[170px] sm:max-w-xs md:max-w-md"
              title={book.title}
            >
              {book.title}
            </h2>
            <p
              className={cn(
                "text-[11px] truncate max-w-[150px] sm:max-w-xs",
                currentTheme.mutedText
              )}
              title={book.author}
            >
              {book.author}
            </p>
          </div>
        </div>

        {/* Left: Progress info, Font size controls, Theme buttons */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Progress Indicator */}
          <div
            className={cn(
              "hidden md:flex items-center gap-1 text-xs font-sans font-bold select-none",
              currentTheme.mutedText
            )}
          >
            <BookOpen className="size-3.5" />
            <span>{toPersianDigits(scrollProgress)}٪</span>
          </div>

          {/* Font Size Controls: A- / A+ (range 14px to 26px, default 18px) */}
          <div
            className={cn(
              "flex items-center border rounded-lg overflow-hidden select-none",
              currentTheme.border
            )}
          >
            <button
              type="button"
              onClick={() => setFontSize((s) => Math.max(14, s - 2))}
              disabled={fontSize <= 14}
              aria-label="کاهش اندازه قلم (A-)"
              title="کاهش قلم (A-)"
              className="px-2 sm:px-2.5 py-1 text-xs font-bold hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30 cursor-pointer transition-colors"
            >
              A-
            </button>
            <span
              className={cn(
                "px-1.5 sm:px-2 text-xs font-sans font-bold border-x",
                currentTheme.border
              )}
            >
              {toPersianDigits(fontSize)}
            </span>
            <button
              type="button"
              onClick={() => setFontSize((s) => Math.min(26, s + 2))}
              disabled={fontSize >= 26}
              aria-label="افزایش اندازه قلم (A+)"
              title="افزایش قلم (A+)"
              className="px-2 sm:px-2.5 py-1 text-xs font-bold hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30 cursor-pointer transition-colors"
            >
              A+
            </button>
          </div>

          {/* Reading Theme Buttons: روز / کاغذی / شب */}
          <div
            className={cn(
              "flex items-center gap-1 p-0.5 sm:p-1 rounded-lg border text-xs select-none",
              currentTheme.border
            )}
          >
            <button
              type="button"
              onClick={() => setTheme("day")}
              aria-label="تم روز (سفید)"
              title="تم روز"
              className={cn(
                "px-2 sm:px-2.5 py-1 rounded text-xs cursor-pointer transition-all flex items-center gap-1",
                theme === "day"
                  ? "bg-white text-zinc-900 font-bold shadow-xs border border-zinc-300"
                  : "hover:bg-black/5"
              )}
            >
              <span>روز</span>
              {theme === "day" && <Check className="size-3" />}
            </button>

            <button
              type="button"
              onClick={() => setTheme("sepia")}
              aria-label="تم کاغذی (کرم سپیا)"
              title="تم کاغذی"
              className={cn(
                "px-2 sm:px-2.5 py-1 rounded text-xs cursor-pointer transition-all flex items-center gap-1",
                theme === "sepia"
                  ? "bg-reader-sepia-bg text-reader-sepia-fg font-bold shadow-xs border border-reader-sepia-border"
                  : "hover:bg-black/5"
              )}
            >
              <span>کاغذی</span>
              {theme === "sepia" && <Check className="size-3" />}
            </button>

            <button
              type="button"
              onClick={() => setTheme("night")}
              aria-label="تم شب (تاریک)"
              title="تم شب"
              className={cn(
                "px-2 sm:px-2.5 py-1 rounded text-xs cursor-pointer transition-all flex items-center gap-1",
                theme === "night"
                  ? "bg-zinc-800 text-zinc-100 font-bold shadow-xs border border-zinc-700"
                  : "hover:bg-white/10"
              )}
            >
              <span>شب</span>
              {theme === "night" && <Check className="size-3" />}
            </button>
          </div>
        </div>
      </header>

      {/* Content Area: scrollable container */}
      <main
        ref={contentRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto w-full focus:outline-none"
      >
        <div className="max-w-3xl mx-auto py-12 px-6 sm:px-8 space-y-12 leading-loose font-sans text-right">
          {/* Book Title Header Card */}
          <div
            className={cn(
              "text-center py-10 px-6 rounded-2xl border space-y-4",
              currentTheme.cardBg
            )}
          >
            <div
              className={cn(
                "text-xs font-bold uppercase tracking-wider",
                currentTheme.mutedText
              )}
            >
              کتاب الکترونیک استاندارد ePub
            </div>
            <h1 className="text-2xl sm:text-3xl font-black leading-tight">
              {book.title}
            </h1>
            <p className={cn("text-sm sm:text-base font-semibold", currentTheme.mutedText)}>
              نویسنده: {book.author}
              {book.translator ? ` | ترجمه: ${book.translator}` : ""}
            </p>
            <p className={cn("text-xs", currentTheme.mutedText)}>
              نشر: {book.publisher}
            </p>
          </div>

          {/* Chapters and Paragraphs */}
          {chapters.map((chap, chapIdx) => (
            <section key={chapIdx} className="space-y-6 pt-4">
              <h3 className="text-lg sm:text-xl font-black pb-2 border-b border-current/15">
                {chap.title}
              </h3>

              <div className="space-y-5">
                {chap.paragraphs.map((para, paraIdx) => (
                  <p
                    key={paraIdx}
                    style={{ fontSize: `${fontSize}px`, lineHeight: 2 }}
                    className="text-justify indent-6 tracking-normal transition-all duration-150 text-inherit opacity-95"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </section>
          ))}

          {/* End of Excerpt / Completion Section */}
          <div
            className={cn(
              "text-center py-12 px-6 rounded-2xl border space-y-4 mt-12",
              currentTheme.cardBg
            )}
          >
            <h4 className="text-base sm:text-lg font-black">
              پایان نسخه آنلاین کتاب «{book.title}»
            </h4>
            <p className={cn("text-xs sm:text-sm max-w-md mx-auto", currentTheme.mutedText)}>
              امیدواریم از مطالعه این اثر لذت برده باشید. با افزودن یادداشت و ثبت دیدگاه، تجربه خود را با سایر خوانندگان کتابگرد به اشتراک بگذارید.
            </p>
            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="cursor-pointer font-bold text-xs gap-1.5"
              >
                <span>بازگشت به فروشگاه کتابگرد</span>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
