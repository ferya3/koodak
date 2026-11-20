"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { ageMenu, learnMenu, worksheetMenu, type MenuColumn, type MenuLink } from "@/lib/data/menu";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  /** ستون‌های مگامنو (اگر باشد، آیتم یک زیرمنو دارد) */
  columns?: MenuColumn[];
  extra?: { title: string; links: MenuLink[] };
  allLabel?: string;
}

const nav: NavItem[] = [
  { href: "/learn", label: "آموزش", columns: learnMenu, allLabel: "همه‌ی درس‌ها" },
  { href: "/worksheets", label: "کاربرگ‌ها", columns: worksheetMenu, extra: { title: "بر اساس سن", links: ageMenu }, allLabel: "همه‌ی کاربرگ‌ها" },
  { href: "/games", label: "بازی‌ها" },
  { href: "/stories", label: "قصه‌ها" },
  { href: "/#worlds", label: "دنیاها" },
  { href: "/pricing", label: "اشتراک" },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 12 12" className={cn("h-3 w-3 transition", open && "rotate-180")} aria-hidden="true">
      <path d="M2.5 4.5 L6 8 L9.5 4.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** پنل مگامنو: ستون‌های دسته‌بندی + میان‌بُرهای سنی + لینک «همه» */
function MegaPanel({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-card border-2 border-ink-900 bg-white p-6 shadow-[0_6px_0_#1f1a3d]">
        <div className={cn("grid gap-x-6 gap-y-6", item.columns!.length > 4 ? "grid-cols-5" : "grid-cols-4")}>
          {item.columns!.map((c) => (
            <div key={c.title}>
              <Link href={c.href} onClick={onNavigate} className="mb-2 block font-display font-extrabold text-ink-900 hover:text-coral-500">
                {c.title}
              </Link>
              <ul className="space-y-1">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} onClick={onNavigate} className="block rounded-lg py-1 text-sm font-bold text-ink-500 hover:text-ink-900">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t-2 border-ink-900/5 pt-4">
          {item.extra && (
            <>
              <span className="me-1 font-display text-sm font-extrabold">{item.extra.title}:</span>
              {item.extra.links.map((l) => (
                <Link key={l.href} href={l.href} onClick={onNavigate} className="rounded-full border-2 border-ink-200 px-3 py-1 text-sm font-bold hover:border-ink-900">
                  {l.label}
                </Link>
              ))}
            </>
          )}
          <Link href={item.href} onClick={onNavigate} className="ms-auto font-extrabold text-coral-500 hover:underline">
            {item.allLabel} ←
          </Link>
        </div>
      </div>
    </div>
  );
}

function HeaderInner() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [mobileSub, setMobileSub] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // با هر جابه‌جایی صفحه همه‌ی منوها بسته شوند
  useEffect(() => {
    setMenu(null);
    setOpen(false);
  }, [pathname, search]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const enter = (href: string) => {
    clearTimeout(closeTimer.current);
    setMenu(href);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setMenu(null), 160);
  };
  const active = nav.find((n) => n.href === menu && n.columns);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink-900/5 bg-cream-50/85 backdrop-blur-md" onMouseLeave={leave}>
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="KidsWorld – صفحه‌ی اصلی" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="ناوبری اصلی">
          {nav.map((n) => {
            const current = pathname.startsWith(n.href) && n.href !== "/#worlds";
            const cls = cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-display text-[0.95rem] font-bold text-ink-700 transition hover:bg-white hover:text-ink-900",
              (current || menu === n.href) && "bg-white text-ink-900 shadow-soft",
            );
            return n.columns ? (
              <button
                key={n.href}
                type="button"
                className={cls}
                aria-expanded={menu === n.href}
                aria-controls="mega-menu"
                onMouseEnter={() => enter(n.href)}
                onClick={() => setMenu(menu === n.href ? null : n.href)}
              >
                {n.label}
                <Chevron open={menu === n.href} />
              </button>
            ) : (
              <Link key={n.href} href={n.href} className={cls} onMouseEnter={() => setMenu(null)}>
                {n.label}
              </Link>
            );
          })}
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

      {active && (
        <div id="mega-menu" className="absolute inset-x-0 top-full hidden lg:block" onMouseEnter={() => enter(active.href)}>
          <MegaPanel item={active} onNavigate={() => setMenu(null)} />
        </div>
      )}

      {open && (
        <nav id="mobile-nav" className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t-2 border-ink-900/5 bg-cream-50 px-4 pb-5 pt-2 lg:hidden" aria-label="ناوبری موبایل">
          <ul className="flex flex-col gap-1">
            {nav.map((n) => (
              <li key={n.href}>
                {n.columns ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={mobileSub === n.href}
                      onClick={() => setMobileSub(mobileSub === n.href ? null : n.href)}
                      className="flex w-full items-center justify-between rounded-2xl px-4 py-3 font-display text-lg font-bold text-ink-900 hover:bg-white"
                    >
                      {n.label}
                      <Chevron open={mobileSub === n.href} />
                    </button>
                    {mobileSub === n.href && (
                      <div className="mb-2 space-y-3 rounded-2xl bg-white p-4">
                        {n.columns.map((c) => (
                          <div key={c.title}>
                            <Link href={c.href} className="font-display font-extrabold">
                              {c.title}
                            </Link>
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              {c.links.map((l) => (
                                <Link key={l.href} href={l.href} className="rounded-full border-2 border-ink-200 px-3 py-1 text-sm font-bold">
                                  {l.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                        {n.extra && (
                          <div>
                            <p className="font-display font-extrabold">{n.extra.title}</p>
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              {n.extra.links.map((l) => (
                                <Link key={l.href} href={l.href} className="rounded-full border-2 border-ink-200 px-3 py-1 text-sm font-bold">
                                  {l.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                        <Link href={n.href} className="block font-extrabold text-coral-500">
                          {n.allLabel} ←
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <Link href={n.href} className="block rounded-2xl px-4 py-3 font-display text-lg font-bold text-ink-900 hover:bg-white">
                    {n.label}
                  </Link>
                )}
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

/** useSearchParams در صفحه‌های ایستا به Suspense نیاز دارد */
export function SiteHeader() {
  return (
    <Suspense fallback={<div className="h-18 border-b-2 border-ink-900/5 bg-cream-50" />}>
      <HeaderInner />
    </Suspense>
  );
}
