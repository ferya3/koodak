import type { Difficulty, ToneKey, Worksheet, WorksheetTemplate } from "@kidsworld/types";
import { enLetters, faLetters, iconThemes, type IconTheme } from "./alphabet";

/**
 * تولید خودکار کتابخانه‌ی کاربرگ از روی داده‌ی پایه (الفبا، اعداد، موضوع‌ها).
 * هر کاربرگ = یک قالب + پارامتر؛ تصویرها همیشه از سیستم طراحی رندر می‌شوند.
 * خروجی به Seed بک‌اند هم صادر می‌شود (pnpm seed:export) و از CMS قابل ویرایش است.
 */

const fa = (n: number | string) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
const ag = (min: number, max: number) => Array.from({ length: Math.max(1, max - min) }, (_, i) => `ag-${min + i}`);
/** شمارنده‌ی دانلود قابل تکرار (برای نمایش محبوبیت در داده‌ی نمونه) */
const pop = (slug: string) => 300 + ([...slug].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % 4200);

interface Opts {
  subject: string;
  min: number;
  max: number;
  difficulty: Difficulty;
  tone: ToneKey;
  skills: string[];
  premium?: boolean;
  minutes?: number;
}

function ws(slug: string, title: string, description: string, template: WorksheetTemplate, params: Worksheet["params"], o: Opts): Worksheet {
  return {
    id: `w-${slug}`,
    slug,
    type: "worksheet",
    title,
    description,
    categoryId: "c-sheets",
    subjectId: o.subject,
    ageGroupIds: ag(o.min, o.max),
    minAge: o.min,
    maxAge: o.max,
    difficulty: o.difficulty,
    estimatedMinutes: o.minutes ?? 10,
    access: o.premium ? "premium" : "free",
    status: "published",
    skills: o.skills.map((skillId, i) => ({ skillId, weight: i === 0 ? 1 : 0.5 })),
    tone: o.tone,
    publishedAt: "2026-11-15",
    template,
    params,
    pageCount: 1,
    paperSize: "A4",
    orientation: "portrait",
    downloadCount: pop(slug),
  };
}

const chunk = <T,>(arr: T[], n: number) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n));
const themeTitle = (t: IconTheme) => iconThemes[t].title;

/* ── الفبای فارسی ── */
const faSheets: Worksheet[] = [
  ...faLetters.flatMap((l, i) => [
    ws(`fa-trace-${l.slug}`, `نوشتن حرف «${l.char}»`, `شکل‌های حرف «${l.char}» و کلمه‌ی «${l.word}» را ردگیری کن.`, "letter-trace", { alphabet: "fa", index: i },
      { subject: "ws-fa", min: 5, max: 7, difficulty: "beginner", tone: "sky", skills: ["s-letters", "s-motor"] }),
    ws(`fa-find-${l.slug}`, `حرف «${l.char}» را پیدا کن`, `همه‌ی «${l.char}»ها را در جدول حروف پیدا کن و بشمار.`, "find-letter", { alphabet: "fa", index: i, seed: i + 3 },
      { subject: "ws-fa", min: 5, max: 8, difficulty: "easy", tone: "sky", skills: ["s-letters", "s-attention"], minutes: 8 }),
  ]),
  ...chunk(faLetters.map((_, i) => i), 6).flatMap((g, k) => [
    ws(`fa-sound-${k + 1}`, `صدای اول کلمه‌ها (${fa(k + 1)})`, `حروف «${faLetters[g[0]].char}» تا «${faLetters[g[g.length - 1]].char}»: هر تصویر با کدام حرف شروع می‌شود؟`, "beginning-sound", { alphabet: "fa", from: g[0], size: g.length, seed: k + 1 },
      { subject: "ws-fa", min: 5, max: 7, difficulty: "easy", tone: "berry", skills: ["s-letters", "s-listening"] }),
    ws(`fa-match-${k + 1}`, `حرف و تصویر (${fa(k + 1)})`, `هر حرف را به تصویری که با آن شروع می‌شود وصل کن.`, "letter-match", { alphabet: "fa", from: g[0], seed: k + 2 },
      { subject: "ws-fa", min: 5, max: 7, difficulty: "easy", tone: "berry", skills: ["s-letters", "s-memory"], premium: k >= 3 }),
  ]),
  ...[1, 2, 3, 4].map((k) =>
    ws(`fa-missing-${k}`, `حرف جاافتاده (${fa(k)})`, "حروف جاافتاده را به ترتیب الفبا بنویس.", "missing-letter", { alphabet: "fa", seed: k * 7 },
      { subject: "ws-fa", min: 6, max: 8, difficulty: k > 2 ? "intermediate" : "easy", tone: "grape", skills: ["s-letters", "s-pattern"], premium: k > 2 }),
  ),
];

