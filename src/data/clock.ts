const DAY = 24 * 60 * 60 * 1000;

export function at(daysAgo: number, time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date(Date.now() - daysAgo * DAY);
  date.setHours(hours ?? 0, minutes ?? 0, 0, 0);
  return date;
}

export function iso(daysAgo: number, time: string) {
  return at(daysAgo, time).toISOString();
}

export function epochMs(daysAgo: number, time: string) {
  return at(daysAgo, time).getTime();
}

export function epochSeconds(daysAgo: number, time: string) {
  return Math.floor(at(daysAgo, time).getTime() / 1000);
}

export function rfc2822(daysAgo: number, time: string) {
  return at(daysAgo, time).toUTCString();
}

export function inDays(days: number, time: string) {
  return iso(-days, time);
}
