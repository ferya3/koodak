"use client";
import { useEffect, useMemo, useState } from "react";
import { enLetters, faLetters } from "@/lib/data/alphabet";
import { cn, fa, seeded, shuffle } from "@/lib/utils";
import type { GameComponentProps } from "../engine/types";
import { nextRound } from "../shared";

interface Config {
  alphabet: "fa" | "en";
  rounds: number;
  /** تعداد خانه‌های جدول */
  cells: number;
}

/** شکار حرف: همه‌ی نمونه‌های یک حرف را در جدول پیدا کن – توجه دیداری و شناخت حرف */
export function LetterHuntGame({ level, runtime, seed }: GameComponentProps<Config>) {
  const { alphabet = "fa", rounds = 4, cells = 16 } = level.configuration;
  const chars = alphabet === "en" ? enLetters.map((l) => l.upper) : faLetters.map((l) => l.char);
  const data = useMemo(() => {
    const rand = seeded(seed);
    return Array.from({ length: rounds }, () => {
      const target = chars[Math.floor(rand() * chars.length)];
      const hits = 3 + Math.floor(rand() * 3);
      const others = chars.filter((c) => c !== target);
      const grid = shuffle([...Array(hits).fill(target), ...Array.from({ length: cells - hits }, () => others[Math.floor(rand() * others.length)])], rand);
      return { target, grid, hits };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, alphabet, rounds, cells]);
  const [round, setRound] = useState(0);
  const [found, setFound] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<number | null>(null);
  const r = data[round];

  useEffect(() => {
    if (found.size === r.hits) {
      runtime.correct({ letter: r.target });
      nextRound({ round, rounds, setRound, complete: runtime.complete, progress: runtime.progress, after: () => setFound(new Set()) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [found.size]);

  const tap = (i: number) => {
    if (found.has(i) || found.size === r.hits) return;
    if (r.grid[i] === r.target) {
      runtime.sfx("tap");
      setFound((f) => new Set(f).add(i));
    } else {
      setWrong(i);
      runtime.wrong({ letter: r.target, tapped: r.grid[i] });
      setTimeout(() => setWrong(null), 450);
    }
  };

  const cols = Math.sqrt(cells) % 1 === 0 ? Math.sqrt(cells) : 5;
  return (
    <div className="flex w-full flex-col items-center gap-5" key={round}>
      <p className="font-display text-2xl font-black">
        همه‌ی <span className="mx-1 inline-grid h-14 w-14 place-items-center rounded-2xl border-[3px] border-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)] bg-sun-300 align-middle text-4xl">{r.target}</span> ها را پیدا کن!
        <span className="ms-3 text-lg text-ink-500">({fa(found.size)} از {fa(r.hits)})</span>
      </p>
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }} dir={alphabet === "en" ? "ltr" : "rtl"}>
        {r.grid.map((c, i) => (
          <button
            key={i}
            type="button"
            onClick={() => tap(i)}
            className={cn(
              "grid h-16 w-16 place-items-center rounded-2xl border-[3px] border-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)] font-display text-4xl font-black btn-3d [--btn-edge:var(--color-ink-200)] sm:h-20 sm:w-20",
              found.has(i) ? "bg-grass-300" : wrong === i ? "animate-shake bg-coral-100" : "bg-white",
            )}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
