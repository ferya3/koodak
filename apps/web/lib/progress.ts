"use client";
/**
 * ذخیره‌ی محلی پیشرفت کودک (حالت مهمان / آفلاین).
 * در حالت متصل، نتایج از طریق POST /games/sessions/{id}/complete به سرور ارسال
 * و این ذخیره به‌عنوان صف آفلاین (Offline Queue) عمل می‌کند.
 */
import type { GameSessionResult } from "@kidsworld/types";

const KEY = "kw.progress.v1";

export interface LocalProgress {
  activeChildId: string | null;
  stars: number;
  points: number;
  results: GameSessionResult[];
  drawings: number;
}

const empty: LocalProgress = { activeChildId: null, stars: 0, points: 0, results: [], drawings: 0 };

export function readProgress(): LocalProgress {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    return empty;
  }
}

export function writeProgress(update: (p: LocalProgress) => LocalProgress) {
  try {
    const next = update(readProgress());
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("kw-progress"));
    return next;
  } catch {
    return empty;
  }
}

export function bestStars(gameId: string, level: number): number {
  return readProgress()
    .results.filter((r) => r.gameId === gameId && r.level === level)
    .reduce((m, r) => Math.max(m, r.stars), 0);
}
