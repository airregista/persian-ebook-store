# Plan 003: ویترین فروشگاه، هدر، ناوبری، بنرهای قهرمان و قفسه‌های کتاب

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 293041b..HEAD -- src/components/ src/app/page.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: LOW
- **Depends on**: plans/001-setup-design-system-and-shadcn.md, plans/002-fidibo-data-layer-and-resilience.md
- **Category**: direction
- **Planned at**: commit `293041b`, 2026-10-24

## Why this matters

ویترین فروشگاه (Storefront) بخش اصلی تجربه کاربری و نخستین نقطه برخورد مخاطب با سایت کتابگرد است. طبق صورت‌مسئله، کاربر باید بتواند کتاب‌ها را بر اساس قفسه‌های مختلف (پرفروش‌ها، تخفیف‌های ویژه، کتاب‌های صوتی و دسته‌بندی موضوعی) مشاهده کند، قیمت‌ها و تخفیف‌ها را ببیند و در سایت جستجو کند. با پیاده‌سازی کامپوننت یکنواخت و اصولی کارت کتاب (`BookCard`) مبتنی بر Shadcn UI، از پراکندگی دیزاین جلوگیری شده و حداکثر امتیاز طراحی (UI/UX) و ساختار کامپوننت کسب می‌شود.

## Current state

- فایل `src/app/page.tsx` در حال حاضر صفحه پیش‌فرض create-next-app با آیکون‌های وِرسل و نکست است و باید با ویترین کامل کتابگرد جایگزین شود.
- طرح رفرنس در `C:\Users\user\Desktop\sample\code.html`:
  - بخش هدر چسبان (Sticky Header) با ناوبری و فیلد جستجوی زنده
  - بنر اعلان بالای صفحه (Announcement Bar)
  - پیل‌های دسته‌بندی موضوعی با قابلیت اسکرول افقی
  - بنر قهرمان (Hero Promotional Section)
  - قفسه‌های اسکرول‌شونده کتاب‌ها با دکمه‌های ناوبری قبلی/بعدی
  - فوتر غنی با لینک‌های دسترسی و نمادهای اعتماد

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Typecheck | `npx tsc --noEmit` | exit 0, no errors |
| Lint | `npm run lint` | exit 0 |
| Build test | `npm run build` | exit 0 |

## Suggested executor toolkit

- مهارت `shadcn`: استفاده از `Card`, `CardContent`, `CardFooter`, `Badge`, `Button`, `ScrollArea` بدون استایل‌دهی‌های غیراستاندارد.
- مهارت `web-design-guidelines`: دکمه‌ها باید دارای `aria-label` و تگ‌های متنی مناسب باشند، تصاویر دارای ویژگی `alt` معنادار و بدون ایجاد اسکرول ناخواسته افقی در صفحه.

## Scope

**In scope**:
- `src/components/book-card.tsx` (کامپوننت واحد و استاندارد کارت کتاب مبتنی بر Shadcn `Card`)
- `src/components/header.tsx` (هدر کامل با لوگو، منوی دسته‌ها، جستجو، نشانگرهای کتابخانه و علاقه‌مندی)
- `src/components/hero-banner.tsx` (بنر شیک فیدیبویی با گرادینت تیره و فیروزه‌ای و پروموشن ویژه)
- `src/components/category-nav.tsx` (نوارهای فیلتر دسته‌بندی اسکرول‌شونده)
- `src/components/book-shelf.tsx` (قفسه نمایش افقی با دکمه‌های اسکرول نرم شبیه طاقچه/فیدیبو)
- `src/components/footer.tsx` (فوتر جامع با ویژگی‌های سایت‌های مرجع)
- `src/app/page.tsx` (صفحه اصلی هماهنگ‌کننده بخش‌ها و مدیریت استیت جستجو و فیلتر)

**Out of scope**:
- لاجیک داخلی کتابخوان و پلیر صوتی (مربوط به پلن 005).
- مودال خرید و جزئیات کتاب (مربوط به پلن 004).

## Git workflow

- شاخه: `advisor/003-storefront-browsing-and-shelves`
- پیام‌های کامیت پیشنهادی:
  - `feat: implement reusable shadcn book card and book shelf component`
  - `feat: create header, hero banner, category navigation and footer`
  - `feat: integrate storefront view in main page with live search and filtering`

## Steps

### Step 1: ساخت کامپوننت یکپارچه کارت کتاب (`src/components/book-card.tsx`)
این کامپوننت باید از `Card`, `Badge` و `Button` از مجموعه Shadcn استفاده کند:
- نمایش تصویر جلد کتاب با نسبت ابعاد استاندارد ۳ به ۴ و انیمیشن Hover ملایم.
- نشان تخفیف درصدی قرمز رنگ (`bg-red-500 text-white`) در صورت وجود.
- نشان نوع محتوا: نشان متنی یا صوتی (با آیکون `Headphones`).
- عنوان کتاب (با کلاس `truncate font-bold text-sm text-foreground`).
- نام نویسنده/مترجم با کلاس `text-xs text-muted-foreground truncate`.
- قیمت نهایی و قیمت خط‌خورده قبلی (فرمت‌شده با `formatToman`).
- دکمه علاقه‌مندی (Heart) با ثبت رویداد بدون تداخل با کلیک روی کارت.
- کلیک روی کارت جهت ارسال شناسه به رویداد `onSelectBook(book.id)`.

