import type { Metadata } from "next";
import { KidsTopBar } from "@/features/kids/KidsTopBar";

/** محیط کودک: هرگز ایندکس نمی‌شود، تم شاد و درشت، بدون لینک بیرونی */
export const metadata: Metadata = {
  title: "دنیای من",
  robots: { index: false, follow: false },
};

export default function KidsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-sky-100 bg-dots font-display">
      <KidsTopBar />
      <main className="mx-auto max-w-6xl px-3 pb-16 pt-5 sm:px-5">{children}</main>
    </div>
  );
}
