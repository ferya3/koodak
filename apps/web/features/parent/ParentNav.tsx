"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

const items = [
  { href: "/parent", label: "داشبورد", d: "M4 13 H10 V20 H4 Z M14 4 H20 V20 H14 Z M4 4 H10 V9 H4 Z" },
  { href: "/parent/reports", label: "گزارش‌ها", d: "M7 3 H15 L19 7 V21 H7 Z M10 12 H16 M10 16 H16 M15 3 V7 H19" },
  { href: "/parent/settings", label: "کنترل و حریم خصوصی", d: "M12 3 L20 6 V12 C20 17 16 20 12 21 C8 20 4 17 4 12 V6 Z M9 12 L11 14 L15 10" },
];

export function ParentNav() {
  const pathname = usePathname();
  return (
    <aside className="border-b border-calm-200 bg-white lg:sticky lg:top-0 lg:h-dvh lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-l">
      <div className="flex items-center justify-between px-5 py-4 lg:block lg:py-6">
        <Link href="/" aria-label="بازگشت به سایت">
          <Logo />
        </Link>
        <span className="rounded-full bg-calm-100 px-2.5 py-1 text-xs font-bold text-calm-700 lg:mt-3 lg:inline-block">پنل والدین</span>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 scrollbar-none lg:flex-col lg:px-4" aria-label="ناوبری پنل والدین">
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={active ? "page" : undefined}
              className={cn("flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition", active ? "bg-calm-900 text-white" : "text-calm-700 hover:bg-calm-100")}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path d={it.d} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="hidden px-4 lg:absolute lg:bottom-6 lg:block lg:w-72">
        <Link href="/kids" className="flex items-center justify-center gap-2 rounded-xl border border-calm-300 py-2.5 text-sm font-bold text-calm-900 hover:bg-calm-50">
          ورود به محیط کودک ←
        </Link>
        <p className="mt-3 text-center text-xs text-calm-500">اشتراک خانواده · فعال تا ۱۴۰۵/۱۲/۲۹</p>
      </div>
    </aside>
  );
}
