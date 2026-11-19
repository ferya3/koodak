"use client";
import { useMemo, useState, useEffect } from "react";
import type { Difficulty, Worksheet, WorksheetTemplate } from "@kidsworld/types";
import { Chip } from "@/components/ui/Badge";
import { ContentCard } from "@/features/content/ContentCard";
import { Mascot } from "@/components/brand/Mascot";
import { difficultyLabel } from "@/lib/data/taxonomy";
import { fa } from "@/lib/utils";
import { templateLabel } from "./labels";


export function WorksheetLibrary({ items, initialAge }: { items: Worksheet[]; initialAge?: number }) {
  const [q, setQ] = useState("");
  const [age, setAge] = useState<number | undefined>(initialAge);
  const [template, setTemplate] = useState<WorksheetTemplate | undefined>();
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>();
  const [freeOnly, setFreeOnly] = useState(false);

  // همگام‌سازی فیلتر سن با URL برای اشتراک‌گذاری و SEO
  useEffect(() => {
    const url = new URL(window.location.href);
    if (age) url.searchParams.set("age", String(age));
    else url.searchParams.delete("age");
    window.history.replaceState(null, "", url);
  }, [age]);

  const results = useMemo(
    () =>
      items.filter(
        (w) =>
          (!q || `${w.title} ${w.description}`.includes(q.trim())) &&
          (!age || (age >= w.minAge && age <= w.maxAge)) &&
          (!template || w.template === template) &&
          (!difficulty || w.difficulty === difficulty) &&
          (!freeOnly || w.access === "free"),
      ),
    [items, q, age, template, difficulty, freeOnly],
  );

  const reset = () => {
    setQ("");
    setAge(undefined);
    setTemplate(undefined);
    setDifficulty(undefined);
    setFreeOnly(false);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start" aria-label="فیلترها">
        <div>
          <label htmlFor="ws-q" className="mb-2 block font-display font-extrabold">
            جستجو
          </label>
          <div className="relative">
            <input
              id="ws-q"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="مثلاً: ماز، حرف ب، جمع…"
              className="h-12 w-full rounded-2xl border-2 border-ink-900 bg-white pe-4 ps-11 font-bold placeholder:font-normal placeholder:text-ink-300 focus:outline-none focus:ring-4 focus:ring-sky-300"
            />
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute start-3.5 top-1/2 h-5 w-5 -translate-y-1/2" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="6.5" stroke="#1f1a3d" strokeWidth="2.4" fill="none" />
              <path d="M15.5 15.5 L 20 20" stroke="#1f1a3d" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <fieldset>
          <legend className="mb-2 font-display font-extrabold">سن کودک</legend>
          <div className="flex flex-wrap gap-2">
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((a) => (
              <button
                key={a}
                type="button"
                aria-pressed={age === a}
                onClick={() => setAge(age === a ? undefined : a)}
                className={`grid h-11 w-11 place-items-center rounded-xl border-2 font-display text-lg font-black transition ${age === a ? "border-ink-900 bg-sun-400" : "border-ink-200 bg-white hover:border-ink-500"}`}
              >
                {fa(a)}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 font-display font-extrabold">نوع فعالیت</legend>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(templateLabel) as WorksheetTemplate[]).map((t) => (
              <Chip key={t} active={template === t} onClick={() => setTemplate(template === t ? undefined : t)}>
                {templateLabel[t]}
              </Chip>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 font-display font-extrabold">سطح دشواری</legend>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(difficultyLabel) as Difficulty[]).map((d) => (
              <Chip key={d} active={difficulty === d} onClick={() => setDifficulty(difficulty === d ? undefined : d)}>
                {difficultyLabel[d]}
              </Chip>
            ))}
          </div>
        </fieldset>

        <label className="flex cursor-pointer items-center justify-between rounded-2xl border-2 border-ink-200 bg-white p-3 font-bold">
          فقط رایگان‌ها
          <input type="checkbox" checked={freeOnly} onChange={(e) => setFreeOnly(e.target.checked)} className="h-5 w-5 accent-grass-500" />
        </label>
      </aside>

      <section aria-live="polite">
        <div className="mb-5 flex items-center justify-between">
          <p className="font-bold text-ink-500">{fa(results.length)} کاربرگ پیدا شد</p>
          {(q || age || template || difficulty || freeOnly) && (
            <button type="button" onClick={reset} className="text-sm font-extrabold text-coral-500 hover:underline">
              پاک کردن فیلترها
            </button>
          )}
        </div>
        {results.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((w) => (
              <ContentCard key={w.id} content={w} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-card border-2 border-dashed border-ink-300 bg-white px-6 py-14 text-center">
            <Mascot mood="think" className="h-32 w-32" />
            <h3 className="mt-4 text-xl font-black">چیزی پیدا نکردیم!</h3>
            <p className="mt-1 text-ink-500">فیلترها را کمتر کنید یا کلمه‌ی دیگری جستجو کنید.</p>
            <button type="button" onClick={reset} className="mt-4 font-extrabold text-coral-500 hover:underline">
              نمایش همه‌ی کاربرگ‌ها
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
