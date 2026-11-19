"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AvatarKey } from "@kidsworld/types";
import { Avatar, avatarKeys, avatarMeta } from "@/components/brand/Avatar";
import { ApiError, live, LIVE } from "@/lib/api/live";
import { cn } from "@/lib/utils";

const MONTHS = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];

/**
 * ساخت پروفایل کودک با حداقل اطلاعات: نام نمایشی + ماه و سال تولد + آواتار.
 * ماه/سال شمسی در مرورگر به YYYY-MM میلادی تبدیل می‌شود (تقریب ماه کافی است).
 */
export function NewChildForm() {
  const router = useRouter();
  const thisYear = Number(new Intl.DateTimeFormat("en-u-ca-persian", { year: "numeric" }).format(new Date()).replace(/\D/g, ""));
  const [avatar, setAvatar] = useState<AvatarKey>("bunny");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const jy = Number(f.get("year"));
    const jm = Number(f.get("month"));
    // تبدیل تقریبی: ماه شمسی jm از سال jy ≈ ماه (jm+2)%12 میلادی
    const gYear = jy + 621 + (jm >= 10 ? 1 : 0);
    const gMonth = ((jm + 2) % 12) + 1;
    setBusy(true);
    setError(null);
    try {
      await live.createChild({
        display_name: String(f.get("name")),
        birth_year_month: `${gYear}-${String(gMonth).padStart(2, "0")}`,
        avatar,
        consent: f.get("consent") === "on",
      });
      router.push("/parent");
    } catch (err) {
      setError(err instanceof ApiError ? Object.values(err.errors ?? {})[0]?.[0] ?? err.message : "ذخیره نشد.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6 rounded-2xl border border-calm-200 bg-white p-6 shadow-calm">
      <div>
        <h1 className="font-sans text-2xl font-bold">افزودن فرزند</h1>
        <p className="mt-1 text-sm text-calm-500">فقط اطلاعات لازم را می‌پرسیم. عکس، نام کامل و تاریخ دقیق تولد لازم نیست.</p>
      </div>
      {!LIVE && <p className="rounded-xl bg-sun-100 p-3 text-sm font-bold text-sun-700">حالت نمایشی: برای ذخیره، اتصال به API لازم است.</p>}
      {error && <p role="alert" className="rounded-xl bg-coral-100 p-3 text-sm font-bold text-coral-700">{error}</p>}

      <label className="block">
        <span className="mb-1.5 block text-sm font-bold">نام نمایشی</span>
        <input name="name" required maxLength={40} className="h-11 w-full rounded-xl border border-calm-300 px-3" placeholder="مثلاً: نیلا" />
      </label>

      <fieldset>
        <legend className="mb-1.5 text-sm font-bold">ماه و سال تولد</legend>
        <div className="grid grid-cols-2 gap-3">
          <select name="month" className="h-11 rounded-xl border border-calm-300 px-3" defaultValue="1" aria-label="ماه">
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <select name="year" className="h-11 rounded-xl border border-calm-300 px-3" defaultValue={thisYear - 5} aria-label="سال">
            {Array.from({ length: 11 }, (_, i) => thisYear - 1 - i).map((y) => <option key={y} value={y}>{y.toLocaleString("fa-IR", { useGrouping: false })}</option>)}
          </select>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-bold">آواتار (به‌جای عکس)</legend>
        <div className="flex flex-wrap gap-3" role="radiogroup">
          {avatarKeys.map((a) => (
            <button key={a} type="button" role="radio" aria-checked={avatar === a} aria-label={avatarMeta[a].name} onClick={() => setAvatar(a)}
              className={cn("rounded-full p-1 transition", avatar === a ? "ring-4 ring-ocean-500" : "opacity-70 hover:opacity-100")}>
              <Avatar kind={a} className="h-14 w-14" />
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex items-start gap-3 rounded-xl bg-calm-50 p-3 text-sm leading-7">
        <input type="checkbox" name="consent" required className="mt-1.5 h-5 w-5 accent-ocean-500" />
        <span>
          به‌عنوان والد/سرپرست قانونی، با ثبت نتایج فعالیت‌های فرزندم برای نمایش گزارش پیشرفت موافقم و{" "}
          <Link href="/privacy" className="font-bold underline">سیاست حریم خصوصی کودکان</Link> را خوانده‌ام. هر زمان می‌توانم داده‌ها را حذف کنم.
        </span>
      </label>

      <button type="submit" disabled={busy || !LIVE} className="h-11 w-full rounded-xl bg-calm-900 font-bold text-white disabled:opacity-50">
        {busy ? "در حال ذخیره…" : "ساخت پروفایل"}
      </button>
    </form>
  );
}
