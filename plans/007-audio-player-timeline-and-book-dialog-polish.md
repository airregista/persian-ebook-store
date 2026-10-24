# Plan 007: اصلاح نوار پیشرفت پخش صوتی و بازطراحی دیالوگ جزئیات کتاب با کامپوننت‌های Shadcn/UI

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat bb7f16f..HEAD -- src/components/ui/slider.tsx src/components/player/audio-player.tsx src/components/book-detail-dialog.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/004-book-details-reviews-and-purchase-flow.md, plans/005-ebook-reader-and-audiobook-player.md
- **Category**: bug / dx
- **Planned at**: commit `bb7f16f`, 2026-10-24

## Why this matters

1. **نمایش نوار زمان‌بندی پخش‌کننده صوتی:** هنگام پخش کتاب صوتی، نوار لغزنده (Slider) پایین صفحه که موقعیت ثانیه‌ها و پیشرفت صوت را نشان می‌دهد کاملاً نامرئی بود. علت آن است که کامپوننت `Slider` از انتخاب‌گرهای ناموجود `data-horizontal:` استفاده می‌کرد در حالی که پکیج `@base-ui/react/slider` صفت `data-orientation="horizontal"` را رندر می‌کند. این امر باعث می‌شد ارتفاع Track برابر ۰ پیکسل شده و کل نوار گم شود.
2. **ظاهر استاندارد و بدون به‌هم‌ریختگی دیالوگ جزئیات کتاب:** پنجره مودال هنگام کلیک روی کتاب نیازمند چیدمان تمیز، خوانا، واکنش‌گرا (موبایل و دسکتاپ) و استفاده یکدست از کامپوننت‌های رسمی Shadcn/UI (`Dialog`, `Tabs`, `Button`, `Badge`, `Separator`, `Card`) با پالت توکن‌های متمرکز بدون کلاس‌های رنگی دل‌بخواهی (`bg-teal-600` یا `bg-emerald-600`) است.

## Current state

- فایل `src/components/ui/slider.tsx` (سطرهای ۲۰ تا ۴۵):
  انتخاب‌گرهای کلاس با `data-horizontal:h-1` و `data-horizontal:w-full` تعریف شده‌اند که با خروجی رندر Base UI مطابقت نداشته و به ترک اسلایدر ارتفاع نمی‌دهند:
  ```tsx
  <SliderPrimitive.Track
    data-slot="slider-track"
    className="relative grow overflow-hidden rounded-full bg-muted select-none data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1"
  >
  ```
- فایل `src/components/player/audio-player.tsx` (سطرهای ۱۳۱ تا ۱۵۸):
  بخش تایم‌لاین شامل زمان سپری‌شده، اسلایدر و زمان کل است که اسلایدر به دلیل ارتفاع صفر در DOM محو می‌شود.
- فایل `src/components/book-detail-dialog.tsx`:
  دارای کلاس‌های رنگ هاردکد شده، عدم تطابق استایل تب‌ها و چیدمان نیازمند ساختاربندی بهتر در نماهای مختلف موبایل و دسکتاپ است.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Typecheck | `npx tsc --noEmit` | exit 0, no errors |
| Lint | `npm run lint` | exit 0 |
| Build test | `npm run build` | exit 0 |

## Scope

**In scope**:
- `src/components/ui/slider.tsx`
- `src/components/player/audio-player.tsx`
- `src/components/book-detail-dialog.tsx`

**Out of scope**:
- `src/context/player-context.tsx` (منطق تایمر و صدا صحیح است و نباید تغییر کند)
- `src/components/reader/ebook-reader.tsx` (کتابخوان کامل است)
- دیتابیس یا فایل‌های روت دیگر

## Steps

### Step 1: اصلاح کامپوننت اسلایدر Shadcn (`src/components/ui/slider.tsx`)

کامپوننت `Slider` را به‌گونه‌ای اصلاح کنید که ارتفاع استاندارد (`h-1.5`) و عرض کامل (`w-full`) را مستقیماً دریافت کند تا وابستگی نامعتبر به کلاس `data-horizontal` حذف شود:

الگوی پیاده‌سازی مورد انتظار برای `src/components/ui/slider.tsx`:
```tsx
import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "cn"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props) {
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max]

  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none select-none items-center py-2",
        className
      )}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted/80 select-none cursor-pointer"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="h-full bg-primary select-none transition-all duration-75"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="block size-3.5 rounded-full border-2 border-primary bg-background shadow-xs transition-transform hover:scale-125 focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:outline-none cursor-pointer select-none"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
```

**Verify**:
`npm run build` → موفق بدون خطا. اجرای یک تست سرور و بررسی ابعاد تگ `SliderPrimitive.Track` با ابزار DevTools که ارتفاع ۱.۵ واحد (۶ پیکسل) داشته باشد.

---

### Step 2: بهینه‌سازی تایم‌لاین در نوار صوتی (`src/components/player/audio-player.tsx`)

