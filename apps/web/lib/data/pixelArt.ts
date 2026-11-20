/** طرح‌های ۱۰×۱۰ برای نقاشی شطرنجی و قرینه‌کشی. حروف = رنگ، نقطه = خانه‌ی خالی */
export const PIXEL_ART: Record<string, { title: string; rows: string[]; symmetric: boolean }> = {
  heart: { title: "قلب", symmetric: true, rows: ["..........", ".rr....rr.", "rrrr..rrrr", "rrrrrrrrrr", "rrrrrrrrrr", ".rrrrrrrr.", "..rrrrrr..", "...rrrr...", "....rr....", ".........."] },
  house: { title: "خانه", symmetric: true, rows: ["....rr....", "...rrrr...", "..rrrrrr..", ".rrrrrrrr.", "rrrrrrrrrr", ".yyyyyyyy.", ".ybbyybby.", ".yyynnyyy.", ".yyynnyyy.", "gggggggggg"] },
  tree: { title: "درخت", symmetric: true, rows: ["....gg....", "...gggg...", "..gggggg..", ".gggggggg.", "..gggggg..", ".gggggggg.", "gggggggggg", "....nn....", "....nn....", "...nnnn..."] },
  rocket: { title: "موشک", symmetric: true, rows: ["....rr....", "...rrrr...", "...wbbw...", "...wbbw...", "...wwww...", "...wwww...", "..rwwwwr..", ".rrwwwwrr.", "....oo....", "...oyyo..."] },
  mushroom: { title: "قارچ", symmetric: true, rows: ["...rrrr...", "..rrrrrr..", ".rwrrrrwr.", "rrrrwwrrrr", "rrrrrrrrrr", "...wwww...", "...wwww...", "...wwww...", "...wwww...", "..gggggg.."] },
  flower: { title: "گل", symmetric: true, rows: ["...pppp...", "..pppppp..", ".ppyyyypp.", ".ppyyyypp.", "..pppppp..", "...pppp...", "....gg....", ".gg.gg.gg.", "..gggggg..", "....gg...."] },
  cat: { title: "گربه", symmetric: true, rows: ["o........o", "oo......oo", "ooo....ooo", "oooooooooo", "ookooookoo", "oooooooooo", "ooooppoooo", "ooookkoooo", ".oooooooo.", "..oooooo.."] },
  car: { title: "ماشین", symmetric: true, rows: ["..........", "..........", "...rrrr...", "..rwrrwr..", ".rrrrrrrr.", "rrrrrrrrrr", "rrkkrrkkrr", "..kk..kk..", "..........", "gggggggggg"] },
  sun: { title: "خورشید", symmetric: true, rows: ["....yy....", ".y..yy..y.", "..yyyyyy..", "..yooooy..", "yyyooooyyy", "yyyooooyyy", "..yooooy..", "..yyyyyy..", ".y..yy..y.", "....yy...."] },
  fish: { title: "ماهی", symmetric: false, rows: ["..........", "...bbbb...", "..bbbbbb.b", ".bkbbbbbbb", ".bbbbbbbbb", "..bbbbbb.b", "...bbbb...", "..........", ".y..y...y.", "yyyyyyyyyy"] },
};
