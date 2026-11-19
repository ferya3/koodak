import Link from "next/link";
import { activityLog, childById, children, parentSettings, skillObservations, weeklyByType, weeklyMinutes } from "@/lib/data/family";
import { contentTypeLabel, skillById } from "@/lib/data/taxonomy";
import { recommend } from "@/lib/recommend";
import { tones } from "@/lib/tones";
import { cn, fa, minutesLabel } from "@/lib/utils";
import { BarList, WeeklyBars } from "@/features/parent/charts";
import { ChildSwitcher } from "@/features/parent/ChildSwitcher";

export const metadata = { title: "داشبورد" };

const DAYS = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];
const DAYS_SHORT = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

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

export default async function ParentDashboard({ searchParams }: { searchParams: Promise<{ child?: string }> }) {
  const { child: childParam } = await searchParams;
  const child = childById(childParam ?? "") ?? children[0];
  const week = weeklyMinutes[child.id];
  const settings = parentSettings[child.id];
  const total = week.reduce((a, b) => a + b, 0);
  const avg = Math.round(total / 7);
  const overDays = week.filter((m) => m > settings.dailyLimitMinutes).length;
  const log = activityLog.filter((a) => a.childId === child.id);
  const skills = [...skillObservations[child.id]].sort((a, b) => b.score - a.score);
  const byType = weeklyByType[child.id];
  const recs = recommend(child, [], 3);

  const kpis = [
    { label: "زمان این هفته", value: minutesLabel(total), note: `میانگین روزانه ${fa(avg)} دقیقه` },
    { label: "فعالیت‌های کامل‌شده", value: fa(child.id === "ch-1" ? 23 : 14), note: "۴ بیشتر از هفته‌ی قبل" },
    { label: "روزهای پیاپی", value: `${fa(child.id === "ch-1" ? 7 : 3)} روز`, note: "پیوستگی یادگیری" },
    {
      label: "سقف زمان روزانه",
      value: `${fa(settings.dailyLimitMinutes)} دقیقه`,
      note: overDays ? `${fa(overDays)} روز بیش از سقف` : "همه‌ی روزها در محدوده",
      status: overDays ? "warn" : "ok",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-calm-500">هفته‌ی جاری · ۲۴ تا ۳۰ آبان</p>
          <h1 className="mt-1 font-sans text-2xl font-bold sm:text-3xl">روند یادگیری {child.displayName}</h1>
        </div>
        <ChildSwitcher activeId={child.id} basePath="/parent" />
      </header>

      {/* KPIها */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
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
          <WeeklyBars values={week} labels={DAYS_SHORT} limit={settings.dailyLimitMinutes} />
          <p className="sr-only">{week.map((m, i) => `${DAYS[i]}: ${m} دقیقه`).join("، ")}</p>
        </Card>

        <Card title="این هفته چه کرد؟" subtitle="تفکیک زمان بر اساس نوع فعالیت (دقیقه)">
          <BarList rows={byType.map((t) => ({ label: contentTypeLabel[t.type], value: t.minutes }))} max={Math.max(...byType.map((t) => t.minutes))} />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card
          title="مهارت‌های تمرین‌شده"
          subtitle="امتیاز مشاهده (۰ تا ۱۰۰) بر اساس عملکرد در فعالیت‌ها"
          className="lg:col-span-2"
          action={
            <Link href="/parent/reports" className="shrink-0 text-xs font-bold text-calm-500 hover:text-calm-900">
              گزارش کامل ←
            </Link>
          }
        >
          <BarList rows={skills.map((s) => ({ label: skillById(s.skillId).title, value: s.score, trend: s.trend, hint: `بر اساس ${fa(s.sampleCount)} فعالیت` }))} />
          <p className="mt-5 rounded-xl bg-calm-50 p-3 text-xs leading-6 text-calm-500">
            ℹ این اعداد «مشاهده‌ی تمرین» هستند، نه سنجش استعداد یا هوش. نمونه‌های کم (کمتر از ۱۰ فعالیت) را با احتیاط تفسیر کنید.
          </p>
        </Card>

        <Card title="پیشنهاد برای هفته‌ی بعد" subtitle="موتور پیشنهاد بر اساس سن و علاقه‌مندی‌ها">
          <ul className="space-y-3">
            {recs.map(({ content, reason }) => (
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
              {log.map((a) => (
                <tr key={a.id} className="border-b border-calm-100 last:border-0">
                  <td className="py-3 font-bold">
                    <span className="flex items-center gap-2">
                      <span className={cn("h-2.5 w-2.5 rounded-full", tones[a.tone].solid)} aria-hidden="true" />
                      {a.contentTitle}
                    </span>
                  </td>
                  <td className="py-3 text-calm-500">{contentTypeLabel[a.contentType]}</td>
                  <td className="py-3 text-calm-500">{a.at}</td>
                  <td className="py-3 tabular-nums">{fa(a.durationMinutes)} دقیقه</td>
                  <td className="py-3">{a.result?.startsWith("★") ? <span className="text-sun-500">{a.result}</span> : a.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
