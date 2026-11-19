import { Suspense } from "react";
import { demoDashboard } from "@/lib/data/demoDashboard";
import { DashboardView } from "@/features/parent/DashboardView";
import { LiveDashboard } from "@/features/parent/LiveDashboard";

export const metadata = { title: "داشبورد" };

const LIVE = Boolean(process.env.NEXT_PUBLIC_API_URL);

export default async function ParentDashboard({ searchParams }: { searchParams: Promise<{ child?: string }> }) {
  if (LIVE) {
    return (
      <Suspense>
        <LiveDashboard />
      </Suspense>
    );
  }

  const { child } = await searchParams;
  const demo = demoDashboard(child);
  return (
    <DashboardView
      data={demo.selected!}
      items={demo.children}
      banner={<p className="rounded-xl bg-sun-100 px-4 py-2.5 text-sm font-bold text-sun-700">حالت نمایشی: داده‌ها نمونه هستند. با اتصال به API، داده‌ی واقعی خانواده‌ی شما نمایش داده می‌شود.</p>}
    />
  );
}
