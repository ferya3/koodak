"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { CustomGame } from "@kidsworld/types";
import { GamePlayer } from "@/features/games/GamePlayer";
import { Mascot } from "@/components/brand/Mascot";
import { readProgress } from "@/lib/progress";
import { customGames, toGame } from "./store";

/** اجرای بازی ساخت والدین در محیط کودک (با همان GamePlayer؛ جلسه به سرور فرستاده نمی‌شود) */
export function CustomPlay({ id }: { id: string }) {
  const [game, setGame] = useState<CustomGame | null | undefined>(undefined);
  useEffect(() => {
    customGames
      .forChild(readProgress().activeChildId)
      .then((list) => setGame(list.find((g) => g.id === id) ?? null))
      .catch(() => setGame(null));
  }, [id]);

  if (game === undefined) return <p className="py-20 text-center text-2xl font-black text-ink-500">یک لحظه…</p>;
  if (game === null)
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <Mascot mood="think" className="h-32 w-32" />
        <p className="text-2xl font-black">این بازی پیدا نشد!</p>
        <Link href="/kids/home" className="rounded-full bg-sky-400 px-6 py-3 font-black text-white">
          برگشت به خانه
        </Link>
      </div>
    );
  return <GamePlayer game={toGame(game)} exitHref="/kids/home" variant="kids" offline />;
}
