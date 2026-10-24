# Plan 005: کتابخوان تعاملی درون‌مرورگر (E-book) و پخش‌کننده صوتی (Player)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 293041b..HEAD -- src/components/reader/ src/components/player/`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: LOW
- **Depends on**: plans/004-book-details-reviews-and-purchase-flow.md
- **Category**: direction
- **Planned at**: commit `293041b`, 2026-10-24

## Why this matters

این بخش، امکان **امتیازی و شاخص** تعیین‌شده در راهنمای پروژه است: «اگر دکمه خوندن کتاب رو بزنم و باز کردن کتاب رو بزنم این امتیازیه، میتونید اینو پیاده‌سازی بکنید که توی همین مرورگر یه یو‌آی شبیه طاقچه/فیدیبو بیاد و کتاب رو نمایش بده». پیاده‌سازی کتابخوان مدرن با امکان تغییر اندازه قلم و تم مطالعه (روشن، شب، کاغذی) به همراه پخش‌کننده روان کتاب صوتی با کنترل سرعت و نوار پیشرفت، پروژه را به یک پلتفرم کامل و متمایز تبدیل کرده و تضمین‌کننده نمره کامل ارزیابی است.

## Current state

- منطق و متدهای کتابخوان و پلیر در فایل رفرنس `C:\Users\user\Desktop\sample\code.html`:
  - توابع: `openReaderForBook`, `closeReader`, `changeReaderFontSize`, `setReaderTheme`, `handleReaderScroll`.
  - توابع پلیر: `loadAudioTrack`, `togglePlayAudio`, `skipAudio`, `seekAudio`, `cyclePlaybackSpeed`, `toggleMute`.
  - طراحی مینیمال و ارگونومیک با نوار پیشرفت مطالعه در بالای صفحه.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Typecheck | `npx tsc --noEmit` | exit 0, no errors |
| Lint | `npm run lint` | exit 0 |
| Build test | `npm run build` | exit 0 |

## Suggested executor toolkit

- مهارت `shadcn`: استفاده از `Slider`, `Progress`, `Button`, `Badge`, `ScrollArea` و `Dialog`.
- استانداردهای تایپوگرافی خوانا و کنتراست مناسب در تم‌های سه‌گانه کتابخوان.

## Scope

**In scope**:
- `src/components/reader/ebook-reader.tsx` (محیط مطالعه تمام‌صفحه با نوار ابزار، تنظیم فونت و تم‌های روز/شب/کاغذی)
- `src/components/player/audio-player.tsx` (پلیر چسبان پایین صفحه با کنترل پخش، پرش ۱۵ ثانیه، اسلایدر زمان و تغییر سرعت)
- `src/context/player-context.tsx` (کانتکست سراسری مدیریت پخش صوت جهت استمرار پخش در جابجایی بین بخش‌ها)

**Out of scope**:
- رمزگذاری DRM یا فرمت‌های انحصاری فایل (متون نمونه از فیلد `sampleText` کتاب‌ها تغذیه می‌شوند).

## Git workflow

- شاخه: `advisor/005-ebook-reader-and-audiobook-player`
- پیام‌های کامیت پیشنهادی:
  - `feat: implement in-browser ebook reader with themes and font controls`
  - `feat: create global audio player context and bottom player bar`

## Steps

### Step 1: ساخت کانتکست پخش کتاب‌های صوتی (`src/context/player-context.tsx`)
پیاده‌سازی استیت سراسری شامل:
- کتاب در حال پخش (`currentBook: Book | null`)
- وضعیت پخش (`isPlaying: boolean`)
- زمان فعلی و کل (`currentTime: number`, `duration: number`)
- سرعت پخش (`playbackRate: number` با مقادیر ۰.۷۵، ۱.۰، ۱.۲۵، ۱.۵ و ۲.۰)
- وضعیت بی‌صدا (`isMuted: boolean`)
- متدهای `playTrack(book)`, `togglePlay()`, `seek(time)`, `skip(seconds)`, `cycleSpeed()`, `closePlayer()`.

**Verify**: `npx tsc --noEmit` بدون ارور.

