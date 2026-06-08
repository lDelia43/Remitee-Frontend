import { describe, it, expect, vi, afterEach } from "vitest";
import {
  formatDate,
  formatTime,
  isDatetimeInPast,
  localDatetimeToUtcIso,
  getNowLocalDatetimeString,
} from "@/utils/date.utils";

describe("formatDate", () => {
  it("formats a UTC ISO string to a readable date", () => {
    expect(formatDate("2026-06-10T09:00:00Z")).toBe("Jun 10, 2026");
  });

  it("formats the first day of a month correctly", () => {
    expect(formatDate("2026-01-01T00:00:00Z")).toBe("Jan 1, 2026");
  });

  it("formats the last day of a year correctly", () => {
    expect(formatDate("2025-12-31T23:59:59Z")).toBe("Dec 31, 2025");
  });

  it("always uses UTC so the date does not shift with local timezone", () => {
    // 2026-06-10T00:30:00Z is still Jun 10 in UTC regardless of local offset
    expect(formatDate("2026-06-10T00:30:00Z")).toBe("Jun 10, 2026");
  });
});

describe("formatTime", () => {
  it("formats a UTC ISO string to 12-hour time", () => {
    expect(formatTime("2026-06-10T09:00:00Z")).toBe("9:00 AM");
  });

  it("formats noon correctly", () => {
    expect(formatTime("2026-06-10T12:00:00Z")).toBe("12:00 PM");
  });

  it("formats midnight correctly", () => {
    expect(formatTime("2026-06-10T00:00:00Z")).toBe("12:00 AM");
  });

  it("includes minutes in the output", () => {
    expect(formatTime("2026-06-10T14:30:00Z")).toBe("2:30 PM");
  });
});

describe("isDatetimeInPast", () => {
  it("returns true for a date clearly in the past", () => {
    expect(isDatetimeInPast("2000-01-01T00:00:00Z")).toBe(true);
  });

  it("returns false for a date clearly in the future", () => {
    expect(isDatetimeInPast("2099-12-31T23:59:59Z")).toBe(false);
  });

  it("uses the current time as the reference point", () => {
    const fixed = new Date("2026-06-08T12:00:00Z");
    vi.setSystemTime(fixed);

    expect(isDatetimeInPast("2026-06-08T11:59:59Z")).toBe(true);
    expect(isDatetimeInPast("2026-06-08T12:00:01Z")).toBe(false);

    vi.useRealTimers();
  });
});

describe("localDatetimeToUtcIso", () => {
  it("returns a string ending in Z (UTC)", () => {
    const result = localDatetimeToUtcIso("2026-06-10T09:00");
    expect(result.endsWith("Z")).toBe(true);
  });

  it("returns a valid ISO 8601 string", () => {
    const result = localDatetimeToUtcIso("2026-06-10T09:00");
    expect(() => new Date(result)).not.toThrow();
    expect(new Date(result).toISOString()).toBe(result);
  });
});

describe("getNowLocalDatetimeString", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns a string in YYYY-MM-DDTHH:mm format (16 characters)", () => {
    vi.setSystemTime(new Date("2026-06-08T15:30:00Z"));
    const result = getNowLocalDatetimeString();
    expect(result).toHaveLength(16);
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });
});
