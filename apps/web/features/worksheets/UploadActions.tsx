"use client";
import Link from "next/link";
import { useState } from "react";
import type { Worksheet } from "@kidsworld/types";
import { Button } from "@/components/ui/Button";
import { faNumber } from "@/lib/utils";
import { uploadUrls } from "./UploadedSheet";

type Problem = null | "login" | "subscribe" | "error";

/**
 * دانلود و چاپ کاربرگ آماده. فایل با fetch گرفته می‌شود تا خطای ورود (۴۰۱) یا اشتراک (۴۰۲)
 * به‌جای یک صفحه‌ی JSON، به‌صورت پیام فارسی نشان داده شود.
 */
export function UploadActions({ worksheet: w }: { worksheet: Worksheet }) {
  const [busy, setBusy] = useState<null | "download" | "print">(null);
  const [problem, setProblem] = useState<Problem>(null);
  const urls = uploadUrls(w.slug);
  const ext = w.file?.mime === "application/pdf" ? "pdf" : (w.file?.mime.split("/")[1] ?? "pdf");

  const get = async (url: string) => {
    const res = await fetch(url, { credentials: "same-origin" });
    if (res.status === 401) throw new Error("login");
    if (res.status === 402) throw new Error("subscribe");
    if (!res.ok) throw new Error("error");
    return URL.createObjectURL(await res.blob());
  };
  const fail = (e: unknown) => setProblem(e instanceof Error && (e.message === "login" || e.message === "subscribe") ? e.message : "error");

  const download = async () => {
    setBusy("download");
    setProblem(null);
    try {
      const href = await get(urls.file);
      const a = document.createElement("a");
      a.href = href;
      a.download = `kidsworld-${w.slug}.${ext}`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(href), 4000);
    } catch (e) {
      fail(e);
    } finally {
      setBusy(null);
    }
  };

  /** چاپ: فایل در زبانه‌ی تازه باز می‌شود (پنجره پیش از await باز می‌شود تا مسدود نشود) */
  const print = async () => {
    setBusy("print");
    setProblem(null);
    const win = window.open("", "_blank");
    try {
      const href = await get(urls.inline);
      if (win) win.location.href = href;
      else window.location.href = href;
    } catch (e) {
      win?.close();
      fail(e);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Button variant="kid" tone="coral" size="lg" onClick={download} disabled={busy !== null} className="w-full">
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
          <path d="M12 3 V15 M7 10 L12 15 L17 10 M4 19 H20" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {busy === "download" ? "در حال دریافت…" : `دانلود ${ext.toUpperCase()}`}
      </Button>
      <Button variant="secondary" onClick={print} disabled={busy !== null}>
        {busy === "print" ? "در حال آماده‌سازی…" : "باز کردن برای چاپ"}
      </Button>
      {w.file && <p className="text-center text-xs text-ink-500">حجم فایل: {faNumber(Math.max(1, Math.round(w.file.size / 1024)))} کیلوبایت</p>}
      {problem === "login" && (
        <p role="alert" className="rounded-2xl bg-sun-100 p-3 text-sm font-bold">
          برای دانلود این کاربرگ <Link href="/parent" className="text-coral-500 underline">وارد حساب والدین</Link> شوید.
        </p>
      )}
      {problem === "subscribe" && (
        <p role="alert" className="rounded-2xl bg-sun-100 p-3 text-sm font-bold">
          این کاربرگ مخصوص اشتراک خانواده است. <Link href="/pricing" className="text-coral-500 underline">مشاهده‌ی اشتراک‌ها</Link>
        </p>
      )}
      {problem === "error" && (
        <p role="alert" className="rounded-2xl bg-coral-100 p-3 text-sm font-bold">
          دریافت فایل ممکن نشد. کمی بعد دوباره امتحان کنید.
        </p>
      )}
    </div>
  );
}
