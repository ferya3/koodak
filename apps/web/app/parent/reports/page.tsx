import { Suspense } from "react";
import { childById, children } from "@/lib/data/family";
import { LiveReports } from "@/features/parent/LiveReports";
import { ChildSwitcher } from "@/features/parent/ChildSwitcher";
import { fa } from "@/lib/utils";

export const metadata = { title: "گزارش‌ها" };

const reports = [
  { period: "۲۴ تا ۳۰ آبان ۱۴۰۵", type: "هفتگی", status: "ready" },
  { period: "۱۷ تا ۲۳ آبان ۱۴۰۵", type: "هفتگی", status: "ready" },
  { period: "مهر ۱۴۰۵", type: "ماهانه", status: "ready" },
  { period: "۱۰ تا ۱۶ آبان ۱۴۰۵", type: "هفتگی", status: "ready" },
];

/** گزارش‌ها – تولید PDF در Backend با Job صف‌شده (POST /parent/reports/generate) */
export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ child?: string }> }) {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return (
      <Suspense>
        <LiveReports />
      </Suspense>
    );
  }
  const { child: id } = await searchParams;
  const child = childById(id ?? "") ?? children[0];
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-bold sm:text-3xl">گزارش‌های {child.displayName}</h1>
          <p className="mt-1 text-sm text-calm-500">هر شنبه صبح یک گزارش هفتگی به‌صورت خودکار ساخته می‌شود.</p>
        </div>
        <ChildSwitcher items={children} activeId={child.id} basePath="/parent/reports" />
      </header>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-calm-200 bg-white p-5 shadow-calm">
        <div>
          <h2 className="font-bold">ساخت گزارش سفارشی</h2>
          <p className="text-sm text-calm-500">بازه‌ی دلخواه را انتخاب کنید؛ فایل PDF چند دقیقه بعد آماده می‌شود.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select className="h-11 rounded-xl border border-calm-300 bg-white px-3 text-sm font-bold" aria-label="بازه">
            <option>۳۰ روز اخیر</option>
            <option>۳ ماه اخیر</option>
            <option>از ابتدای عضویت</option>
          </select>
          <button type="button" className="h-11 rounded-xl bg-calm-900 px-5 text-sm font-bold text-white hover:bg-calm-700">ساخت گزارش PDF</button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-calm-200 bg-white shadow-calm">
        <ul className="divide-y divide-calm-100">
          {reports.map((r, i) => (
            <li key={i} className="flex items-center gap-4 p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-coral-100 text-xs font-black text-coral-700">PDF</span>
              <span className="flex-1">
                <span className="block font-bold">گزارش {r.type} · {r.period}</span>
                <span className="block text-xs text-calm-500">{fa(4)} صفحه · زمان استفاده، مهارت‌ها، آثار هنری، پیشنهادها</span>
              </span>
              <button type="button" className="h-9 rounded-lg border border-calm-300 px-3 text-sm font-bold hover:bg-calm-50">دانلود</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
