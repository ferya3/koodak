"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { live, LIVE } from "@/lib/api/live";
import type { Content, ToneKey } from "@kidsworld/types";
import { categories } from "@/lib/data/taxonomy";
import { achievements, earnedAchievements } from "@/lib/data/family";
import { recommend } from "@/lib/recommend";
import { tones } from "@/lib/tones";
import { cn, fa } from "@/lib/utils";
import { Avatar } from "@/components/brand/Avatar";
import { Mascot } from "@/components/brand/Mascot";
import { WorldIcon } from "@/components/brand/WorldIcon";
import { Stars } from "@/components/ui/Stars";
import { GameCover } from "@/features/games/GameCover";
import { StoryScene } from "@/features/stories/StoryScene";
import { LessonVisual } from "@/features/learning/LessonVisual";
import { useKid } from "@/features/kids/useKid";

/** مسیر هر دنیا در محیط کودک (دنیاهایی که هنوز محتوا ندارند «به‌زودی» نمایش داده می‌شوند) */
const worldHref: Record<string, string | null> = {
  "learning-academy": "/kids/learn",
  "brain-games": "/kids/play/memory-garden",
  "creative-studio": "/kids/studio",
  "fun-games": "/kids/play/pattern-train",
  "story-world": "/kids/story/little-cloud",
  "discovery-world": null,
  "music-sounds": null,
  "life-skills": null,
  "growth-center": null,
  worksheets: null,
};

const kidHref = (c: Content) => (c.type === "game" ? `/kids/play/${c.slug}` : c.type === "lesson" ? `/kids/learn/${c.slug}` : `/kids/story/${c.slug}`);

type Rec = { content: Content; reason: string };
type Badge = { id: string; title: string; description: string; icon: string; earned: boolean };

