import { Mascot } from "@/components/brand/Mascot";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-sky-100 bg-dots p-6 text-center">
      <div>
        <Mascot mood="think" className="mx-auto h-40 w-40" />
        <h1 className="mt-4 text-4xl font-black">اوه! این صفحه گم شده</h1>
        <p className="mt-2 text-lg text-ink-500">پیکو همه‌جا را گشت ولی پیدایش نکرد.</p>
        <ButtonLink href="/" variant="kid" tone="coral" size="lg" className="mt-6">برگردیم خانه</ButtonLink>
      </div>
    </div>
  );
}
