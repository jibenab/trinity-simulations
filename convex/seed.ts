import { v } from "convex/values";

import { internalMutation, mutation } from "./_generated/server";
import { seedContent } from "./seedData";

export const seedCatalog = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    let inserted = 0;

    for (const item of seedContent) {
      const existing = await ctx.db
        .query("content")
        .withIndex("by_slug", (q) => q.eq("slug", item.slug))
        .unique();

      if (existing) continue;

      await ctx.db.insert("content", {
        ...item,
        concepts: [...item.concepts],
        svgCode: "",
        published: true,
        createdAt: now,
        updatedAt: now,
      });
      inserted += 1;
    }

    return { inserted };
  },
});

export const seedLeverLab = internalMutation({
  args: {
    code: v.string(),
    svgCode: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", "lever-lab"))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        type: "game",
        title: "Moments Master",
        subject: "Physics",
        grade: "Class 10",
        chapter: "Moments and Equilibrium",
        level: "Core",
        minutes: 10,
        concepts: [
          "moments",
          "equilibrium",
          "fulcrum",
          "timed problem solving",
          "clockwise moment",
          "anticlockwise moment",
        ],
        svgCode: args.svgCode,
        code: args.code,
        published: true,
        updatedAt: Date.now(),
      });
      return { action: "updated", id: existing._id };
    }

    const id = await ctx.db.insert("content", {
      slug: "lever-lab",
      type: "game",
      title: "Moments Master",
      subject: "Physics",
      grade: "Class 10",
      chapter: "Moments and Equilibrium",
      level: "Core",
      minutes: 10,
      concepts: [
        "moments",
        "equilibrium",
        "fulcrum",
        "timed problem solving",
        "clockwise moment",
        "anticlockwise moment",
      ],
      svgCode: args.svgCode,
      code: args.code,
      published: true,
      featured: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { action: "inserted", id };
  },
});

export const seedPeriodicTableGame = internalMutation({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const content = {
      slug: "periodic-table-game",
      type: "game" as const,
      title: "Periodic Table Drill",
      subject: "Chemistry" as const,
      grade: "Class 10",
      chapter: "Periodic Classification of Elements",
      level: "Core" as const,
      minutes: 10,
      concepts: [
        "periodic trends",
        "valency",
        "ionisation energy",
        "metallic character",
      ],
      svgCode: `<svg viewBox="0 0 200 140" width="100%" style="max-height:120px" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  <line x1="20" y1="12" x2="20" y2="128" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  <line x1="60" y1="12" x2="60" y2="128" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  <line x1="100" y1="12" x2="100" y2="128" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  <line x1="140" y1="12" x2="140" y2="128" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  <line x1="180" y1="12" x2="180" y2="128" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  <line x1="12" y1="12" x2="188" y2="12" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  <line x1="12" y1="41" x2="188" y2="41" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  <line x1="12" y1="70" x2="188" y2="70" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  <line x1="12" y1="99" x2="188" y2="99" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  <line x1="12" y1="128" x2="188" y2="128" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>

  <g fill="none" stroke="var(--ink)" stroke-width="1" opacity="0.25">
    <rect x="28" y="28" width="16" height="16"/>
    <rect x="148" y="28" width="16" height="16"/>
    <rect x="28" y="50" width="16" height="16"/>
    <rect x="52" y="50" width="16" height="16"/>
    <rect x="76" y="50" width="16" height="16"/>
    <rect x="100" y="50" width="16" height="16"/>
    <rect x="124" y="50" width="16" height="16"/>
    <rect x="148" y="50" width="16" height="16"/>
    <rect x="28" y="72" width="16" height="16"/>
    <rect x="52" y="72" width="16" height="16"/>
    <rect x="76" y="72" width="16" height="16"/>
    <rect x="100" y="72" width="16" height="16"/>
    <rect x="124" y="72" width="16" height="16"/>
    <rect x="148" y="72" width="16" height="16"/>
    <rect x="52" y="104" width="16" height="16"/>
    <rect x="76" y="104" width="16" height="16"/>
    <rect x="100" y="104" width="16" height="16"/>
    <rect x="124" y="104" width="16" height="16"/>
  </g>

  <line x1="36" y1="100" x2="156" y2="100" stroke="var(--ink)" stroke-width="1.2" stroke-dasharray="4 5"/>
  <text x="30" y="116" font-family="var(--mono)" font-size="10" fill="var(--ink-mute)" letter-spacing="0.06em">Z</text>

  <g>
    <rect x="28" y="50" width="16" height="16" fill="var(--accent)" stroke="var(--ink)" stroke-width="1.5"/>
    <text x="32" y="61" font-family="var(--mono)" font-size="10" fill="var(--ink)" letter-spacing="0.02em">Na</text>
    <animateTransform attributeName="transform" type="translate" values="0 0;48 0;96 22;24 54;0 0" dur="5s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1"/>
  </g>
</svg>`,
      code: args.code,
      published: true,
      featured: false,
    };

    const existing = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", content.slug))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...content,
        updatedAt: now,
      });
      return { action: "updated", id: existing._id };
    }

    const id = await ctx.db.insert("content", {
      ...content,
      createdAt: now,
      updatedAt: now,
    });

    return { action: "inserted", id };
  },
});

