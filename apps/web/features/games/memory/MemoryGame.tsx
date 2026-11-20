"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { PlayIcon, playIconKeys, type PlayIconKey } from "@/components/brand/PlayIcon";
import { cn, seeded, shuffle } from "@/lib/utils";
import { iconThemes, type IconTheme } from "@/lib/data/alphabet";
import type { GameComponentProps } from "../engine/types";

interface MemoryConfig {
  pairs: number;
  cols: number;
  /** موضوع کارت‌ها (اختیاری): animals | fruits | sky | ... */
  theme?: IconTheme;
}

/** بازی حافظه‌ی تصویری – Brain Games › Memory › Visual Memory */
export function MemoryGame({ level, runtime, seed }: GameComponentProps<MemoryConfig>) {
  const { pairs, cols, theme } = level.configuration;
  const pool = (theme && iconThemes[theme] ? iconThemes[theme].icons : playIconKeys) as PlayIconKey[];
  const deck = useMemo(() => {
    const rand = seeded(seed);
    const picks = shuffle(pool.length >= pairs ? pool : playIconKeys, rand).slice(0, pairs);
    return shuffle([...picks, ...picks], rand).map((icon, i) => ({ id: i, icon }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairs, seed, theme]);

  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<PlayIconKey>>(new Set());
  const [shake, setShake] = useState<number[]>([]);
  const lock = useRef(false);

  useEffect(() => {
    runtime.progress(matched.size / pairs);
    if (matched.size === pairs) {
      const t = setTimeout(() => runtime.complete(), 600);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched.size, pairs]);

  const flip = (i: number) => {
    if (lock.current || open.includes(i) || matched.has(deck[i].icon)) return;
    runtime.sfx("flip");
    const next = [...open, i];
    setOpen(next);
    if (next.length === 2) {
      lock.current = true;
      const [a, b] = next;
      if (deck[a].icon === deck[b].icon) {
        setTimeout(() => {
          setMatched((m) => new Set(m).add(deck[a].icon));
          setOpen([]);
          runtime.correct({ icon: deck[a].icon });
          lock.current = false;
        }, 350);
      } else {
        setTimeout(() => {
          setShake([a, b]);
          runtime.wrong({ a: deck[a].icon, b: deck[b].icon });
        }, 450);
        setTimeout(() => {
          setOpen([]);
          setShake([]);
          lock.current = false;
        }, 1000);
      }
    }
  };

  return (
    <div className="mx-auto grid w-full gap-2.5 sm:gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, maxWidth: cols * 150 }}>
      {deck.map((card, i) => {
        const isOpen = open.includes(i) || matched.has(card.icon);
        const isMatched = matched.has(card.icon);
        return (
          <button
            key={card.id}
            type="button"
            onClick={() => flip(i)}
            aria-label={isOpen ? card.icon : `کارت ${i + 1}، برگردان`}
            className={cn("aspect-[3/4] perspective-[800px]", shake.includes(i) && "animate-shake")}
          >
            <span className={cn("relative block h-full w-full transition-transform duration-500 transform-3d", isOpen && "rotate-y-180")}>
              {/* پشت کارت */}
              <span className="absolute inset-0 grid place-items-center rounded-2xl border-[3px] border-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)] bg-grape-400 backface-hidden btn-3d [--btn-edge:var(--color-grape-500)]">
                <svg viewBox="0 0 40 40" className="h-1/2 w-1/2 opacity-80" aria-hidden="true">
                  <circle cx="12" cy="12" r="5" fill="#bfa5ff" />
                  <circle cx="28" cy="20" r="5" fill="#bfa5ff" />
                  <circle cx="12" cy="28" r="5" fill="#bfa5ff" />
                  <path d="M30 4 L 32 9 L 37 9 L 33 12 L 35 17 L 30 14 L 25 17 L 27 12 L 23 9 L 28 9 Z" fill="#ffce3d" />
                </svg>
              </span>
              {/* روی کارت */}
              <span
                className={cn(
                  "absolute inset-0 grid rotate-y-180 place-items-center rounded-2xl border-[3px] border-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)] backface-hidden",
                  isMatched ? "bg-grass-100" : "bg-white",
                )}
              >
                <PlayIcon name={card.icon} className={cn("h-3/5 w-3/5", isMatched && "animate-pop")} />
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
