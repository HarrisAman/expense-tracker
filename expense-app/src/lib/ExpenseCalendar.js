import { dayKey } from "./sharedLogic.js";
import { sumAmounts } from "./ExpenseList.js";

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// "2026-12", +1 -> "2027-01". UTC math avoids time zone surprises.
export function shiftMonth(month, delta) {
  const [year, mon] = month.split("-").map(Number);
  return new Date(Date.UTC(year, mon - 1 + delta, 1)).toISOString().slice(0, 7);
}

// "2026-11" -> "November 2026"
export function formatMonth(month) {
  return new Date(`${month}-01T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
  });
}

// total of every expense whose day falls in the month
export function monthTotal(expenses, month) {
  return sumAmounts(expenses.filter((e) => dayKey(e).startsWith(month)));
}

// only the expenses for one "YYYY-MM-DD" day
export function expensesForDay(expenses, key) {
  return expenses.filter((e) => dayKey(e) === key);
}

// Flat list of cells for a 7-column grid: leading blanks, one cell per day,
// trailing blanks so the last row is full.
export function buildMonthGrid(month, expenses, todayKey) {
  const [year, mon] = month.split("-").map(Number);
  const leading = new Date(Date.UTC(year, mon - 1, 1)).getUTCDay(); // 0 = Sunday
  const daysInMonth = new Date(Date.UTC(year, mon, 0)).getUTCDate();

  const byDay = {};
  for (const expense of expenses) {
    const key = dayKey(expense);
    (byDay[key] ||= []).push(expense);
  }

  const cells = [];
  for (let i = 0; i < leading; i++) cells.push({ key: `pad-start-${i}`, day: null });
  for (let day = 1; day <= daysInMonth; day++) {
    const key = `${month}-${String(day).padStart(2, "0")}`;
    const items = byDay[key] ?? [];
    cells.push({
      key,
      day,
      count: items.length,
      total: sumAmounts(items),
      isToday: key === todayKey,
    });
  }
  let i = 0;
  while (cells.length % 7 !== 0) cells.push({ key: `pad-end-${i++}`, day: null });
  return cells;
}

// CSS class names for one day cell
export function cellClass(cell, selectedDay) {
  return [
    "day",
    cell.isToday && "today",
    cell.key === selectedDay && "selected",
    cell.count > 0 && "has-expenses",
  ]
    .filter(Boolean)
    .join(" ");
}