import { cn } from "@/lib/utils";

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
        {eyebrow && (
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-extrabold text-coral-500 shadow-soft ring-1 ring-ink-900/5">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-l from-coral-400 to-berry-400" />
            {eyebrow}
          </p>
        )}
        <h2 className="text-3xl font-black leading-tight text-ink-900 sm:text-[2.6rem] sm:leading-[1.2]">{title}</h2>
        {description && <p className="mt-3 text-lg leading-8 text-ink-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}
