"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { readProgress, writeProgress } from "@/lib/progress";
import { live, LIVE } from "@/lib/api/live";
import { Mascot } from "@/components/brand/Mascot";
import { coloringTemplates, svgToDataUrl } from "./templates";

/**
 * Creative Studio – بوم نقاشی
 * Canvas Rendering · قلم · مداد شمعی · پاک‌کن · سطل رنگ · پالت · اندازه‌ی قلم · Undo/Redo · خروجی PNG · ذخیره در پروفایل
 * لایه‌ی Line Art (قالب رنگ‌آمیزی) همیشه روی نقاشی می‌ماند تا خطوط پاک نشوند.
 */

const W = 1200;
const H = 900;
const MAX_HISTORY = 30;

const PALETTE = ["#1f1a3d", "#ff7a66", "#ff9f4a", "#ffce3d", "#4fcb72", "#3fc4b6", "#4fb8f5", "#9b7bff", "#ff73b3", "#c98a4b", "#ffffff", "#b9b4d3"];
const COLOR_NAMES = ["سرمه‌ای", "قرمز", "نارنجی", "زرد", "سبز", "فیروزه‌ای", "آبی", "بنفش", "صورتی", "قهوه‌ای", "سفید", "خاکستری"];
const SIZES = [8, 18, 36];

type Tool = "brush" | "crayon" | "eraser" | "fill";

