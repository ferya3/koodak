"use client";
import { useMemo, useState } from "react";
import { PlayIcon, type PlayIconKey } from "@/components/brand/PlayIcon";
import { iconThemes, type IconTheme } from "@/lib/data/alphabet";
import { seeded, shuffle } from "@/lib/utils";
import type { GameComponentProps } from "../engine/types";
import { ChoiceTile, nextRound } from "../shared";

interface Config {
  rounds: number;
  size: number;
}

const GROUPS: IconTheme[] = ["animals", "fruits", "vehicles", "birds", "food", "things", "sky"];

/** کدام فرق دارد؟ – دسته‌بندی و استدلال */
export function OddOneOutGame({ level, runtime, seed }: GameComponentProps<Config>) {
  const { rounds = 6, size = 4 } = level.configuration;
  const data = useMemo(() => {
    const rand = seeded(seed);
    return Array.from({ length: rounds }, () => {
      const [a, b] = shuffle(GROUPS, rand);
      const same = shuffle(iconThemes[a].icons as PlayIconKey[], rand).slice(0, size - 1);
      const odd = shuffle((iconThemes[b].icons as PlayIconKey[]).filter((i) => !same.includes(i)), rand)[0];
      return { items: shuffle([...same, odd], rand), odd, group: iconThemes[a].title };
    });
  }, [seed, rounds, size]);
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<{ i: number; ok: boolean } | null>(null);
  const r = data[round];

  const choose = (i: number) => {
    if (picked?.ok) return;
    const ok = r.items[i] === r.odd;
    setPicked({ i, ok });
    if (ok) {
      runtime.correct({ odd: r.odd });
      nextRound({ round, rounds, setRound, complete: runtime.complete, progress: runtime.progress, after: () => setPicked(null) });
    } else {
      runtime.wrong({ picked: r.items[i] });
      setTimeout(() => setPicked(null), 500);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-6" key={round}>
      <p className="font-display text-2xl font-black">کدام با بقیه فرق دارد؟</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {r.items.map((ic, i) => (
          <ChoiceTile key={i} onClick={() => choose(i)} state={picked?.i === i ? (picked.ok ? "right" : "wrong") : "idle"} className="h-32 w-32 sm:h-36 sm:w-36">
            <PlayIcon name={ic} className="h-24 w-24" />
          </ChoiceTile>
        ))}
      </div>
      <p className="h-7 font-display text-lg font-bold text-ink-500">{picked?.ok ? `آفرین! بقیه از گروه «${r.group}» بودند.` : ""}</p>
    </div>
  );
}
