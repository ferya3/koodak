import Link from "next/link";
import { api } from "@/lib/api";
import { tones } from "@/lib/tones";
import { cn, fa } from "@/lib/utils";
import { Mascot } from "@/components/brand/Mascot";
import { Cloud, Hills, Sparkle, Wave } from "@/components/brand/Decor";
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
  const [categories, { data: worksheets }, { data: games }, { data: stories }] = await Promise.all([
    api.categories(),
    api.worksheets(),
    api.games(),
    api.stories(),
  ]);
  const featured = [games[0], worksheets[5], stories[0], worksheets[0]];

  return (
    <>
      {/* ═════════ HERO ═════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-100 via-cream-50 to-cream-50">
        <Cloud className="absolute right-[8%] top-10 w-36 animate-float opacity-90" />
        <Cloud className="absolute left-[4%] top-40 w-24 animate-float opacity-80 [animation-delay:1.5s]" />
        <Sparkle className="absolute right-[45%] top-16 w-6" />
        <Sparkle className="absolute left-[30%] top-28 w-4" fill="#ff73b3" />

        <Container className="relative grid items-center gap-10 pb-36 pt-12 lg:grid-cols-[1.1fr_1fr] lg:pb-44 lg:pt-20">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-ink-900 bg-white px-4 py-1.5 text-sm font-extrabold shadow-soft">
              <span className="h-2.5 w-2.5 rounded-full bg-grass-400" />
              برای کودکان {fa(2)} تا {fa(10)} سال
            </p>
            <h1 className="text-[2.6rem] font-black leading-[1.25] text-ink-900 sm:text-6xl sm:leading-[1.2]">
              جایی که{" "}
              <span className="relative inline-block text-coral-500">
                بازی
                <svg viewBox="0 0 120 14" className="absolute -bottom-2 right-0 h-3 w-full" aria-hidden="true" preserveAspectRatio="none">
                  <path d="M2 10 C 30 2, 90 2, 118 10" stroke="#ffce3d" strokeWidth="6" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              ،<br />
              یادگیری می‌شود.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-9 text-ink-700 sm:text-xl">
              بازی‌های فکری، قصه‌های تعاملی، استودیوی نقاشی و صدها کاربرگ قابل چاپ؛ همه در یک دنیای امن و بدون تبلیغ، با پنلی که والدین را در جریان رشد کودک نگه می‌دارد.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/kids" variant="kid" tone="coral" size="xl">
                بزن بریم بازی!
              </ButtonLink>
              <ButtonLink href="/parent" variant="secondary" size="xl" className="rounded-3xl">
                ساخت حساب والدین
              </ButtonLink>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-ink-700">
              {["بدون تبلیغات", "بدون چت عمومی", "کنترل کامل والدین", "فارسی و انگلیسی"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
                    <circle cx="10" cy="10" r="9" fill="#4fcb72" />
                    <path d="M6 10 L 9 13 L 14 7" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* ترکیب تصویری Hero */}
          <div className="relative mx-auto aspect-square w-full max-w-[520px]">
            <div className="absolute inset-[10%] rounded-full border-[3px] border-dashed border-ink-900/15" />
            <div className="absolute inset-[22%] rounded-full bg-sun-300" />
            <div className="absolute inset-[22%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff7d6_0,transparent_55%)]" />
            <Mascot mood="cheer" className="absolute inset-x-[24%] bottom-[16%] top-[14%] mx-auto animate-float drop-shadow-xl" />
            {[
              { icon: "brain", tone: "grape" as const, pos: "right-[2%] top-[14%]", rot: "rotate-6" },
              { icon: "studio", tone: "berry" as const, pos: "left-[4%] top-[8%]", rot: "-rotate-6" },
              { icon: "story", tone: "lilac" as const, pos: "left-0 bottom-[24%]", rot: "rotate-3" },
              { icon: "worksheet", tone: "sun" as const, pos: "right-0 bottom-[22%]", rot: "-rotate-3" },
              { icon: "music", tone: "peach" as const, pos: "left-[40%] top-0", rot: "rotate-12" },
            ].map((b) => (
              <IconTile key={b.icon} icon={b.icon} tone={b.tone} className={cn("absolute h-20 w-20 shadow-lift sm:h-24 sm:w-24", b.pos, b.rot)} iconClass="h-12 w-12 sm:h-14 sm:w-14" />
            ))}
          </div>
        </Container>
        <Hills className="absolute inset-x-0 bottom-0 h-28 sm:h-40" />
      </section>

      {/* ═════════ AGE PICKER ═════════ */}
      <section className="bg-grass-400 pb-10">
        <Container>
          <div className="flex flex-col items-center gap-4 rounded-blob border-2 border-ink-900 bg-white p-6 shadow-lift sm:flex-row sm:justify-between sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3 space-x-reverse">
                {(["fox", "bunny", "bear"] as const).map((a) => (
                  <Avatar key={a} kind={a} className="h-12 w-12" />
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
                  className="grid h-12 w-12 place-items-center rounded-2xl border-2 border-ink-900 bg-cream-50 font-display text-xl font-black transition hover:-translate-y-0.5 hover:bg-sun-300"
                  aria-label={`${age} ساله`}
                >
                  {fa(age)}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>
      <Wave fill="#4fcb72" flip />

      {/* ═════════ WORLDS ═════════ */}
      <section id="worlds" className="scroll-mt-24 py-16">
        <Container>
          <SectionHeading eyebrow="ده دنیا، هزار ماجرا" title="هر روز یک دنیای تازه برای کشف" description="هر دنیا یک رنگ و یک شخصیت دارد تا کودک حتی قبل از خواندن، راهش را پیدا کند." align="center" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((c, i) => (
              <Link
                key={c.id}
                href={c.slug === "worksheets" ? "/worksheets" : c.slug === "story-world" ? "/stories" : c.slug === "brain-games" || c.slug === "fun-games" ? "/games" : "/kids"}
                className={cn(
                  "group relative flex flex-col items-center gap-3 overflow-hidden rounded-card border-2 border-ink-900 p-5 text-center shadow-soft transition duration-300 hover:-translate-y-1.5 hover:shadow-lift",
                  tones[c.tone].soft,
                )}
              >
                <span className="absolute -left-6 -top-6 h-20 w-20 rounded-full bg-white/50" />
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
              <li key={s.n} className="relative rounded-card border-2 border-ink-900 bg-white p-6 shadow-soft">
                <span className={cn("absolute -top-5 left-6 grid h-10 w-10 place-items-center rounded-full border-2 border-ink-900 font-display text-lg font-black", tones[s.tone].solid)}>
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
          <div className="grid items-center gap-10 overflow-hidden rounded-[2.5rem] border-2 border-ink-900 bg-ink-900 p-6 text-white sm:p-10 lg:grid-cols-2 lg:p-14">
            <div>
              <p className="mb-2 text-sm font-extrabold text-sun-300">برای والدین</p>
              <h2 className="text-3xl font-black leading-tight sm:text-4xl">ببینید کودکتان چه چیزهایی یاد می‌گیرد، نه فقط چقدر بازی می‌کند.</h2>
              <ul className="mt-6 space-y-4">
                {[
                  ["clock", "مدیریت زمان استفاده، سقف روزانه و قفل ساعت خواب"],
                  ["growth", "مشاهده‌ی روند تمرین مهارت‌ها (حافظه، عدد، زبان، خلاقیت…)"],
                  ["printer", "گزارش هفتگی قابل دانلود به‌صورت PDF"],
                  ["shield", "مدیریت حریم خصوصی، رضایت‌نامه‌ها و حذف کامل اطلاعات"],
                ].map(([icon, text]) => (
                  <li key={text} className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10">
                      <WorldIcon name={icon} className="h-7 w-7" />
                    </span>
                    <span className="leading-7 text-ink-100">{text}</span>
                  </li>
                ))}
              </ul>
              <ButtonLink href="/parent" variant="kid" tone="sun" size="lg" className="mt-8">
                مشاهده‌ی پنل والدین
              </ButtonLink>
            </div>
            <ParentPreview />
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
              <div key={f.t} className={cn("rounded-card border-2 border-ink-900 p-6", tones[f.tone].soft)}>
                <WorldIcon name={f.icon} className="h-14 w-14" />
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
              <details key={f.q} className="group rounded-3xl border-2 border-ink-900 bg-white p-5 shadow-soft open:bg-sun-100">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-extrabold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-ink-900 bg-white transition group-open:rotate-45">
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
          <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-ink-900 bg-coral-400 px-6 py-12 text-center text-white sm:px-12">
            <Sparkle className="absolute right-10 top-8 w-8" />
            <Sparkle className="absolute bottom-10 left-16 w-6" fill="#fff" />
            <Mascot mood="happy" className="mx-auto h-28 w-28" />
            <h2 className="mt-4 text-3xl font-black sm:text-4xl">پیکو منتظر شماست!</h2>
            <p className="mx-auto mt-3 max-w-xl text-lg text-coral-100">شروع رایگان است و نیازی به کارت بانکی ندارد.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/kids" variant="kid" tone="sun" size="xl">شروع بازی</ButtonLink>
              <ButtonLink href="/pricing" variant="secondary" size="xl" className="rounded-3xl">مقایسه‌ی اشتراک‌ها</ButtonLink>
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
