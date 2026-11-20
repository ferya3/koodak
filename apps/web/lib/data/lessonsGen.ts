import type { Lesson, LessonStep, ToneKey } from "@kidsworld/types";
import { enLetters, faForms, faLetters, iconThemes } from "./alphabet";

/**
 * تولید خودکار درس‌های آکادمی: ۳۲ حرف فارسی، ۲۶ حرف انگلیسی، اعداد ۱ تا ۱۰.
 * پاسخ درست همیشه گزینه‌ی «a» است و ترتیب نمایش گزینه‌ها با seed ثابت جابه‌جا می‌شود.
 */
const ag = (min: number, max: number) => Array.from({ length: max - min }, (_, i) => `ag-${min + i}`);
const fa = (n: number) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

/** جابه‌جایی قطعی بر اساس عدد (برای اینکه گزینه‌ی درست همیشه اول نباشد) */
function rotate<T>(arr: T[], k: number): T[] {
  const n = k % arr.length;
  return [...arr.slice(n), ...arr.slice(0, n)];
}

function lesson(slug: string, title: string, description: string, subjectId: string, tone: ToneKey, min: number, max: number, skills: string[], objectives: string[], steps: LessonStep[], order: number): Lesson {
  return {
    id: `l-${slug}`,
    slug,
    type: "lesson",
    title,
    description,
    categoryId: "c-learn",
    subjectId,
    ageGroupIds: ag(min, max),
    minAge: min,
    maxAge: max,
    difficulty: order < 8 ? "beginner" : order < 20 ? "easy" : "intermediate",
    estimatedMinutes: 4,
    access: order >= 24 ? "premium" : "free",
    status: "published",
    skills: skills.map((skillId, i) => ({ skillId, weight: i === 0 ? 1 : 0.5 })),
    tone,
    publishedAt: "2026-11-15",
    objectives,
    prerequisiteIds: [],
    steps,
  };
}

/* ── حروف فارسی ── */
export const faLetterLessons: Lesson[] = faLetters.map((l, i) => {
  const near = [faLetters[(i + 1) % faLetters.length], faLetters[(i + faLetters.length - 1) % faLetters.length]];
  const others = [faLetters[(i + 5) % faLetters.length], faLetters[(i + 11) % faLetters.length]];
  const forms = faForms(l);
  return lesson(
    `letter-${l.slug}`,
    `حرف «${l.char}» مثل ${l.word}`,
    `با حرف «${l.char}» آشنا شو، شکل‌هایش را ببین و کلمه‌هایی که با آن شروع می‌شوند را پیدا کن.`,
    "sub-letters",
    "sky",
    4,
    7,
    ["s-letters", "s-listening"],
    [`شناخت شکل حرف «${l.char}»`, `تشخیص صدای «${l.char}» در اول کلمه`],
    [
      { id: "s1", type: "explain", title: `سلام حرف «${l.char}»!`, body: `این حرف «${l.name}» است. بلند بگو: ${l.name}!`, visual: { kind: "letter", value: l.char, word: l.word } },
      {
        id: "s2",
        type: "explain",
        title: "شکل‌های حرف",
        body: l.joins
          ? `«${l.char}» به حرف بعدی می‌چسبد و ${fa(forms.length)} شکل دارد: تنها، اول کلمه، وسط کلمه و آخر کلمه.`
          : `«${l.char}» به حرف بعدی نمی‌چسبد؛ برای همین فقط دو شکل دارد.`,
        visual: { kind: "forms", forms },
      },
      { id: "s3", type: "explain", title: `«${l.char}» مثل ${l.word}`, body: `${l.word} با صدای «${l.char}» شروع می‌شود. تو هم بگو: ${l.word}!`, visual: { kind: "icons", icons: [l.icon] } },
      {
        id: "s4",
        type: "quiz",
        title: "پیدایش کن!",
        body: "",
        question: {
          prompt: `کدام حرف «${l.char}» است؟`,
          answerId: "a",
          options: rotate([{ id: "a", label: l.char, visual: { kind: "letter" as const, value: l.char } }, ...near.map((n, k) => ({ id: "bc"[k], label: n.char, visual: { kind: "letter" as const, value: n.char } }))], i),
        },
      },
      {
        id: "s5",
        type: "quiz",
        title: "گوش کن و انتخاب کن",
        body: "",
        question: {
          prompt: `کدام تصویر با صدای «${l.char}» شروع می‌شود؟`,
          answerId: "a",
          options: rotate([{ id: "a", label: l.word, visual: { kind: "icons" as const, icons: [l.icon] } }, ...others.map((n, k) => ({ id: "bc"[k], label: n.word, visual: { kind: "icons" as const, icons: [n.icon] } }))], i + 1),
        },
      },
    ],
    i,
  );
});

