"use client";
import { useRouter } from "next/navigation";
import { children } from "@/lib/data/family";
import { writeProgress } from "@/lib/progress";
import { Avatar } from "@/components/brand/Avatar";
import { Mascot } from "@/components/brand/Mascot";
import { fa } from "@/lib/utils";

/** «کی داره بازی می‌کنه؟» – انتخاب پروفایل بدون رمز و فرم (رمز در دست والدین است) */
export default function WhoIsPlaying() {
  const router = useRouter();
  const pick = (id: string | null) => {
    writeProgress((p) => ({ ...p, activeChildId: id }));
    router.push("/kids/home");
  };
  return (
    <div className="flex flex-col items-center pt-6 text-center">
      <Mascot mood="happy" className="h-32 w-32 animate-float" />
      <h1 className="mt-4 text-4xl font-black sm:text-5xl">سلام! کی داره بازی می‌کنه؟</h1>
      <p className="mt-3 text-lg font-bold text-ink-500">روی عکس خودت بزن</p>
      <ul className="mt-10 flex flex-wrap justify-center gap-6">
        {children.map((c) => (
          <li key={c.id}>
            <button type="button" onClick={() => pick(c.id)} className="group flex w-44 flex-col items-center gap-3 rounded-[2rem] border-[3px] border-ink-900 bg-white p-5 btn-3d [--btn-edge:var(--color-ink-900)]">
              <Avatar kind={c.avatar} className="h-32 w-32 transition group-hover:animate-wiggle" />
              <span className="text-2xl font-black">{c.displayName}</span>
              <span className="rounded-full bg-sky-100 px-3 py-0.5 text-sm font-bold text-sky-700">{fa(c.age)} ساله</span>
            </button>
          </li>
        ))}
        <li>
          <button type="button" onClick={() => pick(null)} className="flex h-full w-44 flex-col items-center justify-center gap-3 rounded-[2rem] border-[3px] border-dashed border-ink-500 bg-white/60 p-5 transition hover:bg-white">
            <span className="grid h-32 w-32 place-items-center rounded-full bg-ink-100 text-6xl font-black text-ink-300">؟</span>
            <span className="text-2xl font-black text-ink-500">مهمان</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
