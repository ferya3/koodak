"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * چاپ و دانلود کاربرگ.
 * فونت Vazirmatn به‌صورت base64 داخل SVG خروجی تزریق می‌شود تا فایل دانلودی
 * در هر دستگاهی دقیقاً مثل پیش‌نمایش دیده شود.
 */
async function serialize(svgId: string) {
  const node = document.getElementById(svgId) as SVGSVGElement | null;
  if (!node) throw new Error("svg not found");
  const clone = node.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("width", "1240");
  clone.setAttribute("height", "1754");
  try {
    const buf = await (await fetch("/fonts/Vazirmatn.woff2")).arrayBuffer();
    let bin = "";
    new Uint8Array(buf).forEach((b) => (bin += String.fromCharCode(b)));
    const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    style.textContent = `@font-face{font-family:Vazirmatn;src:url(data:font/woff2;base64,${btoa(bin)}) format("woff2");font-weight:100 900}`;
    clone.insertBefore(style, clone.firstChild);
  } catch {
    /* بدون فونت هم خروجی قابل استفاده است */
  }
  return new XMLSerializer().serializeToString(clone);
}

function download(href: string, name: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = name;
  a.click();
}

export function WorksheetActions({ svgId, slug }: { svgId: string; slug: string }) {
  const [busy, setBusy] = useState<null | "png" | "svg">(null);

  const asSvg = async () => {
    setBusy("svg");
    const text = await serialize(svgId);
    const url = URL.createObjectURL(new Blob([text], { type: "image/svg+xml" }));
    download(url, `kidsworld-${slug}.svg`);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    setBusy(null);
  };

  const asPng = async () => {
    setBusy("png");
    const text = await serialize(svgId);
    const img = new Image();
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(text)}`;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = 1240;
    canvas.height = 1754;
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    download(canvas.toDataURL("image/png"), `kidsworld-${slug}.png`);
    setBusy(null);
  };

  return (
    <div className="flex flex-col gap-3">
      <Button variant="kid" tone="coral" size="lg" onClick={() => window.print()} className="w-full">
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
          <path d="M7 9 V3 H17 V9 M7 17 H5 a2 2 0 0 1 -2 -2 V11 a2 2 0 0 1 2 -2 H19 a2 2 0 0 1 2 2 V15 a2 2 0 0 1 -2 2 H17 M7 14 H17 V21 H7 Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
        </svg>
        چاپ مستقیم
      </Button>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={asPng} disabled={busy !== null}>
          {busy === "png" ? "در حال ساخت…" : "دانلود PNG"}
        </Button>
        <Button variant="secondary" onClick={asSvg} disabled={busy !== null}>
          {busy === "svg" ? "در حال ساخت…" : "دانلود SVG"}
        </Button>
      </div>
      <p className="text-center text-xs text-ink-500">نسخه‌ی PDF چندصفحه‌ای پس از اتصال به سرور (صف پردازش) فعال می‌شود.</p>
    </div>
  );
}
