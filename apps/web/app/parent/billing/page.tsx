import { Suspense } from "react";
import { BillingView } from "@/features/billing/BillingView";

export const metadata = { title: "اشتراک و پرداخت" };

export default function BillingPage() {
  return (
    <Suspense>
      <BillingView />
    </Suspense>
  );
}
