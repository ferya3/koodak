"use client";
import { useMemo, useState } from "react";
import { PlayIcon } from "@/components/brand/PlayIcon";
import { enLetters, faLetters } from "@/lib/data/alphabet";
import { seeded, shuffle } from "@/lib/utils";
import type { GameComponentProps } from "../engine/types";
import { ChoiceTile, nextRound } from "../shared";

interface Config {
  alphabet: "fa" | "en";
  from: number;
  to: number;
  rounds: number;
}

/** صدای اول: تصویر را ببین، حرف اولش را انتخاب کن – Learning › Alphabet › Phonics */
export function LetterSoundGame({ level, runtime, seed }: GameComponentProps<Config>) {
  const { alphabet = "fa", from = 0, to, rounds = 6 } = level.configuration;
  const letters = alphabet === "en" ? enLetters.map((l) => ({ char: l.upper, word: l.word, icon: l.icon })) : faLetters.map((l) => ({ char: l.char, word: l.word, icon: l.icon }));
  const pool = letters.slice(from, to ?? letters.length);
  const data = useMemo(() => {
    const rand = seeded(seed);
    return shuffle(pool, rand).slice(0, rounds).map((target) => ({
      target,
      options: shuffle([target, ...shuffle(letters.filter((l) => l.char !== target.char), rand).slice(0, 2)], rand),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, alphabet, from, to, rounds]);
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<{ i: number; ok: boolean } | null>(null);
  const r = data[round];

  const choose = (i: number) => {
    if (picked?.ok) return;
    const ok = r.options[i].char === r.target.char;
    setPicked({ i, ok });
    if (ok) {
      runtime.correct({ letter: r.target.char });
      nextRound({ round, rounds: data.length, setRound, complete: runtime.complete, progress: runtime.progress, after: () => setPicked(null) });
    } else {
      runtime.wrong({ letter: r.target.char, picked: r.options[i].char });
      setTimeout(() => setPicked(null), 500);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-6" key={round}>
      <div className="flex animate-pop flex-col items-center gap-2 rounded-[2rem] border-[3px] border-ink-900 bg-sun-100 px-10 py-6">
        <PlayIcon name={r.target.icon} className="h-36 w-36" />
        <span className="font-display text-3xl font-black" dir={alphabet === "en" ? "ltr" : "rtl"}>
          {picked?.ok ? r.target.word : "؟"}
        </span>
      </div>
      <p className="font-display text-xl font-bold text-ink-500">این تصویر با کدام حرف شروع می‌شود؟</p>
      <div className="flex gap-4" role="group" aria-label="حرف‌ها">
        {r.options.map((o, i) => (
          <ChoiceTile key={o.char} onClick={() => choose(i)} state={picked?.i === i ? (picked.ok ? "right" : "wrong") : "idle"} className="h-24 w-24 text-5xl sm:h-28 sm:w-28 sm:text-6xl" dir={alphabet === "en" ? "ltr" : "rtl"}>
            {o.char}
          </ChoiceTile>
        ))}
      </div>
    </div>
  );
}
