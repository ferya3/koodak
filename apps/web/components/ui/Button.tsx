import Link from "next/link";
import type { ToneKey } from "@kidsworld/types";
import { cn } from "@/lib/utils";

/**
 * دکمه‌ی KidsWorld
 * - variant="kid": دکمه‌ی سه‌بعدی و درشت محیط کودک (حداقل ۵۶px ارتفاع)
 * - variant="primary" | "secondary" | "ghost": سایت عمومی
 * - variant="calm": پنل والدین (تخت، آرام، داده‌محور)
 */
type Variant = "primary" | "secondary" | "ghost" | "kid" | "calm" | "calm-outline";
type Size = "sm" | "md" | "lg" | "xl";

const kidTone: Record<ToneKey, string> = {
  sun: "bg-sun-400 text-ink-900 [--btn-edge:var(--color-sun-500)]",
  coral: "bg-coral-400 text-white [--btn-edge:var(--color-coral-500)]",
  sky: "bg-sky-400 text-white [--btn-edge:var(--color-sky-500)]",
  grass: "bg-grass-400 text-white [--btn-edge:var(--color-grass-500)]",
  grape: "bg-grape-400 text-white [--btn-edge:var(--color-grape-500)]",
  berry: "bg-berry-400 text-white [--btn-edge:var(--color-berry-500)]",
  ocean: "bg-ocean-400 text-white [--btn-edge:var(--color-ocean-500)]",
  peach: "bg-peach-400 text-white [--btn-edge:var(--color-peach-500)]",
  mint: "bg-mint-400 text-ink-900 [--btn-edge:var(--color-mint-500)]",
  lilac: "bg-lilac-400 text-white [--btn-edge:var(--color-lilac-500)]",
};

const base =
  "inline-flex items-center justify-center gap-2 font-display font-extrabold whitespace-nowrap select-none transition disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Exclude<Variant, "kid">, string> = {
  primary:
    "rounded-full bg-gradient-to-l from-coral-400 via-coral-500 to-berry-500 text-white shadow-glow hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0",
  secondary: "rounded-full bg-white text-ink-900 shadow-soft ring-1 ring-ink-900/10 hover:-translate-y-0.5 hover:shadow-lift hover:ring-ink-900/20 active:translate-y-0",
  ghost: "text-ink-700 hover:bg-ink-900/5 rounded-full",
  calm: "bg-calm-900 text-white hover:bg-calm-700 rounded-xl font-sans font-bold",
  "calm-outline": "bg-white text-calm-900 border border-calm-300 hover:bg-calm-50 rounded-xl font-sans font-bold",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-base",
  lg: "h-14 px-7 text-lg",
  xl: "h-16 px-9 text-kid-md",
};

export interface ButtonStyleProps {
  variant?: Variant;
  tone?: ToneKey;
  size?: Size;
  className?: string;
}

export function buttonClass({ variant = "primary", tone = "coral", size = "md", className }: ButtonStyleProps) {
  return cn(
    base,
    variant === "kid" ? cn("btn-3d rounded-3xl", kidTone[tone]) : variants[variant],
    sizes[size],
    className,
  );
}

export function Button({ variant, tone, size, className, ...props }: ButtonStyleProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={buttonClass({ variant, tone, size, className })} {...props} />;
}

export function ButtonLink({ variant, tone, size, className, href, ...props }: ButtonStyleProps & React.ComponentProps<typeof Link>) {
  return <Link href={href} className={buttonClass({ variant, tone, size, className })} {...props} />;
}
