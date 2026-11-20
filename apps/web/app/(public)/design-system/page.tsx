import type { Metadata } from "next";
import { toneKeys, tones } from "@/lib/tones";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge, Chip, PremiumBadge } from "@/components/ui/Badge";
import { Stars } from "@/components/ui/Stars";
import { ProgressBar } from "@/components/ui/Progress";
import { IconTile } from "@/components/ui/IconTile";
import { Mascot, type MascotMood } from "@/components/brand/Mascot";
import { Avatar, avatarKeys, avatarMeta } from "@/components/brand/Avatar";
import { WorldIcon } from "@/components/brand/WorldIcon";
import { PlayIcon, playIconKeys, playIconNames } from "@/components/brand/PlayIcon";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { categories } from "@/lib/data/taxonomy";

export const metadata: Metadata = {
  title: "سیستم طراحی KidsWorld",
  description: "توکن‌ها، کامپوننت‌ها، تصویرسازی و اصول طراحی KidsWorld.",
  robots: { index: false },
};

const toneNames: Record<string, string> = {
  sun: "خورشید", coral: "مرجان", sky: "آسمان", grass: "چمن", grape: "انگور", berry: "توت", ocean: "اقیانوس", peach: "هلو", mint: "نعناع", lilac: "یاس",
};

