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
    },
    setupFiles: ["./vitest.setup.tsx"],
    deps: {
      interopDefault: true,
    },
  },
});
