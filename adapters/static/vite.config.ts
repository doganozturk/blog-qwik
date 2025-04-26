import { qwikVite } from "@builder.io/qwik/optimizer";
import { extendConfig } from "@builder.io/qwik-city/vite";
import { qwikCity } from "@builder.io/qwik-city/vite";
import { generate } from "@builder.io/qwik-city/static";
import baseConfig from "../../vite.config";
import path from "node:path";

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
            outDir: path.resolve(__dirname, "./dist"),
            renderModulePath: path.resolve(
              __dirname,
              "../../dist/entry.ssr.js",
            ),
            qwikCityPlanModulePath: "@qwik-city-plan",
          });
        },
      },
    ],
  };
});
