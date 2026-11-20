import type { Difficulty, Lesson, LessonStep, ToneKey } from "@kidsworld/types";
import { generatedLessons } from "./lessonsGen";

/**
 * درس‌های نمونه‌ی آکادمی یادگیری.
 * هر درس = چند گام «توضیح» (تصویر + متن + خواندن با صدا) و چند گام «پرسش».
 * همین داده به Seed بک‌اند صادر می‌شود (backend/database/seeders/data/lessons.json).
 */
const ag = (min: number, max: number) => Array.from({ length: max - min }, (_, i) => `ag-${min + i}`);

function lesson(
  slug: string,
  title: string,
  description: string,
  subjectId: string,
  o: { min: number; max: number; difficulty: Difficulty; tone: ToneKey; skills: string[]; minutes: number; prerequisites?: string[]; objectives: string[] },
  steps: LessonStep[],
): Lesson {
  return {
    id: `l-${slug}`,
    slug,
    type: "lesson",
    title,
    description,
    categoryId: "c-learn",
    subjectId,
    ageGroupIds: ag(o.min, o.max),
    minAge: o.min,
    maxAge: o.max,
    difficulty: o.difficulty,
    estimatedMinutes: o.minutes,
    access: "free",
    status: "published",
    skills: o.skills.map((skillId, i) => ({ skillId, weight: i === 0 ? 1 : 0.5 })),
    tone: o.tone,
    publishedAt: "2026-11-01",
    objectives: o.objectives,
    prerequisiteIds: o.prerequisites ?? [],
    steps,
  };
}

