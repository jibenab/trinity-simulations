#!/usr/bin/env node
/**
 * Seeds the cohesion-adhesion simulation into Convex.
 * Run from the project root: node scripts/seed-cohesion-adhesion.mjs
 * Requires: npx convex login (or an active `npx convex dev` session).
 */

import { readFileSync } from "fs";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const code = readFileSync(
  join(root, "files/simulations/cohesion_adhesion.html"),
  "utf-8",
);
const args = JSON.stringify({ code });

const convexBin = join(root, "node_modules/.bin/convex");
execFileSync(convexBin, ["run", "seed:seedCohesionAdhesion", args], {
  stdio: "inherit",
  cwd: root,
});