export function DrawingStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wallsRef = useRef<Uint8ClampedArray | null>(null);
  const history = useRef<ImageData[]>([]);
  const histIdx = useRef(-1);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  const [tool, setTool] = useState<Tool>("brush");
  const [color, setColor] = useState(PALETTE[1]);
  const [size, setSize] = useState(SIZES[1]);
  const [template, setTemplate] = useState<string | null>("fish");
  const [, force] = useState(0);
  const [saved, setSaved] = useState<string[]>([]);
  const [toast, setToast] = useState(false);

  const ctx = () => canvasRef.current!.getContext("2d", { willReadFrequently: true })!;

  const snapshot = useCallback(() => {
    const data = ctx().getImageData(0, 0, W, H);
    history.current = history.current.slice(0, histIdx.current + 1);
    history.current.push(data);
    if (history.current.length > MAX_HISTORY) history.current.shift();
    histIdx.current = history.current.length - 1;
    force((n) => n + 1);
  }, []);

  const clear = useCallback(() => {
    const c = ctx();
    c.fillStyle = "#fff";
    c.fillRect(0, 0, W, H);
    snapshot();
  }, [snapshot]);

  useEffect(() => {
    clear();
    try {
      setSaved(JSON.parse(localStorage.getItem("kw.gallery") ?? "[]"));
    } catch {}
  }, [clear]);

  // بارگذاری دیوارهای قالب برای سطل رنگ
  useEffect(() => {
    wallsRef.current = null;
    if (!template) return;
    const t = coloringTemplates.find((x) => x.id === template)!;
    const img = new Image();
    img.onload = () => {
      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const oc = off.getContext("2d")!;
      oc.drawImage(img, 0, 0, W, H);
      wallsRef.current = oc.getImageData(0, 0, W, H).data;
    };
    img.src = svgToDataUrl(t.svg);
  }, [template]);

  const pos = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  };

  const stroke = (from: { x: number; y: number }, to: { x: number; y: number }, pressure = 0.5) => {
    const c = ctx();
    c.lineCap = "round";
    c.lineJoin = "round";
    c.strokeStyle = tool === "eraser" ? "#fff" : color;
    const w = tool === "eraser" ? size * 1.6 : size * (0.75 + pressure * 0.5);
    if (tool === "crayon") {
      // مداد شمعی: چند خط نازک با جابه‌جایی تصادفی برای بافت
      c.globalAlpha = 0.55;
      for (let i = 0; i < 4; i++) {
        const jx = (Math.random() - 0.5) * size * 0.6;
        const jy = (Math.random() - 0.5) * size * 0.6;
        c.lineWidth = w * 0.35;
        c.beginPath();
        c.moveTo(from.x + jx, from.y + jy);
        c.lineTo(to.x + jx, to.y + jy);
        c.stroke();
      }
      c.globalAlpha = 1;
      return;
    }
    c.lineWidth = w;
    c.beginPath();
    c.moveTo(from.x, from.y);
    c.lineTo(to.x, to.y);
    c.stroke();
  };

  const fill = (sx: number, sy: number) => {
    const c = ctx();
    const img = c.getImageData(0, 0, W, H);
    const d = img.data;
    const walls = wallsRef.current;
    const x0 = Math.floor(sx);
    const y0 = Math.floor(sy);
    const i0 = (y0 * W + x0) * 4;
    if (walls && walls[i0 + 3] > 60) return;
    const [tr, tg, tb] = [d[i0], d[i0 + 1], d[i0 + 2]];
    const n = parseInt(color.slice(1), 16);
    const [fr, fg, fb] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    if (tr === fr && tg === fg && tb === fb) return;
    const match = (i: number) => (!walls || walls[i + 3] < 60) && Math.abs(d[i] - tr) < 40 && Math.abs(d[i + 1] - tg) < 40 && Math.abs(d[i + 2] - tb) < 40;
    const stack = [x0, y0];
    const seen = new Uint8Array(W * H);
    while (stack.length) {
      const y = stack.pop()!;
      const x = stack.pop()!;
      let lx = x;
      while (lx >= 0 && !seen[y * W + lx] && match((y * W + lx) * 4)) lx--;
      lx++;
      let up = false;
      let down = false;
      for (let cx = lx; cx < W; cx++) {
        const p = y * W + cx;
        if (seen[p] || !match(p * 4)) break;
        seen[p] = 1;
        d[p * 4] = fr;
        d[p * 4 + 1] = fg;
        d[p * 4 + 2] = fb;
        d[p * 4 + 3] = 255;
        if (y > 0) {
          const q = p - W;
          const ok = !seen[q] && match(q * 4);
          if (ok && !up) stack.push(cx, y - 1);
          up = ok;
        }
        if (y < H - 1) {
          const q = p + W;
          const ok = !seen[q] && match(q * 4);
          if (ok && !down) stack.push(cx, y + 1);
          down = ok;
        }
      }
    }
    c.putImageData(img, 0, 0);
    snapshot();
  };

  const onDown = (e: React.PointerEvent) => {
    const p = pos(e);
    if (tool === "fill") {
      fill(p.x, p.y);
      return;
    }
    (e.target as Element).setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = p;
    stroke(p, { x: p.x + 0.1, y: p.y + 0.1 }, e.pressure || 0.5);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drawing.current || !last.current) return;
    const p = pos(e);
    stroke(last.current, p, e.pressure || 0.5);
    last.current = p;
  };
  const onUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    snapshot();
  };

  const undo = () => {
    if (histIdx.current <= 0) return;
    histIdx.current--;
    ctx().putImageData(history.current[histIdx.current], 0, 0);
    force((n) => n + 1);
  };
  const redo = () => {
    if (histIdx.current >= history.current.length - 1) return;
    histIdx.current++;
    ctx().putImageData(history.current[histIdx.current], 0, 0);
    force((n) => n + 1);
  };

  const composite = async () => {
    const out = document.createElement("canvas");
    out.width = W;
    out.height = H;
    const oc = out.getContext("2d")!;
    oc.drawImage(canvasRef.current!, 0, 0);
    if (template) {
      const img = new Image();
      img.src = svgToDataUrl(coloringTemplates.find((x) => x.id === template)!.svg);
      await img.decode();
      oc.drawImage(img, 0, 0, W, H);
    }
    return out;
  };

  const exportPng = async () => {
    const out = await composite();
    const a = document.createElement("a");
    a.href = out.toDataURL("image/png");
    a.download = "kidsworld-drawing.png";
    a.click();
  };

  const saveToProfile = async () => {
    const out = await composite();
    const thumb = document.createElement("canvas");
    thumb.width = 240;
    thumb.height = 180;
    thumb.getContext("2d")!.drawImage(out, 0, 0, 240, 180);
    const next = [thumb.toDataURL("image/jpeg", 0.7), ...saved].slice(0, 8);
    setSaved(next);
    try {
      localStorage.setItem("kw.gallery", JSON.stringify(next));
    } catch {}
    writeProgress((p) => ({ ...p, drawings: p.drawings + 1 }));
    // حالت متصل: ثبت فعالیت (مدال «نقاش کوچک»). آپلود خود تصویر به Object Storage در فاز بعد.
    const childId = readProgress().activeChildId;
    if (LIVE && childId) live.activity(childId, { type: "drawing", durationSeconds: 300, title: "نقاشی در استودیو" }).catch(() => null);
    setToast(true);
    setTimeout(() => setToast(false), 2200);
  };

  const canUndo = histIdx.current > 0;
  const canRedo = histIdx.current < history.current.length - 1;

  const tools: { id: Tool; label: string; icon: React.ReactNode }[] = [
    { id: "brush", label: "قلم‌مو", icon: <><path d="M14 4 L20 10 L10 20 L4 20 L4 14 Z" fill="#ffce3d" stroke="#1f1a3d" strokeWidth="2" strokeLinejoin="round" /><path d="M4 20 L 8 16" stroke="#1f1a3d" strokeWidth="2" /></> },
    { id: "crayon", label: "مداد شمعی", icon: <><path d="M6 18 L16 8 L20 12 L10 22 Z" fill="#ff7a66" stroke="#1f1a3d" strokeWidth="2" strokeLinejoin="round" /><path d="M16 8 L19 3 L21 5 L20 12" fill="#fff" stroke="#1f1a3d" strokeWidth="2" strokeLinejoin="round" /></> },
    { id: "fill", label: "سطل رنگ", icon: <><path d="M5 11 L12 4 L19 11 L12 18 Z" fill="#4fb8f5" stroke="#1f1a3d" strokeWidth="2" strokeLinejoin="round" /><path d="M20 15 C 22 18, 22 20, 20 20 C 18 20, 18 18, 20 15 Z" fill="#4fb8f5" stroke="#1f1a3d" strokeWidth="1.6" /></> },
    { id: "eraser", label: "پاک‌کن", icon: <><path d="M3 15 L12 6 L19 13 L12 20 L7 20 Z" fill="#ffa3cf" stroke="#1f1a3d" strokeWidth="2" strokeLinejoin="round" /><path d="M8 11 L 15 18" stroke="#1f1a3d" strokeWidth="2" /></> },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[88px_1fr_220px]">
      {/* ابزارها */}
      <div className="flex gap-2 rounded-[1.75rem] border-[3px] border-ink-900 bg-white p-2 lg:flex-col" role="toolbar" aria-label="ابزار نقاشی">
        {tools.map((t) => (
          <button key={t.id} type="button" onClick={() => setTool(t.id)} aria-pressed={tool === t.id} aria-label={t.label} title={t.label} className={cn("grid h-16 flex-1 place-items-center rounded-2xl transition lg:flex-none", tool === t.id ? "bg-sun-300 ring-[3px] ring-ink-900" : "hover:bg-ink-50")}>
            <svg viewBox="0 0 24 24" className="h-9 w-9" aria-hidden="true">
              {t.icon}
            </svg>
          </button>
        ))}
        <div className="mx-1 w-px bg-ink-100 lg:my-1 lg:h-px lg:w-auto" />
        <button type="button" onClick={undo} disabled={!canUndo} aria-label="برگرداندن" title="برگرداندن" className="grid h-16 flex-1 place-items-center rounded-2xl hover:bg-ink-50 disabled:opacity-30 lg:flex-none">
          <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true"><path d="M15 6 L 20 10 L 15 14 M20 10 H9 a5 5 0 0 0 0 10 H12" stroke="#1f1a3d" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button type="button" onClick={redo} disabled={!canRedo} aria-label="دوباره انجام دادن" title="دوباره" className="grid h-16 flex-1 place-items-center rounded-2xl hover:bg-ink-50 disabled:opacity-30 lg:flex-none">
          <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true"><path d="M9 6 L 4 10 L 9 14 M4 10 H15 a5 5 0 0 1 0 10 H12" stroke="#1f1a3d" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      {/* بوم */}
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-[1.75rem] border-[3px] border-ink-900 bg-white shadow-soft">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className={cn("block aspect-[4/3] w-full touch-none", tool === "fill" ? "cursor-cell" : "cursor-crosshair")}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onPointerLeave={onUp}
            aria-label="بوم نقاشی"
          />
          {template && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={svgToDataUrl(coloringTemplates.find((t) => t.id === template)!.svg)} alt="" className="pointer-events-none absolute inset-0 h-full w-full" />
          )}
          {toast && (
            <div className="absolute inset-x-0 top-4 mx-auto flex w-max animate-pop items-center gap-2 rounded-2xl border-[3px] border-ink-900 bg-grass-300 px-4 py-2 font-black">
              <Mascot mood="cheer" className="h-10 w-10" /> نقاشی‌ات در گالری ذخیره شد!
            </div>
          )}
        </div>

        {/* پالت */}
        <div className="flex flex-wrap items-center gap-2 rounded-[1.75rem] border-[3px] border-ink-900 bg-white p-3" role="radiogroup" aria-label="رنگ">
          {PALETTE.map((c, i) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={color === c}
              aria-label={COLOR_NAMES[i]}
              onClick={() => {
                setColor(c);
                if (tool === "eraser") setTool("brush");
              }}
              className={cn("h-11 w-11 rounded-full border-[3px] border-ink-900 transition", color === c ? "scale-110 ring-4 ring-ink-900/20" : "hover:scale-105")}
              style={{ backgroundColor: c }}
            />
          ))}
          <div className="ms-auto flex items-center gap-1 rounded-2xl bg-ink-50 p-1" role="radiogroup" aria-label="اندازه‌ی قلم">
            {SIZES.map((s, i) => (
              <button key={s} type="button" role="radio" aria-checked={size === s} aria-label={["نازک", "متوسط", "کلفت"][i]} onClick={() => setSize(s)} className={cn("grid h-11 w-11 place-items-center rounded-xl", size === s && "bg-white shadow-soft")}>
                <span className="rounded-full bg-ink-900" style={{ width: 6 + i * 7, height: 6 + i * 7 }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* قالب‌ها و ذخیره */}
      <div className="space-y-4">
        <div className="rounded-[1.75rem] border-[3px] border-ink-900 bg-white p-3">
          <p className="mb-2 px-1 text-lg font-black">صفحه‌ی رنگ‌آمیزی</p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setTemplate(null)} aria-pressed={template === null} className={cn("grid aspect-[4/3] place-items-center rounded-2xl border-[3px] text-sm font-black", template === null ? "border-ink-900 bg-sun-100" : "border-ink-100")}>
              نقاشی آزاد
            </button>
            {coloringTemplates.map((t) => (
              <button key={t.id} type="button" onClick={() => setTemplate(t.id)} aria-pressed={template === t.id} aria-label={t.title} className={cn("overflow-hidden rounded-2xl border-[3px] bg-white", template === t.id ? "border-ink-900 bg-sun-100" : "border-ink-100")}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={svgToDataUrl(t.svg)} alt="" className="aspect-[4/3] w-full" />
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-2">
          <button type="button" onClick={saveToProfile} className="h-14 rounded-2xl border-[3px] border-ink-900 bg-grass-400 text-lg font-black text-white btn-3d [--btn-edge:var(--color-grass-500)]">
            ذخیره در گالری من
          </button>
          <button type="button" onClick={exportPng} className="h-12 rounded-2xl border-[3px] border-ink-900 bg-white font-black btn-3d [--btn-edge:var(--color-ink-900)]">
            دانلود عکس
          </button>
          <button type="button" onClick={clear} className="h-12 rounded-2xl font-black text-coral-500 hover:bg-coral-100">
            صفحه‌ی تازه
          </button>
        </div>
        {saved.length > 0 && (
          <div className="rounded-[1.75rem] border-[3px] border-ink-900 bg-white p-3">
            <p className="mb-2 px-1 font-black">گالری من</p>
            <div className="grid grid-cols-2 gap-2">
              {saved.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt={`نقاشی ${i + 1}`} className="aspect-[4/3] w-full rounded-xl border-2 border-ink-100 object-cover" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
