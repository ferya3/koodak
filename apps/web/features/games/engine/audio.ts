"use client";
import type { SfxName } from "./types";

/**
 * Audio Manager – صداهای کوتاه با Web Audio API ساخته می‌شوند (بدون فایل صوتی).
 * نرم، کوتاه و بدون صدای «خطای» ترسناک.
 */
let ctx: AudioContext | null = null;

function tone(freq: number, start: number, dur: number, type: OscillatorType = "sine", gain = 0.12) {
  if (!ctx) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, ctx.currentTime + start);
  g.gain.setValueAtTime(0, ctx.currentTime + start);
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
  o.connect(g).connect(ctx.destination);
  o.start(ctx.currentTime + start);
  o.stop(ctx.currentTime + start + dur + 0.02);
}

export function playSfx(name: SfxName, enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    switch (name) {
      case "tap":
        tone(660, 0, 0.08, "triangle", 0.08);
        break;
      case "flip":
        tone(520, 0, 0.06, "triangle", 0.07);
        tone(780, 0.04, 0.06, "triangle", 0.06);
        break;
      case "correct":
        tone(660, 0, 0.12, "sine");
        tone(990, 0.09, 0.18, "sine");
        break;
      case "wrong":
        tone(330, 0, 0.14, "sine", 0.08);
        tone(290, 0.1, 0.16, "sine", 0.06);
        break;
      case "win":
        [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.11, 0.25, "triangle", 0.1));
        break;
    }
  } catch {
    /* بی‌صدا ادامه بده */
  }
}
