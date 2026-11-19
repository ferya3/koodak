import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

/** Vazirmatn Round-Dots: نقطه‌های گرد، دوستانه و خوانا برای کودکان (تیترها و محیط کودک) */
const display = localFont({ src: "./fonts/VazirmatnRD.woff2", variable: "--font-rd", weight: "100 900", display: "swap" });
/** Vazirmatn: متن بدنه و پنل والدین */
const body = localFont({ src: "./fonts/Vazirmatn.woff2", variable: "--font-base", weight: "100 900", display: "swap" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kidsworld.example";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "KidsWorld | دنیای بازی و یادگیری کودکان", template: "%s | KidsWorld" },
  description: "پلتفرم جامع آموزش، بازی، خلاقیت و کاربرگ برای کودکان ۲ تا ۱۰ سال؛ امن، بدون تبلیغات و با پنل اختصاصی والدین.",
  applicationName: "KidsWorld",
  openGraph: { type: "website", locale: "fa_IR", siteName: "KidsWorld" },
  alternates: { canonical: "/", languages: { fa: "/", en: "/en" } },
};

export const viewport: Viewport = {
  themeColor: "#fffbf3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
