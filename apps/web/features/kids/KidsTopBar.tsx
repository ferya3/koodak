"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/brand/Logo";
import { Avatar } from "@/components/brand/Avatar";
import { cn, fa } from "@/lib/utils";
import { useKid } from "./useKid";
import { ParentGate } from "./ParentGate";

/** نوار بالای محیط کودک: بدون متن زیاد، آیکون‌محور، با امتیاز و آواتار */
export function KidsTopBar() {
  const { child, progress } = useKid();
  const [gate, setGate] = useState(false);
  const pathname = usePathname();
  const onPicker = pathname === "/kids";

  return (
    <header className="sticky top-0 z-30 px-3 pt-3 sm:px-5">
      <div className="mx-auto flex h-20 max-w-6xl items-center gap-3 rounded-[1.75rem] border-[3px] border-ink-900 bg-white px-3 shadow-soft sm:px-4">
        <Link href={onPicker ? "/kids" : "/kids/home"} aria-label="خانه‌ی من" className="grid h-14 w-14 place-items-center rounded-2xl bg-sun-100">
          <LogoMark className="h-11 w-11" />
        </Link>

        {!onPicker && (
          <nav className="flex items-center gap-2" aria-label="ناوبری کودک">
            {[
              { href: "/kids/home", label: "خانه", icon: <path d="M4 12 L12 4 L20 12 V20 H14 V15 H10 V20 H4 Z" fill="#4fcb72" stroke="#1f1a3d" strokeWidth="2" strokeLinejoin="round" /> },
              { href: "/kids/studio", label: "نقاشی", icon: <><path d="M12 3 C 18 3, 21 7, 21 11 C 21 14, 18 14, 16 13 C 14 12, 13 14, 13.5 16 C 14 19, 12 21, 10 21 C 5 21, 3 17, 3 12 C 3 7, 7 3, 12 3 Z" fill="#ffe3f1" stroke="#1f1a3d" strokeWidth="2" /><circle cx="8" cy="10" r="1.8" fill="#ff7a66" /><circle cx="12" cy="7" r="1.8" fill="#4fb8f5" /><circle cx="16" cy="9" r="1.8" fill="#ffce3d" /></> },
            ].map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={cn("flex h-14 items-center gap-2 rounded-2xl px-3 font-display text-lg font-black transition", pathname === n.href ? "bg-ink-900 text-white" : "hover:bg-ink-50")}
              >
                <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
                  {n.icon}
                </svg>
                <span className="hidden sm:inline">{n.label}</span>
              </Link>
            ))}
          </nav>
        )}

        <div className="ms-auto flex items-center gap-2">
          {child && progress && (
            <>
              <span className="flex h-12 items-center gap-1.5 rounded-2xl border-[3px] border-ink-900 bg-sun-300 px-3 font-display text-xl font-black" aria-label={`${progress.stars} ستاره`}>
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                  <path d="M12 2.5 L 14.8 8.6 L 21.5 9.3 L 16.5 13.8 L 17.9 20.4 L 12 17 L 6.1 20.4 L 7.5 13.8 L 2.5 9.3 L 9.2 8.6 Z" fill="#fff" stroke="#1f1a3d" strokeWidth="2" strokeLinejoin="round" />
                </svg>
                {fa(progress.stars)}
              </span>
              <Link href="/kids" aria-label={`تغییر بازیکن (${child.displayName})`} className="rounded-full transition hover:scale-105">
                <Avatar kind={child.avatar} className="h-14 w-14" />
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setGate(true)}
            className="grid h-12 w-12 place-items-center rounded-2xl text-ink-300 transition hover:bg-ink-50 hover:text-ink-700"
            aria-label="ورود والدین"
            title="ورود والدین"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
              <rect x="5" y="11" width="14" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M8 11 V8 a4 4 0 0 1 8 0 V11" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </div>
      {gate && <ParentGate href="/parent" onClose={() => setGate(false)} />}
    </header>
  );
}
