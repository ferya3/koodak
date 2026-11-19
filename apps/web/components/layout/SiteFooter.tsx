import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Wave } from "@/components/brand/Decor";
import { Container } from "@/components/ui/Section";

const cols = [
  { title: "کاوش", links: [["آکادمی یادگیری", "/learn"], ["کاربرگ‌ها", "/worksheets"], ["بازی‌ها", "/games"], ["قصه‌ها", "/stories"], ["دنیاها", "/#worlds"]] },
  { title: "برای بزرگ‌ترها", links: [["پنل والدین", "/parent"], ["اشتراک خانواده", "/pricing"], ["مدارس و مهدها", "/pricing#school"], ["سیستم طراحی", "/design-system"]] },
  { title: "اعتماد", links: [["حریم خصوصی کودکان", "/privacy"], ["قوانین استفاده", "/privacy#terms"], ["سوالات متداول", "/#faq"], ["تماس با ما", "/privacy#contact"]] },
];

export function SiteFooter() {
  return (
    <footer className="mt-24">
      <Wave fill="#1f1a3d" />
      <div className="bg-ink-900 pb-10 pt-6 text-ink-200">
        <Container>
          <div className="grid gap-10 md:grid-cols-[1.3fr_repeat(3,1fr)]">
            <div>
              <div className="inline-block rounded-2xl bg-cream-50 px-3 py-2">
                <Logo />
              </div>
              <p className="mt-4 max-w-xs leading-7 text-ink-300">
                جایی امن برای بازی، یادگیری و خلق کردن. بدون تبلیغات، بدون چت عمومی، با کنترل کامل والدین.
              </p>
            </div>
            {cols.map((c) => (
              <div key={c.title}>
                <h3 className="mb-3 font-display text-lg font-extrabold text-white">{c.title}</h3>
                <ul className="space-y-2">
                  {c.links.map(([label, href]) => (
                    <li key={href}>
                      <Link href={href} className="text-ink-300 transition hover:text-sun-300">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-ink-300">
            <p>© ۱۴۰۵ KidsWorld · ساخته‌شده با ❤ برای بچه‌ها</p>
            <p>طراحی‌شده با اصول حریم خصوصی کودکان (COPPA / GDPR-K)</p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
