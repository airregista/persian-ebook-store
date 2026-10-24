# Plan 001: زیرساخت دیزاین سیستم، فونت وزیرمتن، RTL و پیکربندی Shadcn/UI

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 293041b..HEAD -- src/app/layout.tsx src/app/globals.css package.json`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `293041b`, 2026-10-24

## Why this matters

پروژه کتابگرد نیاز به یک بستر بصری منسجم، کاملاً فارسی و راست‌چین (RTL) همراه با تایپوگرافی چشم‌نواز (فونت استاندارد وزیرمتن) دارد. بدون پیکربندی اصولی Shadcn/UI و توکن‌های استاندارد Tailwind CSS، توسعه‌دهندگان ممکن است کامپوننت‌های پراکنده و کلاس‌های استایل غیراستاندارد ایجاد کنند که باعث افت ۵۰ نمره ارزیابی Shadcn/UI می‌شود. اجرای این پلن زیربنای مستحکم، یکپارچه و استاندارد تمام صفحات و کامپوننت‌ها را پایه‌ریزی می‌کند.

## Current state

- فایل‌های موجود مرتبط:
  - `package.json` — پروژه خام Next.js 16.4.3 و Tailwind v4 بدون وابستگی‌های آیکون یا ابزارهای رادیکس/شَدسن.
  - `src/app/layout.tsx` — در حال حاضر به صورت چپ‌چین (`lang="en"`) با فونت انگلیسی Geist پیکربندی شده است:
    ```tsx
    export default function RootLayout({ children }: LayoutProps<"/">) {
      return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
          <body className="min-h-full flex flex-col">{children}</body>
        </html>
      );
    }
    ```
  - `src/app/globals.css` — شامل متغیرهای پایه سیاه و سفید بدون پالت رنگی اختصاصی سازگار با دیزاین فیدیبو/طاقچه (Teal `#00A389`).
  - نمونه دیزاین رفرنس: فایل `C:\Users\user\Desktop\sample\code.html` از رنگ فیروزه‌ای شاخص `brand-600: #00A389`، رنگ مکمل کهربایی `#F59E0B`، رنگ هشدار مرجانی `#FF5722` و فونت `Vazirmatn` استفاده کرده است.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Install deps | `npm install lucide-react clsx tailwind-merge class-variance-authority sonner next-themes` | exit 0 |
| Shadcn Init | `npx shadcn@latest init -d -y` | exit 0, creates `components.json` |
| Add components | `npx shadcn@latest add button badge card dialog sheet tabs separator progress slider scroll-area input -y` | exit 0 |
| Typecheck | `npx tsc --noEmit` | exit 0, no errors |
| Build test | `npm run build` | exit 0 |

## Suggested executor toolkit

- مهارت `shadcn`: رعایت قوانین composition (مانند استفاده از `DialogTitle` برای تمام دیالوگ‌ها، `cn()` برای ترکیب کلاس‌ها، عدم استفاده از `space-y-*` و استفاده از `flex flex-col gap-*`).
- مهارت `web-design-guidelines`: رعایت استانداردهای a11y، کنتراست رنگ و پشتیبانی کامل راست‌چین.

## Scope

**In scope**:
- `package.json` (نصب پکیج‌های مورد نیاز)
- `components.json` (ایجاد و تنظیم پیکربندی شَدسن)
- `src/app/layout.tsx` (تنظیم `dir="rtl"`، `lang="fa"`، فونت وزیرمتن و پرووایدر Toaster)
- `src/app/globals.css` (تعریف پالت تم فیروزه‌ای اختصاصی، متغیرهای استاندارد شَدسن و تایپوگرافی)
- `src/lib/utils.ts` (تابع هلپر `cn` استاندارد)
- `src/components/ui/*` (کامپوننت‌های رسمی شَدسن: Button, Badge, Card, Dialog, Sheet, Tabs, Separator, Progress, Slider, ScrollArea, Input)

**Out of scope**:
- ایجاد صفحات محتوایی یا کدهای لاجیک فروشگاه در `src/app/page.tsx` (مربوط به پلن 003).
- دستکاری فایل‌های غیرضروری در ریشه پروژه.

## Git workflow

- شاخه: `advisor/001-setup-design-system-and-shadcn`
- پیام‌های کامیت پیشنهادی:
  - `feat: setup vazirmatn font, rtl layout and tailwind theme tokens`
  - `feat: initialize shadcn ui and add core primitives`

