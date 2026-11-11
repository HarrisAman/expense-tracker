import { describe, it, expect } from "vitest";
import { formatDateTime, statusLabel } from "../itemUtils.js";

describe("formatDateTime", () => {
  it("handles a missing value", () => expect(formatDateTime(undefined)).toBe("Unknown"));
  it("formats an ISO string", () =>
    expect(formatDateTime("2026-10-23T12:00:00.000Z")).toMatch(/2026/));
});

describe("statusLabel", () => {
  it("labels active", () => expect(statusLabel({ isActive: 1 })).toBe("Active"));
  it("labels inactive", () => expect(statusLabel({ isActive: 0 })).toBe("Inactive"));
});