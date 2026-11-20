import type { Game, Story, Worksheet, Difficulty, ToneKey, AccessLevel, WorksheetTemplate } from "@kidsworld/types";
import { generatedWorksheets } from "./catalog";
import { moreStories } from "./storiesMore";

const ag = (min: number, max: number) =>
  Array.from({ length: max - min }, (_, i) => `ag-${min + i}`);

function ws(
  slug: string,
  title: string,
  description: string,
  template: WorksheetTemplate,
  params: Worksheet["params"],
  o: { min: number; max: number; difficulty: Difficulty; tone: ToneKey; access?: AccessLevel; skills: string[]; minutes?: number; downloads?: number },
): Worksheet {
  return {
    id: `w-${slug}`,
    slug,
    type: "worksheet",
    title,
    description,
    categoryId: "c-sheets",
    ageGroupIds: ag(o.min, o.max),
    minAge: o.min,
    maxAge: o.max,
    difficulty: o.difficulty,
    estimatedMinutes: o.minutes ?? 10,
    access: o.access ?? "free",
    status: "published",
    skills: o.skills.map((skillId, i) => ({ skillId, weight: i === 0 ? 1 : 0.5 })),
    tone: o.tone,
    publishedAt: "2026-10-01",
    template,
    params,
    pageCount: 1,
    paperSize: "A4",
    orientation: "portrait",
    downloadCount: o.downloads ?? 1200,
  };
}

const handmadeWorksheets: Worksheet[] = [
  ws("trace-alef", "ردگیری حرف «آ»", "با دنبال کردن خط‌چین‌ها، شکل حرف «آ» را یاد بگیر.", "tracing", { letter: "آ", word: "آب", rows: 4 }, { min: 4, max: 6, difficulty: "beginner", tone: "sky", skills: ["s-letters", "s-motor"], downloads: 4820 }),
  ws("trace-be", "ردگیری حرف «ب»", "تمرین نوشتن حرف «ب» در چهار ردیف.", "tracing", { letter: "ب", word: "بادکنک", rows: 4 }, { min: 4, max: 6, difficulty: "easy", tone: "sky", skills: ["s-letters", "s-motor"], downloads: 3110 }),
  ws("trace-numbers", "ردگیری اعداد ۱ تا ۵", "اعداد را با مداد دنبال کن و بلند بشمار.", "tracing", { letter: "۱۲۳۴۵", word: "", rows: 4 }, { min: 3, max: 5, difficulty: "beginner", tone: "peach", skills: ["s-number", "s-motor"], downloads: 5240 }),
  ws("count-apples", "بشمار و بنویس: میوه‌ها", "میوه‌های هر ردیف را بشمار و عددش را بنویس.", "counting", { max: 5, rows: 5, seed: 11 }, { min: 3, max: 5, difficulty: "beginner", tone: "coral", skills: ["s-number", "s-attention"], downloads: 6120 }),
  ws("count-to-ten", "بشمار تا ۱۰", "شمارش اشیا تا ۱۰ همراه با نوشتن عدد.", "counting", { max: 10, rows: 5, seed: 29 }, { min: 5, max: 7, difficulty: "easy", tone: "coral", skills: ["s-number", "s-attention"] }),
  ws("maze-easy", "ماز کوچک: راه خانه", "به خرگوش کمک کن راه خانه را پیدا کند.", "maze", { size: 7, seed: 3 }, { min: 4, max: 6, difficulty: "easy", tone: "grass", skills: ["s-spatial", "s-motor"], downloads: 7310 }),
  ws("maze-medium", "ماز جنگل", "یک ماز بزرگ‌تر با راه‌های پیچ‌درپیچ.", "maze", { size: 11, seed: 42 }, { min: 6, max: 8, difficulty: "intermediate", tone: "grass", skills: ["s-spatial", "s-attention"], downloads: 2980 }),
  ws("maze-hard", "ماز بزرگ قلعه", "چالش ماز برای کاشفان حرفه‌ای!", "maze", { size: 15, seed: 77 }, { min: 8, max: 10, difficulty: "advanced", tone: "grass", access: "premium", skills: ["s-spatial", "s-attention"] }),
  ws("dots-star", "نقطه به نقطه: ستاره", "نقطه‌ها را به ترتیب وصل کن تا یک ستاره ظاهر شود.", "dot-to-dot", { shape: "star" }, { min: 4, max: 6, difficulty: "easy", tone: "grape", skills: ["s-number", "s-motor"], downloads: 3890 }),
  ws("dots-house", "نقطه به نقطه: خانه", "یک خانه‌ی کوچک با وصل کردن نقطه‌ها بساز.", "dot-to-dot", { shape: "house" }, { min: 5, max: 7, difficulty: "intermediate", tone: "grape", skills: ["s-number", "s-motor"] }),
  ws("match-shapes", "تطبیق شکل‌ها", "هر شکل را به سایه‌ی خودش وصل کن.", "matching", { set: "shapes", seed: 5 }, { min: 3, max: 5, difficulty: "beginner", tone: "berry", skills: ["s-pattern", "s-spatial"], downloads: 4410 }),
  ws("color-garden", "رنگ‌آمیزی: باغ گل", "باغ را با رنگ‌های دلخواهت زنده کن.", "coloring", { scene: "garden" }, { min: 2, max: 5, difficulty: "beginner", tone: "mint", skills: ["s-creativity", "s-motor"], downloads: 8020 }),
  ws("add-within-10", "جمع تا ۱۰", "جمع‌های ساده با کمک تصویر.", "addition", { max: 10, count: 8, seed: 9 }, { min: 6, max: 8, difficulty: "easy", tone: "ocean", skills: ["s-number"], downloads: 3370 }),
  ws("add-within-20", "جمع تا ۲۰", "جمع‌های دو رقمی برای نوآموزان کلاس اول و دوم.", "addition", { max: 20, count: 12, seed: 18 }, { min: 7, max: 9, difficulty: "intermediate", tone: "ocean", access: "premium", skills: ["s-number", "s-attention"] }),
];

