import { defineConfig } from "vitest/config"; // helper that returns object I give

export default defineConfig({
  test: { // test objects that live under the test key
    env: { DB_NAME: "expense-app-test" }, // env variable
    testTimeout: 20000,
    hookTimeout: 20000,
  },
});

