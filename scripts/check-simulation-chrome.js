const fs = require("fs");
const path = require("path");

const root = process.cwd();
const simulationDir = path.join(root, "simulation");

const forbidden = [
  { name: "nav element", pattern: /<\s*nav\b/i },
  { name: "topnav class/component", pattern: /\btopnav\b/i },
  { name: "TopNav component", pattern: /<\s*TopNav\b/ },
  { name: "app Footer component", pattern: /<\s*Footer\b/ },
  { name: "navlinks class", pattern: /\bnavlinks\b/i },
  { name: "nav-actions class", pattern: /\bnav-actions\b/i },
  { name: "student login link", pattern: /Student\s+login/i },
  { name: "admin auth button", pattern: />\s*Admin\s*</i },
  { name: "site nav link set", pattern: /Home[\s\S]{0,240}Simulations[\s\S]{0,240}Subjects[\s\S]{0,240}For teachers[\s\S]{0,240}Help/i },
];

const viewportLockPattern =
  /(?:height|min-height)\s*:\s*100(?:dvh|svh|vh)\b/i;
const hiddenOverflowPattern = /overflow(?:-[xy])?\s*:\s*hidden\b/i;
const scrollingOverflowPattern = /overflow(?:-[xy])?\s*:\s*(?:auto|scroll)\b/i;
const visibleOverflowPattern = /overflow(?:-[xy])?\s*:\s*visible\b/i;

function listHtmlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return listHtmlFiles(fullPath);
      return entry.isFile() && entry.name.endsWith(".html") ? [fullPath] : [];
    });
}

function extractCssBlocks(source) {
  return Array.from(source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi), (match) => match[1]).join("\n");
}

function compactSelector(selector) {
  return selector.replace(/\s+/g, " ").trim();
}

function getClassNames(selector) {
  return Array.from(selector.matchAll(/\.([_a-zA-Z]+[_a-zA-Z0-9-]*)/g), (match) => match[1]);
}

function collectCssRules(css) {
  const rules = [];
  const rulePattern = /([^{}@][^{}]*)\{([^{}]*)\}/g;
  let match;

  while ((match = rulePattern.exec(css))) {
    const selector = compactSelector(match[1]);
    const declarations = match[2];
    if (!selector || selector.includes("%")) continue;
    rules.push({ selector, declarations, classNames: getClassNames(selector) });
  }

  return rules;
}

function selectorHasVisibleReset(scrollRule, visibleRules) {
  if (!scrollRule.classNames.length) return false;

  return visibleRules.some(
    (visibleRule) =>
      scrollRule.classNames.some((className) => visibleRule.classNames.includes(className)) ||
      visibleRule.selector.includes(scrollRule.selector),
  );
}

function findScrollLayoutFailure(relativeFile, source) {
  const css = extractCssBlocks(source);
  if (!css) return null;

  const locksViewport = viewportLockPattern.test(css) && hiddenOverflowPattern.test(css);
  if (!locksViewport) return null;

  const rules = collectCssRules(css);
  const scrollingRules = rules.filter((rule) => scrollingOverflowPattern.test(rule.declarations));
  const visibleRules = rules.filter((rule) => visibleOverflowPattern.test(rule.declarations));
  const activeScrollingSelectors = scrollingRules.filter(
    (rule) => !selectorHasVisibleReset(rule, visibleRules),
  );

  if (activeScrollingSelectors.length <= 1) return null;

  return [
    `${relativeFile}: has multiple active scroll containers in a viewport-locked simulation`,
    `  Active scroll selectors: ${activeScrollingSelectors.map((rule) => rule.selector).join(", ")}`,
    "  Keep one mobile scroll owner, or add a mobile override that sets nested result/review panels to overflow: visible.",
  ].join("\n");
}

