"use client";
import { useMemo, useState, useEffect } from "react";
import type { Difficulty, Subject, ToneKey, Worksheet, WorksheetTemplate } from "@kidsworld/types";
import { Chip } from "@/components/ui/Badge";
import { ContentCard } from "@/features/content/ContentCard";
import { Mascot } from "@/components/brand/Mascot";
import { difficultyLabel } from "@/lib/data/taxonomy";
import { tones } from "@/lib/tones";
import { fa } from "@/lib/utils";
import { templateLabel } from "./labels";

const PAGE = 24;
const PER_SHELF = 6;

/** نمای هر قفسه: نماد و رنگ (بر اساس slug موضوع؛ موضوع ناشناخته هم نمای پیش‌فرض دارد) */
const shelfLook: Record<string, { glyph: string; tone: ToneKey; ltr?: boolean }> = {
  "persian-letters": { glyph: "الف ب", tone: "coral" },
  "english-letters": { glyph: "Aa Bb", tone: "sky", ltr: true },
  numbers: { glyph: "۱ ۲ ۳", tone: "sun" },
  math: { glyph: "+ −", tone: "grass" },
  logic: { glyph: "▲●■", tone: "grape" },
  "mazes-tracing": { glyph: "↯", tone: "peach" },
  coloring: { glyph: "✎", tone: "berry" },
  "word-puzzles": { glyph: "ک ل م", tone: "mint" },
  "flash-cards": { glyph: "▭▭", tone: "lilac" },
};
const look = (s: Subject) => shelfLook[s.slug] ?? { glyph: s.title.slice(0, 2), tone: "lilac" as ToneKey };

/** جستجوی مقاوم: ی/ک عربی، نیم‌فاصله و فاصله‌های اضافه یکسان می‌شوند */
const norm = (t: string) => t.replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/‌/g, " ").replace(/\s+/g, " ").trim().toLowerCase();

/** عبارت‌های یک‌حرفی (مثل «ب» یا «A») فقط با کلمه‌ی کامل جور می‌شوند، وگرنه داخل همه‌ی کلمه‌ها پیدا می‌شوند */
const hit = (hay: string, t: string) => (t.length > 1 ? hay.includes(t) : ` ${hay.replace(/[«»"(),.:؛،]/g, " ")} `.includes(` ${t} `));

