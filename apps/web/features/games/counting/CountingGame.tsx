"use client";
import { useMemo, useState } from "react";
import { PlayIcon } from "@/components/brand/PlayIcon";
import { cn, fa, seeded, shuffle } from "@/lib/utils";
import type { GameComponentProps } from "../engine/types";

interface CountingConfig {
  max: number;
  rounds: number;
}

/** ماهی‌ها را بشمار – Learning Academy › Math › Number Sense */
export function CountingGame({ level, runtime, seed }: GameComponentProps<CountingConfig>) {
  const { max, rounds } = level.configuration;
  const data = useMemo(() => {
    const rand = seeded(seed);
    const values = shuffle(Array.from({ length: max }, (_, i) => i + 1), rand);
    return Array.from({ length: rounds }, (_, i) => {
      const n = values[i % values.length];
      // چیدمان روی شبکه‌ی ۴×۴ بدون هم‌پوشانی
      const cells = shuffle(Array.from({ length: 16 }, (_, c) => c), rand).slice(0, n);
      const fish = cells.map((c) => ({ x: (c % 4) * 25 + 4 + rand() * 6, y: Math.floor(c / 4) * 20 + 8 + rand() * 4, flip: rand() > 0.5, s: 0.85 + rand() * 0.3 }));
      const options = new Set([n]);
      while (options.size < 3) {
        const d = n + Math.floor(rand() * 5) - 2;
        if (d >= 1 && d <= max + 1 && d !== n) options.add(d);
      }
      return { n, fish, options: shuffle([...options], rand) };
    });
  }, [max, rounds, seed]);

  const [round, setRound] = useState(0);
  const [tapped, setTapped] = useState<Set<number>>(new Set());
  const [result, setResult] = useState<{ i: number; ok: boolean } | null>(null);
  const r = data[round];

  const choose = (i: number) => {
    if (result?.ok) return;
    const ok = r.options[i] === r.n;
    setResult({ i, ok });
    if (ok) {
      runtime.correct({ n: r.n });
      setTimeout(() => {
        setResult(null);
        setTapped(new Set());
        if (round + 1 >= rounds) runtime.complete();
        else {
          setRound(round + 1);
          runtime.progress((round + 1) / rounds);
        }
      }, 900);
    } else {
      runtime.wrong({ n: r.n, answered: r.options[i] });
      setTimeout(() => setResult(null), 500);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="relative aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[2rem] border-[3px] border-ink-900 bg-gradient-to-b from-sky-100 to-sky-300" key={round}>
        <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 30 C 100 10, 300 50, 400 24" stroke="#fff" strokeWidth="6" fill="none" opacity="0.6" />
          <path d="M0 300 L 0 270 C 60 250, 140 280, 200 264 C 270 246, 340 276, 400 260 L 400 300 Z" fill="#fce8c6" />
          <path d="M40 280 C 36 250, 46 230, 56 214 M60 282 C 62 256, 72 240, 82 232" stroke="#4fcb72" strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M350 280 C 354 250, 344 232, 334 220" stroke="#2ead55" strokeWidth="7" fill="none" strokeLinecap="round" />
        </svg>
        {r.fish.map((f, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              runtime.sfx("tap");
              setTapped((t) => new Set(t).add(i));
            }}
            className="absolute transition-transform hover:scale-110"
            style={{ left: `${f.x}%`, top: `${f.y}%`, width: `${17 * f.s}%` }}
            aria-label={`ماهی ${i + 1}`}
          >
            <span className="block" style={{ transform: f.flip ? "scaleX(-1)" : undefined }}>
              <PlayIcon name="fish" className="w-full animate-float" />
            </span>
            {tapped.has(i) && (
              <span className="absolute -top-2 left-1/2 grid h-7 w-7 -translate-x-1/2 animate-pop place-items-center rounded-full border-2 border-ink-900 bg-sun-400 font-display text-sm font-black">
                {fa([...tapped].indexOf(i) + 1)}
              </span>
            )}
          </button>
        ))}
      </div>
      <p className="text-center font-display text-lg font-bold text-ink-500">روی هر ماهی بزن تا با هم بشماریم!</p>
      <div className="flex gap-4" role="group" aria-label="عددها">
        {r.options.map((o, i) => (
          <button
            key={o}
            type="button"
            onClick={() => choose(i)}
            className={cn(
              "grid h-20 w-20 place-items-center rounded-3xl border-[3px] border-ink-900 font-display text-4xl font-black btn-3d [--btn-edge:var(--color-ink-900)] sm:h-24 sm:w-24 sm:text-5xl",
              result?.i === i ? (result.ok ? "bg-grass-300" : "animate-shake bg-coral-100") : "bg-white",
            )}
          >
            {fa(o)}
          </button>
        ))}
      </div>
    </div>
  );
}
