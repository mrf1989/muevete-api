import { DenonConfig, env } from "./deps.ts";

const config: DenonConfig = {
  env: env(),
  scripts: {
    start: {
      cmd: "deno run src/app.ts",
      desc: "Ejecuta aplicación",
      tsconfig: "tsconfig.json",
      allow: ["net", "env", "read"],
      unstable: true,
    },
    test: {
      cmd: "deno test",
      desc: "Ejecuta todas las suites de tests",
      tsconfig: "tsconfig.json",
      allow: ["net", "env", "read"],
      unstable: true
    }
  },
};

export default config;
