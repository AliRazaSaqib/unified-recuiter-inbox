import { t } from "@/i18n/dictionary";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function formatClock(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDayLabel(iso: string) {
  const date = new Date(iso);
  const today = startOfDay(new Date());
  const target = startOfDay(date);
  const diffDays = Math.round((today.getTime() - target.getTime()) / DAY);

  if (diffDays === 0) return t("time.today");
  if (diffDays === 1) return t("time.yesterday");
  if (diffDays < 7) return date.toLocaleDateString(undefined, { weekday: "long" });

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < MINUTE) return t("time.now");
  if (diff < HOUR) return t("time.minutes", { count: Math.floor(diff / MINUTE) });
  if (diff < DAY) return t("time.hours", { count: Math.floor(diff / HOUR) });
  if (diff < 7 * DAY) return t("time.days", { count: Math.floor(diff / DAY) });

  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

export function formatAgo(iso: string) {
  return t("time.ago", { value: formatRelative(iso) });
}

export function formatFullTimestamp(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function formatDueDate(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  const days = Math.round(diff / DAY);
  if (diff < 0 && days === 0) return t("time.dueToday");
  if (diff < 0) return t("time.overdueByDays", { count: Math.abs(days) });
  if (days === 0) return t("time.dueToday");
  if (days === 1) return t("time.dueTomorrow");
  return t("time.dueInDays", { count: days });
}

export function formatFileSize(sizeKb: number) {
  if (sizeKb < 1024) return t("file.kilobytes", { value: Math.round(sizeKb) });
  return t("file.megabytes", { value: (sizeKb / 1024).toFixed(1) });
}

export function formatGapLabel(gapHours: number) {
  if (gapHours >= 24) return t("time.daysLater", { count: Math.round(gapHours / 24) });
  if (gapHours >= 1) return t("time.hoursLater", { count: gapHours });
  return t("time.momentsLater");
}

export function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function isSameDay(a: string, b: string) {
  return startOfDay(new Date(a)).getTime() === startOfDay(new Date(b)).getTime();
}
