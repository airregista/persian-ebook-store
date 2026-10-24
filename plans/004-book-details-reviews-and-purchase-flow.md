# Plan 004: مودال جزئیات کتاب، نظرات، علاقه‌مندی‌ها و فرآیند خرید لوکال

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 293041b..HEAD -- src/components/ src/hooks/`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/003-storefront-browsing-and-shelves.md
- **Category**: direction
- **Planned at**: commit `293041b`, 2026-10-24

## Why this matters

مشاهده جزئیات کامل هر کتاب (مشخصات چاپ، تعداد صفحه، بریده کتاب، نظرات خوانندگان و کتاب‌های مشابه) به همراه امکان افزودن به لیست علاقه‌مندی‌ها و خرید کتاب، قلب تجربه تعاملی فروشگاه کتابگرد است. طبق صورت‌مسئله، فرآیند خرید بدون نیاز به درگاه بانکی واقعی بوده و با کلیک بر روی دکمه خرید، باید یک مودال تأیید موفقیت‌آمیز ظاهر شده و کتاب در حافظه محلی مرورگر (`localStorage`) به عنوان کتاب خریداری‌شده ذخیره گردد تا دکمه‌های مطالعه فعال شوند.

## Current state

- ساختار مودال جزئیات در فایل رفرنس `C:\Users\user\Desktop\sample\code.html`:
  - بخش هدر مدال با تصویر جلد، اطلاعات مؤلف، ناشر، نمره ستاره‌ای و دسته‌بندی
  - تب‌های تعاملی «درباره کتاب»، «نظرات و بازخوردها» و «کتاب‌های مشابه»
  - دکمه اکشن هوشمند که قبل از خرید متن «خرید این کتاب - ۸۵٬۰۰۰ تومان» و پس از خرید متن سبز رنگ «شروع مطالعه کتاب» یا «شنیدن کتاب صوتی» را نشان می‌دهد.
  - مودال تأیید خرید با انیمیشن موفقیت‌آمیز و پیام هدایت به مطالعه.
  - مودال «کتابخانه من» و مودال «علاقه‌مندی‌ها».

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Typecheck | `npx tsc --noEmit` | exit 0, no errors |
| Lint | `npm run lint` | exit 0 |
| Build test | `npm run build` | exit 0 |

## Suggested executor toolkit

- مهارت `shadcn`: استفاده از `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` و `toast` از `sonner`.
  - **قانون حیاتی**: تمام `Dialog`ها باید حاوی `DialogTitle` باشند تا خطای دسترسی‌پذیری تولید نشود.
- هوک‌های سفارشی برای همگام‌سازی بی‌درنگ با `localStorage` و جلوگیری از خطای Hydration در SSR.

## Scope

**In scope**:
- `src/hooks/use-book-storage.ts` (هوک مدیریت وضعیت `localStorage` برای کتاب‌های خریداری‌شده و علاقه‌مندی‌ها)
- `src/components/book-detail-dialog.tsx` (مودال جامع نمایش اطلاعات کتاب، نظرات و تب‌ها)
- `src/components/checkout-dialog.tsx` (مودال شبیه‌سازی خرید موفق و فعال‌سازی مطالعه)
- `src/components/library-dialog.tsx` (مودال کتابخانه من شامل کتاب‌های خریداری‌شده و ذخیره‌شده)

**Out of scope**:
- صفحه ریدر متنی و پلیر صوتی (مربوط به پلن 005 که از طریق رویداد `onOpenReader` فراخوانی می‌شوند).

## Git workflow

- شاخه: `advisor/004-book-details-reviews-and-purchase-flow`
- پیام‌های کامیت پیشنهادی:
  - `feat: implement useBookStorage hook for localStorage state management`
  - `feat: create comprehensive book detail dialog with reviews and similar books`
  - `feat: add checkout success dialog and my library management modal`

## Steps

### Step 1: پیاده‌سازی هوک وضعیت کلاینت (`src/hooks/use-book-storage.ts`)
ایجاد هوک سفارشی با کلیدهای استاندارد `kg_wishlist_ids` و `kg_purchased_ids`:
```typescript
export function useBookStorage() {
  const [wishlist, setWishlist] = useState<(string | number)[]>([]);
  const [purchased, setPurchased] = useState<(string | number)[]>([]);
  // کنترل بارگذاری پس از مونت برای پیشگیری از SSR mismatch
  ...
  return {
    wishlist,
    purchased,
    toggleWishlist: (id: string | number) => void,
    isWishlisted: (id: string | number) => boolean,
    purchaseBook: (id: string | number) => void,
    isPurchased: (id: string | number) => boolean,
  };
}
```

**Verify**: `npx tsc --noEmit` بدون ارور.

---

### Step 2: پیاده‌سازی مودال جزئیات کتاب (`src/components/book-detail-dialog.tsx`)
- استفاده از `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle` از Shadcn.
- نمایش اطلاعات ناشر، نویسنده، مترجم، رده‌بندی سنی و فرمت کتاب.
- استفاده از `Tabs` جهت تفکیک:
  1. درباره کتاب (خلاصه داستان، شناسنامه کتاب و مشخصات فنی).
  2. نظرات خوانندگان (امتیاز میانگین، توزیع ستاره‌ها، نظرات ثبت‌شده با تاریخ شمسی).
  3. کتاب‌های پیشنهادی و مشابه در همان موضوع.
- فوتر وضعیت پویا:
  - اگر کتاب قبلاً خریداری شده: دکمه سبز رنگ با آیکون کتاب/هدفون برای باز کردن سریع کتابخوان/پلیر.
  - اگر هنوز خریداری نشده: دکمه ثبت خرید با نمایش قیمت تخفیف‌دار و دکمه قلبی علاقه‌مندی.

**Verify**: چک تگ‌های `DialogTitle` برای تمام سناریوها.

---

### Step 3: پیاده‌سازی مودال تأیید خرید شبیه‌سازی‌شده (`src/components/checkout-dialog.tsx`)
- پیام صمیمانه و شیک موفقیت‌آمیز: «تبریک! خرید شما با موفقیت ثبت شد».
- نمایش تصویر جلد، عنوان و مؤلف کتاب تهیه شده.
- دکمه فراخوان مستقیم: «ورود به کتابخوان و مطالعه» جهت باز کردن بلافاصله ریدر درون‌مرورگر.
- ثبت شناسه کتاب در `purchased` و نمایش نوتیفیکیشن با `toast.success`.

**Verify**: فراخوانی تست خرید و بررسی اضافه شدن شناسه به `localStorage`.

---

### Step 4: پیاده‌سازی مودال کتابخانه من (`src/components/library-dialog.tsx`)
- تب اول: کتاب‌های من (فهرست کتاب‌هایی که کاربر تهیه کرده به همراه دکمه‌های مستقیم مطالعه/شنیدن).
- تب دوم: لیست علاقه‌مندی‌ها (کتاب‌های بوک‌مارک شده به همراه دکمه خرید سریع و حذف از لیست).
- در صورت خالی بودن: نمایش حالت تهی (Empty State استاندارد شَدسن) با دکمه هدایت به ویترین فروشگاه.

**Verify**: باز کردن مودال و اطمینان از عملکرد تب‌ها و بستن مودال.

---

## Test plan

- تست افزودن یک کتاب به علاقه‌مندی‌ها و بازبینی شمارنده هدر.
- تست کلیک روی خرید کتاب: مشاهده مودال تأیید، بسته شدن و تبدیل دکمه به «مطالعه کتاب».
- ریفرش کردن صفحه مرورگر و اطمینان از باقی ماندن وضعیت کتاب در لیست خریداری‌شده‌ها.

## Done criteria

- [ ] افزودن و حذف از علاقه‌مندی‌ها بدون رفرش صفحه و به صورت آنی اعمال می‌شود.
- [ ] دکمه خرید در مودال جزئیات پس از خرید موفق به دکمه مطالعه تغییر شکل می‌دهد.
- [ ] مودال «کتابخانه من» لیست اقلام ذخیره و خریداری‌شده را به درستی تفکیک می‌کند.
- [ ] `npm run build` با کد خروج 0 انجام می‌شود.
- [ ] ردیف پلن 004 در `plans/README.md` به وضعیت `DONE` بروزرسانی می‌شود.

## STOP conditions

- در صورتی که دکمه خرید باعث خطای کنسول یا رندر مجدد نامتناهی شود، بررسی ساختار هوک `useBookStorage` و عدم اجرای همگام در بدنه رندر ضروری است.

## Maintenance notes

- این بخش کاملاً روی مرورگر کاربر متمرکز است و در صورت تصمیم آینده برای اتصال به بک‌اند یا درگاه واقعی شاپرک، تنها کافی است متد `purchaseBook` در `useBookStorage` به یک فراخوانی fetch به اندپوینت پرداخت متصل شود.
