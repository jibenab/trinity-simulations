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

const failures = [];

for (const file of listHtmlFiles(simulationDir)) {
  const source = fs.readFileSync(file, "utf8");
  for (const rule of forbidden) {
    if (rule.pattern.test(source)) {
      failures.push(`${path.relative(root, file)}: contains ${rule.name}`);
    }
  }
}

if (failures.length) {
  console.error("Simulation files must not include app-level navigation/auth chrome:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Simulation chrome check passed.");
