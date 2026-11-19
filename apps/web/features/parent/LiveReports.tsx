"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { ChildProfile } from "@kidsworld/types";
import { ApiError, live } from "@/lib/api/live";
import { ChildSwitcher } from "./ChildSwitcher";

type Report = { id: string; type: string; periodStart: string; periodEnd: string; status: string; format?: string };
const date = new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "long" });

/** گزارش‌ها در حالت متصل: ساخت در صف (Job) و دانلود از طریق BFF */
export function LiveReports() {
  const router = useRouter();
  const childParam = useSearchParams().get("child") ?? undefined;
  const [kids, setKids] = useState<ChildProfile[]>([]);
  const [reports, setReports] = useState<Report[] | null>(null);
  const [busy, setBusy] = useState(false);
  const childId = childParam ?? kids[0]?.id;

  useEffect(() => {
    live.children().then((r) => setKids(r.data)).catch((e) => e instanceof ApiError && e.status === 401 && router.replace("/auth/login?next=/parent/reports"));
  }, [router]);

  const load = useCallback(() => {
    if (childId) live.reports(childId).then((r) => setReports(r.data));
  }, [childId]);
  useEffect(load, [load]);

  const generate = async (type: "weekly" | "monthly") => {
    if (!childId) return;
    setBusy(true);
    await live.generateReport(childId, type).catch(() => null);
    setTimeout(() => {
      load();
      setBusy(false);
    }, 800);
  };

  const child = kids.find((k) => k.id === childId);
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-bold sm:text-3xl">گزارش‌های {child?.displayName ?? ""}</h1>
          <p className="mt-1 text-sm text-calm-500">گزارش در صف پردازش ساخته می‌شود و چند لحظه بعد آماده‌ی دانلود است.</p>
        </div>
        {child && <ChildSwitcher items={kids} activeId={child.id} basePath="/parent/reports" />}
      </header>
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-calm-200 bg-white p-5 shadow-calm">
        <div>
          <h2 className="font-bold">ساخت گزارش تازه</h2>
          <p className="text-sm text-calm-500">زمان استفاده، مهارت‌ها، فعالیت‌ها و پیشنهادها – آماده‌ی چاپ.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" disabled={busy} onClick={() => generate("weekly")} className="h-11 rounded-xl bg-calm-900 px-5 text-sm font-bold text-white disabled:opacity-50">گزارش هفتگی</button>
          <button type="button" disabled={busy} onClick={() => generate("monthly")} className="h-11 rounded-xl border border-calm-300 px-5 text-sm font-bold">گزارش ماهانه</button>
        </div>
      </section>
      <section className="overflow-hidden rounded-2xl border border-calm-200 bg-white shadow-calm">
        {reports === null ? (
          <div className="h-40 animate-pulse bg-calm-50" />
        ) : reports.length === 0 ? (
          <p className="p-6 text-sm text-calm-500">هنوز گزارشی ساخته نشده است.</p>
        ) : (
          <ul className="divide-y divide-calm-100">
            {reports.map((r) => (
              <li key={r.id} className="flex items-center gap-4 p-4">
                <span className={r.format === "pdf" ? "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-coral-100 text-xs font-black text-coral-700" : "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ocean-100 text-xs font-black text-ocean-700"}>{r.format === "pdf" ? "PDF" : "HTML"}</span>
                <span className="flex-1">
                  <span className="block font-bold">
                    گزارش {r.type === "monthly" ? "ماهانه" : "هفتگی"} · {date.format(new Date(r.periodStart))} تا {date.format(new Date(r.periodEnd))}
                  </span>
                  <span className="block text-xs text-calm-500">{r.status === "ready" ? "آماده" : r.status === "failed" ? "خطا در ساخت" : "در صف…"}</span>
                </span>
                {r.status === "ready" && (
                  <a href={`/api/v1/parent/reports/${r.id}/download`} className="h-9 rounded-lg border border-calm-300 px-3 text-sm font-bold leading-9 hover:bg-calm-50">دانلود</a>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