در `src/components/player/audio-player.tsx`:
1. مطمئن شوید بخش تایم‌لاین دارای کلاس `dir="ltr"`، زمان‌های عددی با کلاس فونت استاندارد (`tabular-nums font-mono text-[11px]`) و اسلایدر دارای فضای منعطف `flex-1` است.
2. بافر پدینگ و هاور اسلایدر بررسی شود تا کاربر بتواند به‌راحتی با کلیک یا درگ، موقعیت پخش صوت را تغییر دهد.

**Verify**:
`npm run build` → خروج ۰.

---

### Step 3: بازطراحی و تمیزکاری دیالوگ جزئیات کتاب (`src/components/book-detail-dialog.tsx`) با کامپوننت‌های Shadcn

دیالوگ جزئیات کتاب را با رعایت استانداردهای زیر بازنویسی و تمیز کنید:
1. **استفاده از کامپوننت‌های رسمی Shadcn:**
   - استفاده از `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`
   - استفاده از `Badge` برای موضوع، نوع کتاب (صوتی/الکترونیک) و برچسب تخفیف ویژه
   - استفاده از `Separator` از `@/components/ui/separator` بین بخش‌های اطلاعاتی
   - استفاده از `Card` یا ساختارهای منظم کادر برای مشخصات اثر (ناشر، شابک، زبان، صفحات/مدت) و بریده کتاب
   - استفاده از `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` استاندارد
2. **استفاده انحصاری از توکن‌های طراحی `globals.css`:**
   - دکمه‌های خرید و مطالعه باید از متغیرهای سیستم طراحی (`bg-primary text-primary-foreground hover:bg-primary/90`) یا واریانت‌های رسمی `Button` استفاده کنند و رنگ‌های موقت دلبخواهی نظیر `bg-teal-600` کاملاً حذف شوند.
3. **ریسپانسیو کامل و راست‌چین:**
   - در نمای موبایل (`< sm`): تصویر در مرکز، اطلاعات کتاب با فواصل متعادل، دکمه بستن در بالا-چپ بدون تداخل با بج‌ها، و دکمه‌های فوتر به صورت پشته‌ای یا منظم در دو ردیف قرار گیرند تا هیچ متنی فشرده یا بریده نشود.
   - در نمای دسکتاپ (`sm` به بالا): تصویر در سمت راست و متون در امتداد آن به زیبایی و تراز با جهت RTL قرار گیرند.
4. **بستن خودکار دیالوگ:**
   - با کلیک روی «مطالعه کتاب» یا «شنیدن کتاب صوتی»، دیالوگ فوراً بسته شده (`onOpenChange(false)`) و ریدر تمام صفحه یا پلیر زیرین فعال گردد.

**Verify**:
`npm run build` → خروج ۰، تولید صفحات استاتیک و روت‌های داینامیک بدون خطای هیدریشن.

---

## Test plan

1. اجرای کامند تست تایپ‌اسکریپت:
   `npx tsc --noEmit`
2. اجرای بیلد پروداکشن:
   `npm run build`
3. آزمون ظاهری در محیط مرورگر:
   - باز کردن سایت و کلیک روی یک کتاب صوتی در قفسه صوتی -> نوار باریک با رنگ فیروزه‌ای (`bg-primary`) در پایین صفحه همراه با پیشروی ثانیه‌شمار ظاهر شود و با درگ تغییر کند.
   - کلیک روی هر کتاب -> دیالوگ مرتب و شیک با کامپوننت‌های Shadcn، تب‌های تفکیک‌شده، بدون خطای کنسول و با طراحی کامپکت در موبایل و دسکتاپ باز شود.

## Done criteria

- [ ] نوار اسلایدر پلیر صوتی دارای ارتفاع مشخص (`h-1.5`) بوده و کاملاً در پایین صفحه قابل مشاهده و تعاملی است.
- [ ] در `src/components/book-detail-dialog.tsx` از کامپوننت‌های Shadcn/UI و توکن‌های طراحی استفاده شده و رنگ‌های دل‌بخواهی (`bg-teal-600`) حذف شده‌اند.
- [ ] هیچ خطای هیدریشن در کنسول مرورگر وجود ندارد (`<p>` حاوی `<div>` نباشد).
- [ ] کلیک روی مطالعه کتاب، دیالوگ را به صورت خودکار بسته و ریدر را باز می‌کند.
- [ ] دستور `npm run build` با کد خروج ۰ اجرا می‌شود.
- [ ] ردیف پلن 007 در `plans/README.md` به‌روزرسانی شده است.

## STOP conditions

- در صورتی که ساختار پکیج `@base-ui/react` دچار تغییر یا ناسازگاری با Tailwind شود، متوقف شده و گزارش دهید.
- در صورتی که تغییرات نیازمند دستکاری فایل‌های خارج از محدوده باشد، فوراً متوقف شوید.
