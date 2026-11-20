"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Game, GameEvent } from "@kidsworld/types";
import { Mascot } from "@/components/brand/Mascot";
import { Stars } from "@/components/ui/Stars";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/Progress";
import { tones } from "@/lib/tones";
import { cn, fa } from "@/lib/utils";
import { bestStars, readProgress, writeProgress } from "@/lib/progress";
import { difficultyLabel } from "@/lib/data/taxonomy";
import { gameRegistry } from "./engine/registry";
import { live, LIVE } from "@/lib/api/live";
import type { Awards } from "@kidsworld/types";
import { playSfx } from "./engine/audio";
import type { GameRuntime, SessionStats } from "./engine/types";
import { GameCover } from "./GameCover";

type Phase = "intro" | "playing" | "result";

/**
 * GamePlayer – پوسته‌ی مشترک همه‌ی بازی‌ها
 * Level Manager · Timer · Scoring · Audio · Event Tracker · Progress Manager
 */
export function GamePlayer({ game, exitHref, variant = "public", offline = false }: { game: Game; exitHref: string; variant?: "public" | "kids"; /** بازی ساخت والدین: جلسه به سرور فرستاده نمی‌شود */ offline?: boolean }) {
  const def = gameRegistry[game.gameType];
  const [phase, setPhase] = useState<Phase>("intro");
  const [levelIdx, setLevelIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [seed, setSeed] = useState(1);
  const [sound, setSound] = useState(true);
  const [best, setBest] = useState<number[]>(() => game.levels.map(() => 0));
  const [result, setResult] = useState<{ stars: 1 | 2 | 3; score: number; stats: SessionStats } | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [awards, setAwards] = useState<Awards | null>(null);
  const remoteSession = useRef<Promise<string | null> | null>(null);

  const stats = useRef<SessionStats>({ correct: 0, mistakes: 0, durationSeconds: 0, events: [] });
  const startedAt = useRef(0);
  const level = game.levels[levelIdx];
  const t = tones[game.tone];

  useEffect(() => {
    setBest(game.levels.map((l) => bestStars(game.id, l.levelNumber)));
    try {
      setSound(localStorage.getItem("kw.sound") !== "off");
    } catch {}
  }, [game, phase]);

  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt.current) / 1000)), 1000);
    return () => clearInterval(id);
  }, [phase]);

  const track = (e: Omit<GameEvent, "at">) => stats.current.events.push({ ...e, at: Date.now() - startedAt.current });

  const start = (idx: number) => {
    setLevelIdx(idx);
    setSeed(Math.floor(Math.random() * 1e6) + 1);
    setProgress(0);
    setElapsed(0);
    stats.current = { correct: 0, mistakes: 0, durationSeconds: 0, events: [] };
    startedAt.current = Date.now();
    track({ type: "start", data: { level: game.levels[idx].levelNumber } });
    setAwards(null);
    // حالت متصل: POST /games/{slug}/sessions با توکن جلسه‌ی کودک (خطا = ادامه‌ی آفلاین)
    const childId = readProgress().activeChildId;
    remoteSession.current =
      LIVE && childId && !offline
        ? live.game.start(game.slug, childId, game.levels[idx].levelNumber).then((r) => r.sessionId).catch(() => null)
        : null;
    setPhase("playing");
  };

  const flash = (f: "correct" | "wrong") => {
    setFeedback(f);
    setTimeout(() => setFeedback(null), 700);
  };

  const finish = useCallback(() => {
    const s = stats.current;
    s.durationSeconds = Math.round((Date.now() - startedAt.current) / 1000);
    track({ type: "level_complete" });
    const stars = def.stars(s, level);
    const score = def.score(s);
    setResult({ stars, score, stats: { ...s } });
    playSfx("win", sound);
    writeProgress((p) => ({
      ...p,
      stars: p.stars + stars,
      points: p.points + score,
      results: [
        ...p.results.slice(-199),
        {
          sessionId: crypto.randomUUID?.() ?? String(Date.now()),
          gameId: game.id,
          childId: readProgress().activeChildId,
          level: level.levelNumber,
          score,
          stars,
          durationSeconds: s.durationSeconds,
          mistakes: s.mistakes,
          completedAt: new Date().toISOString(),
        },
      ],
    }));
    // حالت متصل: ارسال دسته‌ای رویدادها و ثبت نهایی؛ ستاره‌ی رسمی را سرور محاسبه می‌کند
    remoteSession.current?.then(async (id) => {
      if (!id) return;
      await live.game.events(id, s.events.slice(0, 200)).catch(() => null);
      const res = await live.game.complete(id, { correct: s.correct, mistakes: s.mistakes, durationSeconds: s.durationSeconds }).catch(() => null);
      if (res) setAwards(res.awards);
    });
    setPhase("result");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [def, level, sound, game.id]);

  const runtime: GameRuntime = useMemo(
    () => ({
      correct: (data) => {
        stats.current.correct++;
        track({ type: "correct", data });
        playSfx("correct", sound);
        flash("correct");
      },
      wrong: (data) => {
        stats.current.mistakes++;
        track({ type: "wrong", data });
        playSfx("wrong", sound);
        flash("wrong");
      },
      progress: setProgress,
      complete: finish,
      sfx: (n) => playSfx(n, sound),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sound, finish],
  );

  const toggleSound = () => {
    setSound((s) => {
      try {
        localStorage.setItem("kw.sound", s ? "off" : "on");
      } catch {}
      return !s;
    });
  };

  const Component = def.component;
  const kids = variant === "kids";

  return (
    <div className={cn("relative overflow-hidden rounded-[2rem] border-[3px] border-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)] bg-white shadow-lift", kids && "min-h-[calc(100dvh-7rem)]")}>
      {/* ── HUD ── */}
      <div className={cn("flex items-center gap-3 border-b border-ink-900/5 px-3 py-3 sm:px-5", t.soft)}>
        <Link href={exitHref} className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-[3px] border-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)] bg-white btn-3d [--btn-edge:var(--color-ink-200)]" aria-label="خروج از بازی">
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            <path d="M6 6 L18 18 M18 6 L6 18" stroke="#1f1a3d" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg font-black">{game.title}</p>
          {phase === "playing" && (
            <div className="mt-1 flex items-center gap-3">
              <span className="shrink-0 rounded-full bg-white px-2.5 py-0.5 text-xs font-extrabold">مرحله {fa(level.levelNumber)}</span>
              <ProgressBar value={progress * 100} tone="grass" className="h-3.5 max-w-xs" label="پیشرفت مرحله" />
              <span dir="ltr" className="hidden shrink-0 font-display text-sm font-bold tabular-nums text-ink-500 sm:inline">⏱ {fa(Math.floor(elapsed / 60))}:{fa(String(elapsed % 60).padStart(2, "0"))}</span>
            </div>
          )}
        </div>
        <button type="button" onClick={toggleSound} className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-[3px] border-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)] bg-white btn-3d [--btn-edge:var(--color-ink-200)]" aria-pressed={sound} aria-label={sound ? "قطع صدا" : "پخش صدا"}>
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            <path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" fill="#ffce3d" stroke="#1f1a3d" strokeWidth="2" strokeLinejoin="round" />
            {sound ? <path d="M16 9 C 17.5 10.5, 17.5 13.5, 16 15 M18.5 6.5 C 21.5 9.5, 21.5 14.5, 18.5 17.5" stroke="#1f1a3d" strokeWidth="2" fill="none" strokeLinecap="round" /> : <path d="M16 9 L 21 15 M21 9 L 16 15" stroke="#1f1a3d" strokeWidth="2" strokeLinecap="round" />}
          </svg>
        </button>
      </div>

      {/* ── INTRO ── */}
      {phase === "intro" && (
        <div className="grid gap-8 p-5 sm:p-10 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-3xl border-[3px] border-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)]">
            <GameCover game={game} className="aspect-[4/3] w-full" />
          </div>
          <div>
            <div className="flex items-start gap-3">
              <Mascot mood="happy" className="h-20 w-20 shrink-0" />
              <p className="relative rounded-3xl rounded-tr-md border-[3px] border-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)] bg-sun-100 px-5 py-4 font-display text-xl font-bold leading-9">{def.howTo}</p>
            </div>
            <h2 className="mt-6 font-display text-lg font-black text-ink-500">یک مرحله انتخاب کن</h2>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {game.levels.map((l, i) => {
                // در محیط کودک مراحل به ترتیب باز می‌شوند؛ در سایت عمومی همه آزادند
                const locked = kids && i > 0 && best[i - 1] === 0;
                return (
                  <button
                    key={l.levelNumber}
                    type="button"
                    disabled={locked}
                    onClick={() => start(i)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-3xl border-[3px] border-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)] p-3 btn-3d [--btn-edge:var(--color-ink-200)] disabled:opacity-50",
                      locked ? "bg-ink-100" : t.soft,
                    )}
                    aria-label={`مرحله ${l.levelNumber}${locked ? "، قفل" : ""}`}
                  >
                    <span className="font-display text-3xl font-black">{locked ? "🔒" : fa(l.levelNumber)}</span>
                    <span className="text-xs font-bold text-ink-500">{difficultyLabel[l.difficulty]}</span>
                    <Stars value={best[i]} size="h-4 w-4" />
                  </button>
                );
              })}
            </div>
            <Button variant="kid" tone="grass" size="xl" className="mt-6 w-full" onClick={() => start(Math.max(0, best.findIndex((b) => b === 0)))}>
              ▶ شروع بازی
            </Button>
          </div>
        </div>
      )}

      {/* ── PLAYING ── */}
      {phase === "playing" && (
        <div className="relative flex min-h-[480px] items-center justify-center bg-dots p-4 sm:p-8">
          <Component key={`${levelIdx}-${seed}`} level={level} runtime={runtime} seed={seed} />
          {feedback && (
            <div className="pointer-events-none absolute bottom-4 left-4 flex animate-pop items-center gap-2" aria-live="polite">
              <Mascot mood={feedback === "correct" ? "cheer" : "think"} className="h-16 w-16" />
              <span className={cn("rounded-2xl border-2 border-ink-900/10 px-3 py-1.5 font-display font-black", feedback === "correct" ? "bg-grass-300" : "bg-sun-300")}>
                {feedback === "correct" ? "آفرین!" : "دوباره امتحان کن"}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── RESULT ── */}
      {phase === "result" && result && (
        <div className="relative flex flex-col items-center px-5 py-10 text-center sm:py-14">
          <Confetti />
          <Mascot mood="cheer" className="h-36 w-36 animate-pop" />
          <h2 className="mt-4 text-4xl font-black">{result.stars === 3 ? "فوق‌العاده بود!" : result.stars === 2 ? "آفرین، عالی بود!" : "تمومش کردی، آفرین!"}</h2>
          <Stars value={result.stars} size="h-14 w-14" className="mt-4 animate-pop" />
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm font-bold">
            <span className="rounded-full bg-sun-100 px-4 py-2">⭐ {fa(result.score)} امتیاز</span>
            <span className="rounded-full bg-sky-100 px-4 py-2">⏱ {fa(result.stats.durationSeconds)} ثانیه</span>
            <span className="rounded-full bg-grass-100 px-4 py-2">✔ {fa(result.stats.correct)} درست</span>
          </div>
          {awards && awards.achievements.length > 0 && (
            <div className="mt-6 flex animate-pop flex-wrap justify-center gap-2" aria-live="polite">
              {awards.achievements.map((a) => (
                <span key={a.id} className="rounded-2xl border-2 border-ink-900/10 bg-sun-300 px-4 py-2 font-display font-black">🏅 مدال جدید: {a.title}</span>
              ))}
            </div>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {levelIdx + 1 < game.levels.length && (
              <Button variant="kid" tone="grass" size="lg" onClick={() => start(levelIdx + 1)}>
                مرحله‌ی بعد ←
              </Button>
            )}
            <Button variant="kid" tone="sky" size="lg" onClick={() => start(levelIdx)}>
              دوباره
            </Button>
            <Button variant="secondary" size="lg" onClick={() => setPhase("intro")}>
              انتخاب مرحله
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Confetti() {
  const colors = ["#ff7a66", "#ffce3d", "#4fcb72", "#4fb8f5", "#9b7bff", "#ff73b3"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 36 }, (_, i) => (
        <span
          key={i}
          className="absolute top-0 block h-3 w-2 animate-confetti rounded-sm"
          style={{ left: `${(i * 37) % 100}%`, backgroundColor: colors[i % colors.length], animationDelay: `${(i % 9) * 0.12}s`, animationDuration: `${2.2 + (i % 5) * 0.3}s` }}
        />
      ))}
    </div>
  );
}
