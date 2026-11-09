import { describe, it, expect } from "vitest";
import { sortExpenses, sumAmounts, groupByDay } from "./ExpenseList.js";

const e = (id, date, amount = 1) => ({
  _id: id,
  date: date && `${date}T00:00:00.000Z`,
  amount,
});

describe("sortExpenses", () => {
  it("sorts newest date first", () => {
    const sorted = sortExpenses([e("a", "2026-08-15"), e("b", "2026-10-23"), e("c", "2026-09-01")]);
    expect(sorted.map((x) => x._id)).toEqual(["b", "c", "a"]);
  });
  it("breaks same-day ties by newest _id first", () => {
    const sorted = sortExpenses([e("a1", "2026-10-23"), e("b2", "2026-10-23")]);
    expect(sorted.map((x) => x._id)).toEqual(["b2", "a1"]);
  });
  it("puts undated expenses last", () => {
    const sorted = sortExpenses([e("a", null), e("b", "2026-10-23")]);
    expect(sorted.map((x) => x._id)).toEqual(["b", "a"]);
  });
  it("does not mutate the input", () => {
    const input = [e("a", "2026-08-15"), e("b", "2026-10-23")];
    sortExpenses(input);
    expect(input.map((x) => x._id)).toEqual(["a", "b"]);
  });
});

describe("sumAmounts", () => {
  it("sums amounts", () => expect(sumAmounts([e("a", "x", 4.5), e("b", "x", 12)])).toBe(16.5));
  it("avoids floating point drift", () =>
    expect(sumAmounts([e("a", "x", 0.1), e("b", "x", 0.2)])).toBe(0.3));
  it("returns 0 for an empty list", () => expect(sumAmounts([])).toBe(0));
});

describe("groupByDay", () => {
  const list = [e("a", "2026-08-15", 2), e("b", "2026-10-23", 4.5), e("c", "2026-10-23", 12)];

  it("creates one group per day, newest first", () =>
    expect(groupByDay(list).map((g) => g.key)).toEqual(["2026-10-23", "2026-08-15"]));
  it("computes a total per day", () =>
    expect(groupByDay(list).map((g) => g.total)).toEqual([16.5, 2]));
  it("keeps same-day items together even if unsorted", () => {
    const groups = groupByDay([e("a", "2026-10-23"), e("b", "2026-08-15"), e("c", "2026-10-23")]);
    expect(groups).toHaveLength(2);
    expect(groups[0].items).toHaveLength(2);
  });
  it("puts undated expenses in a none group", () =>
    expect(groupByDay([e("a", null)])[0].key).toBe("none"));
  it("returns an empty array for no expenses", () => expect(groupByDay([])).toEqual([]));
});