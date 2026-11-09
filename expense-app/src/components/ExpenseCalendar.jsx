import { useState } from "react";
import { today } from "../lib/ExpenseForm.js";
import { formatCurrency } from "../lib/sharedLogic.js";
import {
  WEEKDAYS, buildMonthGrid, cellClass, formatMonth, monthTotal, shiftMonth,
} from "../lib/ExpenseCalendar.js";

export default function ExpenseCalendar({ expenses, selectedDay, onSelectDay }) {
  const [month, setMonth] = useState(() => today().slice(0, 7)); // UI-only state
  const cells = buildMonthGrid(month, expenses, today());

  return (
    <section className="calendar">
      <header className="calendar-header">
        <button type="button" className="secondary" aria-label="Previous month"
          onClick={() => setMonth(shiftMonth(month, -1))}>‹</button>
        <h2>{formatMonth(month)} ({formatCurrency(monthTotal(expenses, month))})</h2>
        <button type="button" className="secondary" aria-label="Next month"
          onClick={() => setMonth(shiftMonth(month, 1))}>›</button>
      </header>

      <div className="calendar-grid">
        {WEEKDAYS.map((name) => (
          <div key={name} className="weekday">{name}</div>
        ))}
        {cells.map((cell) =>
          cell.day ? (
            <button
              key={cell.key}
              type="button"
              className={cellClass(cell, selectedDay)}
              aria-pressed={cell.key === selectedDay}
              onClick={() => onSelectDay(cell.key)}
            >
              <span className="day-number">{cell.day}</span>
              {cell.count > 0 && <span className="day-total">{formatCurrency(cell.total)}</span>}
            </button>
          ) : (
            <div key={cell.key} className="blank" />
          )
        )}
      </div>
    </section>
  );
}