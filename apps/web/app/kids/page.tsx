"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ChildProfile } from "@kidsworld/types";
import { children as demoChildren } from "@/lib/data/family";
import { writeProgress } from "@/lib/progress";
import { ApiError, live, LIVE } from "@/lib/api/live";
import { Avatar } from "@/components/brand/Avatar";
import { Mascot } from "@/components/brand/Mascot";
import { ParentGate } from "@/features/kids/ParentGate";
import { fa } from "@/lib/utils";

/**
 * «کی داره بازی می‌کنه؟» – انتخاب پروفایل بدون رمز و فرم.
 * حالت متصل: فهرست از حساب والدِ واردشده؛ با انتخاب، یک توکن جلسه‌ی محدود برای همان کودک صادر می‌شود.
 */
export default function WhoIsPlaying() {
  const router = useRouter();
  const [kids, setKids] = useState<ChildProfile[] | null>(LIVE ? null : demoChildren);
  const [needsParent, setNeedsParent] = useState(false);
  const [gate, setGate] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!LIVE) return;
    live
      .children()
      .then((r) => setKids(r.data))
      .catch((e) => (e instanceof ApiError && (e.status === 401 || e.status === 403) ? setNeedsParent(true) : setKids([])));
  }, []);

  const pick = async (child: ChildProfile | null) => {
    if (LIVE && child) {
      setBusy(child.id);
      try {
        await live.startChildSession(child.id);
      } catch {
        setBusy(null);
        return;
      }
    }
    writeProgress((p) => ({ ...p, activeChildId: child?.id ?? null, activeChild: LIVE ? child : null }));
    router.push("/kids/home");
  };

  if (needsParent) {
    return (
      <div className="flex flex-col items-center pt-10 text-center">
        <Mascot mood="think" className="h-32 w-32" />
        <h1 className="mt-4 text-3xl font-black">اول یکی از بزرگ‌ترها وارد شود</h1>
        <p className="mt-2 text-lg font-bold text-ink-500">بعد می‌توانی بازی را شروع کنی!</p>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={() => setGate(true)} className="h-14 rounded-3xl border-[3px] border-ink-900 bg-white px-6 text-lg font-black btn-3d [--btn-edge:var(--color-ink-900)]">
            ورود بزرگ‌ترها
          </button>
          <button type="button" onClick={() => pick(null)} className="h-14 rounded-3xl bg-grass-400 px-6 text-lg font-black text-white btn-3d [--btn-edge:var(--color-grass-500)]">
            بازی به‌عنوان مهمان
          </button>
        </div>
        {gate && <ParentGate href="/auth/login?next=/kids" onClose={() => setGate(false)} />}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pt-6 text-center">
      <Mascot mood="happy" className="h-32 w-32 animate-float" />
      <h1 className="mt-4 text-4xl font-black sm:text-5xl">سلام! کی داره بازی می‌کنه؟</h1>
      <p className="mt-3 text-lg font-bold text-ink-500">روی عکس خودت بزن</p>
      <ul className="mt-10 flex flex-wrap justify-center gap-6" aria-busy={kids === null}>
        {kids === null &&
          [0, 1].map((i) => <li key={i} className="h-60 w-44 animate-pulse rounded-[2rem] bg-white/70" />)}
        {kids?.map((c) => (
          <li key={c.id}>
            <button type="button" disabled={busy !== null} onClick={() => pick(c)} className="group flex w-44 flex-col items-center gap-3 rounded-[2rem] border-[3px] border-ink-900 bg-white p-5 btn-3d [--btn-edge:var(--color-ink-900)] disabled:opacity-60">
              <Avatar kind={c.avatar} className="h-32 w-32 transition group-hover:animate-wiggle" />
              <span className="text-2xl font-black">{c.displayName}</span>
              <span className="rounded-full bg-sky-100 px-3 py-0.5 text-sm font-bold text-sky-700">{busy === c.id ? "…" : `${fa(c.age)} ساله`}</span>
            </button>
          </li>
        ))}
        <li>
          <button type="button" onClick={() => pick(null)} className="flex h-full min-h-60 w-44 flex-col items-center justify-center gap-3 rounded-[2rem] border-[3px] border-dashed border-ink-500 bg-white/60 p-5 transition hover:bg-white">
            <span className="grid h-32 w-32 place-items-center rounded-full bg-ink-100 text-6xl font-black text-ink-300">؟</span>
            <span className="text-2xl font-black text-ink-500">مهمان</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
