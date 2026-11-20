/** شکل‌ها و رنگ‌های واگن‌های قطار الگو (مشترک بین بازی و بازی‌ساز والدین) */
export const SHAPES = ["circle", "square", "triangle", "star", "heart"] as const;
export const COLORS = ["red", "blue", "green", "yellow", "purple", "pink", "orange"] as const;
export type Shape = (typeof SHAPES)[number];
export type ColorName = (typeof COLORS)[number];

export const COLOR_HEX: Record<ColorName, string> = {
  red: "#ff7a66", blue: "#4fb8f5", green: "#4fcb72", yellow: "#ffce3d", purple: "#9b7bff", pink: "#ff73b3", orange: "#ff9f4a",
};
export const SHAPE_FA: Record<Shape, string> = { circle: "دایره", square: "مربع", triangle: "مثلث", star: "ستاره", heart: "قلب" };
export const COLOR_FA: Record<ColorName, string> = { red: "قرمز", blue: "آبی", green: "سبز", yellow: "زرد", purple: "بنفش", pink: "صورتی", orange: "نارنجی" };

export interface Token {
  shape: Shape;
  color: string;
  name: string;
  id: string;
}

/** «circle-red» → Token */
export function parseToken(id: string): Token {
  const [s, c] = id.split("-") as [Shape, ColorName];
  const shape = (SHAPES as readonly string[]).includes(s) ? s : "circle";
  const color = (COLORS as readonly string[]).includes(c) ? c : "red";
  return { shape, color: COLOR_HEX[color], name: `${SHAPE_FA[shape]} ${COLOR_FA[color]}`, id: `${shape}-${color}` };
}

export function TokenArt({ t, className }: { t: Token; className?: string }) {
  const S = { stroke: "#1f1a3d", strokeWidth: 4, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 60 60" className={className} aria-label={t.name} role="img">
      {t.shape === "circle" && <circle cx="30" cy="30" r="20" fill={t.color} {...S} />}
      {t.shape === "square" && <rect x="11" y="11" width="38" height="38" rx="7" fill={t.color} {...S} />}
      {t.shape === "triangle" && <path d="M30 8 L 52 50 L 8 50 Z" fill={t.color} {...S} />}
      {t.shape === "star" && <path d="M30 6 L 36 22 L 53 23 L 40 34 L 44 51 L 30 42 L 16 51 L 20 34 L 7 23 L 24 22 Z" fill={t.color} {...S} />}
      {t.shape === "heart" && <path d="M30 50 C 10 36, 6 24, 12 16 C 18 9, 27 11, 30 19 C 33 11, 42 9, 48 16 C 54 24, 50 36, 30 50 Z" fill={t.color} {...S} />}
    </svg>
  );
}
