import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExpenseForm from "../ExpenseForm";

afterEach(cleanup);

const dateInput = (container) => container.querySelector('input[type="date"]');

async function fillAndSubmit(user) {
  await user.type(screen.getByPlaceholderText("Title"), "Coffee");
  await user.type(screen.getByPlaceholderText("Amount"), "4.5");
  await user.click(screen.getByRole("button", { name: "Add expense" }));
}

describe("ExpenseForm (add mode)", () => {
  it("shows Add expense and no Cancel button", () => {
    render(<ExpenseForm onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Add expense" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull();
  });

  it("defaults the date to a YYYY-MM-DD value", () => {
    const { container } = render(<ExpenseForm onSubmit={vi.fn()} />);
    expect(dateInput(container).value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("submits the amount as a number", async () => {
    const onSubmit = vi.fn().mockResolvedValue(true);
    const user = userEvent.setup();
    render(<ExpenseForm onSubmit={onSubmit} />);
    await fillAndSubmit(user);
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith({
      title: "Coffee",
      amount: 4.5,
      date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
    });
  });

  it("clears title and amount but keeps the date after a successful add", async () => {
    const onSubmit = vi.fn().mockResolvedValue(true);
    const user = userEvent.setup();
    const { container } = render(<ExpenseForm onSubmit={onSubmit} />);
    const dateBefore = dateInput(container).value;
    await fillAndSubmit(user);
    await waitFor(() => expect(screen.getByPlaceholderText("Title").value).toBe(""));
    expect(screen.getByPlaceholderText("Amount").value).toBe("");
    expect(dateInput(container).value).toBe(dateBefore);
  });

  it("keeps what was typed when the save fails", async () => {
    const onSubmit = vi.fn().mockResolvedValue(false);
    const user = userEvent.setup();
    render(<ExpenseForm onSubmit={onSubmit} />);
    await fillAndSubmit(user);
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(screen.getByPlaceholderText("Title").value).toBe("Coffee");
    expect(screen.getByPlaceholderText("Amount").value).toBe("4.5");
  });
});

describe("ExpenseForm (edit mode)", () => {
  const initial = { title: "Tea", amount: 2, date: "2026-08-15T00:00:00.000Z" };

  it("pre-fills the fields and trims the date to YYYY-MM-DD", () => {
    const { container } = render(
      <ExpenseForm initial={initial} onSubmit={vi.fn()} onCancel={vi.fn()} />
    );
    expect(screen.getByPlaceholderText("Title").value).toBe("Tea");
    expect(screen.getByPlaceholderText("Amount").value).toBe("2");
    expect(dateInput(container).value).toBe("2026-08-15");
  });

  it("shows Save and Cancel, and Cancel calls onCancel", async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(<ExpenseForm initial={initial} onSubmit={vi.fn()} onCancel={onCancel} />);
    expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalled();
  });

  it("does not clear the fields after saving", async () => {
    const onSubmit = vi.fn().mockResolvedValue(true);
    const user = userEvent.setup();
    render(<ExpenseForm initial={initial} onSubmit={onSubmit} onCancel={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(screen.getByPlaceholderText("Title").value).toBe("Tea");
  });
});