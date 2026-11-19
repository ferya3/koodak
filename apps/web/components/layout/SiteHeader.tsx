"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/worksheets", label: "کاربرگ‌ها" },
  { href: "/games", label: "بازی‌ها" },
  { href: "/stories", label: "قصه‌ها" },
  { href: "/#worlds", label: "دنیاها" },
  { href: "/pricing", label: "اشتراک" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink-900/5 bg-cream-50/85 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="KidsWorld – صفحه‌ی اصلی" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="ناوبری اصلی">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "rounded-full px-4 py-2 font-display text-[0.95rem] font-bold text-ink-700 transition hover:bg-white hover:text-ink-900",
                pathname.startsWith(n.href) && n.href !== "/#worlds" && "bg-white text-ink-900 shadow-soft",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <ButtonLink href="/parent" variant="ghost" size="sm">
            ورود والدین
          </ButtonLink>
          <ButtonLink href="/kids" variant="kid" tone="grass" size="md" className="rounded-2xl">
            ورود بچه‌ها
          </ButtonLink>
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-2xl border-2 border-ink-900 bg-white lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "بستن منو" : "باز کردن منو"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            {open ? (
              <path d="M6 6 L18 18 M18 6 L6 18" stroke="#1f1a3d" strokeWidth="2.5" strokeLinecap="round" />
            ) : (
              <path d="M4 7 H20 M4 12 H20 M4 17 H14" stroke="#1f1a3d" strokeWidth="2.5" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t-2 border-ink-900/5 bg-cream-50 px-4 pb-5 pt-2 lg:hidden" aria-label="ناوبری موبایل">
          <ul className="flex flex-col gap-1">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 font-display text-lg font-bold text-ink-900 hover:bg-white">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <ButtonLink href="/parent" variant="secondary" size="md">ورود والدین</ButtonLink>
            <ButtonLink href="/kids" variant="kid" tone="grass" size="md" className="rounded-2xl">ورود بچه‌ها</ButtonLink>
          </div>
        </nav>
      )}
    </header>
  );
}