/** موضوع کتابخانه برای کاربرگ‌های دست‌ساز */
const SUBJECT_BY_TEMPLATE: Partial<Record<WorksheetTemplate, string>> = {
  tracing: "ws-fa", counting: "ws-numbers", maze: "ws-motor", "dot-to-dot": "ws-motor", matching: "ws-logic", coloring: "ws-coloring", addition: "ws-math",
};

export const worksheets: Worksheet[] = [
  ...handmadeWorksheets.map((w) => ({ ...w, subjectId: w.slug === "trace-numbers" ? "ws-numbers" : SUBJECT_BY_TEMPLATE[w.template] })),
  ...generatedWorksheets,
];

const handmadeGames: Game[] = [
  {
    id: "g-memory-animals",
    slug: "memory-garden",
    type: "game",
    title: "باغ حافظه",
    description: "کارت‌ها را برگردان و جفت‌های یکسان را پیدا کن. هرچه کمتر اشتباه کنی، ستاره‌ی بیشتری می‌گیری!",
    categoryId: "c-brain",
    ageGroupIds: ag(3, 8),
    minAge: 3,
    maxAge: 8,
    difficulty: "easy",
    estimatedMinutes: 5,
    access: "free",
    status: "published",
    skills: [{ skillId: "s-memory", weight: 1 }, { skillId: "s-attention", weight: 0.6 }],
    tone: "grape",
    publishedAt: "2026-09-12",
    gameType: "memory",
    engine: "react-svg",
    levels: [
      { levelNumber: 1, difficulty: "beginner", configuration: { pairs: 3, cols: 3 } },
      { levelNumber: 2, difficulty: "easy", configuration: { pairs: 6, cols: 4 } },
      { levelNumber: 3, difficulty: "intermediate", configuration: { pairs: 8, cols: 4 } },
    ],
  },
  {
    id: "g-pattern",
    slug: "pattern-train",
    type: "game",
    title: "قطار الگوها",
    description: "واگن بعدی قطار چه شکلی است؟ الگو را پیدا کن و قطار را کامل کن.",
    categoryId: "c-brain",
    ageGroupIds: ag(4, 9),
    minAge: 4,
    maxAge: 9,
    difficulty: "intermediate",
    estimatedMinutes: 6,
    access: "free",
    status: "published",
    skills: [{ skillId: "s-pattern", weight: 1 }, { skillId: "s-attention", weight: 0.5 }],
    tone: "sky",
    publishedAt: "2026-09-20",
    gameType: "pattern",
    engine: "react-svg",
    levels: [
      { levelNumber: 1, difficulty: "beginner", configuration: { patterns: ["AB"], rounds: 5 } },
      { levelNumber: 2, difficulty: "easy", configuration: { patterns: ["AB", "AAB", "ABB"], rounds: 6 } },
      { levelNumber: 3, difficulty: "intermediate", configuration: { patterns: ["ABC", "AABB", "ABBC"], rounds: 7 } },
    ],
  },
  {
    id: "g-counting",
    slug: "count-the-fish",
    type: "game",
    title: "ماهی‌ها را بشمار",
    description: "در آکواریوم چند ماهی هست؟ بشمار و عدد درست را انتخاب کن.",
    categoryId: "c-learn",
    ageGroupIds: ag(3, 7),
    minAge: 3,
    maxAge: 7,
    difficulty: "beginner",
    estimatedMinutes: 4,
    access: "free",
    status: "published",
    skills: [{ skillId: "s-number", weight: 1 }, { skillId: "s-attention", weight: 0.4 }],
    tone: "ocean",
    publishedAt: "2026-10-02",
    gameType: "counting",
    engine: "react-svg",
    levels: [
      { levelNumber: 1, difficulty: "beginner", configuration: { max: 5, rounds: 5 } },
      { levelNumber: 2, difficulty: "easy", configuration: { max: 8, rounds: 6 } },
      { levelNumber: 3, difficulty: "intermediate", configuration: { max: 12, rounds: 7 } },
    ],
  },
];