export function WorksheetLibrary({ items, shelves, initialAge, initialShelf, initialTemplate, initialQuery = "" }: { items: Worksheet[]; shelves: Subject[]; initialAge?: number; initialShelf?: string; initialTemplate?: WorksheetTemplate; initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery);
  const [age, setAge] = useState<number | undefined>(initialAge);
  const [shelf, setShelf] = useState<string | undefined>(initialShelf);
  const [template, setTemplate] = useState<WorksheetTemplate | undefined>(initialTemplate);
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>();
  const [freeOnly, setFreeOnly] = useState(false);
  const [limit, setLimit] = useState(PAGE);

  // همگام‌سازی سن و قفسه با URL برای اشتراک‌گذاری و SEO
  useEffect(() => {
    const url = new URL(window.location.href);
    const slug = shelves.find((s) => s.id === shelf)?.slug;
    if (age) url.searchParams.set("age", String(age));
    else url.searchParams.delete("age");
    if (slug) url.searchParams.set("subject", slug);
    else url.searchParams.delete("subject");
    if (template) url.searchParams.set("type", template);
    else url.searchParams.delete("type");
    window.history.replaceState(null, "", url);
  }, [age, shelf, template, shelves]);

  // با هر تغییر فیلتر، صفحه‌بندی از اول
  useEffect(() => setLimit(PAGE), [q, age, shelf, template, difficulty, freeOnly]);

  const shelfTitle = useMemo(() => new Map(shelves.map((s) => [s.id, s.title])), [shelves]);
  const haystack = useMemo(
    () => new Map(items.map((w) => [w.id, norm(`${w.title} ${w.description} ${templateLabel[w.template] ?? ""} ${shelfTitle.get(w.subjectId ?? "") ?? ""}`)])),
    [items, shelfTitle],
  );

  const base = useMemo(
    () =>
      items.filter(
        (w) =>
          (!age || (age >= w.minAge && age <= w.maxAge)) &&
          (!difficulty || w.difficulty === difficulty) &&
          (!freeOnly || w.access === "free"),
      ),
    [items, age, difficulty, freeOnly],
  );
  const terms = norm(q).split(" ").filter(Boolean);
  const results = base.filter(
    (w) =>
      (!shelf || w.subjectId === shelf) &&
      (!template || w.template === template) &&
      terms.every((t) => hit(haystack.get(w.id)!, t)),
  );

  // فقط نوع فعالیت‌هایی که در قفسه‌ی انتخاب‌شده وجود دارند
  const templates = useMemo(() => {
    const set = new Set(items.filter((w) => !shelf || w.subjectId === shelf).map((w) => w.template));
    return (Object.keys(templateLabel) as WorksheetTemplate[]).filter((t) => set.has(t));
  }, [items, shelf]);

  const countIn = (id: string) => base.filter((w) => w.subjectId === id).length;
  const filtering = Boolean(q.trim() || shelf || template);
  const anyFilter = filtering || Boolean(age || difficulty || freeOnly);

  const reset = () => {
    setQ("");
    setAge(undefined);
    setShelf(undefined);
    setTemplate(undefined);
    setDifficulty(undefined);
    setFreeOnly(false);
  };
  const openShelf = (id: string) => {
    setShelf(id);
    setTemplate(undefined);
    document.getElementById("ws-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-10">
      {/* قفسه‌ها */}
      <nav aria-label="قفسه‌های کاربرگ" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {shelves.map((s) => {
          const l = look(s);
          const active = shelf === s.id;
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={active}
              onClick={() => (active ? setShelf(undefined) : openShelf(s.id))}
              className={`group flex items-center gap-2 rounded-card sm:gap-3 border-2 p-3 text-start transition hover:-translate-y-0.5 ${active ? "border-ink-900 shadow-[0_4px_0_#1f1a3d]" : "border-ink-900/10 hover:border-ink-900/40"} ${tones[l.tone].soft}`}
            >
              <span
                dir={l.ltr ? "ltr" : "rtl"}
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl border-2 border-ink-900 font-display text-sm font-black leading-none sm:h-14 sm:w-14 sm:text-lg ${tones[l.tone].solid}`}
                aria-hidden="true"
              >
                {l.glyph}
              </span>
              <span className="min-w-0">
                <span className="block font-display text-sm font-extrabold leading-5 sm:text-base">{s.title}</span>
                <span className="text-sm font-bold text-ink-500">{fa(countIn(s.id))} کاربرگ</span>
              </span>
            </button>
          );
        })}
      </nav>

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
                placeholder="مثلاً: حرف ب، ماز، ساعت، A…"
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
              {templates.map((t) => (
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

        <section id="ws-results" aria-live="polite" className="scroll-mt-24">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <p className="font-bold text-ink-500">
              {shelf && <span className="me-2 font-display text-xl font-black text-ink-900">{shelfTitle.get(shelf)}</span>}
              {fa(filtering ? results.length : base.length)} کاربرگ
            </p>
            {anyFilter && (
              <button type="button" onClick={reset} className="text-sm font-extrabold text-coral-500 hover:underline">
                پاک کردن فیلترها
              </button>
            )}
          </div>

          {!filtering ? (
            /* نمای پیش‌فرض: چند نمونه از هر قفسه */
            <div className="space-y-12">
              {shelves.map((s) => {
                const list = base.filter((w) => w.subjectId === s.id);
                if (!list.length) return null;
                return (
                  <section key={s.id} aria-labelledby={`shelf-${s.id}`}>
                    <div className="mb-4 flex items-end justify-between gap-3">
                      <h2 id={`shelf-${s.id}`} className="text-2xl font-black">
                        {s.title}
                      </h2>
                      <button type="button" onClick={() => openShelf(s.id)} className="shrink-0 font-extrabold text-coral-500 hover:underline">
                        همه‌ی {fa(list.length)} کاربرگ ←
                      </button>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {list.slice(0, PER_SHELF).map((w) => (
                        <ContentCard key={w.id} content={w} />
                      ))}
                    </div>
                  </section>
                );
              })}
              {base.some((w) => !w.subjectId || !shelfTitle.has(w.subjectId)) && (
                <section aria-labelledby="shelf-other">
                  <h2 id="shelf-other" className="mb-4 text-2xl font-black">
                    کاربرگ‌های دیگر
                  </h2>
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {base
                      .filter((w) => !w.subjectId || !shelfTitle.has(w.subjectId))
                      .slice(0, PER_SHELF)
                      .map((w) => (
                        <ContentCard key={w.id} content={w} />
                      ))}
                  </div>
                </section>
              )}
            </div>
          ) : results.length ? (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {results.slice(0, limit).map((w) => (
                  <ContentCard key={w.id} content={w} />
                ))}
              </div>
              {results.length > limit && (
                <div className="mt-8 flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLimit((n) => n + PAGE)}
                    className="h-12 rounded-full border-2 border-ink-900 bg-sun-400 px-8 font-display font-extrabold shadow-[0_4px_0_#1f1a3d] transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
                  >
                    نمایش کاربرگ‌های بیشتر
                  </button>
                  <span className="text-sm font-bold text-ink-500">
                    {fa(limit)} از {fa(results.length)}
                  </span>
                </div>
              )}
            </>
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
    </div>
  );
}