**Verify**: `npx tsc --noEmit` بدون ارور.

---

### Step 2: ساخت کامپوننت قفسه کتاب‌ها (`src/components/book-shelf.tsx`)
- عنوان قفسه، آیکون اختصاصی و زیرعنوان توضیحی.
- دکمه‌های پیکان راست و چپ برای اسکرول روان محفظه بدون نوار اسکرول زشت (`no-scrollbar`).
- رندرینگ ریسپانسیو و روان مجموعه‌ای از `BookCard`.

**Verify**: بررسی کامپوننت با تایپ‌اسکریپت.

---

### Step 3: ساخت هدر و بنر اعلان (`src/components/header.tsx`)
- نوار اعلان بالایی با پس‌زمینه گرادینت تیره/فیروزه‌ای برای جشنواره کتاب و لینک اشتراک.
- هدر چسبان شیشه‌ای (`backdrop-blur-md bg-background/95 border-b border-border`).
- لوگوی اختصاصی «کتابگرد» با آیکون کتاب و پالت برند.
- اینپوت جستجوی متصل به فیلتر زنده کتاب‌ها با دکمه پاک‌کردن سریع.
- دکمه تغییر حالت روز/شب (ThemeToggle) با انیمیشن آیکون ماه و خورشید.
- دکمه‌های اکشن: نشانگر تعداد علاقه‌مندی‌ها با بَج مرجانی، دکمه «کتابخانه من» و دکمه ویژه اشتراک طلایی.

**Verify**: تست رفتار ریسپانسیو هدر در ابعاد موبایل و دسکتاپ و کارکرد دکمه تغییر تم لایت/دارک.

---

### Step 4: ساخت بنر پروموشن قهرمان و ناوبری دسته‌ها
- `src/components/hero-banner.tsx`: بنر با طراحی گرادینت شیک بر اساس نمونه `code.html`، شامل عنوان جشنواره، دکمه‌های CTA و کارت‌های شاخص معلق.
- `src/components/category-nav.tsx`: پیل‌های تعاملی برای فیلتر سریع: همه، رمان و داستان، روانشناسی، فلسفه، هنر، کتاب‌های صوتی و تخفیف‌ها.

**Verify**: تغییر فعال بودن پیل‌ها با کلیک و انتقال استیت به والد.

---

### Step 5: مونتاژ و یکپارچه‌سازی در `src/app/page.tsx`
- دریافت داده‌های کتاب‌ها از API فیدیبو / Fallback.
- بخش‌بندی صفحه با قفسه‌های:
  1. پرفروش‌ترین‌های کتابگرد
  2. پیشنهادهای شگفت‌انگیز و دارای تخفیف
  3. کتاب‌های صوتی و پادکست‌ها
  4. فهرست جامع بر اساس دسته‌بندی انتخاب‌شده
- مدیریت حالت جستجو: در صورت تایپ در هدر، نمایش آنی نتایج فیلترشده در یک گرید یکنواخت به همراه پیام عدم یافتن نتیجه (Empty State استاندارد).

**Verify**: اجرای `npm run build` و بازبینی صفحه اصلی در مرورگر.

---

## Test plan

- بررسی واکنش‌گرایی در صفحات با عرض 375px (موبایل) و 1280px (دسکتاپ).
- بررسی صحت فیلتر موضوعی و اسکرول روان قفسه‌ها به کمک دکمه‌های ناوبری.
- بررسی عملکرد اینپوت جستجو و پاک کردن آن.

## Done criteria

- [ ] کامپوننت یکنواخت `BookCard` در تمام قفسه‌ها بدون تغییر استایل متناقض استفاده شده است.
- [ ] هدر، بنر تبلیغاتی، پیل‌های موضوعی و فوتر کامل پیاده‌سازی شده‌اند.
- [ ] هیچ‌گونه اسکرول افقی در کل صفحه اصلی روی رزولوشن‌های مختلف رخ نمی‌دهد.
- [ ] `npm run build` با کد خروج 0 خاتمه می‌یابد.
- [ ] ردیف پلن 003 در `plans/README.md` به وضعیت `DONE` بروزرسانی می‌شود.

## STOP conditions

- اگر تصاویر کتاب‌ها لود نشد، کامپوننت `BookCard` باید بلافاصله یک تصویر جایگزین (Placeholder SVG با پالت برند) نمایش دهد و کرش نکند.
- از کامپوننت‌های دست‌ساز بدون ارتباط با Shadcn برای نشان‌ها و دکمه‌ها استفاده نشود.

## Maintenance notes

- اضافه کردن هر قفسه جدید در آینده صرفاً با فراخوانی مجدد کامپوننت `BookShelf` با پراپ‌های عنوان و فیلتر انجام می‌شود و نیاز به کدنویسی مجدد ندارد.
