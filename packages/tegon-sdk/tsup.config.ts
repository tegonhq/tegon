import { Options, defineConfig as defineConfigTSUP } from "tsup";

const options: Options = {
  name: "main",
  config: "tsconfig.json",
  entry: ["./src/index.ts"],
  outDir: "./dist",
  platform: "node",
  format: ["cjs", "esm"],
  legacyOutput: false,
  sourcemap: true,
  clean: true,
  bundle: true,
  splitting: false,
  dts: {
    entry: "src/index.ts", // Replace with your entry point
    resolve: true, // This bundles the .d.ts files together
  },
  treeshake: {
    preset: "recommended",
  },
};

export default defineConfigTSUP(options);
