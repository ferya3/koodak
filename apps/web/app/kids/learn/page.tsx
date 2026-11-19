import Link from "next/link";
import { api } from "@/lib/api";
import { tones } from "@/lib/tones";
import { cn } from "@/lib/utils";
import { LessonVisual } from "@/features/learning/LessonVisual";
import { Mascot } from "@/components/brand/Mascot";

export const metadata = { title: "آکادمی یادگیری" };

/** آکادمی در محیط کودک: یک شبکه از کاشی‌های درشت تصویری، بدون متن طولانی */
export default async function KidsLearn() {
  const [subjects, { data: lessons }] = await Promise.all([api.subjects(), api.lessons()]);
  const subjectTitle = (id?: string) => subjects.find((s) => s.id === id)?.title;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Mascot mood="wow" className="h-20 w-20" />
        <h1 className="text-4xl font-black">آکادمی یادگیری</h1>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {lessons.map((l) => (
          <Link key={l.id} href={`/kids/learn/${l.slug}`} className="flex flex-col overflow-hidden rounded-[2rem] border-[3px] border-ink-900 bg-white btn-3d [--btn-edge:var(--color-ink-900)]">
            <div className={cn("relative grid aspect-square place-items-center border-b-[3px] border-ink-900 p-4", tones[l.tone].soft)}>
              {l.steps[0]?.visual && <LessonVisual visual={l.steps[0].visual} size="md" />}
              {subjectTitle(l.subjectId) && (
                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-black">{subjectTitle(l.subjectId)}</span>
              )}
            </div>
            <p className="p-3 text-center text-lg font-black leading-tight">{l.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
