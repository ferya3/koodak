"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { CustomGame } from "@kidsworld/types";
import { GameCover } from "@/features/games/GameCover";
import { readProgress } from "@/lib/progress";
import { customGames, toGame } from "./store";

/** محیط کودک: بازی‌هایی که مامان یا بابا ساخته‌اند (فقط اگر وجود داشته باشد نمایش داده می‌شود) */
export function FamilyGames() {
  const [list, setList] = useState<CustomGame[]>([]);
  useEffect(() => {
    customGames.forChild(readProgress().activeChildId).then(setList).catch(() => setList([]));
  }, []);
  if (!list.length) return null;
  return (
    <section aria-labelledby="family-title">
      <h2 id="family-title" className="mb-4 text-2xl font-black">
        بازی‌هایی که خانواده برایت ساخته 💛
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {list.map((g) => (
          <Link key={g.id} href={`/kids/custom/${g.id}`} className="group flex flex-col overflow-hidden rounded-[2rem] border-[3px] border-white bg-white shadow-[0_10px_28px_-12px_rgb(31_26_61/0.35)] btn-3d [--btn-edge:var(--color-ink-200)]">
            <div className="aspect-[4/3] overflow-hidden">
              <GameCover game={toGame(g)} className="h-full w-full transition duration-300 group-hover:scale-105" />
            </div>
            <p className="p-3 text-center text-lg font-black leading-tight">{g.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
