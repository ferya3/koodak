"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Awards, Lesson } from "@kidsworld/types";
import { Mascot } from "@/components/brand/Mascot";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/Progress";
import { Stars } from "@/components/ui/Stars";
import { playSfx } from "@/features/games/engine/audio";
import { live, LIVE } from "@/lib/api/live";
import { readProgress, writeProgress } from "@/lib/progress";
import { tones } from "@/lib/tones";
import { cn, fa } from "@/lib/utils";
import { LessonVisual } from "./LessonVisual";

/**
 * پخش‌کننده‌ی درس: گام‌های «توضیح» (تصویر + متن + خواندن با صدا) و «پرسش» (بازخورد فوری).
 * نمره از «اولین پاسخ» هر پرسش است؛ کودک می‌تواند دوباره امتحان کند تا یاد بگیرد.
 * در حالت متصل، پاسخ‌ها به سرور فرستاده و نمره‌ی رسمی همان‌جا محاسبه می‌شود.
 */
export function LessonPlayer({ lesson, exitHref, variant = "public" }: { lesson: Lesson; exitHref: string; variant?: "public" | "kids" }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [solved, setSolved] = useState<Record<string, boolean>>({});
  const [wrong, setWrong] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [awards, setAwards] = useState<Awards | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const startedAt = useRef(Date.now());
  const t = tones[lesson.tone];

  const step = lesson.steps[idx];
  const quizzes = lesson.steps.filter((s) => s.type === "quiz" && s.question);
  const correctFirst = quizzes.filter((q) => answers[q.id] === q.question!.answerId).length;
  const score = quizzes.length ? Math.round((correctFirst / quizzes.length) * 100) : 100;
  const stars = (score >= 100 ? 3 : score >= 50 ? 2 : 1) as 1 | 2 | 3;
  const canNext = step?.type === "explain" || solved[step?.id];

  const speakText = useMemo(() => (step ? (step.type === "quiz" ? step.question?.prompt ?? step.title : `${step.title}. ${step.body}`) : ""), [step]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const speak = () => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    if (speaking) return setSpeaking(false);
    const u = new SpeechSynthesisUtterance(speakText);
    u.lang = "fa-IR";
    u.rate = 0.9;
    u.onend = () => setSpeaking(false);
    synth.speak(u);
    setSpeaking(true);
  };

  const choose = (optionId: string) => {
    if (!step.question || solved[step.id]) return;
    if (!(step.id in answers)) setAnswers((a) => ({ ...a, [step.id]: optionId }));
    if (optionId === step.question.answerId) {
      setSolved((s) => ({ ...s, [step.id]: true }));
      playSfx("correct", true);
    } else {
      setWrong(optionId);
      playSfx("wrong", true);
      setTimeout(() => setWrong(null), 500);
    }
  };

  const finish = () => {
    window.speechSynthesis?.cancel();
    setDone(true);
    playSfx("win", true);
    writeProgress((p) => ({ ...p, stars: p.stars + stars, points: p.points + stars * 10 }));
    const childId = readProgress().activeChildId;
    if (LIVE && childId && /^\d+$/.test(lesson.id)) {
      live
        .lessonComplete(lesson.slug, childId, answers, Math.max(1, Math.round((Date.now() - startedAt.current) / 1000)))
        .then((r) => setAwards(r.awards))
        .catch(() => null);
    }
  };

  const next = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    if (idx + 1 >= lesson.steps.length) finish();
    else setIdx(idx + 1);
  };

  const restart = () => {
    setIdx(0);
    setAnswers({});
    setSolved({});
    setDone(false);
    setAwards(null);
    startedAt.current = Date.now();
  };

  return (
    <div className={cn("overflow-hidden rounded-[2rem] border-[3px] border-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)] bg-white shadow-lift font-display", variant === "kids" && "min-h-[calc(100dvh-7rem)]")}>
      {/* نوار بالا */}
      <div className={cn("flex items-center gap-3 border-b border-ink-900/5 px-3 py-3 sm:px-5", t.soft)}>
        <Link href={exitHref} className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-[3px] border-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)] bg-white btn-3d [--btn-edge:var(--color-ink-200)]" aria-label="خروج از درس">
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true"><path d="M6 6 L18 18 M18 6 L6 18" stroke="#1f1a3d" strokeWidth="3" strokeLinecap="round" /></svg>
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-black">{lesson.title}</p>
          <div className="mt-1 flex items-center gap-3">
            <span className="shrink-0 rounded-full bg-white px-2.5 py-0.5 text-xs font-extrabold">
              {done ? "پایان" : `گام ${fa(idx + 1)} از ${fa(lesson.steps.length)}`}
            </span>
            <ProgressBar value={done ? 100 : (idx / lesson.steps.length) * 100} tone="grass" className="h-3.5 max-w-xs" label="پیشرفت درس" />
          </div>
        </div>
        {!done && (
          <button type="button" onClick={speak} aria-pressed={speaking} className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-[3px] border-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)] bg-white btn-3d [--btn-edge:var(--color-ink-200)]" aria-label={speaking ? "توقف خواندن" : "برام بخون"}>
            <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
              <path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" fill={speaking ? "#ff7a66" : "#ffce3d"} stroke="#1f1a3d" strokeWidth="2" strokeLinejoin="round" />
              <path d="M16 9 C 17.5 10.5, 17.5 13.5, 16 15 M18.5 6.5 C 21.5 9.5, 21.5 14.5, 18.5 17.5" stroke="#1f1a3d" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {!done && step && (
        <div className="flex min-h-[460px] flex-col items-center gap-6 bg-dots px-4 py-8 text-center sm:px-10" key={step.id}>
          {step.type === "explain" ? (
            <>
              <div className={cn("grid w-full max-w-xl animate-pop place-items-center rounded-[2rem] border-[3px] border-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)] p-6 sm:p-10", t.soft)}>
                {step.visual ? <LessonVisual visual={step.visual} /> : <Mascot mood="happy" className="h-32 w-32" />}
              </div>
              <div className="max-w-xl">
                <h2 className="text-3xl font-black">{step.title}</h2>
                <p className="mt-3 text-xl font-bold leading-10 text-ink-700">{step.body}</p>
              </div>
            </>
          ) : (
            step.question && (
              <>
                <div className="flex items-center gap-3">
                  <Mascot mood={solved[step.id] ? "cheer" : "think"} className="h-16 w-16 shrink-0" />
                  <h2 className="text-2xl font-black sm:text-3xl">{step.question.prompt}</h2>
                </div>
                {step.visual && (
                  <div className={cn("w-full max-w-xl rounded-[2rem] border-[3px] border-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)] p-5", t.soft)}>
                    <LessonVisual visual={step.visual} size="md" />
                  </div>
                )}
                <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3" role="group" aria-label="گزینه‌ها">
                  {step.question.options.map((o) => {
                    const isAnswer = o.id === step.question!.answerId;
                    return (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => choose(o.id)}
                        disabled={solved[step.id] && !isAnswer}
                        className={cn(
                          "flex min-h-28 flex-col items-center justify-center gap-2 rounded-3xl border-[3px] border-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)] p-4 btn-3d [--btn-edge:var(--color-ink-200)] disabled:opacity-40",
                          solved[step.id] && isAnswer ? "bg-grass-300" : wrong === o.id ? "animate-shake bg-coral-100" : "bg-white",
                        )}
                      >
                        {o.visual && <LessonVisual visual={o.visual} size="md" />}
                        <span className={cn("font-black", o.visual ? "text-lg" : "text-4xl")}>{o.label}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="h-7 text-lg font-black" aria-live="polite">
                  {solved[step.id] ? (answers[step.id] === step.question.answerId ? "آفرین! درست بود 🎉" : "آفرین! حالا یاد گرفتی ✨") : wrong ? "دوباره فکر کن…" : ""}
                </p>
              </>
            )
          )}
          <Button variant="kid" tone="grass" size="xl" onClick={next} disabled={!canNext} className="mt-auto min-w-48">
            {idx + 1 >= lesson.steps.length ? "پایان درس" : "بعدی ←"}
          </Button>
        </div>
      )}

      {done && (
        <div className="flex flex-col items-center px-5 py-12 text-center">
          <Mascot mood="cheer" className="h-36 w-36 animate-pop" />
          <h2 className="mt-4 text-4xl font-black">درس را تمام کردی!</h2>
          <Stars value={stars} size="h-14 w-14" className="mt-4 animate-pop" />
          {quizzes.length > 0 && (
            <p className="mt-4 text-lg font-bold text-ink-500">
              {fa(correctFirst)} پاسخ درست از {fa(quizzes.length)} پرسش، در همان بار اول
            </p>
          )}
          {lesson.objectives.length > 0 && (
            <ul className="mt-6 space-y-2 text-start">
              {lesson.objectives.map((o) => (
                <li key={o} className="flex items-center gap-2 font-bold">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-grass-400 text-sm text-white">✓</span>
                  {o}
                </li>
              ))}
            </ul>
          )}
          {awards && awards.achievements.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-2" aria-live="polite">
              {awards.achievements.map((a) => (
                <span key={a.id} className="rounded-2xl border-2 border-ink-900/10 bg-sun-300 px-4 py-2 font-black">🏅 مدال جدید: {a.title}</span>
              ))}
            </div>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="kid" tone="sky" size="lg" onClick={restart}>دوباره</Button>
            <Link href={exitHref} className="inline-flex h-14 items-center rounded-2xl border-2 border-ink-900/10 bg-white px-7 text-lg font-extrabold btn-3d [--btn-edge:var(--color-ink-200)]">درس‌های دیگر</Link>
          </div>
        </div>
      )}
    </div>
  );
}
