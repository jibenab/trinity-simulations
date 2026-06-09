<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->

## Simulation HTML chrome

Files in `simulation/*.html` are embedded as the simulation body, so they must not create site-level navigation or auth chrome. Do not add `<nav>`, Trinity site nav links, `Student login`, `Admin`, or duplicated app headers/footers to standalone simulation files. Keep only the simulation's own 4-zone lab UI: header strip, stage, parameter/actions strip, and prompt/status area.

Before handing off a new or edited simulation file, run:

```bash
npm run check:simulation-chrome
```
