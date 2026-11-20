import Link from "next/link";
import { api } from "@/lib/api";
import { tones } from "@/lib/tones";
import { cn, fa } from "@/lib/utils";
import { Mascot } from "@/components/brand/Mascot";
import { Sparkle } from "@/components/brand/Decor";
import { WorldIcon } from "@/components/brand/WorldIcon";
import { Avatar } from "@/components/brand/Avatar";
import { ButtonLink } from "@/components/ui/Button";
import { Container, SectionHeading } from "@/components/ui/Section";
import { IconTile } from "@/components/ui/IconTile";
import { ContentCard } from "@/features/content/ContentCard";
import { ParentPreview } from "@/features/parent/ParentPreview";

const faqs = [
  { q: "KidsWorld برای چه سنی مناسب است؟", a: "محتوا برای کودکان ۲ تا ۱۰ سال طراحی شده و هر فعالیت به گروه سنی و سطح دشواری مشخصی متصل است. پیشنهادها هم بر اساس سن و عملکرد کودک شخصی‌سازی می‌شوند." },
  { q: "آیا در سایت تبلیغات یا چت عمومی وجود دارد؟", a: "خیر. هیچ تبلیغ رفتاری، چت عمومی یا پروفایل عمومی کودک وجود ندارد. کودک فقط با محتوای تأییدشده‌ی تیم آموزشی تعامل می‌کند." },
  { q: "چه اطلاعاتی از کودک ذخیره می‌شود؟", a: "فقط حداقل لازم: نام نمایشی، سال و ماه تولد و نتیجه‌ی فعالیت‌ها. به‌جای عکس از آواتار کارتونی استفاده می‌شود و والدین هر زمان بخواهند می‌توانند همه‌ی اطلاعات را دانلود یا حذف کنند." },
  { q: "گزارش مهارت یعنی تست هوش؟", a: "نه. گزارش‌ها «مشاهده‌ی تمرین» هستند؛ نشان می‌دهند کودک در کدام مهارت‌ها بیشتر تمرین کرده و چه روندی داشته. ما هیچ تشخیص قطعی استعداد یا IQ ارائه نمی‌دهیم." },
  { q: "کاربرگ‌ها را می‌توانم چاپ کنم؟", a: "بله. همه‌ی کاربرگ‌ها در قطع A4 آماده‌ی چاپ مستقیم هستند و می‌توانید آن‌ها را به‌صورت PNG یا SVG هم دانلود کنید." },
];