/* ── الفبای انگلیسی ── */
const enSheets: Worksheet[] = [
  ...enLetters.flatMap((l, i) => [
    ws(`en-trace-${l.lower}`, `حرف ${l.upper}${l.lower} انگلیسی`, `حرف بزرگ و کوچک ${l.upper} و کلمه‌ی ${l.word} را بنویس.`, "letter-trace", { alphabet: "en", index: i },
      { subject: "ws-en", min: 5, max: 8, difficulty: "beginner", tone: "coral", skills: ["s-letters", "s-motor"] }),
    ws(`en-find-${l.lower}`, `پیدا کردن حرف ${l.upper}`, `همه‌ی ${l.upper}ها را در جدول پیدا کن.`, "find-letter", { alphabet: "en", index: i, seed: i + 5 },
      { subject: "ws-en", min: 5, max: 8, difficulty: "easy", tone: "coral", skills: ["s-letters", "s-attention"], minutes: 8 }),
  ]),
  ...chunk(enLetters.map((_, i) => i), 6).flatMap((g, k) => [
    ws(`en-sound-${k + 1}`, `Beginning sounds (${fa(k + 1)})`, `حروف ${enLetters[g[0]].upper} تا ${enLetters[g[g.length - 1]].upper}: صدای اول هر تصویر.`, "beginning-sound", { alphabet: "en", from: g[0], size: g.length, seed: k + 4 },
      { subject: "ws-en", min: 5, max: 8, difficulty: "easy", tone: "peach", skills: ["s-letters", "s-listening"] }),
    ws(`en-match-${k + 1}`, `حرف بزرگ و کوچک (${fa(k + 1)})`, "هر حرف بزرگ انگلیسی را به حرف کوچکش وصل کن.", "letter-match", { alphabet: "en", from: g[0], seed: k + 9 },
      { subject: "ws-en", min: 5, max: 8, difficulty: "easy", tone: "peach", skills: ["s-letters", "s-memory"], premium: k >= 3 }),
  ]),
  ...[1, 2, 3, 4].map((k) =>
    ws(`en-missing-${k}`, `Missing letters (${fa(k)})`, "حروف جاافتاده‌ی الفبای انگلیسی را بنویس.", "missing-letter", { alphabet: "en", seed: k * 11 },
      { subject: "ws-en", min: 6, max: 9, difficulty: k > 2 ? "intermediate" : "easy", tone: "grape", skills: ["s-letters", "s-pattern"], premium: k > 2 }),
  ),
];