const SUBJECTS = ["Physics", "Chemistry", "Biology", "Math"];
const GRADES = ["Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];
const LEVELS = ["Intro", "Core", "Advanced"];
const TYPES = ["simulation", "game"];

function validateMeta(meta) {
  const problems = [];
  if (!meta.title || typeof meta.title !== "string") problems.push("title (string) is required");
  if (!meta.chapter || typeof meta.chapter !== "string") problems.push("chapter (string) is required");
  if (!SUBJECTS.includes(meta.subject)) problems.push(`subject must be one of: ${SUBJECTS.join(", ")}`);
  if (!GRADES.includes(meta.grade)) problems.push(`grade must be one of: ${GRADES.join(", ")}`);
  if (meta.type !== undefined && !TYPES.includes(meta.type)) problems.push(`type must be one of: ${TYPES.join(", ")}`);
  if (meta.level !== undefined && !LEVELS.includes(meta.level)) problems.push(`level must be one of: ${LEVELS.join(", ")}`);
  if (meta.minutes !== undefined && typeof meta.minutes !== "number") problems.push("minutes must be a number");
  if (meta.prompt !== undefined && typeof meta.prompt !== "string") problems.push("prompt must be a string");
  if (
    meta.concepts !== undefined &&
    (!Array.isArray(meta.concepts) || meta.concepts.some((c) => typeof c !== "string"))
  ) {
    problems.push("concepts must be an array of strings");
  }
  return problems;
}

const failures = [];
const warnings = [];

for (const file of listHtmlFiles(simulationDir)) {
  const source = fs.readFileSync(file, "utf8");
  const relativeFile = path.relative(root, file);

  for (const rule of forbidden) {
    if (rule.pattern.test(source)) {
      failures.push(`${relativeFile}: contains ${rule.name}`);
    }
  }

  const scrollLayoutFailure = findScrollLayoutFailure(relativeFile, source);
  if (scrollLayoutFailure) failures.push(scrollLayoutFailure);

  if (!/<meta[^>]+name=["']viewport["']/i.test(source)) {
    failures.push(`${relativeFile}: missing <meta name="viewport">`);
  }

  const metaMatch = source.match(/<!--\s*trinity-meta\s*([\s\S]*?)-->/);
  if (!metaMatch) {
    warnings.push(
      `${relativeFile}: no trinity-meta block — scripts/upload-sim.mjs needs one (see simulation/_template.html)`,
    );
  } else {
    let meta = null;
    try {
      meta = JSON.parse(metaMatch[1]);
    } catch (error) {
      failures.push(`${relativeFile}: trinity-meta is not valid JSON (${error.message})`);
    }
    if (meta) {
      const problems = validateMeta(meta);
      if (problems.length) {
        failures.push(`${relativeFile}: invalid trinity-meta — ${problems.join("; ")}`);
      }
      if (meta.type === "game" && !/type:\s*["']score["']/.test(source)) {
        failures.push(
          `${relativeFile}: type is "game" but it never posts {type:"score"} to the parent`,
        );
      }
    }
  }

  const css = extractCssBlocks(source);
  if (css) {
    const cssOutsideRoot = css.replace(/:root\s*\{[^}]*\}/g, "");
    const hardcodedColors = [
      ...new Set(
        Array.from(cssOutsideRoot.matchAll(/#[0-9a-fA-F]{3,8}\b/g), (m) => m[0]),
      ),
    ];
    if (hardcodedColors.length) {
      warnings.push(
        `${relativeFile}: colors hardcoded outside :root — ${hardcodedColors.join(", ")} (use var(--token))`,
      );
    }

    const tinyFonts = [
      ...new Set(
        Array.from(css.matchAll(/font-size:\s*(\d+(?:\.\d+)?)px/g), (m) => Number(m[1])).filter(
          (n) => n < 12,
        ),
      ),
    ];
    if (tinyFonts.length) {
      warnings.push(
        `${relativeFile}: font-size below 12px — ${tinyFonts.join("px, ")}px (13px min for labels, 12px min for svg ticks)`,
      );
    }
  }
}

if (warnings.length) {
  console.warn("Simulation warnings (not failing the check):");
  for (const warning of warnings) console.warn(`- ${warning}`);
  console.warn("");
}

if (failures.length) {
  console.error("Simulation files failed standalone simulation checks:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Simulation checks passed.");