function Block({ id, title, description, children }: { id: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t-2 border-ink-900/5 py-12">
      <h2 className="text-3xl font-black">{title}</h2>
      {description && <p className="mt-2 max-w-3xl leading-8 text-ink-500">{description}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

const toc = [
  ["principles", "اصول"], ["brand", "برند"], ["color", "رنگ"], ["type", "تایپوگرافی"], ["shape", "فرم و سایه"],
  ["buttons", "دکمه‌ها"], ["components", "کامپوننت‌ها"], ["illustration", "تصویرسازی"], ["themes", "سه محیط"],
];

export default function DesignSystemPage() {
  return (
    <Container className="py-12">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-sm font-extrabold text-coral-500">KidsWorld Design System · v0.1</p>
          <h1 className="mt-2 text-5xl font-black">سیستم طراحی</h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-ink-700">زبان بصری مشترک سایت عمومی، محیط کودک و پنل والدین. همه‌ی مقادیر از توکن‌های <code className="rounded bg-ink-100 px-1.5 text-sm" dir="ltr">app/globals.css</code> می‌آیند.</p>
        </div>
        <Mascot mood="wow" className="h-32 w-32" />
      </header>
      <nav className="sticky top-20 z-10 mt-8 flex gap-2 overflow-x-auto rounded-2xl bg-cream-50/90 py-2 backdrop-blur scrollbar-none" aria-label="فهرست">
        {toc.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="shrink-0 rounded-full bg-white shadow-soft ring-1 ring-ink-900/10 px-4 py-1.5 text-sm font-bold hover:ring-ink-900/30">
            {label}
          </a>
        ))}
      </nav>

      <Block id="principles" title="اصول طراحی">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["تصویر قبل از متن", "کودک ۳ ساله نمی‌خواند؛ هر عمل اصلی یک آیکون تصویرسازی‌شده و یک رنگ ثابت دارد."],
            ["هدف لمسی بزرگ", "حداقل ۵۶px در محیط کودک (ترجیحاً ۶۴px+)، فاصله‌ی ۱۲px بین اهداف لمسی."],
            ["بازخورد فوری و مهربان", "هر لمس صدا/حرکت دارد. اشتباه هرگز قرمز ترسناک نیست؛ لرزش ملایم و «دوباره امتحان کن»."],
            ["یک کار در هر صفحه", "صفحه‌ی بازی فقط بازی است. ناوبری کودک ≤ ۳ گزینه."],
            ["محیط‌های جدا", "سایت عمومی = شاد و قابل اعتماد؛ کودک = بازیگوش و درشت؛ والدین = آرام و داده‌محور."],
            ["دسترس‌پذیری", "کنتراست WCAG AA، فوکوس قابل دید، احترام به prefers-reduced-motion، برچسب برای هر دکمه‌ی آیکونی."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-card border-2 border-ink-900/10 bg-white p-5">
              <h3 className="text-lg font-black">{t}</h3>
              <p className="mt-1 text-sm leading-7 text-ink-500">{d}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block id="brand" title="برند" description="نماد: سیاره‌ای خندان با مدار و ستاره – «دنیای» کودک. شخصیت راهنما: پیکو، موجودی آبی و گرد با دو شاخک ستاره‌ای که در همه‌ی لحظه‌های مهم حضور دارد.">
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <div className="grid gap-4">
            <div className="grid place-items-center rounded-card border-2 border-ink-900/10 bg-white p-8"><Logo /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid place-items-center rounded-card border-2 border-ink-900/10 bg-sky-100 p-6"><LogoMark className="h-16 w-16" /></div>
              <div className="grid place-items-center rounded-card border-2 border-ink-900/10 bg-ink-900 p-6"><LogoMark className="h-16 w-16" /></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {(["happy", "wow", "cheer", "think", "sleepy"] as MascotMood[]).map((m) => (
              <figure key={m} className="flex flex-col items-center rounded-card border-2 border-ink-900/10 bg-white p-4">
                <Mascot mood={m} className="h-28 w-28" />
                <figcaption className="mt-2 text-sm font-bold" dir="ltr">{m}</figcaption>
                <span className="text-xs text-ink-500">{{ happy: "خوشامد", wow: "کشف", cheer: "موفقیت", think: "راهنمایی", sleepy: "قصه‌ی شب" }[m]}</span>
              </figure>
            ))}
          </div>
        </div>
      </Block>

      <Block id="color" title="رنگ" description="ده تُن برند – هر دنیا یک تُن ثابت دارد تا کودک با رنگ مسیر را به خاطر بسپارد. پله‌ی ۱۰۰ برای پس‌زمینه، ۴۰۰ برای سطح پررنگ، ۷۰۰ برای متن روی ۱۰۰ (کنتراست AA).">
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[["ink-900", "#1f1a3d", "متن اصلی"], ["ink-500", "#6e6893", "متن ثانویه"], ["cream-50", "#fffbf3", "پس‌زمینه"], ["calm-900", "#0f1b2d", "پنل والدین"]].map(([n, hex, use]) => (
            <div key={n} className="overflow-hidden rounded-2xl border-2 border-ink-900/10 bg-white">
              <div className="h-16" style={{ backgroundColor: hex }} />
              <div className="p-3 text-sm"><b dir="ltr">{n}</b> <span className="text-ink-500">· {use}</span><br /><code className="text-xs text-ink-500" dir="ltr">{hex}</code></div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {toneKeys.map((k) => (
            <div key={k} className="grid grid-cols-[90px_1fr] items-center gap-3 sm:grid-cols-[120px_1fr]">
              <div>
                <p className="font-black">{toneNames[k]}</p>
                <p className="text-xs text-ink-500" dir="ltr">{k}</p>
              </div>
              <div className="grid grid-cols-4 overflow-hidden rounded-2xl border-2 border-ink-900/10">
                {(["soft", "mid", "solid", "deep"] as const).map((s, i) => (
                  <div key={s} className="flex h-14 items-end p-2 text-[11px] font-bold" style={{ backgroundColor: tones[k].hex[s], color: i === 3 ? "#fff" : "#1f1a3d" }} dir="ltr">
                    {["100", "300", "400", "700"][i]} · {tones[k].hex[s]}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {categories.map((c) => (
            <div key={c.id} className={cn("flex items-center gap-2 rounded-2xl p-2 text-sm font-bold", tones[c.tone].soft)}>
              <WorldIcon name={c.icon} className="h-8 w-8" /> {c.title}
            </div>
          ))}
        </div>
      </Block>

      <Block id="type" title="تایپوگرافی" description="Vazirmatn Round-Dots برای تیترها و محیط کودک (نقطه‌های گرد و دوستانه)، Vazirmatn استاندارد برای متن بدنه و پنل والدین. حداقل اندازه‌ی متن کودک ۱۸px.">
        <div className="space-y-4 rounded-card border-2 border-ink-900/10 bg-white p-6">
          {[
            ["Display / 48", "text-5xl font-black font-display", "دنیای بازی و یادگیری"],
            ["H1 / 36", "text-4xl font-black font-display", "سلام نیلا! امروز چه کنیم؟"],
            ["H2 / 28", "text-[1.75rem] font-extrabold font-display", "مأموریت امروز"],
            ["Kid body / 22", "text-kid-md font-bold font-display", "ماهی‌ها را یکی‌یکی بشمار."],
            ["Body / 16", "text-base font-sans", "گزارش هفتگی هر شنبه صبح برای شما ساخته می‌شود."],
            ["Caption / 12", "text-xs font-sans text-ink-500", "بر اساس ۲۴ فعالیت در ۷ روز اخیر"],
          ].map(([n, cls, sample]) => (
            <div key={n} className="grid items-baseline gap-2 border-b border-ink-100 pb-4 last:border-0 sm:grid-cols-[140px_1fr]">
              <span className="text-xs font-bold text-ink-500" dir="ltr">{n}</span>
              <span className={cls}>{sample}</span>
            </div>
          ))}
        </div>
      </Block>

      <Block id="shape" title="فرم، گردی و سایه" description="خط دور ۲ تا ۳ پیکسلی تیره به همه‌چیز شخصیت «کتاب تصویری» می‌دهد. گوشه‌ها همیشه گرد. سایه‌ی سخت زیر دکمه‌ها حس قابل‌فشردن بودن می‌دهد.">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[["chip", "rounded-full", "999px"], ["input", "rounded-2xl", "16px"], ["card", "rounded-card", "24px"], ["panel", "rounded-[2rem]", "32px"], ["blob", "rounded-blob", "36px"], ["calm", "rounded-xl", "12px"]].map(([n, cls, v]) => (
            <div key={n} className="text-center">
              <div className={cn("mx-auto h-20 w-full border-2 border-ink-900/10 bg-sky-100", cls)} />
              <p className="mt-2 text-sm font-bold" dir="ltr">{n} · {v}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {[["shadow-soft", "کارت‌ها"], ["shadow-lift", "hover و مودال"], ["shadow-calm", "پنل والدین"], ["btn-3d", "دکمه‌ی کودک"]].map(([cls, use]) => (
            <div key={cls} className={cn("rounded-2xl bg-white p-5 text-center", cls === "btn-3d" ? "border-2 border-ink-900/10 btn-3d [--btn-edge:var(--color-ink-200)]" : cls)}>
              <p className="font-bold" dir="ltr">{cls}</p>
              <p className="text-xs text-ink-500">{use}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block id="buttons" title="دکمه‌ها">
        <div className="space-y-6 rounded-card border-2 border-ink-900/10 bg-white p-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">اصلی</Button>
            <Button variant="secondary">ثانویه</Button>
            <Button variant="ghost">متنی</Button>
            <Button variant="primary" disabled>غیرفعال</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {(["sm", "md", "lg", "xl"] as const).map((s) => (
              <Button key={s} variant="kid" tone="grass" size={s}>اندازه {s}</Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {toneKeys.map((k) => (
              <Button key={k} variant="kid" tone={k} size="lg">{toneNames[k]}</Button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-calm-50 p-4 font-sans">
            <Button variant="calm">ذخیره‌ی تغییرات</Button>
            <Button variant="calm-outline">انصراف</Button>
            <span className="text-xs text-calm-500">← دکمه‌های پنل والدین: تخت و آرام</span>
          </div>
        </div>
      </Block>

      <Block id="components" title="کامپوننت‌ها">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4 rounded-card border-2 border-ink-900/10 bg-white p-6">
            <p className="font-black">Badge · Chip</p>
            <div className="flex flex-wrap gap-2">
              {toneKeys.slice(0, 5).map((k) => <Badge key={k} tone={k}>{toneNames[k]}</Badge>)}
              <PremiumBadge />
            </div>
            <div className="flex flex-wrap gap-2"><Chip active>انتخاب‌شده</Chip><Chip>عادی</Chip><Chip>ماز</Chip></div>
          </div>
          <div className="space-y-4 rounded-card border-2 border-ink-900/10 bg-white p-6">
            <p className="font-black">Stars · Progress</p>
            <div className="flex gap-6"><Stars value={0} /><Stars value={2} /><Stars value={3} /></div>
            <ProgressBar value={35} tone="sun" label="نمونه" />
            <ProgressBar value={80} tone="grass" label="نمونه" />
          </div>
          <div className="space-y-4 rounded-card border-2 border-ink-900/10 bg-white p-6">
            <p className="font-black">Icon Tile</p>
            <div className="flex flex-wrap gap-3">
              {categories.slice(0, 6).map((c) => <IconTile key={c.id} icon={c.icon} tone={c.tone} />)}
            </div>
          </div>
          <div className="space-y-4 rounded-card border-2 border-ink-900/10 bg-white p-6">
            <p className="font-black">Avatar (بدون عکس واقعی کودک)</p>
            <div className="flex flex-wrap gap-3">
              {avatarKeys.map((a) => (
                <figure key={a} className="text-center">
                  <Avatar kind={a} className="h-16 w-16" />
                  <figcaption className="mt-1 text-xs font-bold">{avatarMeta[a].name}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </Block>

      <Block id="illustration" title="تصویرسازی" description="سبک واحد: خط دور تیره‌ی ۳px، سرهای گرد، رنگ تخت از پالت، یک هایلایت سفید. همه به‌صورت SVG تا در هر اندازه‌ای تیز و سبک باشند.">
        <p className="mb-3 font-black">آیکون دنیاها و نشان‌ها</p>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8 lg:grid-cols-13">
          {["academy", "brain", "studio", "worksheet", "fun", "discover", "story", "music", "life", "growth", "rocket", "drum", "bubble", "dino", "palette", "book", "fire", "abacus", "trophy", "star", "lock", "parent", "shield", "printer", "sparkle", "clock"].map((n) => (
            <div key={n} className="flex flex-col items-center gap-1 rounded-2xl bg-white p-2">
              <WorldIcon name={n} className="h-12 w-12" />
              <span className="text-[10px] text-ink-500" dir="ltr">{n}</span>
            </div>
          ))}
        </div>
        <p className="mb-3 mt-8 font-black">اشیای بازی (مشترک بین بازی‌ها و کاربرگ‌ها)</p>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-12">
          {playIconKeys.map((n) => (
            <div key={n} className="flex flex-col items-center gap-1 rounded-2xl bg-white p-2">
              <PlayIcon name={n} className="h-12 w-12" />
              <span className="text-xs font-bold">{playIconNames[n]}</span>
            </div>
          ))}
        </div>
      </Block>

      <Block id="themes" title="سه محیط، یک خانواده" description="محیط کودک و والدین کاملاً متمایزند تا کودک هرگز وارد فضای بزرگسالان نشود و والدین در محیطی آرام و داده‌محور تصمیم بگیرند.">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-card border-2 border-ink-900/10 bg-cream-50 p-5">
            <p className="font-black">سایت عمومی</p>
            <p className="mt-1 text-sm text-ink-500">شاد، قابل اعتماد، SEO-محور</p>
            <div className="mt-4 flex gap-2"><Button variant="primary" size="sm">شروع</Button><Button variant="secondary" size="sm">بیشتر</Button></div>
          </div>
          <div className="rounded-card border-2 border-ink-900/10 bg-sky-100 bg-dots p-5 font-display">
            <p className="text-lg font-black">محیط کودک</p>
            <p className="mt-1 text-sm text-ink-500">درشت، آیکونی، بدون فرم و متن زیاد</p>
            <Button variant="kid" tone="grass" size="lg" className="mt-4">▶ بازی</Button>
          </div>
          <div className="rounded-xl border border-calm-200 bg-white p-5 font-sans shadow-calm">
            <p className="font-bold text-calm-900">پنل والدین</p>
            <p className="mt-1 text-sm text-calm-500">آرام، خنثی، داده‌محور</p>
            <div className="mt-4 h-2 rounded bg-calm-100"><div className="h-full w-2/3 rounded bg-ocean-500" /></div>
            <Button variant="calm" size="sm" className="mt-4">گزارش PDF</Button>
          </div>
        </div>
      </Block>
    </Container>
  );
}
