"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Plan } from "@kidsworld/types";
import { buttonClass } from "@/components/ui/Button";
import { ApiError, live, LIVE } from "@/lib/api/live";
import { cn, faNumber } from "@/lib/utils";

/**
 * کارت‌های اشتراک + انتخاب دوره‌ی پرداخت.
 * حالت متصل: «خرید» → POST /subscriptions/checkout → هدایت به درگاه زرین‌پال.
 * کاربر واردنشده ابتدا به ثبت‌نام هدایت می‌شود و پس از آن به همین صفحه برمی‌گردد.
 */
export function PricingPlans({ plans }: { plans: Plan[] }) {
  const router = useRouter();
  const [period, setPeriod] = useState<"monthly" | "yearly">("yearly");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const buy = async (plan: Plan) => {
    setError(null);
    if (!LIVE) return router.push("/parent");
    if (plan.priceMonthly === 0) return router.push("/auth/register");
    if (plan.audience === "school") return router.push("/privacy#contact");
    setBusy(plan.id);
    try {
      const { redirectUrl } = await live.checkout(plan.id, period);
      window.location.href = redirectUrl;
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) router.push("/auth/register?next=/pricing");
      else setError(e instanceof Error ? e.message : "خطا در اتصال به درگاه پرداخت.");
      setBusy(null);
    }
  };

  if (plans.length === 0) {
    return <p className="mx-auto max-w-xl rounded-2xl bg-sun-100 p-6 text-center text-lg font-bold text-sun-700">اشتراک‌ها به‌زودی فعال می‌شوند. فعلاً همه‌ی محتوا رایگان در دسترس است!</p>;
  }

  return (
    <>
      <div className="mb-10 flex justify-center">
        <div className="inline-flex rounded-full bg-white p-1 shadow-soft ring-1 ring-ink-900/10" role="radiogroup" aria-label="دوره‌ی پرداخت">
          {(["monthly", "yearly"] as const).map((p) => (
            <button key={p} type="button" role="radio" aria-checked={period === p} onClick={() => setPeriod(p)}
              className={cn("rounded-full px-5 py-2 font-display font-extrabold transition", period === p ? "bg-ink-900 text-white" : "text-ink-700")}>
              {p === "monthly" ? "ماهانه" : "سالانه · ۲ ماه هدیه"}
            </button>
          ))}
        </div>
      </div>
      {error && <p role="alert" className="mx-auto mb-6 max-w-xl rounded-2xl bg-coral-100 p-3 text-center font-bold text-coral-700">{error}</p>}
      <div className="grid items-start gap-6 lg:grid-cols-3">
        {plans.map((p) => {
          const price = period === "yearly" ? p.priceYearly : p.priceMonthly;
          return (
            <div
              key={p.id}
              id={p.audience === "school" ? "school" : undefined}
              className={cn("relative scroll-mt-24 rounded-[2rem] p-7", p.highlighted ? "bg-gradient-to-b from-ink-900 to-[#2c2566] text-white shadow-float ring-1 ring-white/10 lg:-mt-4" : "bg-white shadow-soft ring-1 ring-ink-900/[0.06]")}
            >
              {p.highlighted && <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-l from-sun-400 to-peach-400 px-4 py-1 text-sm font-black text-ink-900 shadow-soft">پیشنهاد ما</span>}
              <h2 className="text-2xl font-black">{p.name}</h2>
              <p className={cn("mt-1 text-sm", p.highlighted ? "text-ink-200" : "text-ink-500")}>{p.tagline}</p>
              <p className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-4xl font-black">{price ? faNumber(price / 10) : "رایگان"}</span>
                {price > 0 && <span className={cn("text-sm", p.highlighted ? "text-ink-200" : "text-ink-500")}>تومان / {period === "yearly" ? "سال" : "ماه"}</span>}
              </p>
              {period === "yearly" && p.priceYearly > 0 && (
                <p className={cn("mt-1 text-xs font-bold", p.highlighted ? "text-sun-300" : "text-grass-700")}>
                  معادل ماهی {faNumber(Math.round(p.priceYearly / 12 / 10))} تومان
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
              <button type="button" onClick={() => buy(p)} disabled={busy !== null}
                className={buttonClass({ variant: p.highlighted ? "kid" : "secondary", tone: "sun", size: "lg", className: "mt-8 w-full" })}>
                {busy === p.id ? "در حال اتصال به درگاه…" : p.priceMonthly === 0 ? "ساخت حساب رایگان" : p.audience === "school" ? "درخواست دمو" : "خرید اشتراک"}
              </button>
            </div>
          );
        })}
      </div>
      <p className="mt-8 text-center text-sm text-ink-500">
        پرداخت امن از طریق درگاه زرین‌پال (شتاب). {!LIVE && "در حالت نمایشی، پرداخت غیرفعال است."}
      </p>
    </>
  );
}
