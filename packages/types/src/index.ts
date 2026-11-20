/**
 * @kidsworld/types
 * قرارداد مشترک داده بین Frontend (Next.js) و Backend (Laravel API v1).
 * این تایپ‌ها آینه‌ی Resourceهای API هستند، نه جداول خام دیتابیس.
 */

export type Locale = "fa" | "en";
export type ID = string;

/* ───────────── Taxonomy ───────────── */

export type Difficulty = "beginner" | "easy" | "intermediate" | "advanced";

export type ContentType =
  | "lesson"
  | "game"
  | "worksheet"
  | "story"
  | "activity"
  | "quiz"
  | "drawing";

export type AccessLevel = "free" | "premium";
export type PublishStatus = "draft" | "review" | "scheduled" | "published" | "archived";

export interface AgeGroup {
  id: ID;
  title: string;
  minAge: number;
  maxAge: number;
}

/** «دنیا»ها همان Categoryهای سطح اول هستند که در UI کودک به شکل جزیره نمایش داده می‌شوند. */
export interface Category {
  id: ID;
  parentId: ID | null;
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  /** کلید آیکون/تصویرسازی در Design System (نه مسیر فایل) */
  icon: string;
  /** کلید رنگ در توکن‌های طراحی: sun | coral | sky | grass | grape | ... */
  tone: ToneKey;
  sortOrder: number;
}

export type ToneKey = "sun" | "coral" | "sky" | "grass" | "grape" | "berry" | "ocean" | "peach" | "mint" | "lilac";

export interface Subject {
  id: ID;
  categoryId: ID;
  slug: string;
  title: string;
}

export type SkillCategory = "cognitive" | "logical" | "creative" | "linguistic" | "auditory" | "spatial" | "fine_motor" | "social_emotional";

export interface Skill {
  id: ID;
  slug: string;
  title: string;
  category: SkillCategory;
}

/* ───────────── Content ───────────── */

export interface ContentBase {
  id: ID;
  slug: string;
  type: ContentType;
  title: string;
  description: string;
  categoryId: ID;
  subjectId?: ID;
  ageGroupIds: ID[];
  minAge: number;
  maxAge: number;
  difficulty: Difficulty;
  estimatedMinutes: number;
  access: AccessLevel;
  status: PublishStatus;
  skills: { skillId: ID; weight: number }[];
  tone: ToneKey;
  publishedAt: string;
}

export type WorksheetTemplate =
  | "tracing" | "counting" | "maze" | "dot-to-dot" | "matching" | "coloring" | "addition"
  | "letter-trace" | "find-letter" | "beginning-sound" | "missing-letter" | "letter-match" | "word-search"
  | "number-trace" | "missing-number" | "subtraction" | "compare" | "clock"
  | "pattern" | "sudoku" | "odd-one-out" | "shapes";

export interface Worksheet extends ContentBase {
  type: "worksheet";
  template: WorksheetTemplate;
  /** پارامترهای Template – ورودی Worksheet Generator */
  params: Record<string, string | number | boolean | string[]>;
  pageCount: number;
  paperSize: "A4" | "Letter";
  orientation: "portrait" | "landscape";
  downloadCount: number;
}

export type GameType = "memory" | "pattern" | "counting" | "maze" | "sorting" | "puzzle" | "letter-sound" | "letter-hunt" | "odd-one-out" | "number-order" | "more-less";
export type GameEngineKind = "react-svg" | "phaser";

export interface GameLevel {
  levelNumber: number;
  difficulty: Difficulty;
  configuration: Record<string, unknown>;
}

export interface Game extends ContentBase {
  type: "game";
  gameType: GameType;
  engine: GameEngineKind;
  levels: GameLevel[];
}

export interface StoryChoice {
  id: ID;
  text: string;
  nextChapterId: ID;
}

export interface StoryChapter {
  id: ID;
  title: string;
  body: string;
  /** کلید صحنه‌ی تصویرسازی شده */
  scene: string;
  choices: StoryChoice[];
  isEnding?: boolean;
}

export interface Story extends ContentBase {
  type: "story";
  storyType: "short" | "picture" | "audio" | "interactive" | "bedtime";
  chapters: StoryChapter[];
}

/* ───────────── Learning Academy ───────────── */

