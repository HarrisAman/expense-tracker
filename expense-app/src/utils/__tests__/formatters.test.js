import { describe, it, expect } from "vitest";
import { formatCurrency, dayKey, formatDay } from "../formatters.js";

describe("formatCurrency", () => {
  it("formats two decimals", () => expect(formatCurrency(4.5)).toBe("$4.50"));
  it("adds thousands separators", () => expect(formatCurrency(1200)).toBe("$1,200.00"));
  it("treats non-numbers as zero", () => expect(formatCurrency(undefined)).toBe("$0.00"));
});

describe("dayKey", () => {
  it("returns the YYYY-MM-DD part", () =>
    expect(dayKey({ date: "2026-10-23T00:00:00.000Z" })).toBe("2026-10-23"));
  it("returns none when undated", () => expect(dayKey({})).toBe("none"));
});

describe("formatDay", () => {
  it("formats a day in UTC with no off-by-one", () =>
    expect(formatDay("2026-10-23")).toBe("Friday, October 23, 2026"));
  it("labels undated expenses", () => expect(formatDay("none")).toBe("No date"));
});