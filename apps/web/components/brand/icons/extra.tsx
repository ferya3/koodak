/**
 * مجموعه‌ی گسترده‌ی تصویرسازی اشیا (viewBox ‏۶۴×۶۴)
 * سبک: خط دور تیره، رنگ‌های تخت پالت KidsWorld، یک هایلایت سفید.
 * کاربرد: تصویر کلمه‌ی هر حرف الفبا، کاربرگ‌های شمارش و رنگ‌آمیزی، بازی‌ها.
 */
const INK = "#1f1a3d";
const eye = (x: number, y: number, r = 2.6) => <circle cx={x} cy={y} r={r} fill={INK} stroke="none" />;
const cheek = (x: number, y: number) => <ellipse cx={x} cy={y} rx="3.2" ry="2" fill="#ff73b3" opacity="0.55" stroke="none" />;

export const extraIconNames = {
  horse: ["اسب", "horse"],
  balloon: ["بادکنک", "balloon"],
  butterfly: ["پروانه", "butterfly"],
  clock: ["ساعت", "clock"],
  chick: ["جوجه", "chick"],
  umbrella: ["چتر", "umbrella"],
  snail: ["حلزون", "snail"],
  rabbit: ["خرگوش", "rabbit"],
  tree: ["درخت", "tree"],
  corn: ["ذرت", "corn"],
  fox: ["روباه", "fox"],
  bee: ["زنبور", "bee"],
  jelly: ["ژله", "jelly"],
  lion: ["شیر", "lion"],
  chair: ["صندلی", "chair"],
  parrot: ["طوطی", "parrot"],
  bowl: ["ظرف", "bowl"],
  glasses: ["عینک", "glasses"],
  goose: ["غاز", "goose"],
  elephant: ["فیل", "elephant"],
  boat: ["قایق", "boat"],
  book: ["کتاب", "book"],
  turtle: ["لاک‌پشت", "turtle"],
  bread: ["نان", "bread"],
  whale: ["وال", "whale"],
  carrot: ["هویج", "carrot"],
  ice: ["یخ", "ice"],
  cat: ["گربه", "cat"],
  dog: ["سگ", "dog"],
  egg: ["تخم‌مرغ", "egg"],
  grapes: ["انگور", "grapes"],
  hat: ["کلاه", "hat"],
  icecream: ["بستنی", "ice cream"],
  kite: ["بادبادک", "kite"],
  nest: ["لانه", "nest"],
  orange: ["پرتقال", "orange"],
  pig: ["خوک", "pig"],
  crown: ["تاج", "crown"],
  van: ["ون", "van"],
  xylophone: ["بلز", "xylophone"],
  yoyo: ["یویو", "yo-yo"],
  zebra: ["گورخر", "zebra"],
  banana: ["موز", "banana"],
  strawberry: ["توت‌فرنگی", "strawberry"],
  watermelon: ["هندوانه", "watermelon"],
  cake: ["کیک", "cake"],
  house: ["خانه", "house"],
  rocket: ["موشک", "rocket"],
  bus: ["اتوبوس", "bus"],
  duck: ["اردک", "duck"],
  owl: ["جغد", "owl"],
  pencil: ["مداد", "pencil"],
  key: ["کلید", "key"],
  bell: ["زنگ", "bell"],
  drum: ["طبل", "drum"],
  bird: ["پرنده", "bird"],
  pear: ["گلابی", "pear"],
  cheese: ["پنیر", "cheese"],
} as const;

export type ExtraIconKey = keyof typeof extraIconNames;