/* ── اعداد و شمارش ── */
const countThemes: IconTheme[] = ["fruits", "animals", "birds", "sea", "vehicles", "food", "sky", "things"];
const numberSheets: Worksheet[] = [
  ...Array.from({ length: 11 }, (_, n) =>
    ws(`number-${n}`, `نوشتن عدد ${fa(n)}`, `عدد ${fa(n)} را بشمار، ببین و بنویس.`, "number-trace", { digit: n, script: "fa", theme: countThemes[n % countThemes.length] },
      { subject: "ws-numbers", min: 3, max: 6, difficulty: "beginner", tone: "peach", skills: ["s-number", "s-motor"] }),
  ),
  ...Array.from({ length: 11 }, (_, n) =>
    ws(`number-en-${n}`, `Number ${n}`, `عدد ${n} انگلیسی را بنویس و بشمار.`, "number-trace", { digit: n, script: "en", theme: countThemes[(n + 3) % countThemes.length] },
      { subject: "ws-numbers", min: 5, max: 8, difficulty: "beginner", tone: "coral", skills: ["s-number", "s-motor"] }),
  ),
  ...countThemes.flatMap((t, i) => [
    ws(`count-${t}-5`, `بشمار تا ۵: ${themeTitle(t)}`, `${themeTitle(t)} را بشمار و عددش را بنویس.`, "counting", { max: 5, rows: 5, seed: i + 31, theme: t },
      { subject: "ws-numbers", min: 3, max: 5, difficulty: "beginner", tone: "ocean", skills: ["s-number", "s-attention"], minutes: 6 }),
    ws(`count-${t}-10`, `بشمار تا ۱۰: ${themeTitle(t)}`, `${themeTitle(t)} را تا ۱۰ بشمار و عددش را بنویس.`, "counting", { max: 10, rows: 5, seed: i + 61, theme: t },
      { subject: "ws-numbers", min: 5, max: 7, difficulty: "easy", tone: "ocean", skills: ["s-number", "s-attention"], minutes: 8, premium: i >= 5 }),
  ]),
  ...([[10, 1], [20, 1], [50, 1], [100, 1], [20, 2], [50, 5], [100, 10]] as const).flatMap(([max, step], i) =>
    [1, 2].map((k) =>
      ws(`missing-number-${max}-${step}-${k}`, step === 1 ? `عدد جاافتاده تا ${fa(max)} (${fa(k)})` : `${fa(step)} تا ${fa(step)} تا بشمار (${fa(k)})`,
        step === 1 ? `عددهای جاافتاده‌ی ۱ تا ${fa(max)} را بنویس.` : `شمارش چندتایی: ${fa(step)} تا ${fa(step)} تا تا ${fa(max)}.`,
        "missing-number", { max, step, seed: i * 10 + k },
        { subject: "ws-numbers", min: max <= 20 ? 5 : 6, max: max <= 20 ? 7 : 9, difficulty: step > 1 || max >= 50 ? "intermediate" : "easy", tone: "grass", skills: ["s-number", "s-pattern"], premium: k === 2 && max >= 50 }),
    ),
  ),
];

/* ── ریاضی و ساعت ── */
const mathSheets: Worksheet[] = [
  ...[5, 10, 20].flatMap((max) =>
    [1, 2, 3].map((k) =>
      ws(`addition-${max}-${k}`, `جمع تا ${fa(max)} (${fa(k)})`, `جمع‌های ساده تا ${fa(max)} با کمک نقطه‌ها.`, "addition", { max, count: max <= 10 ? 8 : 12, seed: max * 10 + k },
        { subject: "ws-math", min: max <= 10 ? 5 : 7, max: max <= 10 ? 7 : 9, difficulty: max === 5 ? "beginner" : max === 10 ? "easy" : "intermediate", tone: "ocean", skills: ["s-number"], premium: k === 3 }),
    ),
  ),
  ...[5, 10, 20].flatMap((max) =>
    [1, 2, 3].map((k) =>
      ws(`subtraction-${max}-${k}`, `تفریق تا ${fa(max)} (${fa(k)})`, `تفریق‌های ساده تا ${fa(max)}؛ تصویرها را خط بزن.`, "subtraction", { max, seed: max * 7 + k, theme: countThemes[k] },
        { subject: "ws-math", min: max <= 10 ? 5 : 7, max: max <= 10 ? 7 : 9, difficulty: max === 5 ? "easy" : max === 10 ? "easy" : "intermediate", tone: "coral", skills: ["s-number", "s-attention"], premium: k === 3 }),
    ),
  ),
  ...[10, 20, 100].flatMap((max) =>
    [1, 2].map((k) =>
      ws(`compare-${max}-${k}`, `بزرگ‌تر، کوچک‌تر، مساوی تا ${fa(max)} (${fa(k)})`, `عددها را با > و < و = مقایسه کن.`, "compare", { max, mode: "numbers", seed: max + k },
        { subject: "ws-math", min: max === 100 ? 7 : 6, max: max === 100 ? 9 : 8, difficulty: max === 100 ? "intermediate" : "easy", tone: "grape", skills: ["s-number", "s-pattern"] }),
    ),
  ),
  ...[1, 2, 3].map((k) =>
    ws(`compare-groups-${k}`, `کدام بیشتر است؟ (${fa(k)})`, "گروه‌های تصویر را بشمار و مقایسه کن.", "compare", { max: 8, mode: "groups", seed: 70 + k, theme: ["animals", "fruits", "birds"][k - 1] },
      { subject: "ws-math", min: 4, max: 6, difficulty: "beginner", tone: "grape", skills: ["s-number", "s-attention"] }),
  ),
  ...(["hour", "half", "quarter"] as const).flatMap((mode, i) =>
    [1, 2].map((k) =>
      ws(`clock-${mode}-${k}`, `خواندن ساعت: ${mode === "hour" ? "ساعت کامل" : mode === "half" ? "نیم ساعت" : "ربع ساعت"} (${fa(k)})`, "ساعت را بخوان و زمان را بنویس.", "clock", { mode, seed: i * 10 + k },
        { subject: "ws-math", min: 6, max: 9, difficulty: mode === "hour" ? "easy" : mode === "half" ? "intermediate" : "advanced", tone: "sky", skills: ["s-number", "s-spatial"], premium: mode === "quarter" }),
    ),
  ),
];

