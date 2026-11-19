import type { Metadata } from "next";
import { api } from "@/lib/api";
import { cn, faNumber } from "@/lib/utils";
import { Container, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Mascot } from "@/components/brand/Mascot";

export const metadata: Metadata = {
  title: "اشتراک‌ها و قیمت‌ها",
  description: "شروع رایگان؛ اشتراک خانواده برای دسترسی کامل و اشتراک ویژه‌ی مدارس و مهدکودک‌ها.",
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage() {
  const plans = await api.plans();
  return (
    <>
      <section className="bg-gradient-to-b from-sun-100 to-cream-50 pt-12">
        <Container className="text-center">
          <Mascot mood="cheer" className="mx-auto h-28 w-28" />
          <SectionHeading title="یک اشتراک، همه‌ی دنیاها" description="بدون تبلیغ، بدون خرید درون‌برنامه‌ای در محیط کودک. هر زمان خواستید لغو کنید." align="center" className="mt-4" />
        </Container>
      </section>
      <Container className="pb-12">
        <div className="grid items-start gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.id}
              id={p.audience === "school" ? "school" : undefined}
              className={cn("relative scroll-mt-24 rounded-[2rem] border-2 border-ink-900 p-7", p.highlighted ? "bg-ink-900 text-white shadow-lift lg:-mt-4" : "bg-white shadow-soft")}
            >
              {p.highlighted && <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border-2 border-ink-900 bg-sun-400 px-4 py-1 text-sm font-black text-ink-900">پیشنهاد ما</span>}
              <h2 className="text-2xl font-black">{p.name}</h2>
              <p className={cn("mt-1 text-sm", p.highlighted ? "text-ink-200" : "text-ink-500")}>{p.tagline}</p>
              <p className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-4xl font-black">{p.priceMonthly ? faNumber(p.priceMonthly / 10) : "رایگان"}</span>
                {p.priceMonthly > 0 && <span className={cn("text-sm", p.highlighted ? "text-ink-200" : "text-ink-500")}>تومان / ماه</span>}
              </p>
              {p.priceYearly > 0 && (
                <p className={cn("mt-1 text-xs font-bold", p.highlighted ? "text-sun-300" : "text-grass-700")}>
                  سالانه {faNumber(p.priceYearly / 10)} تومان · ۲ ماه هدیه
                </p>
              )}
              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm leading-6">
                    <svg viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true">
                      <circle cx="10" cy="10" r="9" fill={p.highlighted ? "#ffce3d" : "#4fcb72"} />
                      <path d="M6 10 L 9 13 L 14 7" stroke={p.highlighted ? "#1f1a3d" : "#fff"} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <ButtonLink href="/parent" variant={p.highlighted ? "kid" : "secondary"} tone="sun" size="lg" className="mt-8 w-full">
                {p.priceMonthly ? (p.audience === "school" ? "درخواست دمو" : "شروع ۷ روز رایگان") : "ساخت حساب رایگان"}
              </ButtonLink>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-ink-500">قیمت‌ها نمونه هستند و از پنل مدیریت (Plans) قابل تغییرند. پرداخت از طریق درگاه امن بانکی.</p>
      </Container>
    </>
  );
}
