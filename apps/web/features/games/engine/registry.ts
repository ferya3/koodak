import type { GameDefinition, SessionStats } from "./types";
import { MemoryGame } from "../memory/MemoryGame";
import { PatternGame } from "../pattern/PatternGame";
import { CountingGame } from "../counting/CountingGame";

/** قاعده‌ی پیش‌فرض بازی‌های راندی: اشتباه کمتر = ستاره‌ی بیشتر */
const roundStars = (s: SessionStats) => (s.mistakes === 0 ? 3 : s.mistakes <= 2 ? 2 : 1);
const baseScore = (s: SessionStats) => Math.max(10, s.correct * 20 - s.mistakes * 5 + Math.max(0, 120 - s.durationSeconds));

/** Game Registry – نگاشت نوع بازی (از CMS) به پیاده‌سازی */
export const gameRegistry: Record<string, GameDefinition> = {
  memory: {
    gameType: "memory",
    component: MemoryGame,
    howTo: "کارت‌ها را دوتا‌دوتا برگردان و جفت‌های یکسان را پیدا کن!",
    stars: (s, level) => {
      const pairs = Number(level.configuration.pairs ?? 6);
      return s.mistakes <= Math.ceil(pairs / 2) ? 3 : s.mistakes <= pairs + 1 ? 2 : 1;
    },
    score: baseScore,
  },
  pattern: {
    gameType: "pattern",
    component: PatternGame,
    howTo: "به واگن‌ها نگاه کن. واگن بعدی کدام است؟",
    stars: roundStars,
    score: baseScore,
  },
  counting: {
    gameType: "counting",
    component: CountingGame,
    howTo: "ماهی‌ها را یکی‌یکی بشمار و عدد درست را انتخاب کن.",
    stars: roundStars,
    score: baseScore,
  },
};
