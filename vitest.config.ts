import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";

export default defineConfig({
  plugins: [qwikCity(), qwikVite(), tsconfigPaths() as any],
  test: {
    globals: true,
    environment: "node",
    coverage: {
      reporter: ["text", "json", "html"],
      include: ["src/components", "src/util", "src/routes", "src/root.tsx"],
    },
    setupFiles: ["./vitest.setup.tsx"],
    deps: {
      interopDefault: true,
    },
  },
});