/* ── بازی‌های بیشتر (همان موتور، پیکربندی متفاوت) ── */
function game(slug: string, title: string, description: string, gameType: Game["gameType"], o: { categoryId: string; min: number; max: number; difficulty: Difficulty; tone: ToneKey; skills: string[]; minutes?: number; premium?: boolean }, levels: Game["levels"]): Game {
  return {
    id: `g-${slug}`, slug, type: "game", title, description, categoryId: o.categoryId, ageGroupIds: ag(o.min, o.max), minAge: o.min, maxAge: o.max,
    difficulty: o.difficulty, estimatedMinutes: o.minutes ?? 5, access: o.premium ? "premium" : "free", status: "published",
    skills: o.skills.map((skillId, i) => ({ skillId, weight: i === 0 ? 1 : 0.5 })), tone: o.tone, publishedAt: "2026-11-15", gameType, engine: "react-svg", levels,
  };
}

export const moreGames: Game[] = [
  game("letter-sounds-fa", "صدای اول حروف فارسی", "تصویر را ببین و حرف اولش را پیدا کن. از الف تا ی، مرحله به مرحله.", "letter-sound",
    { categoryId: "c-learn", min: 4, max: 8, difficulty: "easy", tone: "sky", skills: ["s-letters", "s-listening"] },
    [
      { levelNumber: 1, difficulty: "beginner", configuration: { alphabet: "fa", from: 0, to: 8, rounds: 5 } },
      { levelNumber: 2, difficulty: "easy", configuration: { alphabet: "fa", from: 8, to: 16, rounds: 6 } },
      { levelNumber: 3, difficulty: "easy", configuration: { alphabet: "fa", from: 16, to: 24, rounds: 6 } },
      { levelNumber: 4, difficulty: "intermediate", configuration: { alphabet: "fa", from: 24, to: 32, rounds: 6 } },
      { levelNumber: 5, difficulty: "advanced", configuration: { alphabet: "fa", from: 0, to: 32, rounds: 10 } },
    ]),
  game("letter-sounds-en", "Beginning sounds: حروف انگلیسی", "Apple, Ball, Cat… تصویر را ببین و حرف اول انگلیسی‌اش را انتخاب کن.", "letter-sound",
    { categoryId: "c-learn", min: 5, max: 9, difficulty: "easy", tone: "coral", skills: ["s-letters", "s-listening"] },
    [
      { levelNumber: 1, difficulty: "beginner", configuration: { alphabet: "en", from: 0, to: 9, rounds: 5 } },
      { levelNumber: 2, difficulty: "easy", configuration: { alphabet: "en", from: 9, to: 18, rounds: 6 } },
      { levelNumber: 3, difficulty: "intermediate", configuration: { alphabet: "en", from: 18, to: 26, rounds: 6 } },
      { levelNumber: 4, difficulty: "advanced", configuration: { alphabet: "en", from: 0, to: 26, rounds: 10 } },
    ]),
  game("letter-hunt-fa", "شکار حرف", "همه‌ی نمونه‌های یک حرف فارسی را در جدول پیدا کن.", "letter-hunt",
    { categoryId: "c-brain", min: 5, max: 9, difficulty: "intermediate", tone: "grape", skills: ["s-letters", "s-attention"] },
    [
      { levelNumber: 1, difficulty: "easy", configuration: { alphabet: "fa", rounds: 3, cells: 9 } },
      { levelNumber: 2, difficulty: "intermediate", configuration: { alphabet: "fa", rounds: 4, cells: 16 } },
      { levelNumber: 3, difficulty: "advanced", configuration: { alphabet: "fa", rounds: 5, cells: 25 } },
    ]),
  game("letter-hunt-en", "Letter hunt: شکار حرف انگلیسی", "حرف‌های انگلیسی را در جدول پیدا کن.", "letter-hunt",
    { categoryId: "c-brain", min: 6, max: 10, difficulty: "intermediate", tone: "peach", skills: ["s-letters", "s-attention"], premium: true },
    [
      { levelNumber: 1, difficulty: "easy", configuration: { alphabet: "en", rounds: 3, cells: 9 } },
      { levelNumber: 2, difficulty: "intermediate", configuration: { alphabet: "en", rounds: 4, cells: 16 } },
      { levelNumber: 3, difficulty: "advanced", configuration: { alphabet: "en", rounds: 5, cells: 25 } },
    ]),
  game("odd-one-out", "کدام فرق دارد؟", "از بین چهار تصویر، آن یکی را که به گروه بقیه تعلق ندارد پیدا کن.", "odd-one-out",
    { categoryId: "c-brain", min: 4, max: 8, difficulty: "easy", tone: "mint", skills: ["s-pattern", "s-attention"] },
    [
      { levelNumber: 1, difficulty: "beginner", configuration: { rounds: 5, size: 3 } },
      { levelNumber: 2, difficulty: "easy", configuration: { rounds: 6, size: 4 } },
      { levelNumber: 3, difficulty: "intermediate", configuration: { rounds: 8, size: 4 } },
    ]),
  game("number-bubbles", "حباب‌های عدد", "حباب‌ها را به ترتیب از یک بترکان!", "number-order",
    { categoryId: "c-learn", min: 3, max: 8, difficulty: "easy", tone: "ocean", skills: ["s-number", "s-attention"] },
    [
      { levelNumber: 1, difficulty: "beginner", configuration: { max: 5, rounds: 3 } },
      { levelNumber: 2, difficulty: "easy", configuration: { max: 10, rounds: 3 } },
      { levelNumber: 3, difficulty: "intermediate", configuration: { max: 15, rounds: 3 } },
      { levelNumber: 4, difficulty: "advanced", configuration: { max: 20, rounds: 2 } },
    ]),
  game("more-or-less", "بیشتر یا کمتر؟", "دو گروه را مقایسه کن و گروهی را که بیشتر (یا کمتر) است انتخاب کن.", "more-less",
    { categoryId: "c-learn", min: 3, max: 6, difficulty: "beginner", tone: "peach", skills: ["s-number", "s-pattern"] },
    [
      { levelNumber: 1, difficulty: "beginner", configuration: { max: 4, rounds: 5 } },
      { levelNumber: 2, difficulty: "easy", configuration: { max: 7, rounds: 6 } },
      { levelNumber: 3, difficulty: "intermediate", configuration: { max: 10, rounds: 8 } },
    ]),
  ...([["animals", "حافظه‌ی حیوانات", "cat"], ["fruits", "حافظه‌ی میوه‌ها", "strawberry"], ["sky", "حافظه‌ی آسمان", "rocket"]] as const).map(([theme, title], i) =>
    game(`memory-${theme}`, title, "کارت‌ها را برگردان و جفت‌ها را پیدا کن.", "memory",
      { categoryId: "c-brain", min: 3, max: 8, difficulty: "easy", tone: (["grape", "berry", "sky"] as const)[i], skills: ["s-memory", "s-attention"], premium: i === 2 },
      [
        { levelNumber: 1, difficulty: "beginner", configuration: { pairs: 3, cols: 3, theme } },
        { levelNumber: 2, difficulty: "easy", configuration: { pairs: 5, cols: 5, theme } },
        { levelNumber: 3, difficulty: "intermediate", configuration: { pairs: theme === "sky" ? 7 : 6, cols: 4, theme } },
      ]),
  ),
];

