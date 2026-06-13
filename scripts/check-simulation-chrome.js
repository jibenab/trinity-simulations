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

const failures = [];

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
}

if (failures.length) {
  console.error("Simulation files failed standalone simulation checks:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Simulation chrome check passed.");
