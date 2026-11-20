"use client";
import { useMemo, useState } from "react";
import { cn, seeded, shuffle } from "@/lib/utils";
import type { GameComponentProps } from "../engine/types";
import { parseToken, TokenArt, type Token as TokenT } from "@/features/custom-games/tokens";

interface PatternConfig {
  patterns?: string[];
  rounds?: number;
  /** حالت ساخت والدین: الگوی واگن‌ها (مثل ["circle-red","square-blue"])، تعداد کل واگن‌ها و تعداد واگن‌های از پیش چیده‌شده */
  unit?: string[];
  wagons?: number;
  shown?: number;
}

type Token = TokenT;

const TOKENS: Token[] = ["circle-red", "square-blue", "triangle-green", "star-yellow", "circle-purple"].map(parseToken);

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
export function PatternGame(props: GameComponentProps<PatternConfig>) {
  return props.level.configuration.unit?.length ? <CustomTrain {...props} /> : <RandomTrain {...props} />;
}

function RandomTrain({ level, runtime, seed }: GameComponentProps<PatternConfig>) {
  const patterns = level.configuration.patterns ?? ["AB"];
  const rounds = level.configuration.rounds ?? 5;
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

/**
 * قطار ساخت والدین: همه‌ی واگن‌ها دیده می‌شوند؛ چند واگن اول چیده شده‌اند و کودک
 * بقیه را یکی‌یکی و به ترتیب الگو پر می‌کند (هر واگن = یک دور).
 */
function CustomTrain({ level, runtime, seed }: GameComponentProps<PatternConfig>) {
  const unit = useMemo(() => (level.configuration.unit ?? []).map(parseToken), [level.configuration.unit]);
  const wagons = Math.min(12, Math.max(unit.length + 1, level.configuration.wagons ?? 8));
  const shown = Math.min(wagons - 1, Math.max(unit.length, level.configuration.shown ?? unit.length));
  const seq = useMemo(() => Array.from({ length: wagons }, (_, i) => unit[i % unit.length]), [unit, wagons]);
  const total = wagons - shown;
  const [filled, setFilled] = useState(0);
  const [wrongPick, setWrongPick] = useState<number | null>(null);
  const [okPick, setOkPick] = useState<number | null>(null);
  const target = shown + filled;
  const answer = seq[Math.min(target, wagons - 1)];
  // گزینه‌ها: جواب + بقیه‌ی شکل‌های الگو + در صورت نیاز یک شکل دیگر (حداقل ۳ گزینه)
  const options = useMemo(() => {
    const rand = seeded(seed + target * 7);
    const uniq = [...new Map(unit.map((t) => [t.id, t])).values()];
    const extra = TOKENS.filter((t) => !uniq.some((u) => u.id === t.id));
    const pool = [...uniq, ...shuffle(extra, rand)].slice(0, Math.max(3, Math.min(4, uniq.length)));
    return shuffle(pool, rand);
  }, [unit, seed, target]);
  const small = wagons > 8;

  const choose = (i: number) => {
    if (okPick !== null || target >= wagons) return;
    if (options[i].id === answer.id) {
      setOkPick(i);
      runtime.correct({ wagon: target });
      setTimeout(() => {
        setOkPick(null);
        const next = filled + 1;
        setFilled(next);
        runtime.progress(next / total);
        if (next >= total) runtime.complete();
      }, 650);
    } else {
      setWrongPick(i);
      runtime.wrong({ wagon: target });
      setTimeout(() => setWrongPick(null), 500);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <div className="w-full overflow-x-auto scrollbar-none">
        <div className="mx-auto flex w-max items-end gap-1.5 px-2 pb-3">
          <Locomotive />
          {seq.map((t, i) => {
            const done = i < target;
            const current = i === target;
            return (
              <Wagon key={i} dashed={!done} active={current} small={small}>
                {done ? <TokenArt t={t} className={cn(small ? "h-8 w-8 sm:h-11 sm:w-11" : "h-10 w-10 sm:h-14 sm:w-14", i >= shown && "animate-pop")} /> : current ? <span className="font-display text-3xl font-black text-ink-300">؟</span> : null}
              </Wagon>
            );
          })}
        </div>
        <div className="mx-auto h-2 w-full max-w-5xl rounded-full bg-ink-900" />
      </div>
      <div className="flex gap-4 sm:gap-6" role="group" aria-label="گزینه‌ها">
        {options.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => choose(i)}
            className={cn(
              "grid h-24 w-24 place-items-center rounded-3xl border-[3px] border-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)] btn-3d [--btn-edge:var(--color-ink-200)] sm:h-28 sm:w-28",
              okPick === i ? "bg-grass-100" : wrongPick === i ? "animate-shake bg-coral-100" : "bg-white",
            )}
          >
            <TokenArt t={t} className="h-14 w-14 sm:h-16 sm:w-16" />
          </button>
        ))}
      </div>
    </div>
  );
}

function Wagon({ children, dashed, active, small }: { children: React.ReactNode; dashed?: boolean; active?: boolean; small?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "grid place-items-center rounded-xl border-[3px] bg-white",
          small ? "h-12 w-12 sm:h-16 sm:w-16" : "h-16 w-16 sm:h-20 sm:w-20",
          dashed ? (active ? "border-dashed border-coral-400 bg-sun-100 ring-4 ring-sun-300" : "border-dashed border-ink-300 bg-white") : "border-ink-900",
        )}
      >
        {children}
      </div>
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