export const extraArt: Record<ExtraIconKey, React.ReactNode> = {
  horse: (
    <>
      <path d="M14 58 L 16 40 C 12 34, 14 24, 22 20 L 30 10 L 34 16 L 44 16 C 52 18, 56 26, 54 32 L 48 32 L 42 26 L 40 40 L 42 58 L 34 58 L 32 44 L 24 44 L 22 58 Z" fill="#c98a4b" />
      <path d="M30 10 C 24 14, 22 20, 20 26" fill="none" stroke="#6e4630" strokeWidth="5" />
      {eye(44, 22)}
      <path d="M50 28 L 52 28" />
    </>
  ),
  balloon: (
    <>
      <ellipse cx="32" cy="26" rx="18" ry="21" fill="#ff7a66" />
      <path d="M29 47 L 35 47 L 32 51 Z" fill="#ff7a66" />
      <path d="M32 51 C 28 56, 36 58, 32 62" fill="none" />
      <path d="M22 18 C 23 13, 26 10, 30 9" stroke="#fff" fill="none" />
    </>
  ),
  butterfly: (
    <>
      <path d="M32 30 C 22 10, 6 12, 8 26 C 10 36, 22 36, 32 32 Z" fill="#ff73b3" />
      <path d="M32 30 C 42 10, 58 12, 56 26 C 54 36, 42 36, 32 32 Z" fill="#9b7bff" />
      <path d="M32 34 C 24 38, 14 46, 20 52 C 26 56, 30 46, 32 36 Z" fill="#ffce3d" />
      <path d="M32 34 C 40 38, 50 46, 44 52 C 38 56, 34 46, 32 36 Z" fill="#4fb8f5" />
      <path d="M32 18 L 32 50" strokeWidth="5" />
      <path d="M32 18 C 30 12, 26 10, 24 8 M32 18 C 34 12, 38 10, 40 8" fill="none" />
    </>
  ),
  clock: (
    <>
      <circle cx="32" cy="34" r="24" fill="#fff" />
      <circle cx="32" cy="34" r="19" fill="#ddf3ff" stroke="none" />
      <path d="M32 18 L 32 21 M32 47 L 32 50 M16 34 L 19 34 M45 34 L 48 34" />
      <path d="M32 34 L 32 24 M32 34 L 40 38" strokeWidth="3.5" />
      <path d="M14 14 L 22 10 M50 14 L 42 10" />
      {eye(32, 34, 2.2)}
    </>
  ),
  chick: (
    <>
      <ellipse cx="32" cy="40" rx="20" ry="18" fill="#ffce3d" />
      <circle cx="32" cy="22" r="13" fill="#ffce3d" />
      <path d="M24 8 C 28 10, 30 12, 30 10" fill="none" />
      {eye(27, 20)}
      {eye(37, 20)}
      <path d="M29 26 L 35 26 L 32 30 Z" fill="#ff9f4a" />
      <path d="M14 40 C 18 36, 22 38, 22 44" fill="none" />
      <path d="M26 58 L 24 62 M38 58 L 40 62" stroke="#ff9f4a" />
    </>
  ),
  umbrella: (
    <>
      <path d="M6 32 C 6 16, 20 8, 32 8 C 44 8, 58 16, 58 32 C 54 28, 48 28, 45 32 C 42 28, 36 28, 32 32 C 28 28, 22 28, 19 32 C 16 28, 10 28, 6 32 Z" fill="#9b7bff" />
      <path d="M32 8 C 26 16, 24 24, 25 31 M32 8 C 38 16, 40 24, 39 31" fill="none" stroke="#bfa5ff" />
      <path d="M32 32 L 32 52 C 32 58, 24 58, 24 52" fill="none" />
    </>
  ),
  snail: (
    <>
      <path d="M6 52 L 54 52 C 58 52, 58 46, 54 46 L 48 46" fill="#a6ecd0" />
      <circle cx="30" cy="34" r="16" fill="#ff9f4a" />
      <path d="M30 34 C 30 30, 36 30, 36 35 C 36 41, 26 42, 24 35 C 22 27, 34 22, 40 30" fill="none" />
      <path d="M46 46 L 50 30 M52 46 L 56 32" />
      <circle cx="50" cy="29" r="2.4" fill={INK} />
      <circle cx="56" cy="31" r="2.4" fill={INK} />
    </>
  ),
  rabbit: (
    <>
      <path d="M22 26 C 16 10, 18 2, 24 2 C 30 2, 30 14, 28 26 Z M42 26 C 48 10, 46 2, 40 2 C 34 2, 34 14, 36 26 Z" fill="#fff" />
      <path d="M24 22 C 22 14, 22 8, 24 7 M40 22 C 42 14, 42 8, 40 7" stroke="#ffa3cf" strokeWidth="4" fill="none" />
      <circle cx="32" cy="40" r="20" fill="#fff" />
      {eye(25, 38)}
      {eye(39, 38)}
      {cheek(21, 46)}
      {cheek(43, 46)}
      <path d="M29 45 L 35 45 L 32 48 Z" fill="#ff73b3" />
      <path d="M32 48 L 32 51 M32 51 Q 28 54 26 51 M32 51 Q 36 54 38 51" fill="none" />
    </>
  ),
  tree: (
    <>
      <path d="M28 40 L 26 60 L 38 60 L 36 40 Z" fill="#c98a4b" />
      <path d="M32 4 C 46 4, 54 14, 52 24 C 60 28, 58 42, 46 42 L 18 42 C 6 42, 4 28, 12 24 C 10 14, 18 4, 32 4 Z" fill="#4fcb72" />
      <circle cx="22" cy="24" r="3" fill="#ff7a66" />
      <circle cx="40" cy="18" r="3" fill="#ff7a66" />
      <circle cx="42" cy="32" r="3" fill="#ff7a66" />
      <path d="M18 16 C 20 12, 24 10, 28 9" stroke="#fff" fill="none" />
    </>
  ),
  corn: (
    <>
      <path d="M32 4 C 44 8, 46 30, 40 50 L 24 50 C 18 30, 20 8, 32 4 Z" fill="#ffce3d" />
      <path d="M26 14 L 38 14 M24 22 L 40 22 M23 30 L 41 30 M24 38 L 40 38 M30 6 L 28 48 M35 6 L 36 48" stroke="#f5b400" strokeWidth="2" />
      <path d="M24 50 C 14 46, 8 36, 10 24 C 16 32, 20 40, 28 50 Z M40 50 C 50 46, 56 36, 54 24 C 48 32, 44 40, 36 50 Z" fill="#4fcb72" />
      <path d="M28 50 L 32 60 L 36 50" fill="#2ead55" />
    </>
  ),
  fox: (
    <>
      <path d="M10 10 L 24 26 L 14 32 Z M54 10 L 40 26 L 50 32 Z" fill="#ff9f4a" />
      <path d="M8 32 C 8 20, 22 18, 32 18 C 42 18, 56 20, 56 32 C 56 46, 44 58, 32 58 C 20 58, 8 46, 8 32 Z" fill="#ff9f4a" />
      <path d="M16 44 C 22 44, 28 48, 32 58 C 36 48, 42 44, 48 44 C 48 52, 40 58, 32 58 C 24 58, 16 52, 16 44 Z" fill="#fff" />
      {eye(23, 36)}
      {eye(41, 36)}
      <ellipse cx="32" cy="48" rx="3.5" ry="2.5" fill={INK} />
    </>
  ),
  bee: (
    <>
      <ellipse cx="24" cy="18" rx="9" ry="12" fill="#ddf3ff" transform="rotate(-25 24 18)" />
      <ellipse cx="40" cy="18" rx="9" ry="12" fill="#ddf3ff" transform="rotate(25 40 18)" />
      <ellipse cx="32" cy="38" rx="22" ry="17" fill="#ffce3d" />
      <path d="M26 22 C 22 30, 22 46, 26 54 M38 22 C 42 30, 42 46, 38 54" fill="none" strokeWidth="6" />
      {eye(16, 34)}
      <path d="M14 42 Q 18 45 21 42" fill="none" />
      <path d="M54 38 L 61 38" />
    </>
  ),
  jelly: (
    <>
      <path d="M12 54 L 16 22 C 16 16, 48 16, 48 22 L 52 54 Z" fill="#ff73b3" />
      <ellipse cx="32" cy="22" rx="16" ry="5" fill="#ffa3cf" />
      <ellipse cx="32" cy="56" rx="24" ry="5" fill="#fff" />
      <path d="M22 28 L 20 46" stroke="#fff" strokeWidth="3.5" />
      <path d="M32 17 C 32 10, 36 8, 40 8" fill="none" />
      <circle cx="40" cy="8" r="4" fill="#ff7a66" />
    </>
  ),
  lion: (
    <>
      <circle cx="32" cy="32" r="27" fill="#ff9f4a" />
      <path d="M8 22 L 14 26 M6 36 L 12 36 M10 48 L 16 44 M56 22 L 50 26 M58 36 L 52 36 M54 48 L 48 44 M32 4 L 32 10 M20 7 L 22 13 M44 7 L 42 13" stroke="#f07f1f" />
      <circle cx="32" cy="34" r="18" fill="#ffce3d" />
      {eye(25, 30)}
      {eye(39, 30)}
      <path d="M28 38 L 36 38 L 32 42 Z" fill={INK} />
      <path d="M32 42 Q 28 46 25 44 M32 42 Q 36 46 39 44" fill="none" />
    </>
  ),
  chair: (
    <>
      <rect x="16" y="6" width="32" height="26" rx="4" fill="#ff9f8e" />
      <rect x="10" y="32" width="44" height="8" rx="3" fill="#c98a4b" />
      <path d="M14 40 L 12 60 M50 40 L 52 60 M18 40 L 20 54 M46 40 L 44 54" strokeWidth="4" />
      <path d="M22 12 L 42 12" stroke="#fff" />
    </>
  ),
  parrot: (
    <>
      <path d="M24 58 C 16 46, 16 26, 26 14 C 32 6, 46 8, 46 20 C 46 30, 40 34, 40 44 C 40 52, 34 58, 24 58 Z" fill="#4fcb72" />
      <path d="M40 44 C 44 50, 46 58, 44 62 C 38 60, 34 56, 34 52 Z" fill="#4fb8f5" />
      <path d="M26 30 C 20 38, 22 48, 30 52 C 32 44, 32 36, 26 30 Z" fill="#ffce3d" />
      <path d="M44 16 C 52 16, 56 22, 52 28 C 50 24, 47 22, 44 22 Z" fill="#ff9f4a" />
      <circle cx="36" cy="16" r="5" fill="#fff" />
      {eye(37, 16)}
      <path d="M28 10 C 30 6, 34 4, 38 5" fill="#ff7a66" />
    </>
  ),
  bowl: (
    <>
      <path d="M6 28 L 58 28 C 58 44, 46 54, 32 54 C 18 54, 6 44, 6 28 Z" fill="#4fb8f5" />
      <path d="M20 54 L 18 60 L 46 60 L 44 54" fill="#1f96e0" />
      <path d="M12 34 C 14 42, 20 47, 26 49" stroke="#fff" fill="none" />
      <path d="M16 28 C 18 20, 26 18, 32 22 C 38 18, 46 20, 48 28" fill="#ffce3d" />
    </>
  ),
  glasses: (
    <>
      <circle cx="18" cy="34" r="12" fill="#ddf3ff" />
      <circle cx="46" cy="34" r="12" fill="#ddf3ff" />
      <path d="M30 32 C 31 28, 33 28, 34 32" fill="none" />
      <path d="M6 32 L 2 22 M58 32 L 62 22" />
      <path d="M12 30 C 13 27, 15 26, 18 26 M40 30 C 41 27, 43 26, 46 26" stroke="#fff" fill="none" />
    </>
  ),
  goose: (
    <>
      <path d="M12 44 C 12 32, 24 30, 34 34 C 34 26, 30 18, 30 12 C 30 4, 42 4, 42 12 C 42 20, 40 30, 46 34 C 54 38, 56 46, 50 52 C 44 58, 18 58, 12 44 Z" fill="#fff" />
      <path d="M42 10 L 52 12 L 42 16 Z" fill="#ff9f4a" />
      {eye(36, 10)}
      <path d="M20 44 C 26 40, 34 42, 38 48" fill="none" stroke="#b9b4d3" />
      <path d="M28 56 L 26 62 M38 56 L 40 62" stroke="#ff9f4a" />
    </>
  ),
  elephant: (
    <>
      <path d="M10 44 C 6 28, 16 14, 30 14 C 44 14, 54 22, 54 34 L 54 58 L 46 58 L 46 46 L 40 46 L 40 58 L 32 58 L 32 48 C 22 50, 14 50, 10 44 Z" fill="#b9b4d3" />
      <path d="M22 18 C 10 16, 4 28, 10 38 C 14 44, 22 40, 24 32 Z" fill="#d9d6ea" />
      <path d="M38 34 C 40 44, 40 54, 34 58 C 32 56, 34 50, 32 40" fill="#b9b4d3" />
      {eye(36, 26)}
      <path d="M42 38 C 46 40, 48 38, 50 34" fill="#fff" />
    </>
  ),
  boat: (
    <>
      <path d="M32 6 L 32 40" />
      <path d="M32 8 L 52 36 L 32 36 Z" fill="#fff" />
      <path d="M30 12 L 14 36 L 30 36 Z" fill="#ffce3d" />
      <path d="M6 40 L 58 40 L 50 54 L 14 54 Z" fill="#ff7a66" />
      <path d="M2 58 C 10 54, 16 62, 24 58 C 32 54, 40 62, 48 58 C 54 55, 58 58, 62 58" stroke="#4fb8f5" fill="none" />
    </>
  ),
  book: (
    <>
      <path d="M6 14 C 14 10, 24 10, 32 16 C 40 10, 50 10, 58 14 L 58 52 C 50 48, 40 48, 32 54 C 24 48, 14 48, 6 52 Z" fill="#fff" />
      <path d="M6 14 L 6 52 C 14 48, 24 48, 32 54 L 32 16 C 24 10, 14 10, 6 14 Z" fill="#4fb8f5" />
      <path d="M38 22 L 52 20 M38 30 L 52 28 M38 38 L 48 37" stroke="#b9b4d3" />
      <path d="M12 20 C 14 18, 18 17, 22 17" stroke="#fff" fill="none" />
    </>
  ),
  turtle: (
    <>
      <path d="M10 46 C 10 28, 22 18, 34 18 C 46 18, 56 28, 56 46 Z" fill="#4fcb72" />
      <path d="M22 30 L 28 24 L 40 24 L 46 30 L 40 40 L 28 40 Z" fill="#8be0a0" />
      <path d="M22 30 L 14 40 M46 30 L 52 40 M28 40 L 26 46 M40 40 L 42 46 M28 24 L 26 20 M40 24 L 42 20" stroke="#2ead55" strokeWidth="2" />
      <path d="M56 40 C 62 40, 62 30, 56 28" fill="#a6ecd0" />
      <ellipse cx="58" cy="36" rx="5" ry="5" fill="#a6ecd0" />
      {eye(59, 34, 1.8)}
      <path d="M14 46 L 12 54 L 20 54 L 20 46 M42 46 L 42 54 L 50 54 L 48 46" fill="#a6ecd0" />
    </>
  ),
  bread: (
    <>
      <path d="M6 40 C 6 22, 18 14, 32 14 C 46 14, 58 22, 58 40 C 58 50, 50 54, 32 54 C 14 54, 6 50, 6 40 Z" fill="#ffbe85" />
      <path d="M18 26 L 24 38 M30 22 L 34 36 M42 24 L 44 38" stroke="#c98a4b" strokeWidth="3" />
      <path d="M12 34 C 12 28, 16 24, 22 21" stroke="#fff" fill="none" />
    </>
  ),
  whale: (
    <>
      <path d="M4 38 C 4 22, 22 16, 36 20 C 46 22, 50 30, 54 34 L 62 24 L 60 42 L 54 40 C 50 52, 34 56, 22 54 C 10 52, 4 46, 4 38 Z" fill="#4fb8f5" />
      <path d="M8 44 C 18 50, 32 50, 44 46" fill="none" stroke="#ddf3ff" strokeWidth="5" />
      {eye(18, 34)}
      <path d="M22 18 C 20 12, 16 10, 14 6 M22 18 C 24 12, 28 10, 30 6" stroke="#8fd3ff" fill="none" />
    </>
  ),
  carrot: (
    <>
      <path d="M22 18 C 32 14, 44 18, 44 26 L 22 60 C 18 62, 16 58, 16 56 L 22 18 Z" fill="#ff9f4a" />
      <path d="M26 30 L 32 32 M22 42 L 28 44 M34 22 L 38 26" stroke="#f07f1f" />
      <path d="M36 18 C 34 10, 38 4, 44 2 C 44 10, 42 14, 38 18 M38 20 C 44 12, 54 12, 60 16 C 54 22, 46 22, 40 22" fill="#4fcb72" />
    </>
  ),
  ice: (
    <>
      <path d="M12 22 L 32 10 L 54 20 L 54 46 L 32 58 L 12 46 Z" fill="#ddf3ff" />
      <path d="M12 22 L 32 32 L 54 20 M32 32 L 32 58" stroke="#8fd3ff" />
      <path d="M18 28 L 18 40" stroke="#fff" strokeWidth="4" />
      {eye(24, 40, 2)}
      {eye(40, 40, 2)}
      <path d="M28 46 Q 32 49 36 46" fill="none" />
    </>
  ),
  cat: (
    <>
      <path d="M12 30 L 14 6 L 30 20 Z M52 30 L 50 6 L 34 20 Z" fill="#ff9f4a" />
      <circle cx="32" cy="36" r="22" fill="#ff9f4a" />
      <path d="M18 14 L 20 22 M46 14 L 44 22" stroke="#ffbe85" strokeWidth="4" />
      {eye(24, 34)}
      {eye(40, 34)}
      <path d="M29 42 L 35 42 L 32 45 Z" fill="#ff73b3" />
      <path d="M32 45 Q 28 49 25 46 M32 45 Q 36 49 39 46" fill="none" />
      <path d="M8 40 L 20 42 M8 46 L 20 45 M56 40 L 44 42 M56 46 L 44 45" strokeWidth="2" />
    </>
  ),
  dog: (
    <>
      <path d="M14 14 C 4 16, 4 36, 12 40 L 18 22 Z M50 14 C 60 16, 60 36, 52 40 L 46 22 Z" fill="#c98a4b" />
      <circle cx="32" cy="34" r="20" fill="#f2c79a" />
      <ellipse cx="32" cy="44" rx="10" ry="8" fill="#fff" />
      {eye(25, 32)}
      {eye(39, 32)}
      <ellipse cx="32" cy="40" rx="4" ry="3" fill={INK} />
      <path d="M32 43 L 32 47 Q 29 50 27 48 M32 47 Q 35 50 37 48" fill="none" />
      <path d="M30 50 C 30 56, 34 56, 34 50" fill="#ff73b3" />
    </>
  ),
  egg: (
    <>
      <path d="M32 4 C 46 4, 54 26, 54 38 C 54 52, 44 60, 32 60 C 20 60, 10 52, 10 38 C 10 26, 18 4, 32 4 Z" fill="#fff" />
      <path d="M18 30 C 18 22, 22 16, 26 12" stroke="#ffe07a" fill="none" strokeWidth="4" />
    </>
  ),
  grapes: (
    <>
      <path d="M32 12 C 32 8, 34 6, 36 4" fill="none" />
      <path d="M34 10 C 40 4, 50 6, 52 12 C 46 14, 40 14, 34 10 Z" fill="#4fcb72" />
      {[[24, 20], [40, 20], [32, 22], [18, 32], [32, 34], [46, 32], [25, 44], [39, 44], [32, 55]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="8" fill="#9b7bff" />
      ))}
      <path d="M14 30 C 15 27, 16 26, 18 26" stroke="#fff" fill="none" />
    </>
  ),
  hat: (
    <>
      <path d="M18 40 L 22 12 C 22 8, 42 8, 42 12 L 46 40 Z" fill="#9b7bff" />
      <path d="M20 32 L 44 32 L 45 40 L 19 40 Z" fill="#ffce3d" />
      <ellipse cx="32" cy="44" rx="28" ry="8" fill="#9b7bff" />
      <path d="M26 14 L 25 26" stroke="#fff" />
    </>
  ),
  icecream: (
    <>
      <path d="M18 30 L 32 62 L 46 30 Z" fill="#ffbe85" />
      <path d="M22 36 L 40 34 M24 44 L 38 42 M20 32 L 36 48 M44 32 L 30 52" stroke="#c98a4b" strokeWidth="2" />
      <circle cx="24" cy="26" r="10" fill="#ffa3cf" />
      <circle cx="40" cy="26" r="10" fill="#a6ecd0" />
      <circle cx="32" cy="14" r="10" fill="#fff3c4" />
      <circle cx="32" cy="3" r="3" fill="#ff7a66" />
    </>
  ),
  kite: (
    <>
      <path d="M32 2 L 52 22 L 32 46 L 12 22 Z" fill="#ff73b3" />
      <path d="M32 2 L 32 46 M12 22 L 52 22" />
      <path d="M32 2 L 52 22 L 32 22 Z M12 22 L 32 46 L 32 22 Z" fill="#ffce3d" />
      <path d="M32 46 C 26 52, 38 54, 32 62" fill="none" />
      <path d="M28 52 L 24 50 L 26 56 Z M36 58 L 40 56 L 38 62 Z" fill="#4fb8f5" />
    </>
  ),
  nest: (
    <>
      <ellipse cx="22" cy="32" rx="7" ry="9" fill="#ddf3ff" />
      <ellipse cx="34" cy="30" rx="7" ry="9" fill="#fff" />
      <ellipse cx="44" cy="33" rx="6" ry="8" fill="#ddf3ff" />
      <path d="M6 36 C 6 52, 20 58, 32 58 C 44 58, 58 52, 58 36 Z" fill="#c98a4b" />
      <path d="M10 42 C 22 46, 42 46, 54 42 M14 50 C 26 52, 38 52, 50 50" stroke="#8a5a3c" fill="none" />
    </>
  ),
  orange: (
    <>
      <circle cx="32" cy="36" r="24" fill="#ff9f4a" />
      <path d="M32 12 L 32 8" />
      <path d="M32 10 C 38 4, 48 6, 50 12 C 44 14, 38 14, 32 10 Z" fill="#4fcb72" />
      <path d="M16 30 C 18 24, 22 20, 28 18" stroke="#fff" fill="none" />
      <circle cx="40" cy="44" r="1.5" fill="#f07f1f" stroke="none" />
      <circle cx="24" cy="46" r="1.5" fill="#f07f1f" stroke="none" />
    </>
  ),
  pig: (
    <>
      <path d="M12 18 L 16 6 L 26 14 Z M52 18 L 48 6 L 38 14 Z" fill="#ffa3cf" />
      <circle cx="32" cy="34" r="24" fill="#ffa3cf" />
      <ellipse cx="32" cy="40" rx="10" ry="7" fill="#ff73b3" />
      <ellipse cx="28" cy="40" rx="2" ry="3" fill={INK} stroke="none" />
      <ellipse cx="36" cy="40" rx="2" ry="3" fill={INK} stroke="none" />
      {eye(24, 28)}
      {eye(40, 28)}
    </>
  ),
  crown: (
    <>
      <path d="M8 22 L 20 34 L 32 12 L 44 34 L 56 22 L 52 50 L 12 50 Z" fill="#ffce3d" />
      <rect x="12" y="50" width="40" height="8" rx="2" fill="#f5b400" />
      <circle cx="8" cy="20" r="4" fill="#ff73b3" />
      <circle cx="32" cy="10" r="4" fill="#4fb8f5" />
      <circle cx="56" cy="20" r="4" fill="#ff73b3" />
      <circle cx="32" cy="38" r="5" fill="#ff7a66" />
    </>
  ),
  van: (
    <>
      <path d="M4 44 L 4 18 C 4 14, 8 12, 12 12 L 44 12 C 50 12, 54 22, 58 30 L 60 44 Z" fill="#ffce3d" />
      <path d="M44 16 L 50 30 L 40 30 L 40 16 Z" fill="#ddf3ff" />
      <rect x="10" y="18" width="12" height="10" rx="2" fill="#ddf3ff" />
      <rect x="25" y="18" width="12" height="10" rx="2" fill="#ddf3ff" />
      <circle cx="16" cy="46" r="7" fill="#fff" />
      <circle cx="48" cy="46" r="7" fill="#fff" />
    </>
  ),
  xylophone: (
    <>
      {["#ff7a66", "#ff9f4a", "#ffce3d", "#4fcb72", "#4fb8f5", "#9b7bff"].map((c, i) => (
        <rect key={c} x={6 + i * 9} y={12 + i * 3} width="7" height={40 - i * 6} rx="2" fill={c} />
      ))}
      <path d="M40 4 L 56 20" strokeWidth="3" />
      <circle cx="58" cy="22" r="4" fill="#fff" />
    </>
  ),
  yoyo: (
    <>
      <path d="M32 4 L 32 14" />
      <circle cx="32" cy="38" r="22" fill="#4fcb72" />
      <circle cx="32" cy="38" r="12" fill="#ffce3d" />
      <circle cx="32" cy="38" r="3" fill={INK} />
      <path d="M16 30 C 18 24, 22 20, 28 18" stroke="#fff" fill="none" />
    </>
  ),
  zebra: (
    <>
      <path d="M20 14 L 16 2 L 26 10 Z M44 14 L 48 2 L 38 10 Z" fill="#fff" />
      <path d="M24 8 C 28 4, 36 4, 40 8 L 38 16 L 26 16 Z" fill={INK} />
      <path d="M18 24 C 18 12, 46 12, 46 24 L 44 44 C 44 56, 20 56, 20 44 Z" fill="#fff" />
      <path d="M20 22 L 28 26 M19 31 L 27 33 M45 22 L 37 26 M45 31 L 37 33 M32 14 L 32 24" strokeWidth="3.5" />
      <ellipse cx="32" cy="48" rx="12" ry="9" fill="#b9b4d3" />
      {eye(25, 34)}
      {eye(39, 34)}
      <circle cx="28" cy="48" r="2" fill={INK} stroke="none" />
      <circle cx="36" cy="48" r="2" fill={INK} stroke="none" />
    </>
  ),
  banana: (
    <>
      <path d="M10 18 C 14 44, 36 56, 58 46 C 52 42, 40 44, 30 38 C 20 32, 16 22, 16 14 Z" fill="#ffce3d" />
      <path d="M16 14 L 12 6 L 8 10 L 10 18" fill="#c98a4b" />
      <path d="M18 28 C 22 36, 30 42, 40 45" stroke="#f5b400" fill="none" />
    </>
  ),
  strawberry: (
    <>
      <path d="M32 16 C 50 14, 58 24, 52 38 C 46 52, 36 60, 32 60 C 28 60, 18 52, 12 38 C 6 24, 14 14, 32 16 Z" fill="#ff7a66" />
      <path d="M20 12 L 32 18 L 44 12 L 40 22 L 32 18 L 24 22 Z" fill="#4fcb72" />
      {[[22, 30], [32, 28], [42, 30], [26, 40], [38, 40], [32, 50]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="1.5" ry="2.2" fill="#fff3c4" stroke="none" />
      ))}
    </>
  ),
  watermelon: (
    <>
      <path d="M4 24 L 60 24 C 60 44, 48 56, 32 56 C 16 56, 4 44, 4 24 Z" fill="#4fcb72" />
      <path d="M10 24 L 54 24 C 54 40, 44 50, 32 50 C 20 50, 10 40, 10 24 Z" fill="#ff7a66" stroke="none" />
      {[[20, 32], [32, 36], [44, 32], [26, 42], [38, 42]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="1.8" ry="3" fill={INK} stroke="none" />
      ))}
    </>
  ),
  cake: (
    <>
      <rect x="10" y="30" width="44" height="26" rx="4" fill="#ffe3f1" />
      <path d="M10 36 C 16 42, 20 34, 26 40 C 32 46, 36 34, 42 40 C 48 46, 52 36, 54 38 L 54 30 L 10 30 Z" fill="#ff73b3" />
      <path d="M32 30 L 32 18" strokeWidth="4" stroke="#4fb8f5" />
      <path d="M32 6 C 36 10, 36 14, 32 16 C 28 14, 28 10, 32 6 Z" fill="#ffce3d" />
      <circle cx="20" cy="48" r="2" fill="#ff7a66" />
      <circle cx="44" cy="48" r="2" fill="#ff7a66" />
    </>
  ),
  house: (
    <>
      <path d="M10 30 L 32 10 L 54 30 L 54 58 L 10 58 Z" fill="#fff3c4" />
      <path d="M4 32 L 32 6 L 60 32" fill="none" strokeWidth="4" stroke="#ff7a66" />
      <rect x="26" y="40" width="12" height="18" rx="2" fill="#c98a4b" />
      <rect x="15" y="34" width="9" height="9" rx="1.5" fill="#ddf3ff" />
      <rect x="40" y="34" width="9" height="9" rx="1.5" fill="#ddf3ff" />
    </>
  ),
  rocket: (
    <>
      <path d="M32 4 C 46 14, 48 32, 42 46 L 22 46 C 16 32, 18 14, 32 4 Z" fill="#fff" />
      <circle cx="32" cy="24" r="6" fill="#4fb8f5" />
      <path d="M22 36 L 12 48 L 22 48 Z M42 36 L 52 48 L 42 48 Z" fill="#ff7a66" />
      <path d="M26 48 C 26 54, 32 60, 32 60 C 32 60, 38 54, 38 48 Z" fill="#ffce3d" />
    </>
  ),
  bus: (
    <>
      <rect x="6" y="10" width="52" height="38" rx="8" fill="#ffce3d" />
      <rect x="12" y="16" width="12" height="12" rx="2" fill="#ddf3ff" />
      <rect x="27" y="16" width="12" height="12" rx="2" fill="#ddf3ff" />
      <rect x="42" y="16" width="10" height="12" rx="2" fill="#ddf3ff" />
      <path d="M6 36 L 58 36" stroke="#f5b400" strokeWidth="3" />
      <circle cx="18" cy="50" r="7" fill="#fff" />
      <circle cx="46" cy="50" r="7" fill="#fff" />
    </>
  ),
  duck: (
    <>
      <path d="M8 40 C 8 30, 18 28, 28 32 C 26 24, 30 14, 40 14 C 50 14, 52 26, 46 32 C 56 34, 58 44, 50 52 C 42 60, 14 58, 8 40 Z" fill="#ffce3d" />
      <path d="M48 22 L 60 24 L 50 28 Z" fill="#ff9f4a" />
      {eye(42, 21)}
      <path d="M18 42 C 24 38, 32 40, 36 46" fill="none" stroke="#f5b400" />
    </>
  ),
  owl: (
    <>
      <path d="M12 30 C 12 12, 24 6, 32 6 C 40 6, 52 12, 52 30 L 52 50 C 52 58, 44 60, 32 60 C 20 60, 12 58, 12 50 Z" fill="#c98a4b" />
      <path d="M12 10 L 20 18 M52 10 L 44 18" />
      <ellipse cx="32" cy="46" rx="12" ry="12" fill="#f2c79a" />
      <circle cx="23" cy="26" r="9" fill="#fff" />
      <circle cx="41" cy="26" r="9" fill="#fff" />
      {eye(23, 26, 4)}
      {eye(41, 26, 4)}
      <path d="M29 34 L 35 34 L 32 39 Z" fill="#ff9f4a" />
    </>
  ),
  pencil: (
    <>
      <path d="M10 54 L 14 40 L 46 8 L 56 18 L 24 50 Z" fill="#ffce3d" />
      <path d="M46 8 L 56 18 L 60 14 C 62 12, 62 8, 58 4 C 56 2, 52 2, 50 4 Z" fill="#ff73b3" />
      <path d="M10 54 L 14 40 L 24 50 Z" fill="#ffbe85" />
      <path d="M10 54 L 12 48 L 16 52 Z" fill={INK} />
    </>
  ),
  key: (
    <>
      <circle cx="18" cy="24" r="12" fill="#ffce3d" />
      <circle cx="18" cy="24" r="4" fill="#fff" />
      <path d="M26 32 L 54 60 L 58 56 L 52 50 L 56 46 L 50 40 L 46 44 L 32 30" fill="#ffce3d" />
    </>
  ),
  bell: (
    <>
      <path d="M32 6 L 32 10" />
      <path d="M14 46 C 18 40, 16 22, 32 12 C 48 22, 46 40, 50 46 Z" fill="#ffce3d" />
      <rect x="10" y="46" width="44" height="6" rx="3" fill="#f5b400" />
      <circle cx="32" cy="57" r="5" fill="#ff9f4a" />
      <path d="M24 22 C 22 28, 22 34, 22 38" stroke="#fff" fill="none" />
    </>
  ),
  drum: (
    <>
      <ellipse cx="32" cy="24" rx="24" ry="8" fill="#fff" />
      <path d="M8 24 L 8 48 C 8 54, 56 54, 56 48 L 56 24" fill="#ff7a66" />
      <path d="M8 24 C 8 30, 56 30, 56 24" fill="none" />
      <path d="M14 32 L 24 46 L 34 32 L 44 46 L 52 34" fill="none" stroke="#fff" />
      <path d="M40 4 L 50 20 M24 4 L 14 20" />
    </>
  ),
  bird: (
    <>
      <path d="M8 36 C 8 22, 22 14, 34 18 C 44 10, 56 16, 56 26 L 62 28 L 56 32 C 54 46, 40 54, 26 52 C 14 50, 8 44, 8 36 Z" fill="#4fb8f5" />
      <path d="M20 32 C 26 26, 36 30, 36 38 C 30 42, 22 40, 20 32 Z" fill="#8fd3ff" />
      {eye(46, 24)}
      <path d="M26 52 L 24 60 M34 52 L 36 60" stroke="#ff9f4a" />
    </>
  ),
  pear: (
    <>
      <path d="M32 12 C 40 12, 42 22, 44 28 C 50 34, 54 40, 52 48 C 50 56, 42 60, 32 60 C 22 60, 14 56, 12 48 C 10 40, 14 34, 20 28 C 22 22, 24 12, 32 12 Z" fill="#8be0a0" />
      <path d="M32 12 C 32 8, 34 6, 36 4" fill="none" />
      <path d="M34 8 C 38 4, 44 4, 46 8 C 42 10, 38 10, 34 8 Z" fill="#4fcb72" />
      <path d="M18 42 C 18 36, 22 32, 26 30" stroke="#fff" fill="none" />
    </>
  ),
  cheese: (
    <>
      <path d="M6 44 L 58 22 L 58 52 L 6 52 Z" fill="#ffce3d" />
      <path d="M6 44 L 58 22 L 42 16 Z" fill="#ffe07a" />
      <circle cx="22" cy="46" r="3" fill="#f5b400" />
      <circle cx="40" cy="40" r="4" fill="#f5b400" />
      <circle cx="50" cy="48" r="2.5" fill="#f5b400" />
    </>
  ),
};
