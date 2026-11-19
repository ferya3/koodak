"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { DashboardResponse } from "@kidsworld/types";
import { ApiError, live } from "@/lib/api/live";
import { ChildSwitcher } from "./ChildSwitcher";
import { SettingsForm } from "./SettingsForm";

export function LiveSettings() {
  const router = useRouter();
  const childId = useSearchParams().get("child") ?? undefined;
  const [data, setData] = useState<DashboardResponse | null>(null);

  useEffect(() => {
    live.dashboard(childId).then(setData).catch((e) => e instanceof ApiError && e.status === 401 && router.replace("/auth/login?next=/parent/settings"));
  }, [childId, router]);

  const sel = data?.selected;
  if (!data) return <div className="h-96 animate-pulse rounded-2xl bg-calm-100" />;
  if (!sel?.settings) return <p className="text-calm-500">هنوز پروفایل کودکی ساخته نشده است.</p>;

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-sans text-2xl font-bold sm:text-3xl">کنترل و حریم خصوصی</h1>
        <ChildSwitcher items={data.children} activeId={sel.child.id} basePath="/parent/settings" />
      </header>
      <SettingsForm
        key={sel.child.id}
        initial={sel.settings}
        childName={sel.child.displayName}
        onSave={async (s) => {
          await live.updateSettings(sel.child.id, {
            daily_limit_minutes: s.dailyLimitMinutes,
            allowed_content_types: s.allowedContentTypes,
            sound_enabled: s.soundEnabled,
            screen_time_enabled: s.screenTimeEnabled,
            bedtime_lock: s.bedtimeLock,
          });
        }}
        onDelete={async () => {
          await live.deleteChild(sel.child.id);
          router.push("/parent");
        }}
      />
    </>
  );
}
