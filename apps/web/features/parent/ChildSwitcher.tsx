import Link from "next/link";
import { children } from "@/lib/data/family";
import { Avatar } from "@/components/brand/Avatar";
import { cn, fa } from "@/lib/utils";

export function ChildSwitcher({ activeId, basePath }: { activeId: string; basePath: string }) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="انتخاب فرزند">
      {children.map((c) => (
        <Link
          key={c.id}
          href={`${basePath}?child=${c.id}`}
          role="tab"
          aria-selected={c.id === activeId}
          className={cn("flex items-center gap-2.5 rounded-2xl border py-1.5 pe-4 ps-1.5 transition", c.id === activeId ? "border-calm-900 bg-white shadow-calm" : "border-transparent hover:bg-white")}
        >
          <Avatar kind={c.avatar} className="h-10 w-10" ring={false} />
          <span className="text-start">
            <span className="block text-sm font-bold">{c.displayName}</span>
            <span className="block text-xs text-calm-500">{fa(c.age)} ساله</span>
          </span>
        </Link>
      ))}
      <button type="button" className="flex items-center gap-2 rounded-2xl border border-dashed border-calm-300 px-4 text-sm font-bold text-calm-500 hover:bg-white">
        + افزودن فرزند
      </button>
    </div>
  );
}
