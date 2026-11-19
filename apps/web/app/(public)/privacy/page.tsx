import type { Metadata } from "next";
import { Container } from "@/components/ui/Section";
import { WorldIcon } from "@/components/brand/WorldIcon";

export const metadata: Metadata = {
  title: "حریم خصوصی کودکان",
  description: "چگونه از اطلاعات کودکان محافظت می‌کنیم: جمع‌آوری حداقلی، کنترل والدین، بدون تبلیغات رفتاری.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  { id: "collect", title: "چه اطلاعاتی جمع می‌کنیم؟", body: "از والدین: ایمیل یا شماره‌ی موبایل و اطلاعات پرداخت (نزد درگاه بانکی). از کودک: فقط نام نمایشی، سال و ماه تولد، آواتار انتخابی و نتیجه‌ی فعالیت‌ها. هیچ عکس، صدا، موقعیت مکانی یا شناسه‌ی تبلیغاتی ذخیره نمی‌شود." },
  { id: "use", title: "از این اطلاعات چه استفاده‌ای می‌شود؟", body: "فقط برای پیشنهاد فعالیت متناسب با سن، ساخت گزارش پیشرفت برای والدین و بهبود کیفیت محتوا (به‌صورت تجمیعی و ناشناس). اطلاعات هرگز فروخته یا برای تبلیغات استفاده نمی‌شود." },
  { id: "control", title: "کنترل دست والدین است", body: "والدین می‌توانند هر زمان اطلاعات کودک را مشاهده، دانلود (JSON) یا به‌طور کامل حذف کنند. حذف ظرف ۳۰ روز از همه‌ی نسخه‌های پشتیبان نیز انجام می‌شود." },
  { id: "safety", title: "محیط امن", body: "محیط کودک چت عمومی، پروفایل عمومی، لینک خروجی یا تبلیغ ندارد. خروج از محیط کودک فقط با «دروازه‌ی والدین» ممکن است. همه‌ی محتوا، از جمله محتوای تولیدشده با هوش مصنوعی، پیش از انتشار توسط متخصص آموزشی بازبینی می‌شود." },
  { id: "terms", title: "قوانین استفاده", body: "حساب کاربری فقط توسط بزرگسال (۱۸ سال به بالا) ساخته می‌شود. استفاده‌ی تجاری از کاربرگ‌ها (فروش مجدد) بدون مجوز مجاز نیست؛ استفاده در خانه و کلاس آزاد است." },
  { id: "contact", title: "تماس با ما", body: "برای هر پرسش درباره‌ی حریم خصوصی با مسئول حفاظت از داده‌ها از طریق privacy@kidsworld.example در تماس باشید." },
];

export default function PrivacyPage() {
  return (
    <Container className="max-w-3xl py-12">
      <div className="flex items-center gap-4">
        <WorldIcon name="shield" className="h-16 w-16" />
        <h1 className="text-4xl font-black">حریم خصوصی کودکان</h1>
      </div>
      <p className="mt-4 text-lg leading-9 text-ink-700">ما KidsWorld را برای کودکان خودمان هم ساخته‌ایم؛ پس با همان دقتی از اطلاعات فرزند شما محافظت می‌کنیم که از فرزندان خودمان.</p>
      <div className="mt-10 space-y-5">
        {sections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-24 rounded-card border-2 border-ink-900/10 bg-white p-6">
            <h2 className="text-xl font-black">{s.title}</h2>
            <p className="mt-2 leading-8 text-ink-700">{s.body}</p>
          </section>
        ))}
      </div>
      <p className="mt-8 text-sm text-ink-500">این متن پیش‌نویس محصول است و پیش از انتشار باید با الزامات قانونی بازار هدف (از جمله COPPA و GDPR) توسط مشاور حقوقی بازبینی شود.</p>
    </Container>
  );
}
