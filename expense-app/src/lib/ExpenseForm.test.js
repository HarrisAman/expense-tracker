import { describe, it, expect } from "vitest";
import { initialFormValues, toPayload, valuesAfterAdd } from "./ExpenseForm.js";

describe("initialFormValues", () => {
  it("defaults for a new expense", () => {
    const v = initialFormValues(undefined);
    expect(v.title).toBe("");
    expect(v.amount).toBe("");
    expect(v.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  it("pre-fills from an existing expense", () => {
    expect(initialFormValues({ title: "Tea", amount: 2, date: "2026-08-15T00:00:00.000Z" }))
      .toEqual({ title: "Tea", amount: 2, date: "2026-08-15" });
  });
});

describe("toPayload", () => {
  it("converts the amount string to a number", () =>
    expect(toPayload({ title: "x", amount: "4.5", date: "2026-10-23" }).amount).toBe(4.5));
});

describe("valuesAfterAdd", () => {
  it("clears title and amount but keeps the date", () =>
    expect(valuesAfterAdd({ title: "x", amount: "1", date: "2026-10-23" }))
      .toEqual({ title: "", amount: "", date: "2026-10-23" }));
});