# Plan 012: جایگزینی تگ‌های خام HTML با کامپوننت‌های رسمی Shadcn/UI

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 6e1c9c6..HEAD -- src/components/header.tsx src/components/footer.tsx src/components/book-card.tsx src/components/book-shelf.tsx src/components/hero-banner.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/008-standardize-cn-utility-and-clean-dependencies.md, plans/011-complete-css-tokens-and-eliminate-hardcoded-colors.md
- **Category**: tech-debt
- **Planned at**: commit `6e1c9c6`, 2026-10-24

## Why this matters

در سراسر پروژه بیش از ۳۵ مورد تگ خام HTML مثل `<button>` و ۳ مورد تگ خام `<input>` استفاده شده است. این در حالی است که کامپوننت‌های شادسن `Button` و `Input` با مدیریت کامل فوکوس، حلقه‌های فوکوس دسترس‌پذیر (`focus-visible:ring-ring`), متغیرهای اندازه (`size="sm"`, `size="icon"`), واریانت‌های CVA و فونت استاندارد در پوشه `src/components/ui/` پیاده‌سازی شده‌اند.
استفاده از تگ‌های خام باعث ناسازگاری رفتار کلیک و فوکوس کیبورد، فقدان استایل‌های یکنواخت دکمه‌ها و شکستن استانداردهای دسترسی‌پذیری و دیزاین سیستم می‌شود. جایگزینی این تگ‌ها با کامپوننت‌های شادسن ظاهر برنامه را کاملاً یکدست و حرفه‌ای می‌کند.

## Current state

- ورودی‌های خام در `src/components/header.tsx:273, 348`:
  ```tsx
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="جستجوی کتاب، نویسنده، مترجم یا ناشر..."
    className="w-full pl-10 pr-10 py-2.5 bg-muted/60 hover:bg-muted text-xs sm:text-sm rounded-2xl border border-transparent focus:border-primary focus:bg-background outline-none transition-all placeholder:text-muted-foreground"
  />
  ```
- ورودی خام در `src/components/footer.tsx:182`:
  ```tsx
  <input
    type="email"
    placeholder="ایمیل خود را وارد کنید..."
    className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-primary transition-colors text-foreground"
  />
  ```
- دکمه خام علاقه‌مندی در `src/components/book-card.tsx:151`:
  ```tsx
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onToggleWishlist?.(book.id);
    }}
    aria-label="افزودن به علاقه‌مندی‌ها"
    className={cn(
      "p-1.5 rounded-full backdrop-blur-xs transition-colors cursor-pointer",
      ...
    )}
  >
    <Heart ... />
  </button>
  ```
- دکمه‌های اسکرول قفسه‌ها در `src/components/book-shelf.tsx:126, 134`:
  دو تگ `<button onClick={scrollPrev}>` و `<button onClick={scrollNext}>`.
- دکمه‌های بنر قهرمان در `src/components/hero-banner.tsx:68, 78`:
  تگ‌های دستی `<button>` به جای `Button` شادسن.

## Commands you will need

| Purpose   | Command                  | Expected on success |
|-----------|--------------------------|---------------------|
| Typecheck | `npx tsc --noEmit`       | exit 0, no errors   |
| Build     | `npm run build`          | exit 0, Compiled successfully |
| Check raw input | `git grep '<input\b' src/` | no matches found |

## Scope

**In scope**:
- `src/components/header.tsx`
- `src/components/footer.tsx`
- `src/components/book-card.tsx`
- `src/components/book-shelf.tsx`
- `src/components/hero-banner.tsx`
- `src/components/reader/ebook-reader.tsx`

**Out of scope**:
- فایل‌های درون `src/components/ui/` (آن‌ها پیاده‌ساز کامپوننت پایه هستند).

## Git workflow

- Branch: `advisor/012-replace-raw-html-with-shadcn`
- Commit message: `refactor(ui): replace raw button and input tags with shadcn Button and Input components`

## Steps

### Step 1: جایگزینی ورودی‌های خام با `<Input>` شادسن

