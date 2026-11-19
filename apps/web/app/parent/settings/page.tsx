import { childById, children, parentSettings } from "@/lib/data/family";
import { ChildSwitcher } from "@/features/parent/ChildSwitcher";
import { SettingsForm } from "@/features/parent/SettingsForm";

export const metadata = { title: "کنترل و حریم خصوصی" };

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ child?: string }> }) {
  const { child: id } = await searchParams;
  const child = childById(id ?? "") ?? children[0];
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-sans text-2xl font-bold sm:text-3xl">کنترل و حریم خصوصی</h1>
        <ChildSwitcher activeId={child.id} basePath="/parent/settings" />
      </header>
      <SettingsForm key={child.id} initial={parentSettings[child.id]} childName={child.displayName} />
    </div>
  );
}
