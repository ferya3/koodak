import Link from "next/link";
import type { Lesson } from "@kidsworld/types";
import { tones } from "@/lib/tones";
import { cn, fa } from "@/lib/utils";

/** نماد کوتاه یک درس برای کاشی‌های فشرده (حرف، حرف بزرگ/کوچک، عدد) */
export function lessonGlyph(l: Lesson): { text: string; ltr?: boolean } | null {
  const v = l.steps[0]?.visual;
  if (!v) return null;
  if (v.kind === "letter") return { text: v.value };
  if (v.kind === "forms") return { text: v.ltr ? v.forms.slice(0, 2).join("") : v.forms[0], ltr: v.ltr };
  // فقط درس‌های «عدد n»؛ درسی مثل «شمارش تا پنج» با عدد تصویر اولش اشتباه معرفی می‌شود
  if (v.kind === "number" && l.title.startsWith("عدد")) return { text: fa(v.value) };
  return null;
}

/**
 * شبکه‌ی فشرده برای موضوع‌های پرتعداد (مثل ۳۲ حرف الفبا): هر درس یک کاشی کوچک با حرف درشت.
 * درس‌های بدون نماد کوتاه با عنوانشان نمایش داده می‌شوند.
 */
export function LessonTiles({ lessons, hrefBase = "/learn", big }: { lessons: Lesson[]; hrefBase?: string; big?: boolean }) {
  return (
    <ul className={cn("grid gap-3", big ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-6" : "grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10")}>
      {lessons.map((l) => {
        const g = lessonGlyph(l);
        return (
          <li key={l.id}>
            <Link
              href={`${hrefBase}/${l.slug}`}
              title={l.title}
              className={cn(
                "relative flex aspect-square flex-col items-center justify-center rounded-2xl border-2 border-ink-900 transition hover:-translate-y-1 hover:shadow-[0_5px_0_#1f1a3d]",
                tones[l.tone].soft,
                big && "rounded-[1.6rem] border-[3px]",
              )}
            >
              <span dir={g?.ltr ? "ltr" : "rtl"} className={cn("font-display font-black leading-none text-ink-900", big ? "text-5xl" : "text-3xl", !g && "px-1 text-center text-sm")}>
                {g?.text ?? l.title}
              </span>
              {l.access === "premium" && (
                <span className="absolute -top-2 left-1 rounded-full border-2 border-ink-900 bg-sun-400 px-1.5 text-[10px] font-black" aria-label="ویژه">
                  ★
                </span>
              )}
              <span className="sr-only">{l.title}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
