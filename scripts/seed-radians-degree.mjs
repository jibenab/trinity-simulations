#!/usr/bin/env node
/**
 * Seeds the Degrees & Radians simulation into Convex.
 * Run from the project root: node scripts/seed-radians-degree.mjs
 * Requires: npx convex login (or an active `npx convex dev` session).
 */

import { execFileSync } from "child_process";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const code = readFileSync(
  join(root, "files/simulations/radians-degree.html"),
  "utf-8",
);
const svgCode = readFileSync(
  join(root, "files/simulations/radians-degree.svg"),
  "utf-8",
);
const args = JSON.stringify({ code, svgCode });

const convexBin = join(root, "node_modules/.bin/convex");
execFileSync(convexBin, ["run", "seed:seedRadiansDegree", args], {
  stdio: "inherit",
  cwd: root,
});