1. در `src/components/header.tsx`:
   - کامپوننت `Input` را از `@/components/ui/input` ایمپورت کنید.
   - هر دو ورودی جستجو (دسکتاپ در خط ۲۷۳ و شیت موبایل در خط ۳۴۸) را با `<Input ... />` جایگزین کنید و پدینگ‌های دو طرف را با کلاس‌های کمکی برای آیکون‌های درون اینپوت حفظ نمایید.
2. در `src/components/footer.tsx`:
   - ورودی خبرنامه در خط ۱۸۲ را به `<Input type="email" ... />` تبدیل کنید.

**Verify**: اجرای دستور `git grep '<input\b' src/components/` نباید هیچ تگ خام اینپوتی بازگرداند (تنها فایل مجاز `src/components/ui/input.tsx` است).

### Step 2: جایگزینی دکمه‌های ناوبری و اسکرول در `src/components/book-shelf.tsx`

- در `src/components/book-shelf.tsx`:
  - کامپوننت `Button` را از `@/components/ui/button` ایمپورت کنید.
  - دکمه‌های اسکرول چپ و راست (خطوط ۱۲۶ و ۱۳۴) را به:
    ```tsx
    <Button
      variant="outline"
      size="icon-sm"
      onClick={scrollPrev}
      aria-label="اسکرول به قبل"
      className="rounded-full shadow-xs cursor-pointer"
    >
      <ChevronRight className="w-4 h-4" />
    </Button>
    ```
    و برای اسکرول بعد نیز به همان شکل با `ChevronLeft` تبدیل کنید.

### Step 3: اصلاح دکمه علاقه‌مندی در `src/components/book-card.tsx`

- در `src/components/book-card.tsx`:
  - دکمه علاقه‌مندی (خط ۱۵۱) را با `<Button variant="ghost" size="icon-sm" ...>` جایگزین کنید تا علاوه بر داشتن استایل hover متناسب با تم، دسترسی‌پذیری کیبورد را نیز ارائه دهد.

### Step 4: اصلاح دکمه‌های کال‌تو‌اکشن در `src/components/hero-banner.tsx`

- در `src/components/hero-banner.tsx`:
  - دکمه «مشاهده تخفیف‌ها» را به `<Button variant="default" size="lg" ...>` و دکمه «طرح‌های اشتراک بی‌نهایت» را به `<Button variant="outline" size="lg" ...>` تبدیل کنید.

### Step 5: جایگزینی دکمه‌های کنترل و تم در `src/components/reader/ebook-reader.tsx`

- در `src/components/reader/ebook-reader.tsx`:
  - دکمه‌های افزایش و کاهش اندازه قلم (خطوط ۲۳۱ و ۲۴۹) را با `<Button variant="ghost" size="icon-sm">` تنظیم کنید.
  - دکمه‌های انتخاب تم کتابخوان (روز، کاغذی، شب) در خطوط ۲۶۸، ۲۸۴ و ۳۰۰ را با کامپوننت `<Button>` شادسن هماهنگ سازید.

**Verify**: `npm run build` → بیلد موفق و تست عملکرد کلیک و فوکوس کیبورد.

## Done criteria

- [ ] هیچ تگ خام `<input>` در کامپوننت‌های پروژه خارج از `ui/input.tsx` وجود ندارد.
- [ ] دکمه‌های اسکرول قفسه‌ها، علاقه‌مندی کارت کتاب و بنر قهرمان با `Button` رسمی شادسن رندر می‌شوند.
- [ ] تست تایپ با `npx tsc --noEmit` بدون خطا پاس می‌شود.
- [ ] بیلد پروژه با `npm run build` با کد صفر تمام می‌شود.
- [ ] وضعیت پلن 012 در `plans/README.md` به `DONE` تغییر می‌یابد.

## STOP conditions

- اگر جایگزینی `Button` باعث تداخل در `e.stopPropagation()` کارت کتاب شود و کلیک روی دکمه علاقه‌مندی باعث باز شدن همزمان دیالوگ کتاب گردد، مطمئن شوید که متد `stopPropagation` داخل تابع `onClick` حفظ شده است.
