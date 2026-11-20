import type { WorksheetTemplate } from "@kidsworld/types";

/**
 * منوی دسته‌بندی‌شده‌ی سایت (مگامنو).
 * slug قفسه‌ها همان slug موضوع‌های taxonomy است، پس در حالت API هم بدون تغییر کار می‌کند.
 */
export interface MenuLink {
  label: string;
  href: string;
}
export interface MenuColumn {
  title: string;
  href: string;
  links: MenuLink[];
}

const ws = (subject: string, type?: WorksheetTemplate) => `/worksheets?subject=${subject}${type ? `&type=${type}` : ""}`;

export const worksheetMenu: MenuColumn[] = [
  {
    title: "الفبای فارسی",
    href: ws("persian-letters"),
    links: [
      { label: "نوشتن حروف", href: ws("persian-letters", "letter-trace") },
      { label: "پیدا کردن حرف", href: ws("persian-letters", "find-letter") },
      { label: "صدای اول کلمه", href: ws("persian-letters", "beginning-sound") },
      { label: "حرف جاافتاده", href: ws("persian-letters", "missing-letter") },
      { label: "وصل کردن حرف و تصویر", href: ws("persian-letters", "letter-match") },
    ],
  },
  {
    title: "الفبای انگلیسی",
    href: ws("english-letters"),
    links: [
      { label: "نوشتن حروف", href: ws("english-letters", "letter-trace") },
      { label: "پیدا کردن حرف", href: ws("english-letters", "find-letter") },
      { label: "صدای اول کلمه", href: ws("english-letters", "beginning-sound") },
      { label: "حرف جاافتاده", href: ws("english-letters", "missing-letter") },
      { label: "حرف بزرگ و کوچک", href: ws("english-letters", "letter-match") },
    ],
  },
  {
    title: "اعداد و شمارش",
    href: ws("numbers"),
    links: [
      { label: "نوشتن اعداد", href: ws("numbers", "number-trace") },
      { label: "شمارش", href: ws("numbers", "counting") },
      { label: "عدد جاافتاده", href: ws("numbers", "missing-number") },
    ],
  },
  {
    title: "ریاضی و ساعت",
    href: ws("math"),
    links: [
      { label: "جمع", href: ws("math", "addition") },
      { label: "تفریق", href: ws("math", "subtraction") },
      { label: "بزرگ‌تر و کوچک‌تر", href: ws("math", "compare") },
      { label: "خواندن ساعت", href: ws("math", "clock") },
    ],
  },
  {
    title: "منطق و الگو",
    href: ws("logic"),
    links: [
      { label: "الگوها", href: ws("logic", "pattern") },
      { label: "سودوکوی تصویری", href: ws("logic", "sudoku") },
      { label: "کدام فرق دارد؟", href: ws("logic", "odd-one-out") },
      { label: "تطبیق و سایه", href: ws("logic", "matching") },
    ],
  },
  {
    title: "ماز، نقطه و شکل",
    href: ws("mazes-tracing"),
    links: [
      { label: "ماز", href: ws("mazes-tracing", "maze") },
      { label: "نقطه به نقطه", href: ws("mazes-tracing", "dot-to-dot") },
      { label: "ردگیری شکل‌ها", href: ws("mazes-tracing", "shapes") },
    ],
  },
  {
    title: "رنگ‌آمیزی و واژه",
    href: ws("coloring"),
    links: [
      { label: "رنگ‌آمیزی", href: ws("coloring") },
      { label: "جدول کلمات", href: ws("word-puzzles", "word-search") },
    ],
  },
];

/** میان‌بُر سنی در پایین مگامنو */
export const ageMenu: MenuLink[] = [
  { label: "۲ تا ۳ سال", href: "/worksheets?age=3" },
  { label: "۴ تا ۵ سال (پیش‌دبستانی)", href: "/worksheets?age=5" },
  { label: "۶ تا ۷ سال (کلاس اول)", href: "/worksheets?age=7" },
  { label: "۸ تا ۱۰ سال", href: "/worksheets?age=9" },
];

export const learnMenu: MenuColumn[] = [
  {
    title: "زبان",
    href: "/learn",
    links: [
      { label: "الفبای فارسی", href: "/learn#alphabet" },
      { label: "الفبای انگلیسی", href: "/learn#english-alphabet" },
    ],
  },
  {
    title: "عدد و ریاضی",
    href: "/learn",
    links: [
      { label: "اعداد و شمارش", href: "/learn#numbers" },
      { label: "ریاضی", href: "/learn#math" },
      { label: "شکل‌ها و رنگ‌ها", href: "/learn#shapes-colors" },
    ],
  },
  {
    title: "دنیای اطراف",
    href: "/learn",
    links: [{ label: "علوم و طبیعت", href: "/learn#science" }],
  },
];
