import type { Achievement, ActivityLogItem, ChildProfile, ParentSettings, Plan, SkillObservation } from "@kidsworld/types";

/** داده‌ی نمونه‌ی یک خانواده برای نمایش پنل والدین و محیط کودک */

export const children: ChildProfile[] = [
  { id: "ch-1", displayName: "نیلا", birthYearMonth: "2020-04", age: 6, avatar: "bunny", favoriteCategoryIds: ["c-studio", "c-story"], preferredLanguage: "fa" },
  { id: "ch-2", displayName: "آرین", birthYearMonth: "2022-08", age: 4, avatar: "fox", favoriteCategoryIds: ["c-brain", "c-discover"], preferredLanguage: "fa" },
];

export const parentSettings: Record<string, ParentSettings> = {
  "ch-1": { childId: "ch-1", dailyLimitMinutes: 45, allowedContentTypes: ["game", "worksheet", "story", "lesson", "drawing"], soundEnabled: true, screenTimeEnabled: true, bedtimeLock: { enabled: true, from: "20:30", to: "07:00" } },
  "ch-2": { childId: "ch-2", dailyLimitMinutes: 30, allowedContentTypes: ["game", "story", "drawing"], soundEnabled: true, screenTimeEnabled: true, bedtimeLock: { enabled: true, from: "20:00", to: "07:30" } },
};

/** دقیقه‌های استفاده در ۷ روز اخیر (شنبه تا جمعه) */
export const weeklyMinutes: Record<string, number[]> = {
  "ch-1": [32, 41, 18, 45, 27, 52, 38],
  "ch-2": [22, 15, 28, 30, 12, 26, 19],
};

/** تفکیک دقیقه‌ها بر اساس نوع فعالیت در هفته‌ی جاری */
export const weeklyByType: Record<string, { type: "game" | "story" | "worksheet" | "drawing"; minutes: number }[]> = {
  "ch-1": [
    { type: "game", minutes: 88 },
    { type: "story", minutes: 61 },
    { type: "drawing", minutes: 72 },
    { type: "worksheet", minutes: 32 },
  ],
  "ch-2": [
    { type: "game", minutes: 74 },
    { type: "story", minutes: 49 },
    { type: "drawing", minutes: 23 },
    { type: "worksheet", minutes: 6 },
  ],
};

export const skillObservations: Record<string, SkillObservation[]> = {
  "ch-1": [
    { skillId: "s-creativity", score: 82, sampleCount: 24, trend: "up" },
    { skillId: "s-letters", score: 71, sampleCount: 18, trend: "up" },
    { skillId: "s-memory", score: 64, sampleCount: 15, trend: "flat" },
    { skillId: "s-listening", score: 77, sampleCount: 20, trend: "up" },
    { skillId: "s-number", score: 58, sampleCount: 12, trend: "up" },
    { skillId: "s-pattern", score: 49, sampleCount: 7, trend: "flat" },
  ],
  "ch-2": [
    { skillId: "s-memory", score: 69, sampleCount: 21, trend: "up" },
    { skillId: "s-pattern", score: 55, sampleCount: 14, trend: "up" },
    { skillId: "s-number", score: 46, sampleCount: 16, trend: "flat" },
    { skillId: "s-listening", score: 62, sampleCount: 11, trend: "up" },
    { skillId: "s-creativity", score: 51, sampleCount: 6, trend: "flat" },
    { skillId: "s-spatial", score: 38, sampleCount: 5, trend: "down" },
  ],
};

