import { dayKey } from "./formatters.js"; // gives an expense day
import { sumAmounts } from "./listUtils.js"; // adds amounts in whole cents

// array for days of the week with indices 0 ans Sunday
export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// "2026-12", +1 -> "2027-01". UTC math avoids time zone surprises
// month is a text key such as "2026-12", delta is how many months to move 1 for next and -1 for back
export function shiftMonth(month, delta) { // shiftMonth function to move month key forward or backwards
  const [year, mon] = month.split("-").map(Number); // month.split cuts the text in half [2026, 12], turns into real numbers for math computations
  // JS months start at 0  2026, 12  - 1 +  1     1   convert to ISO string then slice to first 7 chars 2027-01
  return new Date(Date.UTC(year, mon - 1 + delta, 1)).toISOString().slice(0, 7); // builds timestamp
}

// "2026-11" -> "November 2026"
export function formatMonth(month) { // converts the 2027-01 to January 2027 date format
  return new Date(`${month}-01T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
  });
}

// total of every expense whose day falls in the month
export function monthTotal(expenses, month) { // takes the expense and which month
  // daykey returns the expenses day as text and asks does it begin with the month text
  // .filter keeps only expenses with those values true and adds them up
  return sumAmounts(expenses.filter((e) => dayKey(e).startsWith(month)));
}

// only the expenses for one "YYYY-MM-DD" day
export function expensesForDay(expenses, key) { // key is the day I want as text
  return expenses.filter((e) => dayKey(e) === key); // gives me the expenses for the day that match
}

// Flat list of cells for a 7-column grid: leading blanks, one cell per day,
// trailing blanks so the last row is full.
export function buildMonthGrid(month, expenses, todayKey) { // takes month value, full array of expenses, todayKey for tests
  const [year, mon] = month.split("-").map(Number); // builds the months shape
  const leading = new Date(Date.UTC(year, mon - 1, 1)).getUTCDay(); // builds the first month and asks which weekday it is
  const daysInMonth = new Date(Date.UTC(year, mon, 0)).getUTCDate(); // calculates how many days in the month
  
  // sorts expenses into their days
  const byDay = {}; 
  for (const expense of expenses) { // for each expense in the full array
    const key = dayKey(expense); // the expenses day as text
    (byDay[key] ||= []).push(expense); // byDay doesnt exist, new empty array, otherwise add the expense
  }

  // building the list of boxes that make up a month- draws box per cell - wrapped into rows of 7
  const cells = []; // cells starts empty 
  // push the first of the month to the right weekday column
  // put empty cells for non days - the number of blanks is leading so i is however many blanks then increment
  // once its the same start at that day push that counter date
  for (let i = 0; i < leading; i++) cells.push({ key: `pad-start-${i}`, day: null }); 
  for (let day = 1; day <= daysInMonth; day++) { // being at day 1, keep going for all the days in month including last day
    // padStart pads the text on the left using 0 until 2 chars long
    const key = `${month}-${String(day).padStart(2, "0")}`; // each pass builds the day to match calander format to match expenses
    const items = byDay[key] ?? []; // looks up the days expenses 
    cells.push({ // add the fields to cells
      key,
      day,
      count: items.length,
      total: sumAmounts(items),
      isToday: key === todayKey,
    });
  }
  let i = 0; // counter used to make unique keys for blank cells
  // adds empty cells to month with blanks after on calendar
  // cells.length % 7 the remainder of cells to be pushed until 0 left
  while (cells.length % 7 !== 0) cells.push({ key: `pad-end-${i++}`, day: null });
  return cells; // returns finished array
}

// CSS class names for one day cell
export function cellClass(cell, selectedDay) { // cell is one cell from buildMonthGrid, selectedDay is the day user clicks
  return [ // array of candidates "day" 
    "day",
    cell.isToday && "today", // if conditions are true gives the class name for CSS
    cell.key === selectedDay && "selected",
    cell.count > 0 && "has-expenses",
    cell.total < 0 && "negative",
  ]
    .filter(Boolean) // keeps only true items and removes false ones
    .join(" "); // joins the names together that have spaces into one string 
}