"use client";
import { useEffect, useMemo, useState } from "react";
import type { ChildProfile, CustomGame, CustomGameType, ToneKey } from "@kidsworld/types";
import { PlayIcon, playIconNames, type PlayIconKey } from "@/components/brand/PlayIcon";
import { Avatar } from "@/components/brand/Avatar";
import { GameCover } from "@/features/games/GameCover";
import { GamePlayer } from "@/features/games/GamePlayer";
import { live, LIVE } from "@/lib/api/live";
import { children as demoChildren } from "@/lib/data/family";
import { tones } from "@/lib/tones";
import { cn, fa } from "@/lib/utils";
import { COLOR_FA, COLOR_HEX, COLORS, parseToken, SHAPE_FA, SHAPES, TokenArt, type ColorName } from "./tokens";
import { CUSTOM_TYPES, customGames, toGame, type CustomGameInput } from "./store";

/**
 * بازی‌ساز والدین: نوع بازی را انتخاب، با ویرایشگر تصویری طراحی، پیش‌نمایش و برای کودکان ذخیره کنید.
 * بازی ساخته‌شده با همان موتور بازی‌های اصلی اجرا می‌شود (قطار الگو، شمارش، حافظه).
 */

type Draft = CustomGameInput & { id?: string };

const COUNT_ICONS: PlayIconKey[] = ["fish", "duck", "star", "apple", "butterfly", "bee", "car", "ball", "balloon", "heart", "strawberry", "rabbit"];
const MEMORY_ICONS: PlayIconKey[] = [
  "cat", "dog", "rabbit", "fox", "lion", "elephant", "zebra", "pig", "horse", "turtle", "owl", "duck", "apple", "banana", "grapes", "strawberry",
  "watermelon", "pear", "car", "bus", "boat", "rocket", "sun", "moon", "star", "cloud", "kite", "balloon", "ball", "book", "icecream", "cake",
];
const TONE_CHOICES: ToneKey[] = ["sun", "coral", "sky", "grass", "grape", "berry"];

const defaults: Record<CustomGameType, Record<string, unknown>> = {
  pattern: { unit: ["circle-red", "square-blue", "triangle-green"], wagons: 10, shown: 6 },
  counting: { counts: [3, 7, 12, 15, 5], icon: "fish" },
  memory: { icons: ["cat", "dog", "rabbit", "fox", "lion", "elephant"] },
};

const newDraft = (type: CustomGameType): Draft => ({
  title: CUSTOM_TYPES[type].title + " من",
  gameType: type,
  tone: CUSTOM_TYPES[type].tone,
  childIds: null,
  config: structuredClone(defaults[type]),
});

