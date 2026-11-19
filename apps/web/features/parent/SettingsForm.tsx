"use client";
import { useState } from "react";
import type { ContentType, ParentSettings } from "@kidsworld/types";
import { contentTypeLabel } from "@/lib/data/taxonomy";
import { cn, fa } from "@/lib/utils";

function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3">
      <span>
        <span className="block text-sm font-bold">{label}</span>
        {description && <span className="block text-xs text-calm-500">{description}</span>}
      </span>
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={cn("relative h-7 w-12 shrink-0 rounded-full transition", checked ? "bg-ocean-500" : "bg-calm-300")}>
        <span className={cn("absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all", checked ? "start-6" : "start-1")} />
      </button>
    </label>
  );
}

const TYPES: ContentType[] = ["game", "story", "worksheet", "lesson", "drawing"];

/** تنظیمات کنترل والدین – در حالت متصل: PUT /api/v1/children/{id}/settings */
export function SettingsForm({ initial, childName }: { initial: ParentSettings; childName: string }) {
  const [s, setS] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const set = <K extends keyof ParentSettings>(k: K, v: ParentSettings[K]) => {
    setS((p) => ({ ...p, [k]: v }));
    setSaved(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSaved(true);
      }}
      className="space-y-6"
    >
      <section className="rounded-2xl border border-calm-200 bg-white p-5 shadow-calm">
        <h2 className="font-sans text-base font-bold">زمان استفاده</h2>
        <p className="text-xs text-calm-500">وقتی زمان تمام شود، پیکو با مهربانی خداحافظی می‌کند و بازی ذخیره می‌شود.</p>
        <div className="mt-4">
          <Toggle checked={s.screenTimeEnabled} onChange={(v) => set("screenTimeEnabled", v)} label="محدودیت زمان روزانه" />
          <div className={cn("transition", !s.screenTimeEnabled && "pointer-events-none opacity-40")}>
            <div className="flex items-center justify-between text-sm">
              <label htmlFor="limit" className="font-bold">
                سقف روزانه
              </label>
              <output htmlFor="limit" className="rounded-lg bg-calm-100 px-2 py-0.5 font-bold tabular-nums">
                {fa(s.dailyLimitMinutes)} دقیقه
              </output>
            </div>
            <input id="limit" type="range" min={10} max={120} step={5} value={s.dailyLimitMinutes} onChange={(e) => set("dailyLimitMinutes", Number(e.target.value))} className="mt-3 w-full accent-ocean-500" />
            <div className="mt-1 flex justify-between text-xs text-calm-500">
              <span>{fa(10)}</span>
              <span>توصیه برای {fa(4)}–{fa(6)} سال: {fa(30)} تا {fa(60)} دقیقه</span>
              <span>{fa(120)}</span>
            </div>
          </div>
        </div>
        <div className="mt-2 border-t border-calm-100">
          <Toggle checked={s.bedtimeLock.enabled} onChange={(v) => set("bedtimeLock", { ...s.bedtimeLock, enabled: v })} label="قفل ساعت خواب" description="در این بازه فقط قصه‌های قبل از خواب در دسترس است" />
          <div className={cn("grid grid-cols-2 gap-3", !s.bedtimeLock.enabled && "pointer-events-none opacity-40")}>
            {(["from", "to"] as const).map((k) => (
              <label key={k} className="text-sm font-bold">
                {k === "from" ? "از ساعت" : "تا ساعت"}
                <input type="time" value={s.bedtimeLock[k]} onChange={(e) => set("bedtimeLock", { ...s.bedtimeLock, [k]: e.target.value })} className="mt-1 h-11 w-full rounded-xl border border-calm-300 px-3" />
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-calm-200 bg-white p-5 shadow-calm">
        <h2 className="font-sans text-base font-bold">محتوای مجاز برای {childName}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {TYPES.map((t) => {
            const on = s.allowedContentTypes.includes(t);
            return (
              <button
                key={t}
                type="button"
                aria-pressed={on}
                onClick={() => set("allowedContentTypes", on ? s.allowedContentTypes.filter((x) => x !== t) : [...s.allowedContentTypes, t])}
                className={cn("rounded-xl border px-4 py-2 text-sm font-bold transition", on ? "border-calm-900 bg-calm-900 text-white" : "border-calm-300 bg-white text-calm-700")}
              >
                {on ? "✓ " : ""}
                {contentTypeLabel[t]}
              </button>
            );
          })}
        </div>
        <div className="mt-3 border-t border-calm-100">
          <Toggle checked={s.soundEnabled} onChange={(v) => set("soundEnabled", v)} label="صدا و موسیقی" description="صداهای بازخورد بازی‌ها و موسیقی پس‌زمینه" />
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button type="submit" className="h-11 rounded-xl bg-calm-900 px-6 text-sm font-bold text-white hover:bg-calm-700">
          ذخیره‌ی تغییرات
        </button>
        {saved && <span className="text-sm font-bold text-grass-700" role="status">✓ ذخیره شد</span>}
      </div>

      <section className="rounded-2xl border border-calm-200 bg-white p-5 shadow-calm">
        <h2 className="font-sans text-base font-bold">حریم خصوصی و داده‌ها</h2>
        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-calm-50 p-3">
            <dt className="text-xs text-calm-500">اطلاعات ذخیره‌شده از کودک</dt>
            <dd className="mt-1 font-bold">نام نمایشی، سال و ماه تولد، آواتار، نتایج فعالیت‌ها</dd>
          </div>
          <div className="rounded-xl bg-calm-50 p-3">
            <dt className="text-xs text-calm-500">رضایت‌نامه‌ی والدین</dt>
            <dd className="mt-1 font-bold text-grass-700">✓ تأییدشده در ۱۴۰۵/۰۷/۰۲ (نسخه ۱٫۲)</dd>
          </div>
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="h-10 rounded-xl border border-calm-300 px-4 text-sm font-bold hover:bg-calm-50">دریافت نسخه‌ی کامل داده‌ها (JSON)</button>
          <button type="button" className="h-10 rounded-xl border border-calm-300 px-4 text-sm font-bold hover:bg-calm-50">مشاهده‌ی رضایت‌نامه</button>
          <button type="button" onClick={() => setConfirmDelete(true)} className="h-10 rounded-xl border border-coral-300 px-4 text-sm font-bold text-coral-700 hover:bg-coral-100">
            حذف کامل اطلاعات {childName}
          </button>
        </div>
        {confirmDelete && (
          <div className="mt-4 rounded-xl border border-coral-300 bg-coral-100 p-4" role="alertdialog" aria-labelledby="del-title">
            <p id="del-title" className="font-bold text-coral-700">
              حذف دائمی؟
            </p>
            <p className="mt-1 text-sm text-calm-700">پروفایل، نقاشی‌ها و تمام سوابق {childName} ظرف ۳۰ روز به‌طور کامل حذف می‌شود و قابل بازگشت نیست.</p>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => setConfirmDelete(false)} className="h-10 rounded-xl bg-white px-4 text-sm font-bold">انصراف</button>
              <button type="button" className="h-10 rounded-xl bg-coral-500 px-4 text-sm font-bold text-white">بله، حذف شود</button>
            </div>
          </div>
        )}
      </section>
    </form>
  );
}
