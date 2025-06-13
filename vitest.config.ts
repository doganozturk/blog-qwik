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
      include: ["src/components", "src/util", "src/routes"],
      exclude: ["src/routes/service-worker.ts"],
    },
    setupFiles: ["./vitest.setup.tsx"],
    deps: {
      interopDefault: true,
    },
  },
});