export function GameStudio() {
  const [games, setGames] = useState<CustomGame[] | null>(null);
  const [kids, setKids] = useState<ChildProfile[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [playing, setPlaying] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const refresh = () =>
    customGames
      .list()
      .then(setGames)
      .catch((e: Error) => {
        setGames([]);
        setError(e.message);
      });

  useEffect(() => {
    refresh();
    if (LIVE) live.children().then((r) => setKids(r.data)).catch(() => setKids([]));
    else setKids(demoChildren);
  }, []);

  const save = async () => {
    if (!draft) return;
    if (!draft.title.trim()) return setError("یک نام برای بازی بنویسید.");
    setBusy(true);
    setError(null);
    try {
      const { id, ...input } = draft;
      await customGames.save({ ...input, title: input.title.trim() }, id);
      setDraft(null);
      setNotice(id ? "بازی به‌روز شد." : "بازی ساخته شد! حالا در محیط کودک دیده می‌شود.");
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "ذخیره ممکن نشد.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (g: CustomGame) => {
    if (!confirm(`بازی «${g.title}» حذف شود؟`)) return;
    await customGames.remove(g.id).catch((e: Error) => setError(e.message));
    refresh();
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-calm-900 sm:text-3xl">بازی‌ساز خانواده</h1>
          <p className="mt-1 max-w-2xl leading-7 text-calm-500">
            بازی را خودتان طراحی کنید: قطاری با الگوی دلخواه، تنگ ماهی با تعداد دلخواه یا کارت‌های حافظه با تصویرهای انتخابی. بازی ساخته‌شده فقط برای کودکان خانواده‌ی شما در محیط کودک نمایش داده می‌شود.
          </p>
          {!LIVE && <p className="mt-2 text-sm font-bold text-peach-700">حالت نمایشی: بازی‌ها فقط در همین مرورگر ذخیره می‌شوند.</p>}
        </div>
      </header>

      {notice && (
        <p role="status" className="rounded-xl bg-grass-100 px-4 py-3 font-bold text-grass-700">
          {notice}
        </p>
      )}
      {error && !draft && (
        <p role="alert" className="rounded-xl bg-coral-100 px-4 py-3 font-bold text-coral-700">
          {error}
        </p>
      )}

      {!draft && (
        <section aria-labelledby="new-title">
          <h2 id="new-title" className="mb-3 text-lg font-black">ساخت بازی تازه</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {(Object.keys(CUSTOM_TYPES) as CustomGameType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setNotice(null);
                  setError(null);
                  setDraft(newDraft(type));
                }}
                className="group overflow-hidden rounded-2xl bg-white text-start shadow-soft ring-1 ring-calm-200 transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <GameCover game={toGame({ id: "preview", ...newDraft(type) })} className="h-full w-full transition group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <p className="font-black text-calm-900">{CUSTOM_TYPES[type].title}</p>
                  <p className="mt-1 text-sm text-calm-500">{CUSTOM_TYPES[type].description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {draft && (
        <Editor
          draft={draft}
          setDraft={setDraft}
          kids={kids}
          busy={busy}
          error={error}
          onCancel={() => {
            setDraft(null);
            setError(null);
          }}
          onSave={save}
          onTry={() => setPlaying(draft)}
        />
      )}

      <section aria-labelledby="mine-title">
        <h2 id="mine-title" className="mb-3 text-lg font-black">
          بازی‌های ساخته‌شده {games && games.length > 0 && <span className="text-calm-500">({fa(games.length)})</span>}
        </h2>
        {games === null ? (
          <p className="text-calm-500">در حال بارگذاری…</p>
        ) : games.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-calm-300 bg-white p-6 text-center text-calm-500">هنوز بازی‌ای نساخته‌اید. از یکی از سه نوع بالا شروع کنید.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {games.map((g) => (
              <li key={g.id} className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-calm-200">
                <div className="aspect-[16/9] overflow-hidden">
                  <GameCover game={toGame(g)} className="h-full w-full" />
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <p className="font-black">{g.title}</p>
                    <p className="text-sm text-calm-500">
                      {CUSTOM_TYPES[g.gameType].title} · {summary(g)}
                    </p>
                  </div>
                  <p className="text-xs font-bold text-calm-500">
                    برای: {g.childIds?.length ? kids.filter((k) => g.childIds!.includes(k.id)).map((k) => k.displayName).join("، ") || "—" : "همه‌ی بچه‌ها"}
                  </p>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setPlaying(g)} className="flex-1 rounded-xl bg-calm-900 py-2 text-sm font-bold text-white hover:bg-calm-700">
                      امتحان
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNotice(null);
                        setDraft({ ...g, config: structuredClone(g.config) });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="flex-1 rounded-xl bg-white py-2 text-sm font-bold ring-1 ring-calm-300 hover:bg-calm-50"
                    >
                      ویرایش
                    </button>
                    <button type="button" onClick={() => remove(g)} className="rounded-xl px-3 py-2 text-sm font-bold text-coral-700 hover:bg-coral-100" aria-label={`حذف ${g.title}`}>
                      حذف
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {playing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-calm-900/70 p-3 backdrop-blur-sm sm:p-8" role="dialog" aria-modal="true" aria-label={`امتحان ${playing.title}`}>
          <div className="relative mx-auto max-w-5xl rounded-3xl bg-white p-3 shadow-float sm:p-6">
            <button type="button" onClick={() => setPlaying(null)} className="absolute left-4 top-4 z-10 rounded-full bg-calm-900 px-4 py-2 text-sm font-bold text-white">
              بستن پیش‌نمایش
            </button>
            <GamePlayer key={JSON.stringify(playing.config)} game={toGame({ id: playing.id ?? "draft", ...playing })} exitHref="/parent/games" offline />
          </div>
        </div>
      )}
    </div>
  );
}

function summary(g: Pick<CustomGame, "gameType" | "config">) {
  const c = g.config as Record<string, unknown>;
  if (g.gameType === "pattern") return `${fa(Number(c.wagons))} واگن، الگوی ${fa((c.unit as string[]).length)}تایی`;
  if (g.gameType === "counting") return `${fa((c.counts as number[]).length)} دور، تا ${fa(Math.max(...(c.counts as number[])))} شیء`;
  return `${fa((c.icons as string[]).length)} جفت کارت`;
}

/* ───────────── ویرایشگر ───────────── */
function Editor({ draft, setDraft, kids, busy, error, onCancel, onSave, onTry }: { draft: Draft; setDraft: (d: Draft) => void; kids: ChildProfile[]; busy: boolean; error: string | null; onCancel: () => void; onSave: () => void; onTry: () => void }) {
  const set = (patch: Partial<Draft>) => setDraft({ ...draft, ...patch });
  const setConfig = (patch: Record<string, unknown>) => setDraft({ ...draft, config: { ...draft.config, ...patch } });
  const childIds = draft.childIds ?? [];

  return (
    <section aria-label="ویرایشگر بازی" className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-calm-200 sm:p-7">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-black">
          {draft.id ? "ویرایش" : "ساخت"} {CUSTOM_TYPES[draft.gameType].title}
        </h2>
        <span className="rounded-full bg-calm-100 px-3 py-1 text-xs font-bold text-calm-700">تغییرات را همین پایین زنده ببینید</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        {/* تنظیمات عمومی */}
        <div className="space-y-5">
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold">نام بازی</span>
            <input value={draft.title} maxLength={60} onChange={(e) => set({ title: e.target.value })} className="h-11 w-full rounded-xl border border-calm-300 px-3 font-bold focus:outline-none focus:ring-2 focus:ring-sky-400" />
          </label>

          <fieldset>
            <legend className="mb-1.5 text-sm font-bold">رنگ کاور</legend>
            <div className="flex gap-2">
              {TONE_CHOICES.map((t) => (
                <button key={t} type="button" aria-pressed={draft.tone === t} aria-label={t} onClick={() => set({ tone: t })} className={cn("h-9 w-9 rounded-full ring-offset-2 transition", draft.tone === t ? "ring-2 ring-calm-900" : "ring-1 ring-calm-200")} style={{ background: tones[t].hex.mid }} />
              ))}
            </div>
          </fieldset>

          {kids.length > 0 && (
            <fieldset>
              <legend className="mb-1.5 text-sm font-bold">برای کدام بچه‌ها؟</legend>
              <div className="flex flex-wrap gap-2">
                <button type="button" aria-pressed={!childIds.length} onClick={() => set({ childIds: null })} className={cn("rounded-full px-3 py-1.5 text-sm font-bold", !childIds.length ? "bg-calm-900 text-white" : "bg-calm-100 text-calm-700")}>
                  همه
                </button>
                {kids.map((k) => {
                  const on = childIds.includes(k.id);
                  return (
                    <button
                      key={k.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => set({ childIds: on ? childIds.filter((x) => x !== k.id) : [...childIds, k.id] })}
                      className={cn("flex items-center gap-1.5 rounded-full py-1 pe-3 ps-1 text-sm font-bold", on ? "bg-calm-900 text-white" : "bg-calm-100 text-calm-700")}
                    >
                      <Avatar kind={k.avatar} className="h-6 w-6" ring={false} />
                      {k.displayName}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {draft.gameType === "pattern" && <PatternEditor config={draft.config} setConfig={setConfig} />}
          {draft.gameType === "counting" && <CountingEditor config={draft.config} setConfig={setConfig} />}
          {draft.gameType === "memory" && <MemoryEditor config={draft.config} setConfig={setConfig} />}
        </div>

        {/* پیش‌نمایش زنده */}
        <div className="space-y-4">
          <div className="rounded-2xl p-4 ring-1 ring-calm-200" style={{ background: `linear-gradient(150deg, ${tones[draft.tone].hex.soft}, #fff)` }}>
            <p className="mb-3 text-sm font-bold text-calm-500">پیش‌نمایش</p>
            {draft.gameType === "pattern" && <TrainPreview config={draft.config} />}
            {draft.gameType === "counting" && <TankPreview config={draft.config} />}
            {draft.gameType === "memory" && <CardsPreview config={draft.config} />}
          </div>
          {error && (
            <p role="alert" className="rounded-xl bg-coral-100 px-4 py-3 text-sm font-bold text-coral-700">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={onSave} disabled={busy} className="h-11 flex-1 rounded-xl bg-calm-900 px-5 font-bold text-white hover:bg-calm-700 disabled:opacity-50">
              {busy ? "در حال ذخیره…" : draft.id ? "ذخیره‌ی تغییرات" : "ذخیره و انتشار برای بچه‌ها"}
            </button>
            <button type="button" onClick={onTry} className="h-11 rounded-xl bg-white px-5 font-bold ring-1 ring-calm-300 hover:bg-calm-50">
              امتحان بازی
            </button>
            <button type="button" onClick={onCancel} className="h-11 rounded-xl px-4 font-bold text-calm-500 hover:bg-calm-100">
              انصراف
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stepper({ label, value, min, max, onChange, hint }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void; hint?: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-bold">{label}</span>
        <span className="rounded-lg bg-calm-100 px-2 py-0.5 text-sm font-black">{fa(value)}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-calm-900" aria-label={label} />
      {hint && <p className="mt-1 text-xs text-calm-500">{hint}</p>}
    </div>
  );
}

/* ── قطار الگو ── */
function PatternEditor({ config, setConfig }: { config: Record<string, unknown>; setConfig: (p: Record<string, unknown>) => void }) {
  const unit = (config.unit as string[]) ?? [];
  const wagons = Number(config.wagons ?? 10);
  const shown = Number(config.shown ?? 6);
  const [color, setColor] = useState<ColorName>("red");
  const update = (u: string[], w = wagons, s = shown) => {
    const ww = Math.max(6, Math.min(12, w));
    setConfig({ unit: u, wagons: ww, shown: Math.max(u.length, Math.min(ww - 1, s)) });
  };
  return (
    <div className="space-y-5 rounded-2xl bg-calm-50 p-4">
      <div>
        <p className="mb-2 text-sm font-bold">الگوی واگن‌ها ({fa(unit.length)} از ۴) – با کلیک روی شکل اضافه کنید</p>
        <div className="flex min-h-14 flex-wrap items-center gap-2 rounded-xl bg-white p-2 ring-1 ring-calm-200">
          {unit.map((id, i) => (
            <button key={i} type="button" onClick={() => unit.length > 2 && update(unit.filter((_, k) => k !== i))} className="group relative rounded-lg p-1 hover:bg-coral-100" aria-label={`حذف ${parseToken(id).name}`} title={unit.length > 2 ? "حذف" : "الگو حداقل دو شکل دارد"}>
              <TokenArt t={parseToken(id)} className="h-10 w-10" />
              {unit.length > 2 && <span className="absolute -left-1 -top-1 hidden h-5 w-5 place-items-center rounded-full bg-coral-500 text-xs font-black text-white group-hover:grid">×</span>}
            </button>
          ))}
          {unit.length < 2 && <span className="text-sm text-calm-500">حداقل دو شکل لازم است</span>}
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-bold">رنگ</p>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button key={c} type="button" aria-pressed={color === c} aria-label={COLOR_FA[c]} onClick={() => setColor(c)} className={cn("h-8 w-8 rounded-full ring-offset-2", color === c ? "ring-2 ring-calm-900" : "ring-1 ring-calm-200")} style={{ background: COLOR_HEX[c] }} />
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-bold">شکل</p>
        <div className="flex flex-wrap gap-2">
          {SHAPES.map((s) => (
            <button key={s} type="button" disabled={unit.length >= 4} onClick={() => update([...unit, `${s}-${color}`])} className="rounded-xl bg-white p-1.5 ring-1 ring-calm-200 transition hover:-translate-y-0.5 hover:ring-calm-500 disabled:opacity-40" aria-label={`افزودن ${SHAPE_FA[s]} ${COLOR_FA[color]}`}>
              <TokenArt t={parseToken(`${s}-${color}`)} className="h-10 w-10" />
            </button>
          ))}
        </div>
      </div>
      <Stepper label="تعداد کل واگن‌ها" value={wagons} min={6} max={12} onChange={(w) => update(unit, w)} />
      <Stepper label="واگن‌هایی که از اول چیده شده‌اند" value={shown} min={unit.length} max={wagons - 1} onChange={(s) => update(unit, wagons, s)} hint={`کودک ${fa(wagons - shown)} واگن باقی‌مانده را به ترتیب پر می‌کند.`} />
    </div>
  );
}

function TrainPreview({ config }: { config: Record<string, unknown> }) {
  const unit = ((config.unit as string[]) ?? []).map(parseToken);
  const wagons = Number(config.wagons ?? 10);
  const shown = Number(config.shown ?? 6);
  if (unit.length < 2) return <p className="text-sm text-calm-500">برای پیش‌نمایش حداقل دو شکل انتخاب کنید.</p>;
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex w-max items-end gap-1">
        <svg viewBox="0 0 90 90" className="h-14 w-14 shrink-0" aria-hidden="true">
          <g stroke="#1f1a3d" strokeWidth="4" strokeLinejoin="round">
            <rect x="6" y="30" width="78" height="44" rx="10" fill="#ffce3d" />
            <rect x="14" y="8" width="20" height="24" rx="4" fill="#ff73b3" />
            <circle cx="26" cy="78" r="9" fill="#fff" />
            <circle cx="64" cy="78" r="9" fill="#fff" />
          </g>
        </svg>
        {Array.from({ length: wagons }, (_, i) => (
          <div key={i} className={cn("grid h-10 w-10 place-items-center rounded-lg border-2 bg-white", i < shown ? "border-calm-900" : "border-dashed border-calm-300")}>
            {i < shown ? <TokenArt t={unit[i % unit.length]} className="h-7 w-7" /> : <span className="text-xs font-black text-calm-300">{fa(i - shown + 1)}</span>}
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-calm-500">
        {fa(shown)} واگن آماده، {fa(wagons - shown)} واگن برای کودک.
      </p>
    </div>
  );
}

/* ── تنگ ماهی ── */
function CountingEditor({ config, setConfig }: { config: Record<string, unknown>; setConfig: (p: Record<string, unknown>) => void }) {
  const counts = (config.counts as number[]) ?? [];
  const icon = (config.icon as PlayIconKey) ?? "fish";
  return (
    <div className="space-y-5 rounded-2xl bg-calm-50 p-4">
      <div>
        <p className="mb-2 text-sm font-bold">چه چیزی بشمارد؟</p>
        <div className="flex flex-wrap gap-2">
          {COUNT_ICONS.map((k) => (
            <button key={k} type="button" aria-pressed={icon === k} aria-label={playIconNames[k]} onClick={() => setConfig({ icon: k })} className={cn("rounded-xl bg-white p-1.5", icon === k ? "ring-2 ring-calm-900" : "ring-1 ring-calm-200")}>
              <PlayIcon name={k} className="h-9 w-9" />
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-bold">دورها ({fa(counts.length)} از ۱۰) – تعداد در هر دور: ۱ تا ۱۵</p>
        <ol className="space-y-2">
          {counts.map((n, i) => (
            <li key={i} className="flex items-center gap-2 rounded-xl bg-white p-2 ring-1 ring-calm-200">
              <span className="w-12 shrink-0 text-sm font-bold text-calm-500">دور {fa(i + 1)}</span>
              <button type="button" onClick={() => setConfig({ counts: counts.map((x, k) => (k === i ? Math.max(1, x - 1) : x)) })} className="h-8 w-8 rounded-lg bg-calm-100 font-black" aria-label="کمتر">
                −
              </button>
              <span className="w-8 text-center text-lg font-black">{fa(n)}</span>
              <button type="button" onClick={() => setConfig({ counts: counts.map((x, k) => (k === i ? Math.min(15, x + 1) : x)) })} className="h-8 w-8 rounded-lg bg-calm-100 font-black" aria-label="بیشتر">
                +
              </button>
              <span className="flex min-w-0 flex-1 flex-wrap gap-0.5" aria-hidden="true">
                {Array.from({ length: n }, (_, k) => (
                  <PlayIcon key={k} name={icon} className="h-4 w-4" />
                ))}
              </span>
              {counts.length > 1 && (
                <button type="button" onClick={() => setConfig({ counts: counts.filter((_, k) => k !== i) })} className="rounded-lg px-2 text-sm font-bold text-coral-700 hover:bg-coral-100" aria-label={`حذف دور ${i + 1}`}>
                  ×
                </button>
              )}
            </li>
          ))}
        </ol>
        {counts.length < 10 && (
          <button type="button" onClick={() => setConfig({ counts: [...counts, Math.min(15, (counts.at(-1) ?? 3) + 2)] })} className="mt-2 rounded-xl bg-white px-4 py-2 text-sm font-bold ring-1 ring-calm-300 hover:bg-calm-50">
            + افزودن دور
          </button>
        )}
      </div>
    </div>
  );
}

function TankPreview({ config }: { config: Record<string, unknown> }) {
  const counts = (config.counts as number[]) ?? [];
  const icon = (config.icon as PlayIconKey) ?? "fish";
  const [round, setRound] = useState(0);
  const n = counts[Math.min(round, counts.length - 1)] ?? 0;
  const cells = useMemo(() => Array.from({ length: n }, (_, k) => ({ x: (k % 5) * 19 + 5, y: Math.floor(k / 5) * 30 + 8 })), [n]);
  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-b from-sky-100 to-sky-300">
        {cells.map((c, k) => (
          <span key={k} className="absolute w-[15%]" style={{ left: `${c.x}%`, top: `${c.y}%` }}>
            <PlayIcon name={icon} className="w-full" />
          </span>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {counts.map((c, i) => (
          <button key={i} type="button" onClick={() => setRound(i)} className={cn("rounded-lg px-2.5 py-1 text-sm font-bold", i === round ? "bg-calm-900 text-white" : "bg-white ring-1 ring-calm-200")}>
            دور {fa(i + 1)}: {fa(c)}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── کارت‌های حافظه ── */
function MemoryEditor({ config, setConfig }: { config: Record<string, unknown>; setConfig: (p: Record<string, unknown>) => void }) {
  const icons = (config.icons as string[]) ?? [];
  const toggle = (k: string) => setConfig({ icons: icons.includes(k) ? icons.filter((x) => x !== k) : icons.length < 8 ? [...icons, k] : icons });
  return (
    <div className="rounded-2xl bg-calm-50 p-4">
      <p className="mb-2 text-sm font-bold">تصویر کارت‌ها ({fa(icons.length)} از ۸، حداقل ۲) – هر تصویر یک جفت کارت می‌شود</p>
      <div className="grid grid-cols-8 gap-1.5">
        {MEMORY_ICONS.map((k) => {
          const on = icons.includes(k);
          return (
            <button key={k} type="button" aria-pressed={on} aria-label={playIconNames[k]} onClick={() => (on && icons.length <= 2 ? null : toggle(k))} className={cn("rounded-lg bg-white p-1", on ? "ring-2 ring-calm-900" : "opacity-70 ring-1 ring-calm-200 hover:opacity-100")}>
              <PlayIcon name={k} className="h-full w-full" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CardsPreview({ config }: { config: Record<string, unknown> }) {
  const icons = ((config.icons as string[]) ?? []) as PlayIconKey[];
  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        {[...icons, ...icons].map((k, i) => (
          <div key={i} className={cn("grid aspect-[3/4] place-items-center rounded-xl", i % 3 === 0 ? "bg-white ring-1 ring-calm-200" : "bg-grape-400")}>
            {i % 3 === 0 && <PlayIcon name={k} className="h-3/5 w-3/5" />}
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-calm-500">{fa(icons.length * 2)} کارت ({fa(icons.length)} جفت)</p>
    </div>
  );
}