/* ── منطق و الگو ── */
const patternThemes: IconTheme[] = ["fruits", "animals", "vehicles", "sky"];
const logicSheets: Worksheet[] = [
  ...[1, 2, 3].flatMap((level) =>
    patternThemes.map((t, i) =>
      ws(`pattern-${level}-${t}`, `الگو را کامل کن: ${themeTitle(t)} (سطح ${fa(level)})`, "بعدی کدام است؟ الگو را پیدا کن.", "pattern", { level, theme: t, seed: level * 10 + i },
        { subject: "ws-logic", min: 3 + level, max: 6 + level, difficulty: level === 1 ? "easy" : level === 2 ? "intermediate" : "advanced", tone: "sun", skills: ["s-pattern", "s-attention"], premium: level === 3 }),
    ),
  ),
  ...(["fruits", "animals", "sky", "birds"] as IconTheme[]).flatMap((t, i) => [
    ws(`sudoku-${t}-easy`, `سودوکوی تصویری: ${themeTitle(t)}`, "سودوکوی ۴×۴ با تصویر؛ مناسب شروع.", "sudoku", { theme: t, blanks: 4, seed: 100 + i },
      { subject: "ws-logic", min: 5, max: 8, difficulty: "easy", tone: "lilac", skills: ["s-pattern", "s-spatial"] }),
    ws(`sudoku-${t}-hard`, `سودوکوی تصویری سخت: ${themeTitle(t)}`, "خانه‌های خالی بیشتر؛ دقت کن!", "sudoku", { theme: t, blanks: 8, seed: 200 + i },
      { subject: "ws-logic", min: 7, max: 10, difficulty: "intermediate", tone: "lilac", skills: ["s-pattern", "s-spatial"], premium: true }),
  ]),
  ...Array.from({ length: 6 }, (_, k) =>
    ws(`odd-one-out-${k + 1}`, `کدام فرق دارد؟ (${fa(k + 1)})`, "در هر ردیف، تصویری را که با بقیه فرق دارد پیدا کن.", "odd-one-out", { seed: 300 + k },
      { subject: "ws-logic", min: 4, max: 7, difficulty: k < 3 ? "easy" : "intermediate", tone: "mint", skills: ["s-pattern", "s-attention"], premium: k >= 4 }),
  ),
  ...(["animals", "fruits", "birds", "food", "things"] as IconTheme[]).map((t, i) =>
    ws(`shadow-match-${t}`, `تصویر و سایه: ${themeTitle(t)}`, "هر تصویر را به سایه‌ی خودش وصل کن.", "matching", { theme: t, seed: 400 + i },
      { subject: "ws-logic", min: 3, max: 6, difficulty: "beginner", tone: "berry", skills: ["s-spatial", "s-attention"] }),
  ),
];

