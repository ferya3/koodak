import Link from "next/link";
import type { DashboardData, ChildProfile } from "@kidsworld/types";
import { contentTypeLabel } from "@/lib/data/taxonomy";
import { tones } from "@/lib/tones";
import { cn, fa, minutesLabel } from "@/lib/utils";
import { BarList, WeeklyBars } from "./charts";
import { ChildSwitcher } from "./ChildSwitcher";

const weekday = new Intl.DateTimeFormat("fa-IR", { weekday: "short" });
const weekdayLong = new Intl.DateTimeFormat("fa-IR", { weekday: "long" });
const when = new Intl.DateTimeFormat("fa-IR", { weekday: "short", hour: "2-digit", minute: "2-digit" });

/** زمان فعالیت: ISO از API یا متن آماده از داده‌ی نمونه */
function formatAt(at: string) {
  const t = Date.parse(at);
  return Number.isNaN(t) ? at : when.format(new Date(t));
}

function Card({ title, subtitle, action, className, children: body }: { title: string; subtitle?: string; action?: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <section className={cn("rounded-2xl border border-calm-200 bg-white p-5 shadow-calm", className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-sans text-base font-bold">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-calm-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      {body}
    </section>
  );
}

/** نمای داشبورد والدین – مشترک بین حالت نمایشی (Server) و حالت متصل (Client) */
export function DashboardView({ data, items, banner }: { data: DashboardData; items: ChildProfile[]; banner?: React.ReactNode }) {
  const { child, settings, kpis } = data;
  const limit = settings?.dailyLimitMinutes;
  const minutes = data.weeklyMinutes.map((d) => d.minutes);
  const labels = data.weeklyMinutes.map((d) => weekday.format(new Date(d.date)));
  const diff = kpis.activitiesCompleted - kpis.activitiesPrevWeek;
  const maxType = Math.max(1, ...data.minutesByType.map((t) => t.minutes));

  const cards = [
    { label: "زمان این هفته", value: minutesLabel(kpis.totalMinutes), note: `میانگین روزانه ${fa(kpis.avgMinutesPerDay)} دقیقه` },
    { label: "فعالیت‌های کامل‌شده", value: fa(kpis.activitiesCompleted), note: diff >= 0 ? `${fa(diff)} بیشتر از هفته‌ی قبل` : `${fa(-diff)} کمتر از هفته‌ی قبل` },
    { label: "روزهای پیاپی", value: `${fa(kpis.streakDays)} روز`, note: `${fa(kpis.points)} امتیاز کل` },
    {
      label: "سقف زمان روزانه",
      value: limit ? `${fa(limit)} دقیقه` : "بدون سقف",
      note: kpis.daysOverLimit ? `${fa(kpis.daysOverLimit)} روز بیش از سقف` : "همه‌ی روزها در محدوده",
      status: kpis.daysOverLimit ? "warn" : "ok",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {banner}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-calm-500">۷ روز اخیر</p>
          <h1 className="mt-1 font-sans text-2xl font-bold sm:text-3xl">روند یادگیری {child.displayName}</h1>
        </div>
        <ChildSwitcher items={items} activeId={child.id} basePath="/parent" />
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((k) => (
          <div key={k.label} className="rounded-2xl border border-calm-200 bg-white p-4 shadow-calm">
            <p className="text-xs font-medium text-calm-500">{k.label}</p>
            <p className="mt-1.5 font-sans text-xl font-bold sm:text-2xl">{k.value}</p>
            <p className={cn("mt-1 flex items-center gap-1 text-xs", k.status === "warn" ? "text-coral-700" : k.status === "ok" ? "text-grass-700" : "text-calm-500")}>
              {k.status === "warn" && <span aria-hidden="true">⚠</span>}
              {k.status === "ok" && <span aria-hidden="true">✓</span>}
              {k.note}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="زمان استفاده‌ی روزانه" subtitle="دقیقه در ۷ روز اخیر · خط‌چین: سقف تعیین‌شده توسط شما" className="lg:col-span-2">
          <WeeklyBars values={minutes} labels={labels} limit={limit} />
          <p className="sr-only">{data.weeklyMinutes.map((d) => `${weekdayLong.format(new Date(d.date))}: ${d.minutes} دقیقه`).join("، ")}</p>
        </Card>
        <Card title="این هفته چه کرد؟" subtitle="تفکیک زمان بر اساس نوع فعالیت (دقیقه)">
          {data.minutesByType.length ? (
            <BarList rows={data.minutesByType.map((t) => ({ label: contentTypeLabel[t.type], value: t.minutes }))} max={maxType} />
          ) : (
            <p className="text-sm text-calm-500">هنوز فعالیتی ثبت نشده است.</p>
          )}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card
          title="مهارت‌های تمرین‌شده"
          subtitle="امتیاز مشاهده (۰ تا ۱۰۰) بر اساس عملکرد در فعالیت‌ها"
          className="lg:col-span-2"
          action={<Link href={`/parent/reports?child=${child.id}`} className="shrink-0 text-xs font-bold text-calm-500 hover:text-calm-900">گزارش کامل ←</Link>}
        >
          {data.skills.length ? (
            <BarList rows={data.skills.map((s) => ({ label: s.title, value: s.score, trend: s.trend, hint: `بر اساس ${fa(s.sampleCount)} فعالیت` }))} />
          ) : (
            <p className="text-sm text-calm-500">بعد از چند بازی و قصه، روند مهارت‌ها اینجا نمایش داده می‌شود.</p>
          )}
          <p className="mt-5 rounded-xl bg-calm-50 p-3 text-xs leading-6 text-calm-500">
            ℹ این اعداد «مشاهده‌ی تمرین» هستند، نه سنجش استعداد یا هوش. نمونه‌های کم (کمتر از ۱۰ فعالیت) را با احتیاط تفسیر کنید.
          </p>
        </Card>

        <Card title="پیشنهاد برای هفته‌ی بعد" subtitle="موتور پیشنهاد بر اساس سن، علاقه‌مندی‌ها و عملکرد">
          <ul className="space-y-3">
            {data.recommendations.map(({ content, reason }) => (
              <li key={content.id} className="flex items-center gap-3">
                <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xs font-bold", tones[content.tone].soft, tones[content.tone].text)}>
                  {contentTypeLabel[content.type]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">{content.title}</span>
                  <span className="block text-xs text-calm-500">{reason}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="فعالیت‌های اخیر" subtitle="فقط برای شما قابل مشاهده است">
        {data.recentActivity.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-calm-200 text-xs text-calm-500">
                  <th className="pb-2 text-start font-medium">فعالیت</th>
                  <th className="pb-2 text-start font-medium">نوع</th>
                  <th className="pb-2 text-start font-medium">زمان</th>
                  <th className="pb-2 text-start font-medium">مدت</th>
                  <th className="pb-2 text-start font-medium">نتیجه</th>
                </tr>
              </thead>
              <tbody>
                {data.recentActivity.map((a) => (
                  <tr key={a.id} className="border-b border-calm-100 last:border-0">
                    <td className="py-3 font-bold">
                      <span className="flex items-center gap-2">
                        <span className={cn("h-2.5 w-2.5 rounded-full", tones[a.tone].solid)} aria-hidden="true" />
                        {a.contentTitle}
                      </span>
                    </td>
                    <td className="py-3 text-calm-500">{contentTypeLabel[a.contentType]}</td>
                    <td className="py-3 text-calm-500">{formatAt(a.at)}</td>
                    <td className="py-3 tabular-nums">{fa(a.durationMinutes)} دقیقه</td>
                    <td className="py-3">{a.result?.startsWith("★") ? <span className="text-sun-500">{a.result}</span> : a.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-calm-500">هنوز فعالیتی ثبت نشده است.</p>
        )}
      </Card>
    </div>
  );
}
