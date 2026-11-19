import type { DashboardResponse } from "@kidsworld/types";
import { skillById } from "./taxonomy";
import { activityLog, childById, children, parentSettings, skillObservations, weeklyByType, weeklyMinutes } from "./family";
import { recommend } from "../recommend";

/** همان شکل پاسخ GET /parent/dashboard، ساخته‌شده از داده‌ی نمونه (حالت نمایشی) */
export function demoDashboard(childId?: string): DashboardResponse {
  const child = childById(childId ?? "") ?? children[0];
  const week = weeklyMinutes[child.id];
  const settings = parentSettings[child.id];
  const today = new Date();
  const total = week.reduce((a, b) => a + b, 0);

  return {
    children,
    selected: {
      child,
      settings,
      kpis: {
        totalMinutes: total,
        avgMinutesPerDay: Math.round(total / 7),
        activitiesCompleted: child.id === "ch-1" ? 23 : 14,
        activitiesPrevWeek: child.id === "ch-1" ? 19 : 10,
        streakDays: child.id === "ch-1" ? 7 : 3,
        points: child.id === "ch-1" ? 640 : 310,
        daysOverLimit: week.filter((m) => m > settings.dailyLimitMinutes).length,
      },
      weeklyMinutes: week.map((minutes, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        return { date: d.toISOString().slice(0, 10), minutes };
      }),
      minutesByType: weeklyByType[child.id],
      skills: skillObservations[child.id].map((s) => ({ ...s, title: skillById(s.skillId).title })).sort((a, b) => b.score - a.score),
      recentActivity: activityLog.filter((a) => a.childId === child.id),
      recommendations: recommend(child, [], 3).map(({ content, reason }) => ({ content, reason })),
    },
  };
}