export default async function HomePage() {
  const [categories, { data: worksheets }, { data: games }, { data: stories }, { data: lessons }] = await Promise.all([
    api.categories(),
    api.worksheets(),
    api.games(),
    api.stories(),
    api.lessons(),
  ]);
  // انتخاب با slug (نه جایگاه در فهرست) تا با بزرگ شدن کاتالوگ یا ترتیب API جابه‌جا نشود
  const pick = <T extends { slug: string }>(list: T[], slug: string, i = 0) => list.find((x) => x.slug === slug) ?? list[i];
  const featured = [pick(games, "letter-sounds-fa"), pick(worksheets, "maze-medium", 1), pick(stories, "little-fish-sea"), pick(worksheets, "fa-trace-be")].filter(Boolean);
  const stats = [
    { n: worksheets.length, t: "کاربرگ قابل چاپ", href: "/worksheets" },
    { n: lessons.length, t: "درس تعاملی", href: "/learn" },
    { n: games.length, t: "بازی آموزشی", href: "/games" },
    { n: stories.length, t: "قصه‌ی مصور", href: "/stories" },
  ];

  return (
    <>
      {/* ═════════ HERO ═════════ */}
      <section className="mesh relative -mt-19 overflow-hidden pt-19 [--hero:var(--color-sky-300)]">
        <div className="grid-fade pointer-events-none absolute inset-0" aria-hidden="true" />
        <Container className="relative grid items-center gap-12 pb-20 pt-14 lg:grid-cols-[1.1fr_1fr] lg:pb-28 lg:pt-20">
          <div>
            <p className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-extrabold text-ink-700">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-grass-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-grass-400" />
              </span>
              برای کودکان {fa(2)} تا {fa(10)} سال · بدون تبلیغ
            </p>
            <h1 className="text-[2.7rem] font-black leading-[1.2] tracking-tight text-ink-900 sm:text-[4.2rem] sm:leading-[1.12]">
              جایی که <span className="text-gradient">بازی</span>،
              <br />
              یادگیری می‌شود.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-9 text-ink-500 sm:text-xl">
              بازی‌های فکری، قصه‌های تعاملی، استودیوی نقاشی و صدها کاربرگ قابل چاپ؛ همه در یک دنیای امن، با پنلی که والدین را در جریان رشد کودک نگه می‌دارد.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/kids" variant="primary" size="xl">
                بزن بریم بازی!
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                  <path d="M15 6 L9 12 L15 18" stroke="currentColor" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </ButtonLink>
              <ButtonLink href="/worksheets" variant="secondary" size="xl">
                کاربرگ‌های رایگان
              </ButtonLink>
            </div>
            <ul className="mt-10 grid max-w-xl grid-cols-4 gap-2.5" aria-label="محتوای دنیای کودک">
              {stats.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className="glass block rounded-2xl px-2 py-3 text-center transition hover:-translate-y-0.5 hover:bg-white">
                    <span className="block font-display text-2xl font-black text-ink-900 sm:text-3xl">{fa(s.n)}</span>
                    <span className="block text-xs font-bold leading-5 text-ink-500">{s.t}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ترکیب تصویری Hero: هاله‌ی گرادیانی + کاشی‌های شیشه‌ای شناور */}
          <div className="relative mx-auto aspect-square w-full max-w-[540px]">
            <div className="absolute inset-[8%] rounded-full bg-[conic-gradient(from_200deg,var(--color-sky-300),var(--color-grape-300),var(--color-berry-300),var(--color-sun-300),var(--color-sky-300))] opacity-70 blur-3xl" />
            <div className="absolute inset-[18%] rounded-full bg-gradient-to-br from-white via-sun-100 to-sun-300 shadow-float ring-8 ring-white/60" />
            <Mascot mood="cheer" className="absolute inset-x-[24%] bottom-[16%] top-[14%] mx-auto animate-float drop-shadow-2xl" />
            {[
              { icon: "brain", tone: "grape" as const, pos: "right-[2%] top-[14%]", rot: "rotate-6", delay: "" },
              { icon: "studio", tone: "berry" as const, pos: "left-[4%] top-[8%]", rot: "-rotate-6", delay: "[animation-delay:1s]" },
              { icon: "story", tone: "lilac" as const, pos: "left-0 bottom-[22%]", rot: "rotate-3", delay: "[animation-delay:2s]" },
              { icon: "worksheet", tone: "sun" as const, pos: "right-0 bottom-[20%]", rot: "-rotate-3", delay: "[animation-delay:3s]" },
              { icon: "music", tone: "peach" as const, pos: "left-[42%] top-0", rot: "rotate-12", delay: "[animation-delay:1.5s]" },
            ].map((b) => (
              <IconTile key={b.icon} icon={b.icon} tone={b.tone} className={cn("absolute h-20 w-20 animate-float shadow-lift sm:h-24 sm:w-24", b.pos, b.rot, b.delay)} iconClass="h-12 w-12 sm:h-14 sm:w-14" />
            ))}
          </div>
        </Container>
      </section>

      {/* ═════════ AGE PICKER ═════════ */}
      <section className="relative z-10 -mt-10">
        <Container>
          <div className="surface flex flex-col items-center gap-5 p-6 sm:flex-row sm:justify-between sm:p-7">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3 space-x-reverse">
                {(["fox", "bunny", "bear"] as const).map((a) => (
                  <Avatar key={a} kind={a} className="h-12 w-12 rounded-full ring-4 ring-white" />
                ))}
              </div>
              <div>
                <h2 className="text-xl font-black">کودک شما چند ساله است؟</h2>
                <p className="text-ink-500">کاربرگ‌ها و بازی‌های مناسب سنش را نشانتان می‌دهیم.</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2" role="list">
              {[2, 3, 4, 5, 6, 7, 8, 9].map((age) => (
                <Link
                  key={age}
                  role="listitem"
                  href={`/worksheets?age=${age}`}
                  className="grid h-12 w-12 place-items-center rounded-2xl bg-ink-50 font-display text-xl font-black text-ink-700 transition hover:-translate-y-0.5 hover:bg-gradient-to-br hover:from-sun-300 hover:to-peach-300 hover:text-ink-900 hover:shadow-soft"
                  aria-label={`${age} ساله`}
                >
                  {fa(age)}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ═════════ WORLDS ═════════ */}
      <section id="worlds" className="scroll-mt-24 py-16">
        <Container>
          <SectionHeading eyebrow="ده دنیا، هزار ماجرا" title="هر روز یک دنیای تازه برای کشف" description="هر دنیا یک رنگ و یک شخصیت دارد تا کودک حتی قبل از خواندن، راهش را پیدا کند." align="center" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((c, i) => (
              <Link
                key={c.id}
                href={c.slug === "learning-academy" ? "/learn" : c.slug === "worksheets" ? "/worksheets" : c.slug === "story-world" ? "/stories" : c.slug === "brain-games" || c.slug === "fun-games" ? "/games" : "/kids"}
                className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-card p-5 text-center shadow-soft ring-1 ring-ink-900/5 transition duration-300 hover:-translate-y-1.5 hover:shadow-lift"
                style={{ background: `linear-gradient(160deg, #fff 10%, ${tones[c.tone].hex.soft} 60%, ${tones[c.tone].hex.mid} 140%)` }}
              >
                <span className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-white/70 blur-xl" />
                <WorldIcon name={c.icon} className={cn("relative h-20 w-20 transition duration-300 group-hover:scale-110", i % 2 ? "group-hover:-rotate-6" : "group-hover:rotate-6")} />
                <h3 className="relative text-lg font-black">{c.title}</h3>
                <p className="relative text-xs leading-5 text-ink-700">{c.description}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ═════════ FEATURED ═════════ */}
      <section className="py-12">
        <Container>
          <SectionHeading
            eyebrow="امروز امتحان کنید"
            title="محبوب‌ترین‌های این هفته"
            description="رایگان و بدون ثبت‌نام؛ برای شروع کافی است روی یکی کلیک کنید."
            action={<ButtonLink href="/worksheets" variant="secondary">همه‌ی محتواها</ButtonLink>}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((c) => (
              <ContentCard key={c.id} content={c} />
            ))}
          </div>
        </Container>
      </section>

      {/* ═════════ HOW IT WORKS ═════════ */}
      <section className="py-16">
        <Container>
          <SectionHeading eyebrow="ساده مثل یک، دو، سه" title="از ثبت‌نام تا اولین ستاره در ۲ دقیقه" align="center" />
          <ol className="grid gap-5 md:grid-cols-3">
            {[
              { n: 1, t: "حساب والدین بسازید", d: "فقط با ایمیل یا موبایل. همه‌ی تنظیمات و مجوزها دست شماست.", icon: "parent", tone: "sky" as const },
              { n: 2, t: "پروفایل کودک را بسازید", d: "یک نام نمایشی و یک آواتار بامزه انتخاب کنید؛ بدون عکس و اطلاعات اضافه.", icon: "sparkle", tone: "sun" as const },
              { n: 3, t: "کودک بازی می‌کند، شما رشدش را می‌بینید", d: "پیشنهادهای متناسب با سن و گزارش هفتگی مهارت‌ها در پنل شما.", icon: "growth", tone: "grass" as const },
            ].map((s) => (
              <li key={s.n} className="surface relative p-7">
                <span className="absolute left-6 top-6 font-display text-6xl font-black leading-none text-ink-900/[0.06]" aria-hidden="true">
                  {fa(s.n)}
                </span>
                <IconTile icon={s.icon} tone={s.tone} />
                <h3 className="mt-4 text-xl font-black">{s.t}</h3>
                <p className="mt-2 leading-7 text-ink-500">{s.d}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ═════════ PARENTS ═════════ */}
      <section className="py-16">
        <Container>
          <div className="relative grid items-center gap-10 overflow-hidden rounded-[2.5rem] bg-ink-900 p-6 text-white shadow-float sm:p-10 lg:grid-cols-2 lg:p-14">
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-grape-500/40 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-coral-500/30 blur-3xl" aria-hidden="true" />
            <div className="relative">
              <p className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-sm font-extrabold text-sun-300 ring-1 ring-white/15">برای والدین</p>
              <h2 className="text-3xl font-black leading-tight sm:text-4xl">ببینید کودکتان چه چیزهایی یاد می‌گیرد، نه فقط چقدر بازی می‌کند.</h2>
              <ul className="mt-6 space-y-4">
                {[
                  ["clock", "مدیریت زمان استفاده، سقف روزانه و قفل ساعت خواب"],
                  ["growth", "مشاهده‌ی روند تمرین مهارت‌ها (حافظه، عدد، زبان، خلاقیت…)"],
                  ["printer", "گزارش هفتگی قابل دانلود به‌صورت PDF"],
                  ["shield", "مدیریت حریم خصوصی، رضایت‌نامه‌ها و حذف کامل اطلاعات"],
                ].map(([icon, text]) => (
                  <li key={text} className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                      <WorldIcon name={icon} className="h-7 w-7" />
                    </span>
                    <span className="leading-7 text-ink-100">{text}</span>
                  </li>
                ))}
              </ul>
              <ButtonLink href="/parent" variant="primary" size="lg" className="mt-8 from-sun-400 via-sun-400 to-peach-400 text-ink-900 shadow-[0_12px_28px_-10px_rgb(245_180_0/0.6)]">
                مشاهده‌ی پنل والدین
              </ButtonLink>
            </div>
            <div className="relative">
              <ParentPreview />
            </div>
          </div>
        </Container>
      </section>

      {/* ═════════ SAFETY ═════════ */}
      <section className="py-12">
        <Container>
          <SectionHeading eyebrow="امنیت، اول" title="از روز اول برای کودکان طراحی شده" align="center" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "جمع‌آوری حداقلی", d: "فقط نام نمایشی و سال تولد. بدون عکس، بدون موقعیت مکانی.", tone: "sky" as const, icon: "shield" },
              { t: "بدون تبلیغ رفتاری", d: "هیچ ردیاب تبلیغاتی و هیچ پیشنهاد خرید درون محیط کودک.", tone: "coral" as const, icon: "lock" },
              { t: "محتوای بازبینی‌شده", d: "هر محتوا، حتی تولید هوش مصنوعی، پیش از انتشار توسط متخصص تأیید می‌شود.", tone: "grass" as const, icon: "star" },
              { t: "کنترل والدین", d: "دسترسی‌ها، زمان و نوع محتوا را والدین تعیین می‌کنند.", tone: "grape" as const, icon: "parent" },
            ].map((f) => (
              <div key={f.t} className="surface p-6 transition hover:-translate-y-1 hover:shadow-lift">
                <IconTile icon={f.icon} tone={f.tone} className="h-16 w-16" iconClass="h-10 w-10" />
                <h3 className="mt-3 text-lg font-black">{f.t}</h3>
                <p className="mt-1 text-sm leading-7 text-ink-700">{f.d}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═════════ FAQ ═════════ */}
      <section id="faq" className="scroll-mt-24 py-16">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="سؤالی دارید؟" title="سوالات متداول والدین" align="center" />
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="surface group p-5 transition open:shadow-lift open:ring-2 open:ring-sun-300">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-extrabold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink-50 transition group-open:rotate-45 group-open:bg-sun-300">
                    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                      <path d="M10 3 V17 M3 10 H17" stroke="#1f1a3d" strokeWidth="2.6" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 leading-8 text-ink-700">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* ═════════ CTA ═════════ */}
      <section className="pt-8">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-l from-grape-500 via-berry-500 to-coral-400 px-6 py-14 text-center text-white shadow-float sm:px-12">
            <div className="grid-fade pointer-events-none absolute inset-0 opacity-40 invert" aria-hidden="true" />
            <Sparkle className="absolute right-10 top-8 w-8" />
            <Sparkle className="absolute bottom-10 left-16 w-6" fill="#fff" />
            <Mascot mood="happy" className="mx-auto h-28 w-28" />
            <h2 className="mt-4 text-3xl font-black sm:text-4xl">پیکو منتظر شماست!</h2>
            <p className="mx-auto mt-3 max-w-xl text-lg text-white/80">شروع رایگان است و نیازی به کارت بانکی ندارد.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/kids" variant="secondary" size="xl" className="ring-0">شروع بازی</ButtonLink>
              <ButtonLink href="/pricing" variant="ghost" size="xl" className="text-white ring-1 ring-white/40 hover:bg-white/10">مقایسه‌ی اشتراک‌ها</ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }),
        }}
      />
    </>
  );
}
