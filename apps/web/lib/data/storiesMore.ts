import type { Story, StoryChapter, ToneKey } from "@kidsworld/types";

/** قصه‌های بیشتر – همه با تصویرسازی داخلی (StoryScene) و برخی با انتخاب مسیر */
const ag = (min: number, max: number) => Array.from({ length: max - min }, (_, i) => `ag-${min + i}`);

function story(slug: string, title: string, description: string, storyType: Story["storyType"], o: { min: number; max: number; tone: ToneKey; minutes: number; skills: string[]; premium?: boolean }, chapters: StoryChapter[]): Story {
  return {
    id: `st-${slug}`, slug, type: "story", title, description, categoryId: "c-story", ageGroupIds: ag(o.min, o.max), minAge: o.min, maxAge: o.max,
    difficulty: o.min <= 3 ? "beginner" : "easy", estimatedMinutes: o.minutes, access: o.premium ? "premium" : "free", status: "published",
    skills: o.skills.map((skillId, i) => ({ skillId, weight: i === 0 ? 1 : 0.6 })), tone: o.tone, publishedAt: "2026-11-15", storyType, chapters,
  };
}
const next = (id: string, nextChapterId: string, text = "ادامه") => ({ id, text, nextChapterId });

export const moreStories: Story[] = [
  story("little-fish-sea", "ماهی کوچولو و دریای بزرگ", "ماهی کوچولو می‌خواهد دریا را ببیند. با او همراه شو و تصمیم بگیر کجا برود!", "interactive",
    { min: 3, max: 7, tone: "ocean", minutes: 6, skills: ["s-listening", "s-empathy"] },
    [
      { id: "c1", title: "خانه‌ی مرجانی", scene: "sea", body: "ماهی کوچولو در یک خانه‌ی مرجانی رنگارنگ زندگی می‌کرد. یک روز گفت: «می‌خواهم دریای بزرگ را ببینم!» مامان‌ماهی گفت: «باشد، ولی مواظب خودت باش.»", choices: [next("a", "c2", "شنا به سمت نور"), next("b", "c3", "شنا به سمت صدای آواز")] },
      { id: "c2", title: "نور خورشید", scene: "sea", body: "ماهی کوچولو بالا و بالاتر رفت تا جایی که نور خورشید روی آب می‌رقصید. یک قایق کوچک از بالای سرش رد شد و بچه‌ها برایش دست تکان دادند.", choices: [next("a", "c4")] },
      { id: "c3", title: "آواز وال", scene: "sea", body: "صدای آواز از یک وال بزرگ و مهربان بود. وال گفت: «سلام کوچولو! دریا بزرگ است؛ همیشه راه خانه را به خاطر بسپار.»", choices: [next("a", "c4")] },
      { id: "c4", title: "بازگشت به خانه", scene: "sea", body: "ماهی کوچولو کلی چیز تازه دید و یاد گرفت. بعد آرام به خانه‌ی مرجانی برگشت و همه‌ی ماجرا را برای مامان‌ماهی تعریف کرد. پایان.", choices: [], isEnding: true },
    ]),
  story("rabbit-big-carrot", "خرگوش و هویج بزرگ", "هویج خیلی بزرگ است! خرگوش تنهایی نمی‌تواند آن را بیرون بکشد. چه کسی کمک می‌کند؟", "picture",
    { min: 2, max: 6, tone: "grass", minutes: 4, skills: ["s-empathy", "s-listening"] },
    [
      { id: "c1", title: "یک هویج غول‌پیکر", scene: "meadow", body: "خرگوش کوچولو در باغچه یک هویج بزرگ دید. کشید و کشید… ولی هویج تکان نخورد!", choices: [next("a", "c2")] },
      { id: "c2", title: "دوستان می‌آیند", scene: "meadow", body: "جوجه آمد، روباه آمد، حتی لاک‌پشت هم آمد. همه با هم گفتند: «یک، دو، سه… بکش!»", choices: [next("a", "c3")] },
      { id: "c3", title: "جشن هویج", scene: "sprout", body: "و هویج بزرگ بیرون آمد! خرگوش هویج را با همه‌ی دوستانش تقسیم کرد. با هم بودن یعنی کارهای بزرگ را راحت انجام دادن.", choices: [], isEnding: true },
    ]),
  story("piko-lost-star", "پیکو و ستاره‌ی گمشده", "یک ستاره‌ی کوچک از آسمان افتاده. پیکو باید کمکش کند به خانه برگردد!", "interactive",
    { min: 4, max: 8, tone: "grape", minutes: 7, skills: ["s-listening", "s-empathy"], premium: true },
    [
      { id: "c1", title: "صدای کوچک", scene: "night-sky", body: "پیکو شب در حیاط بود که صدای گریه‌ی کوچکی شنید. یک ستاره‌ی کوچولو روی چمن افتاده بود و نورش کم شده بود.", choices: [next("a", "c2", "ساختن موشک"), next("b", "c3", "صدا زدن جغد دانا")] },
      { id: "c2", title: "موشک مقوایی", scene: "space", body: "پیکو با جعبه و چسب یک موشک ساخت. ستاره را کنار پنجره‌ی موشک گذاشت و شمرد: ده، نه، هشت… پرواز!", choices: [next("a", "c4")] },
      { id: "c3", title: "راهنمای جغد", scene: "owl-tree", body: "جغد گفت: «ستاره‌ها از کوه بالا می‌روند تا به آسمان برسند.» پیکو ستاره را برداشت و با هم از کوه بالا رفتند.", choices: [next("a", "c4")] },
      { id: "c4", title: "دوباره در آسمان", scene: "moon-rise", body: "ستاره به خانه‌اش در آسمان برگشت و آن‌قدر درخشید که تمام شهر روشن شد. پیکو لبخند زد: کمک کردن چه حس خوبی دارد!", choices: [], isEnding: true },
    ]),
  story("bedtime-moon", "لالایی ماه", "قصه‌ی آرام قبل از خواب: ماه به همه‌ی حیوانات شب‌بخیر می‌گوید.", "bedtime",
    { min: 2, max: 6, tone: "lilac", minutes: 4, skills: ["s-listening"] },
    [
      { id: "c1", title: "شب شد", scene: "night-sky", body: "خورشید رفت پشت کوه. ماه آرام بالا آمد و گفت: «وقت خواب است.»", choices: [next("a", "c2")] },
      { id: "c2", title: "شب‌بخیر حیوانات", scene: "meadow", body: "شب‌بخیر خرگوش. شب‌بخیر جوجه. شب‌بخیر لاک‌پشت که آهسته به لانه‌اش رفت.", choices: [next("a", "c3")] },
      { id: "c3", title: "شب‌بخیر تو", scene: "moon-rise", body: "و ماه آهسته گفت: «شب‌بخیر کوچولو. چشم‌هایت را ببند. فردا روز تازه‌ای است.»", choices: [], isEnding: true },
    ]),
];
