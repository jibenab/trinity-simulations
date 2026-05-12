#!/usr/bin/env node
/**
 * Seeds the Centre of Gravity simulation into Convex.
 * Run from the project root: node scripts/seed-centre-of-gravity.mjs
 * Requires: npx convex login (or an active `npx convex dev` session).
 */

import { execFileSync } from "child_process";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const code = readFileSync(
  join(root, "files/simulations/futuresimulations/centre-of-gravity.html"),
  "utf-8",
);
const args = JSON.stringify({ code });

const convexBin = join(root, "node_modules/.bin/convex");
execFileSync(convexBin, ["run", "--push", "seed:seedCentreOfGravity", args], {
  stdio: "inherit",
  cwd: root,
});
