#!/usr/bin/env node
/**
 * Seeds the 1D Motion simulation into Convex.
 * Run from the project root: node scripts/seed-one-dimensional-motion.mjs
 * Requires: npx convex login (or an active `npx convex dev` session).
 */

import { execFileSync } from "child_process";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const code = readFileSync(
  join(root, "files/simulations/1-dimension-simulation.html"),
  "utf-8",
);
const args = JSON.stringify({ code });

const convexBin = join(root, "node_modules/.bin/convex");
execFileSync(convexBin, ["run", "--push", "seed:seedOneDimensionalMotion", args], {
  stdio: "inherit",
  cwd: root,
});
