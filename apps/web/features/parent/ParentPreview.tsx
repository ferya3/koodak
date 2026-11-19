import { Avatar } from "@/components/brand/Avatar";
import { fa } from "@/lib/utils";

/** پیش‌نمایش استاتیک پنل والدین برای صفحه‌ی اصلی (تصویرسازی محصول) */
export function ParentPreview() {
  const week = [32, 41, 18, 45, 27, 52, 38];
  const days = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
  const skills: [string, number][] = [
    ["خلاقیت", 82],
    ["مهارت شنیداری", 77],
    ["شناخت حروف", 71],
  ];
  return (
    <div className="relative font-sans" aria-label="نمونه‌ی پنل والدین">
      <div className="absolute -inset-4 rotate-2 rounded-[2rem] bg-sun-400" aria-hidden="true" />
      <div className="relative rounded-[1.75rem] bg-white p-5 text-calm-900 shadow-lift">
        <div className="flex items-center gap-3">
          <Avatar kind="bunny" className="h-12 w-12" ring={false} />
          <div>
            <p className="font-bold">نیلا · ۶ ساله</p>
            <p className="text-xs text-calm-500">این هفته {fa(253)} دقیقه · {fa(7)} روز پیاپی</p>
          </div>
          <span className="ms-auto rounded-full bg-grass-100 px-2.5 py-1 text-xs font-bold text-grass-700">در محدوده‌ی مجاز</span>
        </div>
        <div className="mt-5 rounded-2xl bg-calm-50 p-4">
          <p className="mb-3 text-xs font-bold text-calm-500">زمان استفاده (دقیقه)</p>
          <div className="flex h-28 items-end justify-between gap-2">
            {week.map((v, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                <div className="w-full max-w-5 rounded-t bg-ocean-500" style={{ height: `${(v / 55) * 85}%` }} />
                <span className="text-[10px] text-calm-500">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {skills.map(([l, v]) => (
            <div key={l}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="font-bold">{l}</span>
                <span className="text-calm-500">{fa(v)}٪ ↑</span>
              </div>
              <div className="h-2 rounded bg-calm-100">
                <div className="h-full rounded bg-ocean-500" style={{ width: `${v}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
