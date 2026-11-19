import type { ChildProfile, Content, GameSessionResult } from "@kidsworld/types";
import { games, stories, worksheets } from "./data/content";
import { lessons } from "./data/lessons";

/**
 * Recommendation Engine – نسخه‌ی ۱ (Rule-Based)
 * امتیاز هر محتوا = تناسب سنی + علاقه‌مندی + تازگی + پله‌ی مناسب دشواری + تنوع نوع محتوا
 * خروجی قابل توضیح است (reason) تا والدین بدانند چرا چیزی پیشنهاد شده.
 */
const DIFF = { beginner: 0, easy: 1, intermediate: 2, advanced: 3 } as const;

export interface Recommendation {
  content: Content;
  score: number;
  reason: string;
}

export function recommend(child: Pick<ChildProfile, "age" | "favoriteCategoryIds">, history: GameSessionResult[], limit = 4): Recommendation[] {
  const pool: Content[] = [...games, ...lessons, ...stories, ...worksheets.filter((w) => w.access === "free")];
  const played = new Map<string, number>();
  history.forEach((h) => played.set(h.gameId, Math.max(played.get(h.gameId) ?? 0, h.stars)));
  const avgStars = history.length ? history.reduce((s, h) => s + h.stars, 0) / history.length : 2;
  const targetDiff = Math.min(3, Math.max(0, Math.round((child.age - 3) / 2) + (avgStars >= 2.5 ? 1 : avgStars < 1.5 ? -1 : 0)));

  const scored = pool
    .filter((c) => child.age >= c.minAge && child.age <= c.maxAge)
    .map((c) => {
      let score = 50;
      let reason = `مناسب ${child.age} سالگی`;
      if (child.favoriteCategoryIds.includes(c.categoryId)) {
        score += 25;
        reason = "از دنیای مورد علاقه‌ات";
      }
      const best = played.get(c.id);
      if (best === undefined) score += 15;
      else if (best < 3) {
        score += 8;
        reason = "بیا ستاره‌ی بیشتری بگیریم!";
      } else score -= 30;
      score -= Math.abs(DIFF[c.difficulty] - targetDiff) * 10;
      return { content: c, score, reason };
    })
    .sort((a, b) => b.score - a.score);

  // تنوع: از هر نوع محتوا حداکثر ۲ مورد
  const out: Recommendation[] = [];
  const perType: Record<string, number> = {};
  for (const r of scored) {
    if ((perType[r.content.type] ?? 0) >= 2) continue;
    perType[r.content.type] = (perType[r.content.type] ?? 0) + 1;
    out.push(r);
    if (out.length === limit) break;
  }
  return out;
}
