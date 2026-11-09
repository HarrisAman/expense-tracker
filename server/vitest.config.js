import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: { DB_NAME: "expense-app-test" },
    testTimeout: 20000,
    hookTimeout: 20000,
  },
});

