"use client";
import { useMemo, useState } from "react";
import { cn, seeded, shuffle } from "@/lib/utils";
import type { GameComponentProps } from "../engine/types";

interface PatternConfig {
  patterns: string[];
  rounds: number;
}

type Shape = "circle" | "square" | "triangle" | "star";
interface Token {
  shape: Shape;
  color: string;
  name: string;
}

const TOKENS: Token[] = [
  { shape: "circle", color: "#ff7a66", name: "دایره‌ی قرمز" },
  { shape: "square", color: "#4fb8f5", name: "مربع آبی" },
  { shape: "triangle", color: "#4fcb72", name: "مثلث سبز" },
  { shape: "star", color: "#ffce3d", name: "ستاره‌ی زرد" },
  { shape: "circle", color: "#9b7bff", name: "دایره‌ی بنفش" },
];

function TokenArt({ t, className }: { t: Token; className?: string }) {
  const S = { stroke: "#1f1a3d", strokeWidth: 4, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 60 60" className={className} aria-label={t.name} role="img">
      {t.shape === "circle" && <circle cx="30" cy="30" r="20" fill={t.color} {...S} />}
      {t.shape === "square" && <rect x="11" y="11" width="38" height="38" rx="7" fill={t.color} {...S} />}
      {t.shape === "triangle" && <path d="M30 8 L 52 50 L 8 50 Z" fill={t.color} {...S} />}
      {t.shape === "star" && <path d="M30 6 L 36 22 L 53 23 L 40 34 L 44 51 L 30 42 L 16 51 L 20 34 L 7 23 L 24 22 Z" fill={t.color} {...S} />}
    </svg>
  );
}

function buildRound(template: string, rand: () => number) {
  const letters = [...new Set(template.split(""))];
  const chosen = shuffle(TOKENS, rand).slice(0, letters.length);
  const map = Object.fromEntries(letters.map((l, i) => [l, chosen[i]]));
  const len = Math.max(6, template.length * 2 + 1);
  const seq = Array.from({ length: len }, (_, i) => map[template[i % template.length]] as Token);
  const answer = seq[seq.length - 1];
  const distractors = shuffle(TOKENS.filter((t) => t !== answer), rand).slice(0, 2);
  return { shown: seq.slice(0, -1).slice(-6), answer, options: shuffle([answer, ...distractors], rand) };
}

/** قطار الگوها – Brain Games › Logic › Pattern Recognition */
export function PatternGame({ level, runtime, seed }: GameComponentProps<PatternConfig>) {
  const { patterns, rounds } = level.configuration;
  const data = useMemo(() => {
    const rand = seeded(seed);
    return Array.from({ length: rounds }, (_, i) => buildRound(patterns[i % patterns.length], rand));
  }, [patterns, rounds, seed]);
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [wrongPick, setWrongPick] = useState<number | null>(null);
  const r = data[round];

  const choose = (i: number) => {
    if (picked !== null) return;
    if (r.options[i] === r.answer) {
      setPicked(i);
      runtime.correct({ round });
      setTimeout(() => {
        setPicked(null);
        setWrongPick(null);
        if (round + 1 >= rounds) runtime.complete();
        else {
          setRound(round + 1);
          runtime.progress((round + 1) / rounds);
        }
      }, 900);
    } else {
      setWrongPick(i);
      runtime.wrong({ round });
      setTimeout(() => setWrongPick(null), 500);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-8">
      {/* قطار – از راست به چپ حرکت می‌کند */}
      <div className="w-full overflow-x-auto scrollbar-none">
        <div className="mx-auto flex w-max items-end gap-2 px-2 pb-3" key={round}>
          <Locomotive />
          {r.shown.map((t, i) => (
            <Wagon key={i}>
              <TokenArt t={t} className="h-10 w-10 sm:h-14 sm:w-14" />
            </Wagon>
          ))}
          <Wagon dashed={picked === null}>
            {picked !== null ? <TokenArt t={r.answer} className="h-10 w-10 animate-pop sm:h-14 sm:w-14" /> : <span className="font-display text-4xl font-black text-ink-300">؟</span>}
          </Wagon>
        </div>
        <div className="mx-auto h-2 w-full max-w-4xl rounded-full bg-ink-900" />
      </div>

      <div className="flex gap-4 sm:gap-6" role="group" aria-label="گزینه‌ها">
        {r.options.map((t, i) => (
          <button
            key={i}
            type="button"
            onClick={() => choose(i)}
            className={cn(
              "grid h-24 w-24 place-items-center rounded-3xl border-[3px] border-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)] btn-3d [--btn-edge:var(--color-ink-200)] sm:h-28 sm:w-28",
              // فقط یک کلاس پس‌زمینه در هر حالت (ترتیب کلاس‌های هم‌خانواده در Tailwind تضمین‌شده نیست)
              picked === i ? "bg-grass-100" : wrongPick === i ? "animate-shake bg-coral-100" : "bg-white",
            )}
          >
            <TokenArt t={t} className="h-14 w-14 sm:h-16 sm:w-16" />
          </button>
        ))}
      </div>
    </div>
  );
}

function Wagon({ children, dashed }: { children: React.ReactNode; dashed?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className={cn("grid h-16 w-16 place-items-center rounded-xl border-[3px] bg-white sm:h-20 sm:w-20", dashed ? "border-dashed border-ink-500 bg-sun-100" : "border-ink-900")}>{children}</div>
      <div className="-mt-1.5 flex gap-5">
        <span className="h-4 w-4 rounded-full border-[3px] border-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)] bg-white" />
        <span className="h-4 w-4 rounded-full border-[3px] border-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)] bg-white" />
      </div>
    </div>
  );
}

function Locomotive() {
  return (
    <svg viewBox="0 0 90 90" className="h-[86px] w-[86px] shrink-0 sm:h-[104px] sm:w-[104px]" aria-hidden="true">
      <g stroke="#1f1a3d" strokeWidth="4" strokeLinejoin="round">
        <rect x="6" y="30" width="78" height="44" rx="10" fill="#ffce3d" />
        <rect x="14" y="8" width="20" height="24" rx="4" fill="#ff73b3" />
        <rect x="46" y="38" width="28" height="20" rx="4" fill="#ddf3ff" />
        <circle cx="26" cy="78" r="9" fill="#fff" />
        <circle cx="64" cy="78" r="9" fill="#fff" />
      </g>
    </svg>
  );
}
