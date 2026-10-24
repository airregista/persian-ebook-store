# Plan 002: لایه داده فیدیبو (MCP/API Proxy)، تایپ‌ها و ماک رزرو آفلاین

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 293041b..HEAD -- src/lib/`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/001-setup-design-system-and-shadcn.md
- **Category**: architecture
- **Planned at**: commit `293041b`, 2026-10-24

## Why this matters

پروژه طبق الزام صورت‌مسئله باید داده‌های کتاب‌ها و دسته‌بندی‌ها را از سرور و API فیدیبو (مطابق پروژه `sepehr071/fidibo-mcp` و `sepehr071/iran-mcp`) واکشی کند. اما وابستگی مستقیم کلاینت به یک سرور خارجی در ارزیابی و اجرا ممکن است با خطاهای شبکه، محدودیت نرخ (Rate-limit) یا فیلترینگ مواجه شود و باعث اختلال در پروژه شود. این پلن یک لایه پراکسی سمت سرور در Next.js API Routes همراه با تایپ‌های شفاف و یک سیستم Fallback غنی و هوشمند پیاده‌سازی می‌کند تا تحت هر شرایطی پروژه ۱۰۰٪ بدون باگ و پرسرعت کار کند.

## Current state

- ساختار رفرنس فیدیبو در سرور `fidibo-mcp`:
  - اندپوینت‌های فیدیبو:
    - جستجو: `GET https://api.fidibo.com/flex/search/list/content?query=...`
    - لیست‌ها و قفسه‌ها: `POST https://api.fidibo.com/flex/list/book`
    - جزئیات کتاب: `GET https://api.fidibo.com/flex/book/item/{id}` و `GET https://api.fidibo.com/flex/page?pageName=BOOK_OVERVIEW&bookId={id}`
    - نظرات: `GET https://api.fidibo.com/flex/book/reviews/{slug}`
- داده‌های نمونه معتبر و استاندارد در `C:\Users\user\Desktop\sample\code.html`:
  - دارای فیلدهای: `id`, `title`, `author`, `translator`, `publisher`, `category`, `price`, `priceRaw`, `rating`, `cover`, `synopsis`, `excerpt`, `sampleText`, `duration` و `pages`.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Typecheck | `npx tsc --noEmit` | exit 0, no errors |
| Test API Route | `node -e "fetch('http://localhost:3000/api/books').then(r => r.json()).then(console.log)"` | Returns books list |
| Build test | `npm run build` | exit 0 |

## Scope

**In scope**:
- `src/types/book.ts` (تعریف اینترفیس‌های تایپ‌اسکریپت: `Book`, `BookReview`, `BookDetail`, `BookCategory`, `Shelf`)
- `src/lib/fidibo-client.ts` (ماژول کلاینت سمت سرور برای فراخوانی API فیدیبو و تبدیل به تایپ استاندارد)
- `src/lib/mock-books.ts` (مجموعه کتاب‌های غنی فارسی و متن‌های نمونه کتابخوان از نمونه رفرنس برای حالت آفلاین/رزرو)
- `src/lib/formatters.ts` (هلپرهای تبدیل اعداد انگلیسی به فارسی، فرمت تومان، محاسبه مدت زمان مطالعه)
- `src/app/api/books/route.ts` (اندپوینت عمومی دریافت کتاب‌ها بر اساس قفسه یا دسته‌بندی با پشتیبانی Fallback)
- `src/app/api/books/search/route.ts` (اندپوینت جستجوی زنده)
- `src/app/api/books/[id]/route.ts` (اندپوینت جزئیات کتاب و نظرات)

**Out of scope**:
- رندرینگ کلاینتی و صفحات UI (مربوط به پلن‌های 003، 004 و 005).

## Git workflow

- شاخه: `advisor/002-fidibo-data-layer-and-resilience`
- پیام‌های کامیت پیشنهادی:
  - `feat: add book domain types and persian formatters`
  - `feat: implement fidibo client with resilient fallback and api routes`

## Steps

### Step 1: تعریف اینترفیس‌های دامنه کتاب در `src/types/book.ts`
ایجاد فایل با فیلدهای زیر:
```typescript
export type BookType = 'ebook' | 'audio' | 'podcast';

export interface Book {
  id: string | number;
  title: string;
  author: string;
  translator?: string;
  narrator?: string;
  publisher: string;
  category: string;
  categoryName: string;
  price: number; // قیمت نهایی به تومان
  originalPrice?: number; // قیمت قبل تخفیف
  discountPercent?: number;
  rating: number;
  ratingsCount?: number;
  cover: string;
  badge?: string;
  isSpecialDeal?: boolean;
  type: BookType;
  duration?: string; // برای کتاب‌های صوتی
  pages?: number | string;
  synopsis: string;
  excerpt?: string;
  sampleText?: string[]; // پاراگراف‌های نمونه برای کتابخوان مرورگر
  slug?: string;
}

export interface BookReview {
  id: string;
  user: string;
  rating: number;
  date: string;
  text: string;
  likes: number;
}
```