/* ── حروف انگلیسی ── */
export const enLetterLessons: Lesson[] = enLetters.map((l, i) => {
  const near = [enLetters[(i + 1) % 26], enLetters[(i + 25) % 26]];
  const others = [enLetters[(i + 7) % 26], enLetters[(i + 13) % 26]];
  return lesson(
    `english-${l.lower}`,
    `حرف ${l.upper}${l.lower} انگلیسی`,
    `حرف ${l.upper} بزرگ و ${l.lower} کوچک را بشناس. ${l.upper} is for ${l.word}!`,
    "sub-english",
    "coral",
    5,
    9,
    ["s-letters", "s-listening"],
    [`شناخت حرف بزرگ ${l.upper} و کوچک ${l.lower}`, `کلمه‌ی ${l.word}`],
    [
      { id: "s1", type: "explain", title: `Hello ${l.upper}!`, body: `این حرف ${l.upper} انگلیسی است. حرف کوچکش ${l.lower} است.`, visual: { kind: "forms", forms: [l.upper, l.lower], ltr: true } },
      { id: "s2", type: "explain", title: `${l.upper} is for ${l.word}`, body: `${l.word} با حرف ${l.upper} شروع می‌شود.`, visual: { kind: "icons", icons: [l.icon] } },
      {
        id: "s3",
        type: "quiz",
        title: "حرف بزرگ",
        body: "",
        question: { prompt: `کدام حرف ${l.upper} بزرگ است؟`, answerId: "a", options: rotate([{ id: "a", label: l.upper }, ...near.map((n, k) => ({ id: "bc"[k], label: n.upper }))], i) },
      },
      {
        id: "s4",
        type: "quiz",
        title: "حرف کوچک",
        body: "",
        question: { prompt: `حرف کوچک ${l.upper} کدام است؟`, answerId: "a", options: rotate([{ id: "a", label: l.lower }, ...near.map((n, k) => ({ id: "bc"[k], label: n.lower }))], i + 2) },
      },
      {
        id: "s5",
        type: "quiz",
        title: "تصویر",
        body: "",
        question: {
          prompt: `کدام تصویر با ${l.upper} شروع می‌شود؟`,
          answerId: "a",
          options: rotate([{ id: "a", label: l.word, visual: { kind: "icons" as const, icons: [l.icon] } }, ...others.map((n, k) => ({ id: "bc"[k], label: n.word, visual: { kind: "icons" as const, icons: [n.icon] } }))], i + 1),
        },
      },
    ],
    i,
  );
});

/* ── اعداد ۱ تا ۱۰ ── */
const NAMES = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه", "ده"];
const numberIcons = [...iconThemes.fruits.icons, ...iconThemes.animals.icons];
export const numberLessons: Lesson[] = Array.from({ length: 10 }, (_, k) => {
  const n = k + 1;
  const icon = numberIcons[k % numberIcons.length];
  const opts = [n, n === 1 ? 3 : n - 1, n === 10 ? 8 : n + 1];
  return lesson(
    `number-lesson-${n}`,
    `عدد ${fa(n)} (${NAMES[n]})`,
    `عدد ${fa(n)} را ببین، بشمار و در بازی پیدایش کن.`,
    "sub-numbers",
    "peach",
    3,
    6,
    ["s-number", "s-attention"],
    [`شناخت عدد ${fa(n)}`, `شمردن ${fa(n)} شیء`],
    [
      { id: "s1", type: "explain", title: `این عدد ${NAMES[n]} است`, body: `${fa(n)} یعنی ${NAMES[n]} تا. بیا با هم بشماریم!`, visual: { kind: "number", value: n, icon } },
      {
        id: "s2",
        type: "quiz",
        title: "بشمار",
        body: "",
        visual: { kind: "icons", icons: Array.from({ length: n }, () => icon) },
        question: { prompt: "چند تا می‌بینی؟", answerId: "a", options: rotate(opts.map((v, j) => ({ id: "abc"[j], label: fa(v) })), k) },
      },
      {
        id: "s3",
        type: "quiz",
        title: "کدام گروه؟",
        body: "",
        question: {
          prompt: `کدام گروه ${NAMES[n]} تاست؟`,
          answerId: "a",
          options: rotate(opts.map((v, j) => ({ id: "abc"[j], label: `${fa(v)} تا`, visual: { kind: "icons" as const, icons: Array.from({ length: v }, () => "star") } })), k + 1),
        },
      },
    ],
    k,
  );
});

export const generatedLessons: Lesson[] = [...faLetterLessons, ...enLetterLessons, ...numberLessons];
