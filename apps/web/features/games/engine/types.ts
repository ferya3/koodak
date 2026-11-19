import type { ComponentType } from "react";
import type { Game, GameEvent, GameLevel } from "@kidsworld/types";

/**
 * قرارداد استاندارد بازی‌ها (Game Contract)
 * ─────────────────────────────────────────
 * هر بازی فقط یک کامپوننت است که «سطح» را می‌گیرد و از طریق GameRuntime
 * رویدادهایش را گزارش می‌کند. زمان‌سنج، امتیاز، ستاره، صدا، ذخیره‌ی پیشرفت
 * و ارسال رویداد به API همگی توسط موتور (GamePlayer) انجام می‌شود.
 * بنابراین ساخت بازی جدید = نوشتن یک کامپوننت + ثبت در Registry + تعریف سطح‌ها در CMS.
 */

export interface GameRuntime {
  /** پاسخ/حرکت درست */
  correct(data?: Record<string, unknown>): void;
  /** پاسخ/حرکت نادرست – هرگز تنبیهی نیست؛ فقط بازخورد ملایم */
  wrong(data?: Record<string, unknown>): void;
  /** پیشرفت درون مرحله (۰ تا ۱) برای نوار HUD */
  progress(value: number): void;
  /** پایان مرحله */
  complete(): void;
  /** پخش صدای کوتاه */
  sfx(name: SfxName): void;
}

export type SfxName = "tap" | "flip" | "correct" | "wrong" | "win";

export interface GameComponentProps<C = Record<string, unknown>> {
  level: GameLevel & { configuration: C };
  runtime: GameRuntime;
  /** seed برای تکرارپذیری و تست */
  seed: number;
}

export interface SessionStats {
  correct: number;
  mistakes: number;
  durationSeconds: number;
  events: GameEvent[];
}

export interface GameDefinition {
  gameType: Game["gameType"];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<GameComponentProps<any>>;
  /** راهنمای کوتاه برای کودک (توسط پیکو گفته می‌شود) */
  howTo: string;
  /** قاعده‌ی امتیازدهی: آمار جلسه → ۱ تا ۳ ستاره */
  stars(stats: SessionStats, level: GameLevel): 1 | 2 | 3;
  score(stats: SessionStats): number;
}
