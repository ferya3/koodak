"use client";
import { useEffect, useState } from "react";
import { childById } from "@/lib/data/family";
import { readProgress, type LocalProgress } from "@/lib/progress";

/** کودک فعال + پیشرفت محلی، همگام با تغییرات */
export function useKid() {
  const [progress, setProgress] = useState<LocalProgress | null>(null);
  useEffect(() => {
    const sync = () => setProgress(readProgress());
    sync();
    window.addEventListener("kw-progress", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("kw-progress", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const child = progress?.activeChildId ? childById(progress.activeChildId) : undefined;
  return { progress, child, ready: progress !== null };
}