export const activityLog: ActivityLogItem[] = [
  { id: "a1", childId: "ch-1", contentId: "st-moon", contentTitle: "ابرک کوچولو و ماه", contentType: "story", tone: "lilac", at: "امروز، ۱۸:۱۰", durationMinutes: 7, result: "پایان قصه" },
  { id: "a2", childId: "ch-1", contentId: "g-memory-animals", contentTitle: "باغ حافظه · مرحله ۲", contentType: "game", tone: "grape", at: "امروز، ۱۷:۴۵", durationMinutes: 6, result: "★★★" },
  { id: "a3", childId: "ch-1", contentId: "studio", contentTitle: "نقاشی آزاد: «خانه‌ی ما»", contentType: "drawing", tone: "berry", at: "امروز، ۱۷:۲۰", durationMinutes: 14, result: "ذخیره شد" },
  { id: "a4", childId: "ch-1", contentId: "w-trace-alef", contentTitle: "ردگیری حرف «آ»", contentType: "worksheet", tone: "sky", at: "دیروز، ۱۰:۰۵", durationMinutes: 9, result: "چاپ شد" },
  { id: "a5", childId: "ch-1", contentId: "g-pattern", contentTitle: "قطار الگوها · مرحله ۱", contentType: "game", tone: "sky", at: "دیروز، ۰۹:۴۰", durationMinutes: 5, result: "★★" },
  { id: "b1", childId: "ch-2", contentId: "g-counting", contentTitle: "ماهی‌ها را بشمار · مرحله ۱", contentType: "game", tone: "ocean", at: "امروز، ۱۶:۳۰", durationMinutes: 5, result: "★★★" },
  { id: "b2", childId: "ch-2", contentId: "st-seed", contentTitle: "دانه‌ی شجاع", contentType: "story", tone: "grass", at: "امروز، ۱۶:۱۰", durationMinutes: 4, result: "پایان قصه" },
  { id: "b3", childId: "ch-2", contentId: "g-memory-animals", contentTitle: "باغ حافظه · مرحله ۱", contentType: "game", tone: "grape", at: "دیروز، ۱۱:۲۰", durationMinutes: 6, result: "★★" },
];

export const achievements: Achievement[] = [
  { id: "ach-first", title: "اولین قدم", description: "اولین فعالیت را کامل کردی", icon: "rocket", points: 10 },
  { id: "ach-memory", title: "ذهن فیل", description: "۳ ستاره در بازی حافظه", icon: "brain", points: 30 },
  { id: "ach-artist", title: "نقاش کوچک", description: "۵ نقاشی ذخیره کردی", icon: "palette", points: 25 },
  { id: "ach-reader", title: "قصه‌خوان", description: "۳ قصه را تا آخر شنیدی", icon: "book", points: 20 },
  { id: "ach-streak", title: "۷ روز پیاپی", description: "یک هفته هر روز یاد گرفتی", icon: "fire", points: 50 },
  { id: "ach-math", title: "ریاضی‌دان", description: "۲۰ پاسخ درست شمارش", icon: "abacus", points: 30 },
];

export const earnedAchievements: Record<string, string[]> = {
  "ch-1": ["ach-first", "ach-memory", "ach-artist", "ach-reader"],
  "ch-2": ["ach-first", "ach-math"],
};

export const plans: Plan[] = [
  {
    id: "p-free",
    name: "رایگان",
    tagline: "برای شروع و آشنایی",
    priceMonthly: 0,
    priceYearly: 0,
    currency: "IRR",
    audience: "family",
    features: ["۱ پروفایل کودک", "بازی‌ها و قصه‌های رایگان", "۱۰ دانلود کاربرگ در ماه", "گزارش هفتگی ساده"],
  },
  {
    id: "p-family",
    name: "خانواده",
    tagline: "محبوب‌ترین انتخاب والدین",
    priceMonthly: 290000,
    priceYearly: 2490000,
    currency: "IRR",
    audience: "family",
    highlighted: true,
    features: ["تا ۴ پروفایل کودک", "دسترسی کامل به همه‌ی دنیاها", "دانلود نامحدود کاربرگ", "گزارش مهارت و خروجی PDF", "کنترل زمان و قفل خواب", "بدون هیچ تبلیغی، همیشه"],
  },
  {
    id: "p-school",
    name: "مدرسه و مهد",
    tagline: "برای کلاس‌ها و مربیان",
    priceMonthly: 1900000,
    priceYearly: 16900000,
    currency: "IRR",
    audience: "school",
    features: ["تا ۶۰ دانش‌آموز", "پنل مربی و مدیریت کلاس", "اختصاص کاربرگ و تکلیف", "گزارش عملکرد کلاس", "پشتیبانی اختصاصی"],
  },
];

export const childById = (id: string) => children.find((c) => c.id === id);