const handmadeLessons: Lesson[] = [
  lesson(
    "count-to-five",
    "شمارش تا ۵",
    "یک، دو، سه، چهار، پنج! با میوه‌ها و ستاره‌ها شمردن را تمرین کن.",
    "sub-numbers",
    { min: 3, max: 5, difficulty: "beginner", tone: "peach", skills: ["s-number", "s-attention"], minutes: 5, objectives: ["شمردن اشیا تا ۵", "تطبیق عدد با تعداد"] },
    [
      { id: "s1", type: "explain", title: "بیا با هم بشماریم", body: "یک سیب، دو سیب، سه سیب. اینجا سه تا سیب داریم!", visual: { kind: "number", value: 3, icon: "apple" } },
      { id: "s2", type: "explain", title: "پنج ستاره‌ی درخشان", body: "انگشت‌هایت را باز کن: یک، دو، سه، چهار، پنج! یک دست ما پنج انگشت دارد.", visual: { kind: "number", value: 5, icon: "star" } },
      { id: "s3", type: "quiz", title: "چند تا؟", body: "", visual: { kind: "icons", icons: ["star", "star", "star", "star"] }, question: { prompt: "چند ستاره می‌بینی؟", answerId: "b", options: [{ id: "a", label: "۳" }, { id: "b", label: "۴" }, { id: "c", label: "۵" }] } },
      { id: "s4", type: "quiz", title: "کدام دوتاست؟", body: "", question: { prompt: "کدام گروه دو قلب دارد؟", answerId: "b", options: [{ id: "a", label: "یک قلب", visual: { kind: "icons", icons: ["heart"] } }, { id: "b", label: "دو قلب", visual: { kind: "icons", icons: ["heart", "heart"] } }, { id: "c", label: "سه قلب", visual: { kind: "icons", icons: ["heart", "heart", "heart"] } }] } },
    ],
  ),
  lesson(
    "basic-shapes",
    "دایره، مربع، مثلث",
    "شکل‌های ساده را در دنیای اطرافت پیدا کن: توپ گرد است، پنجره مربع است!",
    "sub-shapes",
    { min: 3, max: 6, difficulty: "easy", tone: "grape", skills: ["s-spatial", "s-pattern"], minutes: 6, objectives: ["نام‌گذاری سه شکل پایه", "تشخیص شکل در اشیای آشنا"] },
    [
      { id: "s1", type: "explain", title: "دایره گرد است", body: "دایره هیچ گوشه‌ای ندارد. مثل توپ و خورشید!", visual: { kind: "icons", icons: ["circle", "ball", "sun"] } },
      { id: "s2", type: "explain", title: "مربع چهار ضلع دارد", body: "مربع چهار ضلع هم‌اندازه و چهار گوشه دارد.", visual: { kind: "icons", icons: ["square"] } },
      { id: "s3", type: "explain", title: "مثلث سه گوشه دارد", body: "مثلث سه ضلع و سه گوشه دارد. مثل یک تکه پیتزا!", visual: { kind: "icons", icons: ["triangle"] } },
      { id: "s4", type: "quiz", title: "شکل گرد", body: "", question: { prompt: "کدام شکل دایره است؟", answerId: "c", options: [{ id: "a", label: "مربع", visual: { kind: "icons", icons: ["square"] } }, { id: "b", label: "مثلث", visual: { kind: "icons", icons: ["triangle"] } }, { id: "c", label: "دایره", visual: { kind: "icons", icons: ["circle"] } }] } },
      { id: "s5", type: "quiz", title: "سه گوشه", body: "", question: { prompt: "کدام شکل سه گوشه دارد؟", answerId: "b", options: [{ id: "a", label: "دایره", visual: { kind: "icons", icons: ["circle"] } }, { id: "b", label: "مثلث", visual: { kind: "icons", icons: ["triangle"] } }, { id: "c", label: "مربع", visual: { kind: "icons", icons: ["square"] } }] } },
    ],
  ),
  lesson(
    "add-with-apples",
    "جمع با سیب‌ها",
    "وقتی سیب‌ها را کنار هم می‌گذاریم، تعدادشان بیشتر می‌شود. این یعنی جمع!",
    "sub-math",
    { min: 5, max: 7, difficulty: "easy", tone: "coral", skills: ["s-number"], minutes: 6, prerequisites: ["l-count-to-five"], objectives: ["فهم مفهوم جمع با اشیا", "جمع اعداد تا ۵"] },
    [
      { id: "s1", type: "explain", title: "دو سیب و یک سیب", body: "دو سیب داریم. یک سیب دیگر هم می‌آید. حالا بشمار: یک، دو، سه! پس دو به‌علاوه‌ی یک می‌شود سه.", visual: { kind: "icons", icons: ["apple", "apple", "plus", "apple"] } },
      { id: "s2", type: "quiz", title: "جمع کن", body: "", visual: { kind: "icons", icons: ["apple", "apple", "plus", "apple", "apple"] }, question: { prompt: "دو سیب به‌علاوه‌ی دو سیب چند سیب می‌شود؟", answerId: "b", options: [{ id: "a", label: "۳" }, { id: "b", label: "۴" }, { id: "c", label: "۵" }] } },
      { id: "s3", type: "quiz", title: "یکی دیگر", body: "", visual: { kind: "icons", icons: ["star", "plus", "star", "star", "star"] }, question: { prompt: "یک ستاره به‌علاوه‌ی سه ستاره؟", answerId: "c", options: [{ id: "a", label: "۲" }, { id: "b", label: "۳" }, { id: "c", label: "۴" }] } },
    ],
  ),
  lesson(
    "sun-and-moon",
    "خورشید، ماه و ستاره‌ها",
    "چرا روز روشن است و شب تاریک؟ با خورشید و ماه آشنا شو.",
    "sub-science",
    { min: 5, max: 9, difficulty: "intermediate", tone: "ocean", skills: ["s-attention", "s-listening"], minutes: 7, objectives: ["تفاوت روز و شب", "شناخت خورشید به‌عنوان یک ستاره", "چرخش ماه به دور زمین"] },
    [
      { id: "s1", type: "explain", title: "خورشید یک ستاره است", body: "خورشید یک ستاره‌ی خیلی بزرگ و داغ است. نورش روز را روشن و زمین را گرم می‌کند. هیچ‌وقت مستقیم به خورشید نگاه نکن!", visual: { kind: "icons", icons: ["sun"] } },
      { id: "s2", type: "explain", title: "ماه دور زمین می‌چرخد", body: "ماه از خودش نور ندارد؛ نور خورشید را برمی‌گرداند. ماه هر ماه یک دور کامل دور زمین می‌چرخد.", visual: { kind: "scene", scene: "moon-rise" } },
      { id: "s3", type: "explain", title: "ستاره‌های شب", body: "شب‌ها ستاره‌های زیادی می‌بینیم. آن‌ها هم خورشیدهایی هستند که خیلی خیلی دورند.", visual: { kind: "scene", scene: "night-sky" } },
      { id: "s4", type: "quiz", title: "روز یا شب؟", body: "", question: { prompt: "روز را چه چیزی روشن می‌کند؟", answerId: "a", options: [{ id: "a", label: "خورشید", visual: { kind: "icons", icons: ["sun"] } }, { id: "b", label: "ماه", visual: { kind: "icons", icons: ["moon"] } }, { id: "c", label: "ابر", visual: { kind: "icons", icons: ["cloud"] } }] } },
      { id: "s5", type: "quiz", title: "ماه کجا می‌چرخد؟", body: "", question: { prompt: "ماه به دور چه چیزی می‌چرخد؟", answerId: "b", options: [{ id: "a", label: "به دور ستاره‌ها" }, { id: "b", label: "به دور زمین" }, { id: "c", label: "به دور ابرها" }] } },
    ],
  ),
];

/** درس‌های دست‌نویس (ریاضی، شکل‌ها، علوم) + درس‌های تولیدی حروف و اعداد */
export const lessons: Lesson[] = [...generatedLessons, ...handmadeLessons];

export const findLesson = (slug: string) => lessons.find((l) => l.slug === slug);
