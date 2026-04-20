#!/usr/bin/env node
/**
 * Seeds the lever-lab game into Convex.
 * Run from the project root: node scripts/seed-lever-lab.mjs
 * Requires: npx convex login (or an active `npx convex dev` session).
 */

import { readFileSync } from "fs";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const code = readFileSync(
  join(root, "files/simulations/lever-lab.html"),
  "utf-8",
);
const args = JSON.stringify({ code });

// Use execFileSync (not execSync) so args are passed directly — no shell quoting issues
const convexBin = join(root, "node_modules/.bin/convex");
execFileSync(convexBin, ["run", "seed:seedLeverLab", args], {
  stdio: "inherit",
  cwd: root,
});
