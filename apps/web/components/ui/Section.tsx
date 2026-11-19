import { cn } from "@/lib/utils";
import { Squiggle } from "@/components/brand/Decor";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  className,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("mb-8 flex flex-wrap items-end justify-between gap-4", align === "center" && "flex-col items-center text-center", className)}>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className="mb-2 text-sm font-extrabold text-coral-500">{eyebrow}</p>}
        <h2 className="text-3xl font-black leading-tight text-ink-900 sm:text-4xl">{title}</h2>
        <Squiggle className={cn("mt-2 h-3 w-24", align === "center" && "mx-auto")} />
        {description && <p className="mt-3 text-lg leading-8 text-ink-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}
