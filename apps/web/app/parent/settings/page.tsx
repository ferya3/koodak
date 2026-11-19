import { Suspense } from "react";
import { childById, children, parentSettings } from "@/lib/data/family";
import { ChildSwitcher } from "@/features/parent/ChildSwitcher";
import { SettingsForm } from "@/features/parent/SettingsForm";
import { LiveSettings } from "@/features/parent/LiveSettings";

export const metadata = { title: "کنترل و حریم خصوصی" };

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ child?: string }> }) {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Suspense>
          <LiveSettings />
        </Suspense>
      </div>
    );
  }
  const { child: id } = await searchParams;
  const child = childById(id ?? "") ?? children[0];
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-sans text-2xl font-bold sm:text-3xl">کنترل و حریم خصوصی</h1>
        <ChildSwitcher items={children} activeId={child.id} basePath="/parent/settings" />
      </header>
      <SettingsForm key={child.id} initial={parentSettings[child.id]} childName={child.displayName} />
    </div>
  );
}