**Verify**: `npx tsc --noEmit` بدون ارور.

---

### Step 2: پیاده‌سازی ابزارهای فرمت و اعداد فارسی در `src/lib/formatters.ts`
ایجاد توابع کمکی:
1. `toPersianDigits(n: number | string): string` (تبدیل اعداد به ارقام فارسی)
2. `formatToman(amount: number): string` (نمایش عدد با جداکننده سه‌رقمی و پسوند تومان: مثلاً «۸۵٬۰۰۰ تومان»)

**Verify**: تست تابع در Node:
`node -e "const { formatToman } = require('./src/lib/formatters.ts'); console.log(formatToman(85000))"`

---

### Step 3: ایجاد پایگاه داده رزرو در `src/lib/mock-books.ts`
انتقال دقیق ۸ عنوان کتاب برجسته از `C:\Users\user\Desktop\sample\code.html` (کتاب‌های راسل، بیونگ چول هان، جان برجر، بابک احمدی، ارلینگ کاگه، گاستون باشلار، اولیویا لینگ و نیچه) با متن کامل فصول و نمونه پاراگراف‌ها جهت تضمین فعال بودن کتابخوان درون‌مرورگر تحت هر شرایطی.

**Verify**: ایمپورت و اعتبارسنجی آرایه `MOCK_BOOKS` در تایپ‌اسکریپت.

---

### Step 4: پیاده‌سازی کلاینت فیدیبو در `src/lib/fidibo-client.ts`
نوشتن توابع ارتباط با فیدیبو:
1. `searchFidibo(query: string, kind?: string): Promise<Book[]>`
2. `getFidiboBookDetails(id: string | number): Promise<Book | null>`
3. `getFidiboBestsellers(): Promise<Book[]>`
4. مدیریت خطا و بازگشت به `MOCK_BOOKS` در صورت تایم‌اوت یا رد شدن درخواست توسط فیدیبو (`try/catch` امن).

**Verify**: اجرای تست کلاینت با `fetch` زنده به فیدیبو.

---

### Step 5: پیاده‌سازی Next.js API Routes
ایجاد روت‌های:
- `src/app/api/books/route.ts`: پشتیبانی از پارامترهای `shelf` (مانند `bestsellers`, `deals`, `audio`, `all`) و `category`.
- `src/app/api/books/search/route.ts`: پشتیبانی از کوئری `q`.
- `src/app/api/books/[id]/route.ts`: برگرداندن جزئیات کتاب انتخابی همراه با نظرات کاربران.

**Verify**: اجرای `npm run build` و اطمینان از تولید موفق مسیرهای API.

---

## Test plan

- فراخوانی روت `/api/books?shelf=bestsellers` و تایید بازگشت آرایه‌ای از آبجکت‌های معتبر `Book`.
- فراخوانی روت `/api/books/search?q=شازده` و تایید درستی پاسخ.
- تست سناریوی شبیه‌سازی قطعی اینترنت (Fallback Mode) و اطمینان از بازگرداندن داده‌های رزرو به جای خطای ۵۰۰.

## Done criteria

- [ ] فایل‌های `src/types/book.ts` و `src/lib/formatters.ts` ایجاد شده‌اند.
- [ ] مسیرهای API در `src/app/api/books/` به درستی پاسخ JSON با هدر مناسب بازمی‌گردانند.
- [ ] مکانیزم Fallback در صورت بروز خطای شبکه یا محدودیت فیدیبو فعال می‌شود.
- [ ] `npx tsc --noEmit` بدون هیچ‌گونه هشدار یا خطایی اجرا می‌شود.
- [ ] ردیف پلن 002 در `plans/README.md` به وضعیت `DONE` بروزرسانی می‌شود.

## STOP conditions

- اگر فیلتر فیدیبو منجر به بلاک شدن IP سرور شد، کلاینت نباید کرش کند، بلکه باید بلافاصله داده‌های غنی موجود در `MOCK_BOOKS` را ارائه دهد.

## Maintenance notes

- در صورت تغییر فرمت پاسخ API فیدیبو در آینده، تنها کافی است تابع تبدیل (Mapper) در `src/lib/fidibo-client.ts` ویرایش شود و تایپ‌های کلاینت دست‌نخورده باقی بمانند.