export const seedChargingMethods = internalMutation({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const content = {
      slug: "charging-methods",
      type: "simulation" as const,
      title: "Charging Methods",
      subject: "Physics" as const,
      grade: "Class 12",
      chapter: "Electric Charges and Fields",
      level: "Core" as const,
      minutes: 12,
      concepts: [
        "charging by friction",
        "charging by conduction",
        "charging by induction",
        "electron transfer",
        "earthing",
      ],
      svgCode: `<svg viewBox="0 0 200 140" width="100%" style="max-height:120px" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  <line x1="20" y1="12" x2="20" y2="128" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  <line x1="60" y1="12" x2="60" y2="128" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  <line x1="100" y1="12" x2="100" y2="128" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  <line x1="140" y1="12" x2="140" y2="128" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  <line x1="180" y1="12" x2="180" y2="128" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  <line x1="12" y1="12" x2="188" y2="12" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  <line x1="12" y1="41" x2="188" y2="41" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  <line x1="12" y1="70" x2="188" y2="70" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  <line x1="12" y1="99" x2="188" y2="99" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>
  <line x1="12" y1="128" x2="188" y2="128" stroke="var(--ink)" stroke-width="0.5" opacity="0.15"/>

  <rect x="34" y="61" width="54" height="10" rx="5" fill="none" stroke="var(--ink)" stroke-width="1.2"/>
  <circle cx="136" cy="70" r="30" fill="none" stroke="var(--ink)" stroke-width="1.2"/>
  <circle cx="136" cy="70" r="38" fill="none" stroke="var(--ink)" stroke-width="1" opacity="0.12"/>
  <line x1="88" y1="66" x2="106" y2="66" stroke="var(--ink)" stroke-width="1" stroke-dasharray="4 4" opacity="0.25"/>

  <g fill="var(--ink)" opacity="0.25">
    <circle cx="44" cy="56" r="2.4"/>
    <circle cx="64" cy="78" r="2.4"/>
    <circle cx="122" cy="59" r="2.4"/>
    <circle cx="153" cy="80" r="2.4"/>
  </g>

  <line x1="136" y1="100" x2="136" y2="114" stroke="var(--ink)" stroke-width="1.2"/>
  <line x1="122" y1="114" x2="150" y2="114" stroke="var(--ink)" stroke-width="1.2"/>
  <line x1="127" y1="120" x2="145" y2="120" stroke="var(--ink)" stroke-width="1"/>
  <line x1="132" y1="126" x2="140" y2="126" stroke="var(--ink)" stroke-width="1"/>

  <circle cx="56" cy="66" r="3.4" fill="var(--accent)" stroke="var(--ink)" stroke-width="1.5">
    <animate attributeName="cx" values="56;112;136;56" dur="4.5s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.42;0.72;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1"/>
    <animate attributeName="cy" values="66;66;70;66" dur="4.5s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.42;0.72;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1"/>
  </circle>

  <text x="48" y="54" font-family="var(--mono)" font-size="10" fill="var(--ink-mute)" letter-spacing="0.06em">+</text>
  <text x="146" y="74" font-family="var(--mono)" font-size="10" fill="var(--ink-mute)" letter-spacing="0.06em">−</text>
</svg>`,
      code: args.code,
      prompt:
        "Compare friction, conduction, and induction. Which methods need contact, and which leave the total charge unchanged?",
      published: true,
      featured: false,
    };

    const existing = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", content.slug))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...content,
        updatedAt: now,
      });
      return { action: "updated", id: existing._id };
    }

    const id = await ctx.db.insert("content", {
      ...content,
      createdAt: now,
      updatedAt: now,
    });

    return { action: "inserted", id };
  },
});