/* ── ماز، نقطه‌به‌نقطه و شکل‌ها ── */
const mazeThemes = [
  { key: "rabbit", start: "rabbit", goal: "carrot", hint: "خرگوش به هویج" },
  { key: "bee", start: "bee", goal: "flower", hint: "زنبور به گل" },
  { key: "rocket", start: "rocket", goal: "moon", hint: "موشک به ماه" },
  { key: "dog", start: "dog", goal: "house", hint: "سگ به خانه" },
] as const;
const motorSheets: Worksheet[] = [
  ...[5, 7, 9, 11, 13, 15].flatMap((size) =>
    mazeThemes.map((m, i) =>
      ws(`maze-${m.key}-${size}`, `ماز ${fa(size)}×${fa(size)}: ${m.hint}`, `کمک کن ${m.hint} برسد.`, "maze", { size, seed: size * 13 + i, start: m.start, goal: m.goal, hint: m.hint },
        { subject: "ws-motor", min: size <= 7 ? 4 : size <= 11 ? 6 : 8, max: size <= 7 ? 6 : size <= 11 ? 9 : 10, difficulty: size <= 7 ? "easy" : size <= 11 ? "intermediate" : "advanced", tone: "grass", skills: ["s-spatial", "s-motor"], premium: size >= 13 }),
    ),
  ),
  ...(["star", "house", "heart", "diamond", "fish", "boat", "kite", "tree", "crown", "rocket"] as const).map((shape, i) =>
    ws(`connect-dots-${shape}`, `نقطه به نقطه: ${({ star: "ستاره", house: "خانه", heart: "قلب", diamond: "الماس", fish: "ماهی", boat: "قایق", kite: "بادبادک", tree: "درخت", crown: "تاج", rocket: "موشک" } as const)[shape]}`,
      "نقطه‌ها را به ترتیب عدد وصل کن تا تصویر پیدا شود.", "dot-to-dot", { shape, hint: i < 3 },
      { subject: "ws-motor", min: 4, max: 7, difficulty: i < 4 ? "easy" : "intermediate", tone: "grape", skills: ["s-number", "s-motor"] }),
  ),
  ws("shapes-basic", "ردگیری شکل‌ها: دایره، مربع، مثلث، ستاره", "روی شکل‌ها بکش و نام آن‌ها را یاد بگیر.", "shapes", { shapes: "circle,square,triangle,star" },
    { subject: "ws-motor", min: 3, max: 5, difficulty: "beginner", tone: "sun", skills: ["s-spatial", "s-motor"] }),
  ws("shapes-more", "ردگیری شکل‌ها: مستطیل، قلب، لوزی، بیضی", "شکل‌های بیشتر را ردگیری کن.", "shapes", { shapes: "rectangle,heart,diamond,oval" },
    { subject: "ws-motor", min: 4, max: 6, difficulty: "easy", tone: "sun", skills: ["s-spatial", "s-motor"] }),
  ws("shapes-all", "همه‌ی شکل‌ها", "شش شکل را ردگیری و رنگ کن.", "shapes", { shapes: "circle,square,triangle,rectangle,heart,star" },
    { subject: "ws-motor", min: 4, max: 6, difficulty: "easy", tone: "sun", skills: ["s-spatial", "s-motor"], premium: true }),
];

/* ── رنگ‌آمیزی ── */
const coloringSheets: Worksheet[] = (Object.keys(iconThemes) as IconTheme[]).flatMap((t, i) =>
  [1, 2].map((k) =>
    ws(`coloring-${t}-${k}`, `رنگ‌آمیزی: ${themeTitle(t)} (${fa(k)})`, `${themeTitle(t)} را با رنگ‌های دلخواهت رنگ کن.`, "coloring", { theme: t, seed: i * 10 + k },
      { subject: "ws-coloring", min: 2, max: 6, difficulty: "beginner", tone: "mint", skills: ["s-creativity", "s-motor"], minutes: 15, premium: k === 2 && i % 2 === 1 }),
  ),
);

/* ── جدول کلمات ── */
const vocabSheets: Worksheet[] = [
  ...(["animals", "fruits", "birds", "food", "things", "sky"] as IconTheme[]).map((t, i) =>
    ws(`word-search-fa-${t}`, `جدول کلمات: ${themeTitle(t)}`, `نام ${themeTitle(t)} را در جدول حروف پیدا کن.`, "word-search", { alphabet: "fa", theme: t, seed: 500 + i },
      { subject: "ws-vocab", min: 7, max: 10, difficulty: i < 3 ? "intermediate" : "advanced", tone: "ocean", skills: ["s-letters", "s-attention"], minutes: 15, premium: i >= 4 }),
  ),
  ...(["animals", "fruits", "birds", "food", "vehicles", "sky"] as IconTheme[]).map((t, i) =>
    ws(`word-search-en-${t}`, `Word search: ${themeTitle(t)}`, `نام انگلیسی ${themeTitle(t)} را پیدا کن.`, "word-search", { alphabet: "en", theme: t, seed: 600 + i },
      { subject: "ws-vocab", min: 7, max: 10, difficulty: "intermediate", tone: "ocean", skills: ["s-letters", "s-attention"], minutes: 15, premium: i >= 4 }),
  ),
];

export const generatedWorksheets: Worksheet[] = [...faSheets, ...enSheets, ...numberSheets, ...mathSheets, ...logicSheets, ...motorSheets, ...coloringSheets, ...vocabSheets];
