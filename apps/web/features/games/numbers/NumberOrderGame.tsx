"use client";
import { useMemo, useState } from "react";
import { cn, fa, seeded, shuffle } from "@/lib/utils";
import type { GameComponentProps } from "../engine/types";
import { nextRound } from "../shared";

interface Config {
  max: number;
  rounds: number;
}

const COLORS = ["bg-coral-300", "bg-sun-300", "bg-grass-300", "bg-sky-300", "bg-grape-300", "bg-berry-300", "bg-ocean-300", "bg-peach-300"];

/** حباب‌های عدد: به ترتیب از ۱ تا n بزن – ترتیب اعداد */
export function NumberOrderGame({ level, runtime, seed }: GameComponentProps<Config>) {
  const { max = 10, rounds = 3 } = level.configuration;
  const data = useMemo(() => {
    const rand = seeded(seed);
    return Array.from({ length: rounds }, () => {
      const slots = shuffle(Array.from({ length: 24 }, (_, i) => i), rand).slice(0, max);
      return slots.map((slot, k) => ({ n: k + 1, x: (slot % 6) * 16 + 3 + rand() * 4, y: Math.floor(slot / 6) * 24 + 4 + rand() * 6, c: COLORS[k % COLORS.length] }));
    });
  }, [seed, max, rounds]);
  const [round, setRound] = useState(0);
  const [next, setNext] = useState(1);
  const [wrong, setWrong] = useState<number | null>(null);
  const bubbles = data[round];

  const tap = (n: number) => {
    if (n < next) return;
    if (n === next) {
      runtime.sfx("tap");
      if (n === max) {
        runtime.correct({ max });
        setNext(max + 1);
        nextRound({ round, rounds, setRound, complete: runtime.complete, progress: runtime.progress, after: () => setNext(1) });
      } else setNext(n + 1);
    } else {
      setWrong(n);
      runtime.wrong({ expected: next, tapped: n });
      setTimeout(() => setWrong(null), 450);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-4" key={round}>
      <p className="font-display text-2xl font-black">
        به ترتیب بزن: {fa(next > max ? max : next)} {next <= max && "←"}
      </p>
      <div className="relative aspect-[4/3] w-full max-w-2xl rounded-[2rem] border-[3px] border-ink-900 bg-sky-100">
        {bubbles.map((b) => (
          <button
            key={b.n}
            type="button"
            onClick={() => tap(b.n)}
            disabled={b.n < next}
            style={{ left: `${b.x}%`, top: `${b.y}%` }}
            className={cn(
              "absolute grid h-14 w-14 place-items-center rounded-full border-[3px] border-ink-900 font-display text-2xl font-black transition sm:h-16 sm:w-16",
              b.n < next ? "scale-75 bg-white opacity-30" : wrong === b.n ? "animate-shake bg-coral-100" : b.c,
            )}
          >
            {fa(b.n)}
          </button>
        ))}
      </div>
    </div>
  );
}