export default function KidsHome() {
  const { child, progress, ready } = useKid();
  // حالت متصل: پیشنهادها و مدال‌ها از سرور (موتور پیشنهاد و قواعد مدال در Backend)
  const [remote, setRemote] = useState<{ recs: Rec[]; badges: Badge[] } | null>(null);
  useEffect(() => {
    if (!LIVE || !child) return;
    Promise.all([live.recommendations(child.id, 3), live.achievements(child.id)])
      .then(([r, a]) =>
        setRemote({
          recs: r.data.map(({ content, reason }) => ({ content, reason })),
          badges: a.data.map((b) => ({ id: b.id, title: b.title, description: b.description, icon: b.icon, earned: Boolean(b.earnedAt) })),
        }),
      )
      .catch(() => null);
  }, [child]);

  if (!ready) return <div className="h-96" />;

  const name = child?.displayName ?? "دوست من";
  const age = child?.age ?? 5;
  const history = progress?.results ?? [];
  const recs: Rec[] =
    remote?.recs ??
    recommend({ age, favoriteCategoryIds: child?.favoriteCategoryIds ?? [] }, history, 8)
      .filter((r) => r.content.type !== "worksheet")
      .slice(0, 3);

  const today = new Date().toDateString();
  const todayResults = history.filter((r) => new Date(r.completedAt).toDateString() === today);
  const missions = [
    { label: "یک بازی فکری", done: todayResults.length >= 1, icon: "brain", tone: "grape" as ToneKey },
    { label: "۳ ستاره بگیر", done: todayResults.some((r) => r.stars === 3), icon: "star", tone: "sun" as ToneKey },
    { label: "یک نقاشی بکش", done: (progress?.drawings ?? 0) > 0, icon: "palette", tone: "berry" as ToneKey },
  ];
  const doneCount = missions.filter((m) => m.done).length;
  const earned = new Set(child ? earnedAchievements[child.id] ?? [] : []);
  const badges: Badge[] = remote?.badges ?? achievements.map((a) => ({ id: a.id, title: a.title, description: a.description, icon: a.icon, earned: earned.has(a.id) }));

  return (
    <div className="space-y-8">
      {/* ── سلام ── */}
      <section className="relative overflow-hidden rounded-[2rem] border-[3px] border-ink-900 bg-sun-300 p-5 sm:p-8">
        <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-sun-100/60" aria-hidden="true" />
        <div className="relative flex flex-wrap items-center gap-5">
          {child ? <Avatar kind={child.avatar} className="h-24 w-24 sm:h-28 sm:w-28" /> : <Mascot className="h-24 w-24" />}
          <div className="flex-1">
            <h1 className="text-4xl font-black sm:text-5xl">سلام {name}!</h1>
            <p className="mt-2 text-xl font-bold text-ink-700">امروز می‌خواهی کدام دنیا را کشف کنی؟</p>
          </div>
          <Mascot mood="cheer" className="hidden h-36 w-36 animate-float sm:block" />
        </div>
      </section>

      {/* ── مأموریت امروز ── */}
      <section aria-labelledby="mission-title" className="rounded-[2rem] border-[3px] border-ink-900 bg-white p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="mission-title" className="text-2xl font-black">
            مأموریت امروز
          </h2>
          <span className="rounded-full bg-grass-100 px-3 py-1 font-black text-grass-700">
            {fa(doneCount)} از {fa(missions.length)}
          </span>
        </div>
        <ul className="grid gap-3 sm:grid-cols-3">
          {missions.map((m) => (
            <li key={m.label} className={cn("flex items-center gap-3 rounded-3xl border-[3px] p-3", m.done ? "border-grass-500 bg-grass-100" : "border-ink-200 bg-cream-50")}>
              <span className={cn("grid h-14 w-14 shrink-0 place-items-center rounded-2xl", tones[m.tone].soft)}>
                <WorldIcon name={m.icon} className="h-10 w-10" />
              </span>
              <span className="flex-1 text-lg font-black">{m.label}</span>
              <span className={cn("grid h-9 w-9 place-items-center rounded-full border-[3px]", m.done ? "border-grass-500 bg-grass-400" : "border-ink-200 bg-white")} aria-label={m.done ? "انجام شد" : "انجام نشده"}>
                {m.done && (
                  <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
                    <path d="M5 10 L 9 14 L 15 6" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── پیشنهاد پیکو ── */}
      <section aria-labelledby="rec-title">
        <div className="mb-4 flex items-center gap-3">
          <Mascot mood="wow" className="h-14 w-14" />
          <h2 id="rec-title" className="text-2xl font-black">
            پیکو پیشنهاد می‌کنه
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {recs.map(({ content, reason }) => {
            const best = history.filter((h) => h.gameId === content.id).reduce((m, h) => Math.max(m, h.stars), 0);
            return (
              <Link key={content.id} href={kidHref(content)} className="group overflow-hidden rounded-[2rem] border-[3px] border-ink-900 bg-white btn-3d [--btn-edge:var(--color-ink-900)]">
                <div className="aspect-[4/3] overflow-hidden border-b-[3px] border-ink-900">
                  {content.type === "game" ? <GameCover game={content} className="h-full w-full transition duration-300 group-hover:scale-105" /> : content.type === "story" ? <StoryScene scene={content.chapters[0].scene} className="h-full w-full transition duration-300 group-hover:scale-105" /> : content.type === "lesson" && content.steps[0]?.visual ? <div className={cn("grid h-full w-full place-items-center", tones[content.tone].soft)}><LessonVisual visual={content.steps[0].visual} size="md" /></div> : null}
                </div>
                <div className="p-4">
                  <p className="text-xl font-black">{content.title}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-ink-500">{reason}</span>
                    {content.type === "game" && <Stars value={best} size="h-5 w-5" />}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── نقشه‌ی دنیاها ── */}
      <section aria-labelledby="worlds-title">
        <h2 id="worlds-title" className="mb-4 text-2xl font-black">
          دنیاها
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => {
            const href = worldHref[c.slug];
            const inner = (
              <>
                <span className={cn("grid aspect-square w-full max-w-36 place-items-center rounded-full border-[3px] border-ink-900", tones[c.tone].solid)}>
                  <WorldIcon name={c.icon} className="h-3/5 w-3/5 transition duration-300 group-hover:scale-110 group-hover:-rotate-6" />
                </span>
                <span className="text-lg font-black leading-tight">{c.title}</span>
              </>
            );
            return href ? (
              <Link key={c.id} href={href} className="group flex flex-col items-center gap-2 rounded-[2rem] p-2 text-center transition hover:bg-white/70">
                {inner}
              </Link>
            ) : (
              <div key={c.id} className="relative flex flex-col items-center gap-2 rounded-[2rem] p-2 text-center opacity-60" aria-label={`${c.title} – به‌زودی`}>
                {inner}
                <span className="absolute right-3 top-3 rounded-full border-2 border-ink-900 bg-white px-2 py-0.5 text-xs font-black">به‌زودی</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── قفسه‌ی مدال‌ها ── */}
      <section aria-labelledby="badges-title" className="rounded-[2rem] border-[3px] border-ink-900 bg-white p-5 sm:p-6">
        <h2 id="badges-title" className="mb-4 text-2xl font-black">
          مدال‌های من
        </h2>
        <ul className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {badges.map((a) => {
            const has = a.earned;
            return (
              <li key={a.id} className="flex flex-col items-center gap-2 text-center" title={a.description}>
                <span className={cn("grid h-20 w-20 place-items-center rounded-full border-[3px]", has ? "border-ink-900 bg-sun-100" : "border-dashed border-ink-300 bg-ink-50")}>
                  <WorldIcon name={has ? a.icon : "lock"} className={cn("h-12 w-12", !has && "opacity-40 grayscale")} />
                </span>
                <span className={cn("text-sm font-black", !has && "text-ink-300")}>{a.title}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