export const seedElectricCharges = internalMutation({
  args: {
    code: v.string(),
    svgCode: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const content = {
      slug: "electric-charges",
      type: "simulation" as const,
      title: "Electric Field: Solid vs Hollow Sphere",
      subject: "Physics" as const,
      grade: "Class 12",
      chapter: "Electric Charges and Fields",
      level: "Core" as const,
      minutes: 12,
      concepts: [
        "electric field",
        "gauss law",
        "solid sphere",
        "conducting shell",
        "inside outside field",
        "field graph",
      ],
      svgCode: args.svgCode,
      code: args.code,
      prompt:
        "Compare how the electric field changes inside a solid sphere, at the surface, and inside a hollow conducting shell.",
      published: true,
      featured: false,
    };

    const existing = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", content.slug))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...content,
        updatedAt: now,
      });
      return { action: "updated", id: existing._id };
    }

    const id = await ctx.db.insert("content", {
      ...content,
      createdAt: now,
      updatedAt: now,
    });

    return { action: "inserted", id };
  },
});

export const seedElectricFieldExplorer = internalMutation({
  args: {
    code: v.string(),
    svgCode: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const content = {
      slug: "electric-field-explorer",
      type: "simulation" as const,
      title: "Electric Field Explorer",
      subject: "Physics" as const,
      grade: "Class 12",
      chapter: "Electric Charges and Fields",
      level: "Core" as const,
      minutes: 14,
      concepts: [
        "electric charge",
        "electric field",
        "field lines",
        "equipotential",
        "superposition",
        "electric potential",
      ],
      svgCode: args.svgCode,
      code: args.code,
      prompt:
        "Build a dipole, then scan with the probe. Where does the field stay strong while potential nearly cancels?",
      published: true,
      featured: false,
    };

    const existing = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", content.slug))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...content,
        updatedAt: now,
      });
      return { action: "updated", id: existing._id };
    }

    const id = await ctx.db.insert("content", {
      ...content,
      createdAt: now,
      updatedAt: now,
    });

    return { action: "inserted", id };
  },
});

export const seedTransportOfSperm = internalMutation({
  args: {
    code: v.string(),
    svgCode: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const content = {
      slug: "transport-of-sperm",
      type: "simulation" as const,
      title: "Transport of Sperm",
      subject: "Biology" as const,
      grade: "Class 12",
      chapter: "Human Reproduction",
      level: "Core" as const,
      minutes: 12,
      concepts: [
        "seminiferous tubules",
        "epididymis",
        "vas deferens",
        "seminal vesicle",
        "prostate gland",
        "urethra",
      ],
      svgCode: args.svgCode,
      code: args.code,
      prompt:
        "Trace the route. When does the sperm become strongly motile, and which gland protects the urethra first?",
      published: true,
      featured: false,
    };

    const existing = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", content.slug))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...content,
        updatedAt: now,
      });
      return { action: "updated", id: existing._id };
    }

    const id = await ctx.db.insert("content", {
      ...content,
      createdAt: now,
      updatedAt: now,
    });

    return { action: "inserted", id };
  },
});

export const seedScalarVector = internalMutation({
  args: {
    code: v.string(),
    svgCode: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const content = {
      slug: "scalar-vector",
      type: "simulation" as const,
      title: "The Return Journey",
      subject: "Physics" as const,
      grade: "Class 9",
      chapter: "Motion",
      level: "Intro" as const,
      minutes: 10,
      concepts: [
        "distance",
        "displacement",
        "speed",
        "velocity",
        "scalar",
        "vector",
      ],
      svgCode: args.svgCode,
      code: args.code,
      prompt:
        "What happens to displacement when the car returns to its starting point — and why does distance behave differently?",
      published: true,
      featured: false,
    };

    const existing = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", content.slug))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...content,
        updatedAt: now,
      });
      return { action: "updated", id: existing._id };
    }

    const id = await ctx.db.insert("content", {
      ...content,
      createdAt: now,
      updatedAt: now,
    });

    return { action: "inserted", id };
  },
});

export const seedRadiansDegree = internalMutation({
  args: {
    code: v.string(),
    svgCode: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const content = {
      slug: "radians-degree",
      type: "simulation" as const,
      title: "Degrees & Radians",
      subject: "Math" as const,
      grade: "Class 11",
      chapter: "Trigonometric Functions",
      level: "Core" as const,
      minutes: 10,
      concepts: ["degrees", "radians", "unit circle", "arc length"],
      svgCode: args.svgCode,
      code: args.code,
      prompt:
        "Unwrap the arc. Why does 180 degrees become pi radians on a unit circle?",
      published: true,
      featured: false,
    };

    const existing = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", content.slug))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...content,
        updatedAt: now,
      });
      return { action: "updated", id: existing._id };
    }

    const id = await ctx.db.insert("content", {
      ...content,
      createdAt: now,
      updatedAt: now,
    });

    return { action: "inserted", id };
  },
});
