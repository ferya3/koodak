import type { Metadata } from "next";
import { GameStudio } from "@/features/custom-games/GameStudio";

export const metadata: Metadata = { title: "بازی‌ساز خانواده" };

export default function ParentGamesPage() {
  return <GameStudio />;
}
