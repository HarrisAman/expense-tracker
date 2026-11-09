import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExpenseItem from "./ExpenseItem";

afterEach(cleanup);

const expense = {
  _id: "1", title: "Coffee", amount: 4.5, isActive: 1,
  date: "2026-10-23T00:00:00.000Z",
  createdAt: "2026-11-04T19:10:13.628Z",
  updatedAt: "2026-11-04T19:10:13.628Z",
};

function setup(props = {}) {
  const handlers = { onEdit: vi.fn(), onCancel: vi.fn(), onSave: vi.fn(), onDelete: vi.fn() };
  render(<ul><ExpenseItem expense={expense} isEditing={false} {...handlers} {...props} /></ul>);
  return handlers;
}

describe("ExpenseItem", () => {
  it("shows the title and formatted amount", () => {
    setup();
    expect(screen.getByText(/Coffee: \$4\.50/)).toBeTruthy();
  });

  it("hides details until Details is clicked, then toggles them", async () => {
    setup();
    expect(screen.queryByText("Created")).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Details" }));
    expect(screen.getByText("Created")).toBeTruthy();
    expect(screen.getByText("Active")).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Hide" }));
    expect(screen.queryByText("Created")).toBeNull();
  });

  it("asks for confirmation before deleting", async () => {
    const { onDelete } = setup();
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByText("Delete this expense?")).toBeTruthy();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("deletes only after confirming", async () => {
    const { onDelete } = setup();
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    await userEvent.click(screen.getByRole("button", { name: "Yes, delete" }));
    expect(onDelete).toHaveBeenCalledWith("1");
  });

  it("cancels the confirmation without deleting", async () => {
    const { onDelete } = setup();
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Delete" })).toBeTruthy();
  });

  it("calls onEdit with the id", async () => {
    const { onEdit } = setup();
    await userEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(onEdit).toHaveBeenCalledWith("1");
  });

  it("shows the edit form in edit mode", () => {
    setup({ isEditing: true });
    expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
  });
});