// Unit test file for server/validation.js
// Validators return { data } on success and { error } on failure

// describe groups related tests under a label
// it defines one test - sentence plus code that checks something
// expect wraps a result so you can compare them
import { describe, it, expect } from "vitest"; // imported functions for testing
import { parseDate, validateNewExpense, validateExpenseUpdate } from "../validation.js"; // functions to test

// describe(name, fn) function to test parseDate
describe("parseDate", () => {
  it("parses a valid date as midnight UTC", () => { // parses a valid date and expects this result
    expect(parseDate("2026-10-23").toISOString()).toBe("2026-10-23T00:00:00.000Z");
  });

  // test cases to check if the value is right
  it.each(["hello", "10/23/2026", "2026-1-5", "2026-10-23T05:00", ""])(
    "rejects bad format %s",
    (value) => expect(parseDate(value)).toBeNull()
  );

  it.each(["2026-02-31", "2026-13-01", "2026-00-10"])(
    "rejects impossible date %s",
    (value) => expect(parseDate(value)).toBeNull()
  );

  it.each([20261023, null, undefined, {}])("rejects non-string %s", (value) =>
    expect(parseDate(value)).toBeNull()
  );
});

describe("validateNewExpense", () => {
  const now = new Date("2026-11-04T15:00:00Z");

  it("accepts a valid expense and trims the title", () => {
    const { data, error } = validateNewExpense(
      { title: "  Coffee ", amount: 4.5, date: "2026-08-15" },
      now
    );
    expect(error).toBeUndefined();
    expect(data.title).toBe("Coffee");
    expect(data.amount).toBe(4.5);
    expect(data.date.toISOString()).toBe("2026-08-15T00:00:00.000Z");
  });

  it("accepts a negative amount", () => {
    const { data, error } = validateNewExpense({ title: "Refund", amount: -5 }, now);
    expect(error).toBeUndefined();
    expect(data.amount).toBe(-5);
  });

  it("defaults the date to today when none is sent", () => {
    const { data } = validateNewExpense({ title: "x", amount: 1 }, now);
    expect(data.date.toISOString()).toBe("2026-11-04T00:00:00.000Z");
  });

  it("allows future dates", () => {
    const { data, error } = validateNewExpense(
      { title: "Rent", amount: 1200, date: "2030-01-01" },
      now
    );
    expect(error).toBeUndefined();
    expect(data.date.getUTCFullYear()).toBe(2030);
  });

  it.each([undefined, "", "   ", 123, null, ["a"]])("rejects title %s", (title) => {
    expect(validateNewExpense({ title, amount: 5 }, now).error).toMatch(/title/i);
  });

  it.each([undefined, "4.5", 0, NaN, Infinity, null])("rejects amount %s", (amount) => {
    expect(validateNewExpense({ title: "x", amount }, now).error).toMatch(/amount/i);
  });

  it("rejects a bad date", () => {
    expect(validateNewExpense({ title: "x", amount: 1, date: "hello" }, now).error).toMatch(/date/i);
  });

  it("ignores unknown fields (whitelisting)", () => {
    const { data } = validateNewExpense({ title: "x", amount: 1, isActive: 0, _id: "abc" }, now);
    expect(Object.keys(data).sort()).toEqual(["amount", "date", "title"]);
  });

  it("handles a missing body", () => {
    expect(validateNewExpense(undefined, now).error).toBeDefined();
  });
});

describe("validateExpenseUpdate", () => {
  it("returns only the fields that were sent", () => {
    expect(validateExpenseUpdate({ amount: 5.25 }).data).toEqual({ amount: 5.25 });
  });

  it("accepts title, amount, date and isActive together", () => {
    const { data } = validateExpenseUpdate({
      title: " Latte ", amount: 3, date: "2026-09-01", isActive: 0,
    });
    expect(data.title).toBe("Latte");
    expect(data.isActive).toBe(0);
    expect(data.date.toISOString()).toBe("2026-09-01T00:00:00.000Z");
  });

  it("accepts a negative amount", () => {
    expect(validateExpenseUpdate({ amount: -5 }).data).toEqual({ amount: -5 });
  });

  it("rejects an empty body", () => {
    expect(validateExpenseUpdate({}).error).toMatch(/nothing to update/i);
  });

  it("ignores unknown fields, so a body of only unknown fields counts as empty", () => {
    expect(validateExpenseUpdate({ createdAt: "1999-01-01" }).error).toMatch(/nothing to update/i);
  });

  it.each(["", "   ", 5])("rejects title %s", (title) =>
    expect(validateExpenseUpdate({ title }).error).toMatch(/title/i)
  );

  it.each(["abc", 0])("rejects amount %s", (amount) =>
    expect(validateExpenseUpdate({ amount }).error).toMatch(/amount/i)
  );

  it.each([2, "1", true, null])("rejects isActive %s", (isActive) =>
    expect(validateExpenseUpdate({ isActive }).error).toMatch(/isActive/)
  );

  it("rejects a bad date", () => {
    expect(validateExpenseUpdate({ date: "nope" }).error).toMatch(/date/i);
  });
});