"use client";

import * as React from "react";
import { BookMarked, Send, ShieldCheck, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FooterProps {
  onSelectCategory?: (category: string) => void;
  onOpenSubscription?: () => void;
  onOpenLibrary?: () => void;
  onOpenWishlist?: () => void;
  onScrollToShelf?: (shelfId: string) => void;
}

export function Footer({
  onSelectCategory,
  onOpenSubscription,
  onOpenLibrary,
  onOpenWishlist,
  onScrollToShelf,
}: FooterProps) {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-card border-t border-border mt-16 pt-12 pb-16 text-card-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Col 1: Brand & Bio */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-xs">
                <BookMarked className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-foreground">کتابگَرد</span>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground max-w-sm">
              کتابگرد پلتفرم قانونی خرید و دانلود کتاب الکترونیک و صوتی در ایران
              است. با استفاده از کتابخوان ابری کتابگرد می‌توانید در هر زمان و
              مکانی، هزاران کتاب را روی گوشی، تبلت یا رایانه خود ورق بزنید و
              لذت کتابخوانی مدرن را تجربه کنید.
            </p>

            <div className="flex items-center gap-3 text-muted-foreground">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors"
                aria-label="اینستاگرام"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors"
                aria-label="تلگرام"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors"
                aria-label="توییتر"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Fast Access / Categories */}
          <div className="md:col-span-2 space-y-3 text-xs">
            <h4 className="font-bold text-foreground mb-2 text-sm">دسته‌بندی‌ها</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory?.("literature")}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  داستان و رمان
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory?.("society")}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  روانشناسی و موفقیت
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory?.("philosophy")}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  فلسفه و اندیشه
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onScrollToShelf?.("shelf-audio")}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  کتاب‌های صوتی
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="md:col-span-2 space-y-3 text-xs">
            <h4 className="font-bold text-foreground mb-2 text-sm">خدمات کتابگرد</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <button
                  type="button"
                  onClick={onOpenSubscription}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  طرح‌های اشتراک بی‌نهایت
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenLibrary}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  کتابخانه من
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenWishlist}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  علاقه‌مندی‌ها
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory?.("all")}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  کتابخوان تحت‌وب
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Newsletter */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-bold text-foreground text-xs sm:text-sm">
              عضویت در خبرنامه تخفیف‌ها
            </h4>

            {subscribed ? (
              <div className="rounded-xl bg-primary/10 border border-primary/20 p-2.5 text-xs text-primary font-medium text-center">
                ایمیل شما با موفقیت در خبرنامه ثبت شد.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ایمیل شما..."
                  required
                  className="w-full text-xs bg-muted border border-border px-3 py-2 rounded-r-xl outline-none focus:border-primary text-foreground"
                />
                <Button
                  type="submit"
                  size="default"
                  variant="default"
                  className="rounded-r-none rounded-l-xl text-xs font-bold shrink-0"
                >
                  ثبت
                </Button>
              </form>
            )}

            <div className="flex items-center gap-2 pt-2">
              <div className="flex-1 p-2 border border-border rounded-xl bg-background/80 shadow-xs text-center">
                <ShieldCheck className="w-4 h-4 text-primary mx-auto mb-0.5" />
                <span className="text-[10px] font-bold text-foreground block">
                  ضمانت خرید
                </span>
                <span className="text-[9px] text-muted-foreground">
                  ۱۰۰٪ اصل و قانونی
                </span>
              </div>

              <div className="flex-1 p-2 border border-border rounded-xl bg-background/80 shadow-xs text-center">
                <Headphones className="w-4 h-4 text-amber-500 mx-auto mb-0.5" />
                <span className="text-[10px] font-bold text-foreground block">
                  پشتیبانی ۲۴/۷
                </span>
                <span className="text-[9px] text-muted-foreground">
                  پاسخگویی آنلاین
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-border/70 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>
            © ۱۴۰۳ پلتفرم کتابگرد. کلیه حقوق محفوظ است. الهام‌گرفته از تجربه
            مدرن فیدیبو و طاقچه.
          </p>
          <div className="flex items-center gap-3">
            <span>نسخه وب اپلیکیشن ۴.۲</span>
            <span>•</span>
            <span>ذخیره‌سازی سریع آفلاین (Local Engine)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
