"use client";
import { useEffect, useState } from "react";
import type { Story } from "@kidsworld/types";
import { tones } from "@/lib/tones";
import { cn, fa } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Mascot } from "@/components/brand/Mascot";
import { StoryScene } from "./StoryScene";
import { live, LIVE } from "@/lib/api/live";
import { readProgress } from "@/lib/progress";

/**
 * Story Reader – قصه‌ی تصویری + صوتی + تعاملی (انتخاب مسیر)
 * صوت: در نسخه‌ی تولیدی فایل صوتی گوینده (audio_asset) پخش می‌شود؛
 * اینجا از Web Speech API به‌عنوان Fallback استفاده شده است.
 */
export function StoryReader({ story }: { story: Story }) {
  const [chapterId, setChapterId] = useState(story.chapters[0].id);
  const [path, setPath] = useState<string[]>([story.chapters[0].id]);
  const [size, setSize] = useState<0 | 1 | 2>(1);
  const [speaking, setSpeaking] = useState(false);
  const [rate, setRate] = useState(0.9);
  const [saved, setSaved] = useState(false);
  const ch = story.chapters.find((c) => c.id === chapterId)!;
  const t = tones[story.tone];
  const BM = `kw.bookmark.${story.id}`;

  useEffect(() => {
    try {
      const b = localStorage.getItem(BM);
      if (b && story.chapters.some((c) => c.id === b)) {
        setChapterId(b);
        setSaved(true);
      }
    } catch {}
    return () => window.speechSynthesis?.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [startedAt] = useState(() => Date.now());

  const go = (id: string) => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    // پایان قصه در حالت متصل ثبت می‌شود (مهارت شنیداری، مدال قصه‌خوان)
    const childId = readProgress().activeChildId;
    if (LIVE && childId && story.chapters.find((c) => c.id === id)?.isEnding && /^\d+$/.test(story.id)) {
      live.activity(childId, { type: "story", contentId: Number(story.id), durationSeconds: Math.max(30, Math.round((Date.now() - startedAt) / 1000)) }).catch(() => null);
    }
    setChapterId(id);
    setPath((p) => [...p, id]);
    setSaved(false);
  };

  const restart = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setChapterId(story.chapters[0].id);
    setPath([story.chapters[0].id]);
  };

  const speak = () => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(`${ch.title}. ${ch.body}`);
    u.lang = "fa-IR";
    u.rate = rate;
    u.onend = () => setSpeaking(false);
    synth.speak(u);
    setSpeaking(true);
  };

  const bookmark = () => {
    try {
      if (saved) localStorage.removeItem(BM);
      else localStorage.setItem(BM, chapterId);
      setSaved(!saved);
    } catch {}
  };

  const textSize = ["text-lg leading-9", "text-xl leading-10 sm:text-2xl sm:leading-[3rem]", "text-2xl leading-[3rem] sm:text-3xl sm:leading-[3.5rem]"][size];

  return (
    <article className="overflow-hidden rounded-[2rem] border-[3px] border-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)] bg-white shadow-lift">
      <div className="relative">
        <StoryScene scene={ch.scene} className="aspect-[16/9] w-full sm:aspect-[21/9]" />
        <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1.5 pb-3">
          {story.chapters.map((c) => (
            <span key={c.id} className={cn("h-2.5 rounded-full border-2 border-ink-900/10 transition-all", c.id === chapterId ? "w-8 bg-sun-400" : path.includes(c.id) ? "w-2.5 bg-white" : "w-2.5 bg-white/40")} />
          ))}
        </div>
      </div>

      {/* نوار ابزار */}
      <div className={cn("flex flex-wrap items-center gap-2 border-y border-ink-900/5 px-4 py-3", t.soft)}>
        <Button variant="kid" tone={speaking ? "coral" : "grass"} size="md" onClick={speak} aria-pressed={speaking}>
          {speaking ? "■ توقف" : "▶ برام بخون"}
        </Button>
        <label className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-bold">
          سرعت
          <select value={rate} onChange={(e) => setRate(Number(e.target.value))} className="bg-transparent font-bold">
            <option value={0.7}>آرام</option>
            <option value={0.9}>معمولی</option>
            <option value={1.1}>تند</option>
          </select>
        </label>
        <div className="flex items-center rounded-2xl bg-white p-1" role="group" aria-label="اندازه‌ی متن">
          {([0, 1, 2] as const).map((s) => (
            <button key={s} type="button" onClick={() => setSize(s)} aria-pressed={size === s} className={cn("grid h-9 w-9 place-items-center rounded-xl font-display font-black", size === s && "bg-ink-900 text-white")} style={{ fontSize: 13 + s * 4 }}>
              الف
            </button>
          ))}
        </div>
        <button type="button" onClick={bookmark} aria-pressed={saved} className="ms-auto flex items-center gap-1.5 rounded-2xl bg-white px-3 py-2 text-sm font-bold">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d="M6 3 H18 V21 L12 16 L6 21 Z" fill={saved ? "#ff73b3" : "none"} stroke="#1f1a3d" strokeWidth="2" strokeLinejoin="round" />
          </svg>
          {saved ? "نشانک‌گذاری شد" : "نشانک"}
        </button>
      </div>

      <div className="px-5 py-8 sm:px-12 sm:py-10">
        <p className="text-sm font-extrabold text-ink-500">
          بخش {fa(path.length)}
        </p>
        <h2 className="mt-1 text-3xl font-black">{ch.title}</h2>
        <p className={cn("mt-4 max-w-3xl font-display font-medium text-ink-900", textSize)}>{ch.body}</p>

        {ch.choices.length > 0 && (
          <div className="mt-8">
            {ch.choices.length > 1 && (
              <div className="mb-4 flex items-center gap-3">
                <Mascot mood="think" className="h-14 w-14" />
                <p className="font-display text-lg font-extrabold">تو انتخاب کن! قصه از کدام راه برود؟</p>
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              {ch.choices.map((c, i) => (
                <Button key={c.id} variant="kid" tone={ch.choices.length > 1 ? (i === 0 ? "sky" : "berry") : story.tone} size="xl" onClick={() => go(c.nextChapterId)}>
                  {c.text}
                  {ch.choices.length === 1 && " ←"}
                </Button>
              ))}
            </div>
          </div>
        )}

        {ch.isEnding && (
          <div className="mt-8 flex flex-wrap items-center gap-4 rounded-3xl border-[3px] border-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)] bg-sun-100 p-5">
            <Mascot mood="sleepy" className="h-20 w-20" />
            <div className="flex-1">
              <p className="font-display text-2xl font-black">پایان قصه 🌙</p>
              <p className="text-ink-700">می‌خواهی ببینی اگر راه دیگری را انتخاب می‌کردی چه می‌شد؟</p>
            </div>
            <Button variant="kid" tone="grape" size="lg" onClick={restart}>
              از اول بخوان
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