---

### Step 2: پیاده‌سازی پخش‌کننده صوتی ثابت (`src/components/player/audio-player.tsx`)
- نوار چسبان در پایین صفحه با انیمیشن ورود نرم (`slide-in-from-bottom`).
- سمت راست: تصویر بندانگشتی جلد، عنوان کتاب و نام گوینده/مؤلف.
- مرکز:
  - دکمه پرش به عقب (۱۵ ثانیه)
  - دکمه اصلی پخش/توقف با استایل برجسته فیروزه‌ای
  - دکمه پرش به جلو (۳۰ ثانیه)
  - نوار لغزنده پیشرفت زمان (`Slider` از Shadcn) و برچسب‌های زمان سپری‌شده و باقی‌مانده.
- سمت چپ: دکمه تغییر سرعت پخش (مثلاً `1.25x`)، دکمه قطع/وصل صدا و دکمه بستن پلیر.

**Verify**: تعامل با اسلایدر و به‌روزرسانی زمان‌ها در تایپ‌اسکریپت.

---

### Step 3: پیاده‌سازی کتابخوان مدرن درون‌مرورگر (`src/components/reader/ebook-reader.tsx`)
- نمای تمام‌صفحه یا مودال فراگیر بدون حواس‌پرتی (`fixed inset-0 z-50 flex flex-col`).
- نوار پیشرفت مطالعه افقی در بالاترین خط صفحه متناسب با اسکرول کاربر.
- هدر ابزارها:
  - دکمه بازگشت/خروج از کتابخوان
  - عنوان و نویسنده کتاب
  - کنترل اندازه قلم: دکمه‌های A- و A+ با گستره ۱۴ تا ۲۴ پیکسل
  - دکمه‌های انتخاب تم:
    - تم روز: پس‌زمینه سفید `#FFFFFF` و متن تیره
    - تم کاغذی/سپیا: پس‌زمینه کرم ملایم `#FBF0D9` و متن قهوه‌ای `#5F4B32`
    - تم شب: پس‌زمینه تیره `#18181B` و متن روشن `#E4E4E7`
- محتوای متن: رندر فصول و پاراگراف‌های روان فارسی با فونت وزیرمتن و فاصله خطوط بهینه.

**Verify**: بررسی عملکرد تغییر تم و سایز قلم در تست کلاینتی.

---

## Test plan

- تست باز کردن کتابخوان از روی یک کتاب خریداری‌شده: اطمینان از باز شدن نمای تمام‌صفحه با متن کتاب.
- تست کلیک روی دکمه‌های A- و A+: فونت متن بلافاصله کوچک و بزرگ شود.
- تست تغییر تم به «کاغذی» و «شب»: استایل پس‌زمینه و رنگ متن بدون تأخیر تغییر کند.
- تست کلیک روی دکمه شنیدن یک کتاب صوتی: پلیر در پایین صفحه ظاهر شده و قابلیت پخش/توقف و پرش فعال باشد.

## Done criteria

- [ ] کتابخوان متنی با قابلیت تغییر اندازه قلم، تغییر تم و محاسبه پیشرفت اسکرول به درستی کار می‌کند.
- [ ] پلیر کتاب صوتی در پایین صفحه همراه با اسلایدر زمان، تغییر سرعت و پخش پایدار عمل می‌کند.
- [ ] باز و بسته شدن محیط مطالعه بدون به هم ریختن صفحه اصلی انجام می‌شود.
- [ ] `npm run build` با کد خروج 0 به پایان می‌رسد.
- [ ] ردیف پلن 005 در `plans/README.md` به وضعیت `DONE` بروزرسانی می‌شود.

## STOP conditions

- کتابخوان نباید اسکرول ناخواسته به بدنه اصلی صفحه (Window Body) منتقل کند (`overflow-hidden` روی بادی هنگام باز بودن ریدر اعمال شود).

## Maintenance notes

- در آینده می‌توان قابلیت نشانه‌گذاری (Bookmark) و هایلایت متن را نیز به این ماژول کتابخوان الحاق کرد.
