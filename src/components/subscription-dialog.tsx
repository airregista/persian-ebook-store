"use client";

import * as React from "react";
import { Crown, Check, Sparkles, Zap, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PlanTier {
  id: string;
  name: string;
  duration: string;
  price: string;
  discountBadge?: string;
  badge?: string;
  description: string;
  highlighted?: boolean;
  popular?: boolean;
}

const PLANS: PlanTier[] = [
  {
    id: "1-month",
    name: "۱ ماهه",
    duration: "اشتراک یک‌ماهه",
    price: "۸۹٬۰۰۰ تومان",
    description: "دسترسی نامحدود به ده‌ها هزار کتاب و صوت",
  },
  {
    id: "3-months",
    name: "۳ ماهه",
    duration: "اشتراک سه‌ماهه",
    price: "۲۳۹٬۰۰۰ تومان",
    discountBadge: "۱۰٪ تخفیف",
    badge: "محبوب‌ترین",
    description: "بهترین انتخاب برای مطالعه فصلی پیوسته",
    popular: true,
  },
  {
    id: "12-months",
    name: "۱۲ ماهه (یک‌ساله)",
    duration: "اشتراک سالانه",
    price: "۷۹۰٬۰۰۰ تومان",
    discountBadge: "۲۵٪ تخفیف",
    badge: "پیشنهاد طلایی ویژه",
    description: "بیشترین صرفه‌جویی، یک سال دسترسی نامحدود بدون دغدغه",
    highlighted: true,
  },
];

const SHARED_BENEFITS = [
  "مطالعه نامحدود بیش از ۴۰٬۰۰۰ کتاب و پادکست",
  "دسترسی به کتابخوان و پخش‌کننده صوتی",
  "امکان مطالعه و شنیدن به صورت آفلاین",
  "اولویت دسترسی به تازه‌های نشر",
];

export function SubscriptionDialog({
  open,
  onOpenChange,
}: SubscriptionDialogProps) {
  const handleSelectPlan = () => {
    toast.success("اشتراک طلایی کتابگرد با موفقیت فعال شد");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[92vh] overflow-y-auto p-5 sm:p-7 text-foreground border-border bg-card">
        <DialogHeader className="items-center text-center space-y-2.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
            <Crown className="w-6 h-6" />
          </div>

          <DialogTitle className="text-xl sm:text-2xl font-black text-foreground">
            طرح‌های اشتراک طلایی کتابگرد
          </DialogTitle>

          <DialogDescription className="text-xs sm:text-sm text-muted-foreground max-w-md text-center">
            با تهیه اشتراک طلایی، به ده‌ها هزار عنوان کتاب متنی، صوتی و پادکست بدون محدودیت دسترسی داشته باشید.
          </DialogDescription>
        </DialogHeader>

        {/* Benefits Strip */}
        <div className="mt-4 p-4 rounded-2xl bg-muted/40 border border-border/80">
          <h4 className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>مزایای اشتراک طلایی کتابگرد:</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-muted-foreground">
            {SHARED_BENEFITS.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span className="font-medium text-foreground/90">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Cards Grid */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-2xl border p-4 flex flex-col justify-between transition-all card-shadow",
                plan.highlighted
                  ? "border-amber-500/60 bg-gradient-to-b from-amber-500/10 via-card to-card ring-2 ring-amber-500/20"
                  : plan.popular
                  ? "border-primary/60 bg-gradient-to-b from-primary/10 via-card to-card ring-2 ring-primary/20"
                  : "border-border bg-card"
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge
                    className={cn(
                      "text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs border-0",
                      plan.highlighted
                        ? "bg-amber-500 hover:bg-amber-500 text-white"
                        : "bg-primary hover:bg-primary text-primary-foreground"
                    )}
                  >
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div className="space-y-3 pt-1 text-right">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-foreground">{plan.name}</h3>
                  {plan.discountBadge && (
                    <Badge variant="destructive" className="text-[10px] font-bold px-1.5 py-0.2">
                      {plan.discountBadge}
                    </Badge>
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="text-xl sm:text-2xl font-black text-foreground">
                    {plan.price}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{plan.duration}</div>
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-border/60">
                <Button
                  type="button"
                  onClick={handleSelectPlan}
                  className={cn(
                    "w-full text-xs font-bold py-2.5 cursor-pointer shadow-xs",
                    plan.highlighted
                      ? "bg-amber-500 hover:bg-amber-600 text-white"
                      : plan.popular
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                  aria-label={`انتخاب ${plan.name} به مبلغ ${plan.price}`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>انتخاب و فعال‌سازی</span>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Guarantee Note */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-success shrink-0" />
            <span>فعال‌سازی آنی پس از انتخاب + قابل استفاده همزمان در تمامی دستگاه‌ها (موبایل، تبلت و وب)</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
