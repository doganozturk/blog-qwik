import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { qwikVite } from "@builder.io/qwik/optimizer";

export default defineConfig({
  plugins: [qwikVite(), tsconfigPaths() as any],
  test: {
    globals: true,
    environment: "node",
    coverage: {
      reporter: ["text", "json", "html"],
      include: [
        "src/components/**/*.{ts,tsx}",
        "src/util/**/*.ts",
        "src/routes/**/*.{ts,tsx}",
      ],
      exclude: [
        "src/routes/service-worker.ts",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
      ],
    },
    setupFiles: ["./vitest.setup.tsx"],
    deps: {
      interopDefault: true,
    },
  },
});
