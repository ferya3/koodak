import type { Metadata } from "next";
import { ParentNav } from "@/features/parent/ParentNav";

/** پنل والدین: تم «آرام» – داده‌محور، کم‌رنگ، متمایز از محیط کودک */
export const metadata: Metadata = {
  title: { default: "پنل والدین", template: "%s | پنل والدین KidsWorld" },
  robots: { index: false, follow: false },
};

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-calm-50 font-sans text-calm-900 lg:flex">
      <ParentNav />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 lg:py-10">{children}</main>
    </div>
  );
}