/** بازی‌هایی که در نقشه‌ی راه هستند (در UI به شکل «به‌زودی» نمایش داده می‌شوند) */
export const upcomingGames = [
  { slug: "space-puzzle", title: "پازل فضایی", tone: "grape" as ToneKey, icon: "rocket" },
  { slug: "rhythm-jungle", title: "ریتم جنگل", tone: "peach" as ToneKey, icon: "drum" },
  { slug: "word-bubbles", title: "حباب کلمه‌ها", tone: "berry" as ToneKey, icon: "bubble" },
  { slug: "dino-dig", title: "حفاری دایناسور", tone: "grass" as ToneKey, icon: "dino" },
];

const handmadeStories: Story[] = [
  {
    id: "st-moon",
    slug: "little-cloud",
    type: "story",
    title: "ابرک کوچولو و ماه",
    description: "ابرک کوچولو می‌خواهد ماه را پیدا کند. تو انتخاب کن از کدام راه برود!",
    categoryId: "c-story",
    ageGroupIds: ag(3, 7),
    minAge: 3,
    maxAge: 7,
    difficulty: "easy",
    estimatedMinutes: 6,
    access: "free",
    status: "published",
    skills: [{ skillId: "s-listening", weight: 1 }, { skillId: "s-empathy", weight: 0.6 }],
    tone: "lilac",
    publishedAt: "2026-09-01",
    storyType: "interactive",
    chapters: [
      { id: "c1", title: "شب شده", scene: "night-sky", body: "شب آرامی بود. ابرک کوچولو بالای شهر شناور بود و دنبال دوستش، ماه، می‌گشت. ولی ماه پشت کوه‌ها پنهان شده بود. ابرک از کدام راه برود؟", choices: [{ id: "a", text: "پرواز بالای کوه‌ها", nextChapterId: "c2" }, { id: "b", text: "پرسیدن از جغد دانا", nextChapterId: "c3" }] },
      { id: "c2", title: "بالای کوه‌ها", scene: "mountains", body: "ابرک آن‌قدر بالا رفت که ستاره‌ها برایش دست تکان دادند. باد خنک گفت: «ماه همین نزدیکی است، فقط کمی صبر کن!»", choices: [{ id: "a", text: "صبر کردن کنار ستاره‌ها", nextChapterId: "c4" }] },
      { id: "c3", title: "جغد دانا", scene: "owl-tree", body: "جغد روی شاخه‌ی بلوط نشسته بود. گفت: «هوو هوو! ماه هر شب کمی دیرتر می‌آید. اگر با هم آواز بخوانیم، زودتر پیدایش می‌شود.»", choices: [{ id: "a", text: "با جغد آواز خواندن", nextChapterId: "c4" }] },
      { id: "c4", title: "سلام ماه!", scene: "moon-rise", body: "و ناگهان، ماه گرد و نقره‌ای از پشت کوه بیرون آمد و لبخند زد. ابرک کوچولو آن‌قدر خوشحال شد که چند قطره باران شادی بارید. شب بخیر، ابرک!", choices: [], isEnding: true },
    ],
  },
  {
    id: "st-seed",
    slug: "brave-seed",
    type: "story",
    title: "دانه‌ی شجاع",
    description: "قصه‌ی دانه‌ی کوچکی که یاد گرفت صبر کند تا جوانه بزند.",
    categoryId: "c-story",
    ageGroupIds: ag(2, 6),
    minAge: 2,
    maxAge: 6,
    difficulty: "beginner",
    estimatedMinutes: 4,
    access: "free",
    status: "published",
    skills: [{ skillId: "s-listening", weight: 1 }],
    tone: "grass",
    publishedAt: "2026-09-15",
    storyType: "bedtime",
    chapters: [
      { id: "c1", title: "زیر خاک", scene: "underground", body: "یک دانه‌ی کوچک زیر خاک خوابیده بود. همه‌جا تاریک بود و دانه کمی می‌ترسید.", choices: [{ id: "a", text: "ادامه", nextChapterId: "c2" }] },
      { id: "c2", title: "قطره‌ی باران", scene: "rain", body: "یک روز، قطره‌ی بارانی آرام در گوشش گفت: «نترس! تو داری بزرگ می‌شوی.» دانه نفس عمیقی کشید.", choices: [{ id: "a", text: "ادامه", nextChapterId: "c3" }] },
      { id: "c3", title: "جوانه", scene: "sprout", body: "و صبح بهاری، دانه سرش را از خاک بیرون آورد. حالا یک جوانه‌ی سبز و شجاع بود که به خورشید سلام می‌کرد.", choices: [], isEnding: true },
    ],
  },
];

export const stories: Story[] = [...handmadeStories, ...moreStories];

export const findWorksheet = (slug: string) => worksheets.find((w) => w.slug === slug);
export const games: Game[] = [...handmadeGames, ...moreGames];

export const findGame = (slug: string) => games.find((g) => g.slug === slug);
export const findStory = (slug: string) => stories.find((s) => s.slug === slug);
