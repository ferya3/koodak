"use client";
import { useMemo, useState } from "react";
import { PlayIcon, type PlayIconKey } from "@/components/brand/PlayIcon";
import { iconThemes } from "@/lib/data/alphabet";
import { cn, seeded, shuffle } from "@/lib/utils";
import type { GameComponentProps } from "../engine/types";
import { nextRound } from "../shared";

interface Config {
  max: number;
  rounds: number;
}

/** بیشتر یا کمتر؟ – مقایسه‌ی مقدار */
export function MoreLessGame({ level, runtime, seed }: GameComponentProps<Config>) {
  const { max = 6, rounds = 6 } = level.configuration;
  const data = useMemo(() => {
    const rand = seeded(seed);
    const icons = [...iconThemes.fruits.icons, ...iconThemes.animals.icons] as PlayIconKey[];
    return Array.from({ length: rounds }, (_, k) => {
      const a = 1 + Math.floor(rand() * max);
      let b = 1 + Math.floor(rand() * max);
      if (b === a) b = a === max ? a - 1 : a + 1;
      return { a, b, icon: shuffle(icons, rand)[0], ask: k % 2 === 0 ? ("more" as const) : ("less" as const) };
    });
  }, [seed, max, rounds]);
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<{ side: "a" | "b"; ok: boolean } | null>(null);
  const r = data[round];
  const correct = (r.ask === "more") === r.a > r.b ? "a" : "b";

  const choose = (side: "a" | "b") => {
    if (picked?.ok) return;
    const ok = side === correct;
    setPicked({ side, ok });
    if (ok) {
      runtime.correct({ ask: r.ask });
      nextRound({ round, rounds, setRound, complete: runtime.complete, progress: runtime.progress, after: () => setPicked(null) });
    } else {
      runtime.wrong({ ask: r.ask });
      setTimeout(() => setPicked(null), 500);
    }
  };

  const Group = ({ side, n }: { side: "a" | "b"; n: number }) => (
    <button
      type="button"
      onClick={() => choose(side)}
      className={cn(
        "flex min-h-48 flex-1 flex-wrap content-center items-center justify-center gap-2 rounded-[2rem] border-[3px] border-ink-900 p-4 btn-3d [--btn-edge:var(--color-ink-900)]",
        picked?.side === side ? (picked.ok ? "bg-grass-300" : "animate-shake bg-coral-100") : "bg-white",
      )}
      aria-label={`گروه ${n} تایی`}
    >
      {Array.from({ length: n }, (_, i) => <PlayIcon key={i} name={r.icon} className="h-12 w-12 sm:h-14 sm:w-14" />)}
    </button>
  );

  return (
    <div className="flex w-full flex-col items-center gap-6" key={round}>
      <p className="font-display text-3xl font-black">{r.ask === "more" ? "کدام گروه بیشتر است؟" : "کدام گروه کمتر است؟"}</p>
      <div className="flex w-full max-w-3xl gap-4">
        <Group side="a" n={r.a} />
        <Group side="b" n={r.b} />
      </div>
    </div>
  );
}
