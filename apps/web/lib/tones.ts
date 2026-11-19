import type { ToneKey } from "@kidsworld/types";

/**
 * نگاشت هر تُن به کلاس‌های Tailwind.
 * کلاس‌ها باید کامل و استاتیک نوشته شوند تا Tailwind آن‌ها را تولید کند.
 */
export interface ToneClasses {
  soft: string; // پس‌زمینه‌ی ملایم کارت
  solid: string; // پس‌زمینه‌ی پررنگ
  text: string; // متن هم‌خانواده روی پس‌زمینه‌ی روشن
  border: string;
  ring: string;
  hex: { soft: string; mid: string; solid: string; deep: string };
}

export const tones: Record<ToneKey, ToneClasses> = {
  sun: { soft: "bg-sun-100", solid: "bg-sun-400", text: "text-sun-700", border: "border-sun-300", ring: "ring-sun-300", hex: { soft: "#fff3c4", mid: "#ffe07a", solid: "#ffce3d", deep: "#8a6200" } },
  coral: { soft: "bg-coral-100", solid: "bg-coral-400", text: "text-coral-700", border: "border-coral-300", ring: "ring-coral-300", hex: { soft: "#ffe1dc", mid: "#ff9f8e", solid: "#ff7a66", deep: "#a62e1c" } },
  sky: { soft: "bg-sky-100", solid: "bg-sky-400", text: "text-sky-700", border: "border-sky-300", ring: "ring-sky-300", hex: { soft: "#ddf3ff", mid: "#8fd3ff", solid: "#4fb8f5", deep: "#0d5a94" } },
  grass: { soft: "bg-grass-100", solid: "bg-grass-400", text: "text-grass-700", border: "border-grass-300", ring: "ring-grass-300", hex: { soft: "#ddf7e3", mid: "#8be0a0", solid: "#4fcb72", deep: "#1a6b34" } },
  grape: { soft: "bg-grape-100", solid: "bg-grape-400", text: "text-grape-700", border: "border-grape-300", ring: "ring-grape-300", hex: { soft: "#ede5ff", mid: "#bfa5ff", solid: "#9b7bff", deep: "#4c2db0" } },
  berry: { soft: "bg-berry-100", solid: "bg-berry-400", text: "text-berry-700", border: "border-berry-300", ring: "ring-berry-300", hex: { soft: "#ffe3f1", mid: "#ffa3cf", solid: "#ff73b3", deep: "#a12161" } },
  ocean: { soft: "bg-ocean-100", solid: "bg-ocean-400", text: "text-ocean-700", border: "border-ocean-300", ring: "ring-ocean-300", hex: { soft: "#d8f6f3", mid: "#7fddd3", solid: "#3fc4b6", deep: "#0f625a" } },
  peach: { soft: "bg-peach-100", solid: "bg-peach-400", text: "text-peach-700", border: "border-peach-300", ring: "ring-peach-300", hex: { soft: "#ffe9d6", mid: "#ffbe85", solid: "#ff9f4a", deep: "#9c4c0c" } },
  mint: { soft: "bg-mint-100", solid: "bg-mint-400", text: "text-mint-700", border: "border-mint-300", ring: "ring-mint-300", hex: { soft: "#e0faf0", mid: "#a6ecd0", solid: "#6fdcb2", deep: "#19714f" } },
  lilac: { soft: "bg-lilac-100", solid: "bg-lilac-400", text: "text-lilac-700", border: "border-lilac-300", ring: "ring-lilac-300", hex: { soft: "#f6ecff", mid: "#e0c4ff", solid: "#cc9ffc", deep: "#6c2fa8" } },
};

export const toneKeys = Object.keys(tones) as ToneKey[];
