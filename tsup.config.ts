import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["cjs"],
  outExtension() {
    return {
      js: ".cjs",
    };
  },
  target: ["node20"],
  platform: "node",
  outDir: "dist",
  clean: true,
});
