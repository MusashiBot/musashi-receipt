import { build } from "esbuild";
import { chmod, rm } from "node:fs/promises";

// fresh build dir so stale tsc artifacts don't ship
await rm("dist", { recursive: true, force: true });

await build({
  entryPoints: ["src/bin.ts"],
  outfile: "dist/bin.js",
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node18",
  // bundle the workspace lib in; keep heavyweight 3rd-party deps external
  external: ["chalk", "string-width"],
  legalComments: "none",
  minify: false,
  sourcemap: false,
});

await chmod("dist/bin.js", 0o755);
console.log("✓ built dist/bin.js");
