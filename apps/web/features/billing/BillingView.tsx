"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError, live, LIVE } from "@/lib/api/live";
import { cn, fa, faNumber } from "@/lib/utils";

type Sub = Awaited<ReturnType<typeof live.subscription>>;
type Payments = Awaited<ReturnType<typeof live.payments>>["data"];
const date = new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" });

/** اشتراک و پرداخت‌ها؛ نتیجه‌ی بازگشت از درگاه با ?payment=paid|failed|error&ref=… نمایش داده می‌شود */
export function BillingView() {
  const router = useRouter();
  const q = useSearchParams();
  const result = q.get("payment");
  const [sub, setSub] = useState<Sub | null>(null);
  const [payments, setPayments] = useState<Payments>([]);

  useEffect(() => {
    if (!LIVE) return;
    Promise.all([live.subscription(), live.payments()])
      .then(([s, p]) => {
        setSub(s);
        setPayments(p.data);
      })
      .catch((e) => e instanceof ApiError && e.status === 401 && router.replace("/auth/login?next=/parent/billing"));
  }, [router]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-sans text-2xl font-bold sm:text-3xl">اشتراک و پرداخت</h1>

      {result && (
        <div role="status" className={cn("rounded-2xl p-4 font-bold", result === "paid" ? "bg-grass-100 text-grass-700" : "bg-coral-100 text-coral-700")}>
          {result === "paid" && <>پرداخت با موفقیت انجام شد و اشتراک فعال است. کد پیگیری: <span dir="ltr">{q.get("ref")}</span></>}
          {result === "failed" && "پرداخت انجام نشد یا لغو شد. اگر مبلغی کسر شده باشد، حداکثر ظرف ۷۲ ساعت به حساب شما برمی‌گردد."}
          {result === "error" && "تأیید پرداخت با درگاه موقتاً ممکن نشد. وضعیت سفارش بعداً به‌روز می‌شود؛ لطفاً دوباره پرداخت نکنید."}
        </div>
      )}

      {!LIVE ? (
        <p className="rounded-2xl bg-sun-100 p-4 text-sm font-bold text-sun-700">حالت نمایشی: اطلاعات اشتراک پس از اتصال به API نمایش داده می‌شود.</p>
      ) : (
        <>
          <section className="rounded-2xl border border-calm-200 bg-white p-5 shadow-calm">
            <h2 className="font-bold">اشتراک فعلی</h2>
            {sub === null ? (
              <div className="mt-3 h-16 animate-pulse rounded-xl bg-calm-100" />
            ) : sub.subscription ? (
              <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div><dt className="text-calm-500">پلن</dt><dd className="font-bold">{sub.subscription.plan.name}</dd></div>
                <div><dt className="text-calm-500">دوره</dt><dd className="font-bold">{sub.subscription.billingPeriod === "yearly" ? "سالانه" : "ماهانه"}</dd></div>
                <div><dt className="text-calm-500">اعتبار تا</dt><dd className="font-bold">{date.format(new Date(sub.subscription.expiresAt))}</dd></div>
                <div><dt className="text-calm-500">پروفایل کودک</dt><dd className="font-bold">تا {fa(sub.entitlements.maxChildren)}</dd></div>
              </dl>
            ) : (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-calm-500">پلن رایگان (۱ پروفایل کودک، محتوای رایگان)</p>
                <Link href="/pricing" className="rounded-xl bg-calm-900 px-4 py-2 text-sm font-bold text-white">ارتقا به خانواده</Link>
              </div>
            )}
          </section>

          <section className="overflow-hidden rounded-2xl border border-calm-200 bg-white shadow-calm">
            <h2 className="border-b border-calm-100 p-5 font-bold">پرداخت‌ها</h2>
            {payments.length === 0 ? (
              <p className="p-5 text-sm text-calm-500">هنوز پرداختی ثبت نشده است.</p>
            ) : (
              <ul className="divide-y divide-calm-100">
                {payments.map((p) => (
                  <li key={p.id} className="flex flex-wrap items-center gap-3 p-4 text-sm">
                    <span className="flex-1 font-bold">{p.plan} · {p.billingPeriod === "yearly" ? "سالانه" : "ماهانه"}</span>
                    <span className="tabular-nums">{faNumber(p.amount / 10)} تومان</span>
                    <span className="text-calm-500">{date.format(new Date(p.paidAt ?? p.createdAt))}</span>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", p.status === "paid" ? "bg-grass-100 text-grass-700" : p.status === "failed" ? "bg-coral-100 text-coral-700" : "bg-calm-100 text-calm-700")}>
                      {p.status === "paid" ? "موفق" : p.status === "failed" ? "ناموفق" : "در انتظار"}
                    </span>
                    {p.refId && <span className="w-full text-xs text-calm-500 sm:w-auto">کد پیگیری: <span dir="ltr">{p.refId}</span></span>}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
