import Link from "next/link";
import { api } from "@/lib/api";
import { tones } from "@/lib/tones";
import { cn, fa } from "@/lib/utils";
import { LessonVisual } from "@/features/learning/LessonVisual";
import { LessonTiles } from "@/features/learning/LessonTiles";
import { Mascot } from "@/components/brand/Mascot";

export const metadata = { title: "آکادمی یادگیری" };

/** آکادمی در محیط کودک: زبانه‌ی درشت برای هر موضوع و کاشی‌های تصویری، بدون متن طولانی */
export default async function KidsLearn({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const { s } = await searchParams;
  const [subjects, { data: lessons }] = await Promise.all([api.subjects(), api.lessons()]);
  const groups = subjects.map((sub) => ({ sub, items: lessons.filter((l) => l.subjectId === sub.id) })).filter((g) => g.items.length);
  const current = groups.find((g) => g.sub.slug === s) ?? groups[0];
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Mascot mood="wow" className="h-20 w-20" />
        <h1 className="text-4xl font-black">آکادمی یادگیری</h1>
      </div>
      <nav aria-label="موضوع‌ها" className="flex gap-3 overflow-x-auto pb-2">
        {groups.map(({ sub, items }) => {
          const active = sub.id === current?.sub.id;
          return (
            <Link
              key={sub.id}
              href={`/kids/learn?s=${sub.slug}`}
              aria-current={active ? "page" : undefined}
              className={cn(
                "shrink-0 rounded-full border-[3px] border-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)] px-5 py-2.5 text-lg font-black transition",
                active ? "bg-sun-400 shadow-[0_4px_0_var(--color-ink-200)]" : "bg-white hover:-translate-y-0.5",
              )}
            >
              {sub.title} <span className="text-base text-ink-500">{fa(items.length)}</span>
            </Link>
          );
        })}
      </nav>
      {current && current.items.length > 9 ? (
        <LessonTiles lessons={current.items} hrefBase="/kids/learn" big />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {current?.items.map((l) => (
            <Link key={l.id} href={`/kids/learn/${l.slug}`} className="flex flex-col overflow-hidden rounded-[2rem] border-[3px] border-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)] bg-white btn-3d [--btn-edge:var(--color-ink-200)]">
              <div className={cn("grid aspect-square place-items-center border-b border-ink-900/5 p-4", tones[l.tone].soft)}>
                {l.steps[0]?.visual && <LessonVisual visual={l.steps[0].visual} size="md" />}
              </div>
              <p className="p-3 text-center text-lg font-black leading-tight">{l.title}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
