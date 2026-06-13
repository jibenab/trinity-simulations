const fs = require('fs');
const babel = require('@babel/core');
const html = fs.readFileSync('/Users/jibenab/Documents/trinity App/Trinity-simulations/simulation/exponents-basics.html', 'utf8');
const scriptMatch = html.match(/<script type="text\/babel" data-presets="react">([\s\S]*?)<\/script>/);
if (scriptMatch) {
  const code = scriptMatch[1];
  try {
    babel.transformSync(code, {
      presets: ['@babel/preset-react']
    });
    console.log("Babel compilation successful");
  } catch (e) {
    console.error("Babel error:", e.message);
  }
} else {
  console.log("No script found");
}
