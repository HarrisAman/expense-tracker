import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import ExpenseList from "../ExpenseList";

afterEach(cleanup);

const make = (id, title, amount, date) => ({
  _id: id, title, amount, isActive: 1,
  date: `${date}T00:00:00.000Z`,
  createdAt: "2026-11-04T19:10:13.628Z",
  updatedAt: "2026-11-04T19:10:13.628Z",
});

const expenses = [
  make("a1", "Tea", 2, "2026-08-15"),
  make("b2", "Coffee", 4.5, "2026-10-23"),
  make("c3", "Lunch", 12, "2026-10-23"),
];

function setup(props = {}) {
  const handlers = { onEdit: vi.fn(), onCancel: vi.fn(), onSave: vi.fn(), onDelete: vi.fn() };
  render(<ExpenseList expenses={expenses} editingId={null} {...handlers} {...props} />);
  return handlers;
}

describe("ExpenseList", () => {
  it("shows an empty message when there are no expenses", () => {
    setup({ expenses: [] });
    expect(screen.getByText("No expenses yet.")).toBeTruthy();
  });

  it("renders one heading per day with its total", () => {
    setup();
    expect(screen.getByText("Friday, October 23, 2026 ($16.50)")).toBeTruthy();
    expect(screen.getByText("Saturday, August 15, 2026 ($2.00)")).toBeTruthy();
  });

  it("renders a row for every expense", () => {
    setup();
    expect(screen.getByText(/Tea: \$2\.00/)).toBeTruthy();
    expect(screen.getByText(/Coffee: \$4\.50/)).toBeTruthy();
    expect(screen.getByText(/Lunch: \$12\.00/)).toBeTruthy();
  });

  it("puts only the matching row into edit mode", () => {
    setup({ editingId: "b2" });
    expect(screen.getAllByRole("button", { name: "Save" })).toHaveLength(1);
  });
});