## Steps

### Step 1: نصب وابستگی‌های پایه شَدسن، آیکون‌ها و تم دارک
نصب `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`, `sonner`, `next-themes` با دستور:
`npm install lucide-react clsx tailwind-merge class-variance-authority sonner next-themes`

**Verify**: `npm list lucide-react clsx tailwind-merge next-themes` → خروجی نسخه معتبر پکیج‌ها بدون ارور.

---

### Step 2: راه‌اندازی شَدسن و افزودن کامپوننت‌های پایه
اجرای دستور:
`npx shadcn@latest init -d -y`
سپس اضافه کردن کامپوننت‌های استاندارد مورد نیاز:
`npx shadcn@latest add button badge card dialog sheet tabs separator progress slider scroll-area input -y`

**Verify**: بررسی وجود فایل‌های `src/components/ui/button.tsx`، `src/components/ui/card.tsx`، `src/components/ui/dialog.tsx` و `components.json`.

---

### Step 3: تنظیم فونت وزیرمتن، پرووایدر تم و راست‌چین در `layout.tsx`
1. ساخت کامپوننت `src/components/theme-provider.tsx` جهت اتصال `next-themes` با ساپورت اتریبیوت `class`.
2. ساخت کامپوننت دکمه سوییچ تم `src/components/theme-toggle.tsx` با آیکون‌های Sun/Moon و انیمیشن انتقال ملایم.
3. در `src/app/layout.tsx`:
   - ایمپورت فونت `Vazirmatn` از `next/font/google`:
     ```tsx
     import { Vazirmatn } from "next/font/google";
     const vazirmatn = Vazirmatn({
       subsets: ["arabic", "latin"],
       variable: "--font-vazirmatn",
       display: "swap",
     });
     ```
   - تنظیم تگ `html` با ویژگی‌های `dir="rtl"`، `lang="fa"`, `suppressHydrationWarning` و کلاس فونت وزیرمتن.
   - احاطه فرزندان با `<ThemeProvider attribute="class" defaultTheme="light" enableSystem>`
   - قرار دادن کامپوننت `<Toaster position="bottom-left" dir="rtl" />` از پکیج `sonner` در انتهای `body`.
   - تنظیم متادیتای عنوان و توضیحات فارسی: «کتابگرد | فروشگاه آنلاین کتاب الکترونیک و صوتی».

**Verify**: اجرای `npx tsc --noEmit` بدون ارور تایپ‌اسکریپت.

---

### Step 4: پیکربندی توکن‌های رنگی، حالت لایت و دارک‌مود در `globals.css`
تمامی توکن‌های دیزاین و پالت‌های رنگی باید صرفاً و متمرکز در `src/app/globals.css` هم برای حالت لایت و هم برای حالت دارک تعریف شوند و هیچ استایل یا رنگ دلبخواهی هاردکد شده (مانند `text-[#...]` یا `bg-[#...]`) در کامپوننت‌ها مجاز نیست.

