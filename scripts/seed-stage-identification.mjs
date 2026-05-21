#!/usr/bin/env node
/**
 * Seeds the Mitosis Phase Identifier game into Convex.
 * Run from the project root: node scripts/seed-stage-identification.mjs
 * Requires: npx convex login (or an active `npx convex dev` session).
 */

import { execFileSync } from "child_process";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const code = readFileSync(
  join(root, "files/simulations/stage-indentification.html"),
  "utf-8",
);
const svgCode = readFileSync(
  join(root, "files/svg/stage.svg"),
  "utf-8",
);
const args = JSON.stringify({ code, svgCode });

const convexBin = join(root, "node_modules/.bin/convex");
execFileSync(convexBin, ["run", "seed:seedStageIdentification", args], {
  stdio: "inherit",
  cwd: root,
});
