/** Formats a UTC ISO datetime string for display. e.g. "2026-06-10T09:00:00Z" → "Jun 10, 2026" */
export const formatDate = (isoDatetime: string): string =>
  new Date(isoDatetime).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

/** Formats a UTC ISO datetime string for time display. e.g. "2026-06-10T09:00:00Z" → "9:00 AM" */
export const formatTime = (isoDatetime: string): string =>
  new Date(isoDatetime).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });

/** Returns true if the given ISO datetime is in the past. */
export const isDatetimeInPast = (isoDatetime: string): boolean =>
  new Date(isoDatetime) < new Date();

/** Returns the minimum datetime-local value (now, formatted for <input type="datetime-local">). */
export const getNowLocalDatetimeString = (): string => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 16);
};

/** Converts a datetime-local input value to a UTC ISO string. e.g. "2026-06-10T09:00" → "2026-06-10T09:00:00.000Z" */
export const localDatetimeToUtcIso = (localDatetime: string): string =>
  new Date(localDatetime).toISOString();