تعریف متغیرهای CSS و اتصال آن‌ها به `@theme inline` در Tailwind v4:
```css
@import "tailwindcss";

:root {
  /* پالت پایه لایت (مطابق نمونه C:\Users\user\Desktop\sample\code.html) */
  --background: #f8fafc;
  --foreground: #1e293b;

  /* سطوح کارت‌ها و پاپ‌اورها */
  --card: #ffffff;
  --card-foreground: #1e293b;
  --popover: #ffffff;
  --popover-foreground: #1e293b;

  /* رنگ اصلی فیدیبویی (Teal برند کتابگرد) */
  --primary: #00a389;
  --primary-foreground: #ffffff;
  --primary-hover: #008772;

  /* ثانویه و سطوح خنثی */
  --secondary: #f1f5f9;
  --secondary-foreground: #1e293b;
  --muted: #f1f5f9;
  --muted-foreground: #64748b;

  /* لهجه‌ها و هایلایت‌ها */
  --accent: #f0fdfa;
  --accent-foreground: #0f766e;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;

  /* خطوط و کادرها */
  --border: #e2e8f0;
  --input: #e2e8f0;
  --ring: #00a389;
  --radius: 0.75rem;

  /* توکن‌های بخش‌های ویژه */
  --gold: #f59e0b;
  --gold-foreground: #ffffff;
  --coral: #ff5722;
  --deal: #ef4444;

  /* تم‌های کتابخوان */
  --reader-sepia-bg: #fbf0d9;
  --reader-sepia-fg: #5f4b32;
  --reader-dark-bg: #18181b;
  --reader-dark-fg: #e4e4e7;
}

.dark {
  /* پالت پایه دارک‌مود مدرن و عمیق */
  --background: #090d16;
  --foreground: #f8fafc;

  --card: #131c2e;
  --card-foreground: #f8fafc;
  --popover: #131c2e;
  --popover-foreground: #f8fafc;

  --primary: #14b8a6;
  --primary-foreground: #042f2e;
  --primary-hover: #2dd4bf;

  --secondary: #1e293b;
  --secondary-foreground: #f8fafc;
  --muted: #1e293b;
  --muted-foreground: #94a3b8;

  --accent: #115e59;
  --accent-foreground: #ccfbf1;
  --destructive: #7f1d1d;
  --destructive-foreground: #fef2f2;

  --border: #1e293b;
  --input: #1e293b;
  --ring: #14b8a6;

  --gold: #fbbf24;
  --gold-foreground: #451a03;
  --coral: #ff7043;
  --deal: #f87171;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary-hover: var(--primary-hover);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --color-gold: var(--gold);
  --color-gold-foreground: var(--gold-foreground);
  --color-coral: var(--coral);
  --color-deal: var(--deal);

  --color-reader-sepia-bg: var(--reader-sepia-bg);
  --color-reader-sepia-fg: var(--reader-sepia-fg);
  --color-reader-dark-bg: var(--reader-dark-bg);
  --color-reader-dark-fg: var(--reader-dark-fg);

  --font-sans: var(--font-vazirmatn), sans-serif;
  --radius-xl: var(--radius);
}

/* افکت سایه کارت‌ها مطابق نمونه sample */
.card-shadow {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.card-shadow:hover {
  box-shadow: 0 12px 24px -6px rgba(0, 163, 137, 0.16), 0 4px 10px -2px rgba(0, 0, 0, 0.04);
  transform: translateY(-3px);
}
.dark .card-shadow {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}
.dark .card-shadow:hover {
  box-shadow: 0 12px 28px -4px rgba(20, 184, 166, 0.2);
  transform: translateY(-3px);
}
```

**قانون سخت‌گیرانه (Hard Enforcement)**: در هیچ فایلی از کلاس‌های رنگ دلبخواهی با براکت هگز (Hex) استفاده نمی‌شود؛ تمام کامپوننت‌ها موظف‌اند صرفاً از این توکن‌های نام‌گذاری‌شده استفاده کنند.

**Verify**: اجرای `npm run build` → بیلد موفقیت‌آمیز باشد.

---

## Test plan

- بررسی درستی تگ روت HTML در مرورگر: `dir="rtl"` و `lang="fa"`.
- بررسی کامپوننت‌های شَدسن اضافه شده: هر کامپوننت بدون خطای کامپایل بارگذاری شود.
- اجرای دستور `npx tsc --noEmit` برای اطمینان از سلامت کامل تایپ‌ها.

## Done criteria

- [ ] فایل `components.json` در ریشه پروژه قرار دارد.
- [ ] کامپوننت‌های شَدسن در مسیر `src/components/ui/` ایجاد شده‌اند.
- [ ] فونت وزیرمتن و جهت `dir="rtl"` در `src/app/layout.tsx` فعال است.
- [ ] `npm run build` با کد خروج 0 به پایان می‌رسد.
- [ ] ردیف پلن 001 در `plans/README.md` به وضعیت `DONE` تغییر می‌یابد.

## STOP conditions

- در صورتی که اجرای `npx shadcn@latest init` یا `add` با خطای ناسازگاری نسخه روبرو شد، با استفاده از فلگ `--legacy-peer-deps` پکیج‌ها بررسی شوند و از دستکاری دستی و غیراستاندارد ساختار کامپوننت‌ها خودداری گردد.
- در صورتی که فایل `package.json` دچار تضاد نسخه شد، بلافاصله گزارش شود.

## Maintenance notes

- تمام کامپوننت‌های آینده باید از `src/components/ui/` استفاده کنند و از ساخت دکمه‌ها یا دیالوگ‌های دستی با div خام خودداری شود.
- برای استایل‌ها همیشه از توکن‌های معنایی (`bg-primary`, `text-muted-foreground`, `border-border`) استفاده شود.
