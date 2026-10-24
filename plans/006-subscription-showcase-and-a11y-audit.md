# Plan 006: صفحه پلن‌های اشتراک کتابگرد، بررسی دسترسی‌پذیری و کنترل نهایی

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 293041b..HEAD -- src/`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/005-ebook-reader-and-audiobook-player.md
- **Category**: docs
- **Planned at**: commit `293041b`, 2026-10-24

## Why this matters

بخش اشتراک (مشابه فیدیبو پلاس یا طاقچه بی‌نهایت) در صورت‌مسئله به عنوان یکی از بخش‌های معتبر معرفی شده است: «قسمت اشتراک و این‌ها هم می‌تونه داشته باشه... صرفاً صفحه‌ش می‌تونه باشه حالا اطلاعاتش». علاوه بر این، ارزیابی ۵۰ نمره‌ای UI/UX و ۵۰ نمره‌ای سلامت کامل کد نیازمند ممیزی دقیق بر اساس استانداردهای Web Interface Guidelines (کنتراست، دسترسی‌پذیری کیبورد، عنوان دیالوگ‌ها و واکنش‌گرایی بدون اسکرول افقی) است تا پروژه بدون کوچک‌ترین نقصی تحویل داده شود.

## Current state

- بخش اشتراک در `C:\Users\user\Desktop\sample\code.html`:
  - پلن ۱ ماهه (۸۹٬۰۰۰ تومان)، ۳ ماهه (۲۳۹٬۰۰۰ تومان) و ۱ ساله (۷۹۰٬۰۰۰ تومان)
  - کارت‌های تعرفه با جدول مقایسه ویژگی‌ها و آیکون تیک سبز
- نیازمندی‌های دسترسی‌پذیری بر اساس مهارت `web-design-guidelines`:
  - تمام دکمه‌های آیکونی (Close, Heart, Search) باید دارای `aria-label` باشند.
  - تمامی مدال‌های شَدسن باید دارای `DialogTitle` باشند.
  - رنگ‌های پیش‌زمینه و پس‌زمینه باید کنتراست لازم (حداقل ۴.۵:۱) را پاس کنند.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Typecheck | `npx tsc --noEmit` | exit 0, no errors |
| Lint | `npm run lint` | exit 0 |
| Production Build | `npm run build` | exit 0 |

## Suggested executor toolkit

- مهارت `web-design-guidelines`: ممیزی UI و استانداردهای a11y.
- مهارت `shadcn`: رعایت توکن‌های معنایی و عدم استفاده از رنگ‌های سخت‌کد شده.

## Scope

**In scope**:
- `src/components/subscription-dialog.tsx` (مودال/نمای معرفی پلن‌های اشتراک کتابگرد با کارت‌های قیمت‌گذاری)
- ممیزی جامع a11y در تمامی فایل‌های `src/components/*`
- `src/app/globals.css` (بررسی کنتراست و پایداری تم در حالت‌های مختلف)

**Out of scope**:
- تغییر در مدل‌های داده یا قراردادهای API تثبیت‌شده در پلن‌های قبلی.

## Git workflow

- شاخه: `advisor/006-subscription-showcase-and-a11y-audit`
- پیام‌های کامیت پیشنهادی:
  - `feat: implement subscription showcase dialog with pricing plans`
  - `fix: complete a11y audit and web design guidelines verification`

## Steps

### Step 1: ساخت کامپوننت معرفی اشتراک (`src/components/subscription-dialog.tsx`)
- استفاده از `Dialog`, `Card`, `Badge` و `Button` از Shadcn.
- عنوان جذاب: «دسترسی نامحدود با اشتراک طلایی کتابگرد».
- سه پلن تعرفه:
  1. پلن ماهانه: ۸۹٬۰۰۰ تومان
  2. پلن فصلی (۳ ماهه): ۲۳۹٬۰۰۰ تومان با برچسب محبوب‌ترین
  3. پلن سالانه: ۷۹۰٬۰۰۰ تومان با ۲۵٪ تخفیف
- لیست ویژگی‌ها: مطالعه نامحدود بیش از ۴۰ هزار کتاب، بدون تبلیغات، دانلود برای حالت آفلاین.
- دکمه فعال‌سازی شبیه‌سازی‌شده که با کلیک روی آن پیام تبریک فعال‌سازی با `toast` صادر می‌شود.

**Verify**: `npx tsc --noEmit` بدون ارور.

---

### Step 2: ممیزی دسترسی‌پذیری و استانداردهای رابط وب (Audit)
بررسی تمام کامپوننت‌های نوشته شده:
1. اطمینان از وجود `aria-label` روی دکمه‌های آیکونی در `Header`, `BookCard`, `AudioPlayer`, `EbookReader`.
2. اطمینان از عدم وجود استایل‌های غیراستاندارد مانند `space-y-*` یا کلاس‌های منسوخ‌شده.
3. اطمینان از اینکه تگ `img` در کارت‌ها دارای `alt` مناسب با عنوان کتاب است.
4. اطمینان از عدم وجود اسکرول افقی روی عرض ۳۲۰ پیکسل تا ۲۵۶۰ پیکسل.

**Verify**: اجرای `npm run lint`.

---

### Step 3: اعتبارسنجی نهایی و اجرای تست بیلد
اجرای دستور کامپایل نهایی پروداکشن:
`npm run build`

**Verify**: تولید بدون خطای صفحات در پوشه `.next` و کد خروج 0.

---

## Test plan

- تست باز کردن مودال اشتراک از طریق بنر هدر و دکمه CTA طلایی بالای صفحه.
- تست ناوبری با کیبورد (کلید Tab و Enter روی دکمه‌ها و کلید Escape برای بستن مودال‌ها).
- تست بیلد استاتیک و بدون خطای Next.js.

## Done criteria

- [ ] نمای معرفی پلن‌های اشتراک کتابگرد با طراحی جذاب و مدرن در دسترس است.
- [ ] کلیه معیارهای دسترسی‌پذیری و Web Design Guidelines برآورده شده‌اند.
- [ ] `npm run lint` و `npm run build` با کد خروج 0 خاتمه می‌یابند.
- [ ] ردیف پلن 006 در `plans/README.md` به وضعیت `DONE` بروزرسانی می‌شود.

## STOP conditions

- در صورت مشاهده هرگونه خطای تایپ یا خطای بیلد در Next.js، فرآیند باید متوقف شده و خطای مورد نظر ریشه‌یابی و برطرف گردد.

## Maintenance notes

- پلن‌ها به‌گونه‌ای طراحی شده‌اند که هر توسعه‌دهنده یا ایجنت کمکی دیگری بتواند با مطالعه فایل‌های پوشه `plans/` به صورت کاملاً مستقل و گام‌به‌گام پروژه را تکمیل یا توسعه دهد.
