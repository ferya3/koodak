import type { AgeGroup, Category, Skill, Subject } from "@kidsworld/types";

/**
 * داده‌ی نمونه (Seed). در نسخه‌ی متصل به Backend این داده‌ها از
 * GET /api/v1/categories و ... خوانده می‌شوند و هیچ‌کدام در UI هاردکد نیستند.
 */

export const ageGroups: AgeGroup[] = [
  { id: "ag-2", title: "۲ تا ۳ سال", minAge: 2, maxAge: 3 },
  { id: "ag-3", title: "۳ تا ۴ سال", minAge: 3, maxAge: 4 },
  { id: "ag-4", title: "۴ تا ۵ سال", minAge: 4, maxAge: 5 },
  { id: "ag-5", title: "۵ تا ۶ سال", minAge: 5, maxAge: 6 },
  { id: "ag-6", title: "۶ تا ۷ سال", minAge: 6, maxAge: 7 },
  { id: "ag-7", title: "۷ تا ۸ سال", minAge: 7, maxAge: 8 },
  { id: "ag-8", title: "۸ تا ۹ سال", minAge: 8, maxAge: 9 },
  { id: "ag-9", title: "۹ تا ۱۰ سال", minAge: 9, maxAge: 10 },
];

/** ده «دنیا»ی اصلی محصول = ماژول‌های بخش سوم سند */
export const categories: Category[] = [
  { id: "c-learn", parentId: null, slug: "learning-academy", title: "آکادمی یادگیری", titleEn: "Learning Academy", description: "الفبا، اعداد، ریاضی، علوم و زبان با درس‌های کوتاه و صوتی", icon: "academy", tone: "sky", sortOrder: 1 },
  { id: "c-brain", parentId: null, slug: "brain-games", title: "بازی‌های فکری", titleEn: "Brain Games", description: "حافظه، تمرکز، الگو و استدلال در قالب بازی", icon: "brain", tone: "grape", sortOrder: 2 },
  { id: "c-studio", parentId: null, slug: "creative-studio", title: "استودیو خلاقیت", titleEn: "Creative Studio", description: "نقاشی، رنگ‌آمیزی، طراحی شخصیت و کاردستی", icon: "studio", tone: "berry", sortOrder: 3 },
  { id: "c-sheets", parentId: null, slug: "worksheets", title: "کاربرگ‌ها", titleEn: "Worksheets", description: "صدها کاربرگ قابل چاپ برای تمرین در خانه و کلاس", icon: "worksheet", tone: "sun", sortOrder: 4 },
  { id: "c-fun", parentId: null, slug: "fun-games", title: "بازی‌های سرگرمی", titleEn: "Fun Games", description: "جورچین، کلمات، تطبیق و ماجراجویی‌های مرحله‌ای", icon: "fun", tone: "coral", sortOrder: 5 },
  { id: "c-discover", parentId: null, slug: "discovery-world", title: "دنیای کشف", titleEn: "Discovery World", description: "فضا، حیوانات، دایناسورها، اقیانوس و آزمایش‌های ساده", icon: "discover", tone: "ocean", sortOrder: 6 },
  { id: "c-story", parentId: null, slug: "story-world", title: "دنیای قصه", titleEn: "Story World", description: "قصه‌های تصویری، صوتی، تعاملی و قبل از خواب", icon: "story", tone: "lilac", sortOrder: 7 },
  { id: "c-music", parentId: null, slug: "music-sounds", title: "موسیقی و صدا", titleEn: "Music & Sounds", description: "پیانو، ریتم، صدای حیوانات و بازی‌های شنیداری", icon: "music", tone: "peach", sortOrder: 8 },
  { id: "c-life", parentId: null, slug: "life-skills", title: "مهارت‌های زندگی", titleEn: "Life Skills", description: "احساسات، همدلی، همکاری و مهارت‌های روزمره", icon: "life", tone: "grass", sortOrder: 9 },
  { id: "c-growth", parentId: null, slug: "growth-center", title: "مرکز رشد", titleEn: "Talent & Growth", description: "مشاهده‌ی علایق و مهارت‌های تمرین‌شده‌ی کودک", icon: "growth", tone: "mint", sortOrder: 10 },
];

/** موضوع‌های آکادمی یادگیری (Category › Subject) */
export const subjects: Subject[] = [
  { id: "sub-letters", categoryId: "c-learn", slug: "alphabet", title: "الفبای فارسی" },
  { id: "sub-english", categoryId: "c-learn", slug: "english-alphabet", title: "الفبای انگلیسی" },
  { id: "sub-numbers", categoryId: "c-learn", slug: "numbers", title: "اعداد و شمارش" },
  { id: "sub-shapes", categoryId: "c-learn", slug: "shapes-colors", title: "شکل‌ها و رنگ‌ها" },
  { id: "sub-math", categoryId: "c-learn", slug: "math", title: "ریاضی" },
  { id: "sub-science", categoryId: "c-learn", slug: "science", title: "علوم و طبیعت" },

  // موضوع‌های کتابخانه‌ی کاربرگ
  { id: "ws-fa", categoryId: "c-sheets", slug: "persian-letters", title: "الفبای فارسی" },
  { id: "ws-en", categoryId: "c-sheets", slug: "english-letters", title: "الفبای انگلیسی" },
  { id: "ws-numbers", categoryId: "c-sheets", slug: "numbers", title: "اعداد و شمارش" },
  { id: "ws-math", categoryId: "c-sheets", slug: "math", title: "ریاضی و ساعت" },
  { id: "ws-logic", categoryId: "c-sheets", slug: "logic", title: "منطق و الگو" },
  { id: "ws-motor", categoryId: "c-sheets", slug: "mazes-tracing", title: "ماز، نقطه‌به‌نقطه و شکل‌ها" },
  { id: "ws-coloring", categoryId: "c-sheets", slug: "coloring", title: "رنگ‌آمیزی" },
  { id: "ws-vocab", categoryId: "c-sheets", slug: "word-puzzles", title: "جدول و واژه" },
];

export const skills: Skill[] = [
  { id: "s-memory", slug: "visual-memory", title: "حافظه‌ی دیداری", category: "cognitive" },
  { id: "s-attention", slug: "attention", title: "تمرکز", category: "cognitive" },
  { id: "s-pattern", slug: "pattern-recognition", title: "تشخیص الگو", category: "logical" },
  { id: "s-number", slug: "number-sense", title: "درک عدد", category: "logical" },
  { id: "s-letters", slug: "letters", title: "شناخت حروف", category: "linguistic" },
  { id: "s-creativity", slug: "creativity", title: "خلاقیت", category: "creative" },
  { id: "s-spatial", slug: "spatial", title: "درک فضایی", category: "spatial" },
  { id: "s-motor", slug: "fine-motor", title: "حرکات ظریف", category: "fine_motor" },
  { id: "s-listening", slug: "listening", title: "مهارت شنیداری", category: "auditory" },
  { id: "s-empathy", slug: "empathy", title: "همدلی", category: "social_emotional" },
];

export const difficultyLabel = {
  beginner: "شروع",
  easy: "آسان",
  intermediate: "متوسط",
  advanced: "پیشرفته",
} as const;

export const contentTypeLabel = {
  lesson: "درس",
  game: "بازی",
  worksheet: "کاربرگ",
  story: "قصه",
  activity: "فعالیت",
  quiz: "آزمونک",
  drawing: "نقاشی",
} as const;

export const categoryById = (id: string) => categories.find((c) => c.id === id)!;
export const skillById = (id: string) => skills.find((s) => s.id === id)!;
