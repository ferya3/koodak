"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { DashboardResponse } from "@kidsworld/types";
import { ApiError, live } from "@/lib/api/live";
import { Mascot } from "@/components/brand/Mascot";
import { DashboardView } from "./DashboardView";

/** حالت متصل: داده‌ی واقعی از GET /parent/dashboard (از طریق BFF) */
export function LiveDashboard() {
  const router = useRouter();
  const childId = useSearchParams().get("child") ?? undefined;
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    live
      .dashboard(childId)
      .then((d) => alive && setData(d))
      .catch((e) => {
        if (e instanceof ApiError && e.status === 401) router.replace(`/auth/login?next=/parent`);
        else if (alive) setError(e.message);
      });
    return () => {
      alive = false;
    };
  }, [childId, router]);

  if (error) return <p className="rounded-2xl bg-coral-100 p-4 font-bold text-coral-700">{error}</p>;
  if (!data) return <div className="mx-auto h-96 max-w-6xl animate-pulse rounded-2xl bg-calm-100" aria-label="در حال بارگذاری" />;

  if (!data.selected) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-calm-200 bg-white p-10 text-center shadow-calm">
        <Mascot mood="wow" className="h-28 w-28" />
        <h1 className="mt-4 text-2xl font-bold">به KidsWorld خوش آمدید!</h1>
        <p className="mt-2 text-calm-500">اولین قدم: یک پروفایل برای فرزندتان بسازید.</p>
        <Link href="/parent/children/new" className="mt-6 rounded-xl bg-calm-900 px-6 py-3 font-bold text-white">ساخت پروفایل کودک</Link>
      </div>
    );
  }

  return <DashboardView data={data.selected} items={data.children} />;
}
