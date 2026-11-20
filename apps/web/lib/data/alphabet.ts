import type { PlayIconKey } from "@/components/brand/PlayIcon";

/**
 * داده‌ی پایه‌ی الفبا – منبع تولید خودکار کاربرگ‌ها، درس‌ها و بازی‌های حروف.
 * هر حرف یک کلمه‌ی نمونه با تصویر (آیکون سیستم طراحی) دارد که با همان حرف شروع می‌شود.
 */

export interface FaLetter {
  /** نامک لاتین برای آدرس (letter-be) */
  slug: string;
  char: string;
  /** نام حرف برای خواندن با صدا */
  name: string;
  /** حروف «دندانه‌دار» به حرف بعدی می‌چسبند؛ ا د ذ ر ز ژ و فقط دو شکل دارند */
  joins: boolean;
  word: string;
  icon: PlayIconKey;
}

export const faLetters: FaLetter[] = [
  { slug: "alef", char: "ا", name: "اَلِف", joins: false, word: "اسب", icon: "horse" },
  { slug: "be", char: "ب", name: "بِ", joins: true, word: "بادکنک", icon: "balloon" },
  { slug: "pe", char: "پ", name: "پِ", joins: true, word: "پروانه", icon: "butterfly" },
  { slug: "te", char: "ت", name: "تِ", joins: true, word: "توپ", icon: "ball" },
  { slug: "se", char: "ث", name: "ثِ", joins: true, word: "ثانیه‌شمار", icon: "clock" },
  { slug: "jim", char: "ج", name: "جیم", joins: true, word: "جوجه", icon: "chick" },
  { slug: "che", char: "چ", name: "چِ", joins: true, word: "چتر", icon: "umbrella" },
  { slug: "he-jimi", char: "ح", name: "حِ", joins: true, word: "حلزون", icon: "snail" },
  { slug: "khe", char: "خ", name: "خِ", joins: true, word: "خرگوش", icon: "rabbit" },
  { slug: "dal", char: "د", name: "دال", joins: false, word: "درخت", icon: "tree" },
  { slug: "zal", char: "ذ", name: "ذال", joins: false, word: "ذرت", icon: "corn" },
  { slug: "re", char: "ر", name: "رِ", joins: false, word: "روباه", icon: "fox" },
  { slug: "ze", char: "ز", name: "زِ", joins: false, word: "زنبور", icon: "bee" },
  { slug: "zhe", char: "ژ", name: "ژِ", joins: false, word: "ژله", icon: "jelly" },
  { slug: "sin", char: "س", name: "سین", joins: true, word: "سیب", icon: "apple" },
  { slug: "shin", char: "ش", name: "شین", joins: true, word: "شیر", icon: "lion" },
  { slug: "sad", char: "ص", name: "صاد", joins: true, word: "صندلی", icon: "chair" },
  { slug: "zad", char: "ض", name: "ضاد", joins: true, word: "ضربان قلب", icon: "heart" },
  { slug: "ta", char: "ط", name: "طا", joins: true, word: "طوطی", icon: "parrot" },
  { slug: "za", char: "ظ", name: "ظا", joins: true, word: "ظرف", icon: "bowl" },
  { slug: "eyn", char: "ع", name: "عین", joins: true, word: "عینک", icon: "glasses" },
  { slug: "gheyn", char: "غ", name: "غین", joins: true, word: "غاز", icon: "goose" },
  { slug: "fe", char: "ف", name: "فِ", joins: true, word: "فیل", icon: "elephant" },
  { slug: "ghaf", char: "ق", name: "قاف", joins: true, word: "قایق", icon: "boat" },
  { slug: "kaf", char: "ک", name: "کاف", joins: true, word: "کتاب", icon: "book" },
  { slug: "gaf", char: "گ", name: "گاف", joins: true, word: "گل", icon: "flower" },
  { slug: "lam", char: "ل", name: "لام", joins: true, word: "لاک‌پشت", icon: "turtle" },
  { slug: "mim", char: "م", name: "میم", joins: true, word: "ماهی", icon: "fish" },
  { slug: "nun", char: "ن", name: "نون", joins: true, word: "نان", icon: "bread" },
  { slug: "vav", char: "و", name: "واو", joins: false, word: "وال", icon: "whale" },
  { slug: "he", char: "ه", name: "هِ", joins: true, word: "هویج", icon: "carrot" },
  { slug: "ye", char: "ی", name: "یِ", joins: true, word: "یخ", icon: "ice" },
];

/** شکل‌های نوشتاری حرف: جدا، اول، وسط، آخر (با کشیده‌ی ـ) */
export function faForms(l: FaLetter): string[] {
  return l.joins ? [l.char, `${l.char}ـ`, `ـ${l.char}ـ`, `ـ${l.char}`] : [l.char, `ـ${l.char}`];
}

export interface EnLetter {
  upper: string;
  lower: string;
  word: string;
  icon: PlayIconKey;
}

export const enLetters: EnLetter[] = [
  ["A", "apple", "apple"], ["B", "ball", "ball"], ["C", "cat", "cat"], ["D", "dog", "dog"], ["E", "egg", "egg"],
  ["F", "fish", "fish"], ["G", "grapes", "grapes"], ["H", "hat", "hat"], ["I", "ice cream", "icecream"], ["J", "jelly", "jelly"],
  ["K", "kite", "kite"], ["L", "lion", "lion"], ["M", "moon", "moon"], ["N", "nest", "nest"], ["O", "orange", "orange"],
  ["P", "pig", "pig"], ["Q", "queen's crown", "crown"], ["R", "rabbit", "rabbit"], ["S", "sun", "sun"], ["T", "tree", "tree"],
  ["U", "umbrella", "umbrella"], ["V", "van", "van"], ["W", "whale", "whale"], ["X", "xylophone", "xylophone"], ["Y", "yo-yo", "yoyo"],
  ["Z", "zebra", "zebra"],
].map(([upper, word, icon]) => ({ upper, lower: upper.toLowerCase(), word, icon: icon as PlayIconKey }));

/** گروه‌های موضوعی اشیا – برای شمارش، رنگ‌آمیزی، «کدام فرق دارد» و جدول کلمات */
export const iconThemes = {
  animals: { title: "حیوانات", icons: ["cat", "dog", "rabbit", "fox", "lion", "elephant", "zebra", "pig", "horse", "turtle"] },
  fruits: { title: "میوه‌ها", icons: ["apple", "banana", "grapes", "orange", "strawberry", "watermelon", "pear"] },
  vehicles: { title: "وسایل نقلیه", icons: ["car", "bus", "van", "boat", "rocket"] },
  birds: { title: "پرنده‌ها و حشره‌ها", icons: ["bird", "duck", "owl", "parrot", "chick", "goose", "bee", "butterfly"] },
  sea: { title: "دریا", icons: ["fish", "whale", "boat", "turtle", "snail"] },
  food: { title: "خوراکی‌ها", icons: ["bread", "cheese", "egg", "cake", "icecream", "jelly", "carrot", "corn"] },
  things: { title: "وسایل خانه و مدرسه", icons: ["book", "pencil", "chair", "clock", "key", "bell", "umbrella", "glasses", "bowl"] },
  sky: { title: "آسمان", icons: ["sun", "moon", "star", "cloud", "rocket", "kite", "balloon"] },
} satisfies Record<string, { title: string; icons: PlayIconKey[] }>;

export type IconTheme = keyof typeof iconThemes;
