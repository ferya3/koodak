import type { Metadata } from "next";
import { api } from "@/lib/api";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Mascot } from "@/components/brand/Mascot";
import { PricingPlans } from "@/features/billing/PricingPlans";

export const metadata: Metadata = {
  title: "اشتراک‌ها و قیمت‌ها",
  description: "شروع رایگان؛ اشتراک خانواده برای دسترسی کامل و اشتراک ویژه‌ی مدارس و مهدکودک‌ها.",
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage() {
  const plans = await api.plans();
  return (
    <>
      <section className="mesh relative -mt-19 pt-31 [--hero:var(--color-sun-300)]">
        <Container className="text-center">
          <Mascot mood="cheer" className="mx-auto h-28 w-28" />
          <SectionHeading title="یک اشتراک، همه‌ی دنیاها" description="بدون تبلیغ، بدون خرید درون‌برنامه‌ای در محیط کودک. هر زمان خواستید لغو کنید." align="center" className="mt-4" />
        </Container>
      </section>
      <Container className="pb-12">
        <PricingPlans plans={plans} />
      </Container>
    </>
  );
}