/** تصویر هر گام درس – با آیکون‌ها و صحنه‌های سیستم طراحی رندر می‌شود (بدون فایل تصویری) */
export type LessonVisual =
  | { kind: "letter"; value: string; word?: string }
  | { kind: "number"; value: number; icon?: string }
  | { kind: "icons"; icons: string[] }
  | { kind: "scene"; scene: string }
  /** شکل‌های نوشتاری یک حرف (جدا، اول، وسط، آخر) یا حرف بزرگ/کوچک */
  | { kind: "forms"; forms: string[]; ltr?: boolean };

export interface LessonOption {
  id: string;
  label: string;
  visual?: LessonVisual;
}

export interface LessonStep {
  id: ID;
  type: "explain" | "quiz";
  title: string;
  body: string;
  visual?: LessonVisual | null;
  question?: { prompt: string; options: LessonOption[]; answerId: string } | null;
}

export interface Lesson extends ContentBase {
  type: "lesson";
  objectives: string[];
  prerequisiteIds: ID[];
  steps: LessonStep[];
}

export interface LessonResult {
  score: number;
  correct: number;
  total: number;
  stars: 1 | 2 | 3;
  steps: { stepId: ID; correct: boolean }[];
}

export type Content = Worksheet | Game | Story | Lesson;

/* ───────────── Children & Progress ───────────── */

export type AvatarKey = "fox" | "bunny" | "bear" | "cat" | "panda" | "frog";

export interface ChildProfile {
  id: ID;
  displayName: string;
  /** فقط سال و ماه تولد – جمع‌آوری حداقلی */
  birthYearMonth: string;
  age: number;
  avatar: AvatarKey;
  favoriteCategoryIds: ID[];
  preferredLanguage: Locale;
}

export interface ParentSettings {
  childId: ID;
  dailyLimitMinutes: number;
  allowedContentTypes: ContentType[];
  soundEnabled: boolean;
  screenTimeEnabled: boolean;
  bedtimeLock: { enabled: boolean; from: string; to: string };
}

export interface GameSessionResult {
  sessionId: ID;
  gameId: ID;
  childId: ID | null;
  level: number;
  score: number;
  stars: 0 | 1 | 2 | 3;
  durationSeconds: number;
  mistakes: number;
  completedAt: string;
}

export interface GameEvent {
  type: "start" | "move" | "correct" | "wrong" | "hint" | "level_complete" | "quit";
  at: number;
  data?: Record<string, unknown>;
}

export interface SkillObservation {
  skillId: ID;
  /** ۰ تا ۱۰۰ – مشاهده‌ی تمرین، نه سنجش استعداد */
  score: number;
  sampleCount: number;
  trend: "up" | "flat" | "down";
}

export interface ActivityLogItem {
  id: ID;
  childId: ID;
  contentId: ID;
  contentTitle: string;
  contentType: ContentType;
  tone: ToneKey;
  at: string;
  durationMinutes: number;
  result?: string;
}

export interface Achievement {
  id: ID;
  title: string;
  description: string;
  icon: string;
  points: number;
}

export interface Plan {
  id: ID;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  currency: "IRR" | "USD";
  features: string[];
  highlighted?: boolean;
  audience: "family" | "school";
}

/* ───────────── API envelopes ───────────── */

export interface Paginated<T> {
  data: T[];
  meta: { page: number; perPage: number; total: number };
}

export interface ContentFilter {
  q?: string;
  age?: number;
  categoryId?: ID;
  difficulty?: Difficulty;
  access?: AccessLevel;
  template?: WorksheetTemplate;
}

/* ───────────── Parent dashboard (GET /parent/dashboard) ───────────── */

export interface SkillObservationView extends SkillObservation {
  title: string;
}

export interface DashboardData {
  child: ChildProfile;
  settings: ParentSettings | null;
  kpis: {
    totalMinutes: number;
    avgMinutesPerDay: number;
    activitiesCompleted: number;
    activitiesPrevWeek: number;
    streakDays: number;
    points: number;
    daysOverLimit: number;
  };
  weeklyMinutes: { date: string; minutes: number }[];
  minutesByType: { type: ContentType; minutes: number }[];
  skills: SkillObservationView[];
  recentActivity: ActivityLogItem[];
  recommendations: { content: Content; reason: string }[];
}

export interface DashboardResponse {
  children: ChildProfile[];
  selected: DashboardData | null;
}

/* ───────────── Game session API ───────────── */

export interface Awards {
  points: number;
  achievements: { id: ID; slug: string; title: string; icon: string; points: number }[];
}

export interface UserView {
  id: ID;
  name: string;
  email: string;
  roles: string[];
}
