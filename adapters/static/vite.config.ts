import { qwikVite } from "@builder.io/qwik/optimizer";
import { extendConfig } from "@builder.io/qwik-city/vite";
import { qwikCity } from "@builder.io/qwik-city/vite";
import { generate } from "@builder.io/qwik-city/static";
import baseConfig from "../../vite.config";

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["@qwik-city-plan"],
      },
    },
    plugins: [
      qwikCity(),
      qwikVite(),
      {
        name: "static-generate",
        closeBundle: async () => {
          await generate({
            origin: "http://doganozturk.dev",
            outDir: "./dist",
            renderModulePath: "./src/entry.ssr.tsx",
            qwikCityPlanModulePath: "@qwik-city-plan",
          });
        },
      },
    ],
  };
});
