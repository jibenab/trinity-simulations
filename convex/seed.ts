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

export const seedCentreOfGravity = internalMutation({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const content = {
      slug: "centre-of-gravity",
      type: "simulation" as const,
      title: "Centre of Gravity",
      subject: "Physics" as const,
      grade: "Class 10",
      chapter: "Centre of Gravity",
      level: "Core" as const,
      minutes: 12,
      concepts: [
        "centre of gravity",
        "base of support",
        "stability",
        "toppling",
        "balance",
        "plumb line",
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

  <line x1="50" y1="116" x2="150" y2="116" stroke="var(--ink)" stroke-width="2"/>
  <line x1="73" y1="116" x2="127" y2="116" stroke="var(--accent)" stroke-width="4" stroke-linecap="round"/>

  <g transform="translate(100 70) rotate(-10)">
    <rect x="-26" y="-34" width="52" height="68" rx="4" fill="none" stroke="var(--ink)" stroke-width="1.4"/>
    <line x1="-26" y1="34" x2="26" y2="34" stroke="var(--ink)" stroke-width="1.2"/>
    <circle cx="0" cy="2" r="7" fill="var(--accent)" stroke="var(--ink)" stroke-width="1.4">
      <animate attributeName="cy" values="0;6;0" dur="3.2s" repeatCount="indefinite"/>
    </circle>
    <line x1="0" y1="2" x2="0" y2="48" stroke="var(--accent)" stroke-width="1.3" stroke-dasharray="4 4"/>
  </g>

  <path d="M75 116 L125 116" stroke="var(--accent)" stroke-width="1.4"/>
  <path d="M142 108 l10 8 l-10 8" fill="none" stroke="var(--ink)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="77" y="34" font-family="var(--mono)" font-size="10" fill="var(--ink-mute)" letter-spacing="0.06em">CoG</text>
</svg>`,
      code: args.code,
      prompt:
        "Move the centre of gravity and watch the plumb line. When does the object stay balanced, and when does it topple?",
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

export const seedContinuousChargeDistribution = internalMutation({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const content = {
      slug: "continuous-charge-distribution",
      type: "simulation" as const,
      title: "Continuous Charge Distribution",
      subject: "Physics" as const,
      grade: "Class 12",
      chapter: "Electric Charges and Fields",
      level: "Core" as const,
      minutes: 12,
      concepts: [
        "continuous charge distribution",
        "linear charge density",
        "surface charge density",
        "volume charge density",
        "electric field",
        "charge density",
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

  <ellipse cx="100" cy="70" rx="55" ry="28" fill="none" stroke="var(--ink)" stroke-width="1.2"/>
  <ellipse cx="100" cy="70" rx="38" ry="19" fill="none" stroke="var(--ink)" stroke-width="1" opacity="0.25"/>
  <line x1="45" y1="70" x2="155" y2="70" stroke="var(--ink)" stroke-width="1" opacity="0.18"/>
  <line x1="100" y1="42" x2="100" y2="98" stroke="var(--ink)" stroke-width="1" opacity="0.18"/>

  <g fill="var(--ink)" opacity="0.25">
    <circle cx="67" cy="58" r="2.2"/>
    <circle cx="81" cy="78" r="2.2"/>
    <circle cx="102" cy="53" r="2.2"/>
    <circle cx="122" cy="82" r="2.2"/>
    <circle cx="137" cy="66" r="2.2"/>
  </g>

  <g stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" fill="none">
    <path d="M100 70 C118 47 145 42 168 52"/>
    <path d="M100 70 C123 64 146 72 168 89"/>
    <path d="M100 70 C83 49 62 40 35 49"/>
    <path d="M100 70 C78 82 58 88 32 83"/>
  </g>

  <circle cx="100" cy="70" r="8" fill="var(--accent)" stroke="var(--ink)" stroke-width="1.5">
    <animate attributeName="r" values="7;10;7" dur="3s" repeatCount="indefinite"/>
  </circle>
  <text x="73" y="118" font-family="var(--mono)" font-size="10" fill="var(--ink-mute)" letter-spacing="0.06em">dq = λdl</text>
</svg>`,
      code: args.code,
      prompt:
        "Switch between line, surface, and volume charge. How does the density model change the field shape?",
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

export const seedOneDimensionalMotion = internalMutation({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const content = {
      slug: "1d-motion",
      type: "simulation" as const,
      title: "1D Motion",
      subject: "Physics" as const,
      grade: "Class 9",
      chapter: "Motion",
      level: "Intro" as const,
      minutes: 10,
      concepts: [
        "position",
        "velocity",
        "acceleration",
        "uniform motion",
        "motion graphs",
        "kinematics",
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

  <line x1="24" y1="86" x2="176" y2="86" stroke="var(--ink)" stroke-width="1.2"/>
  <line x1="32" y1="80" x2="32" y2="92" stroke="var(--ink)" stroke-width="1"/>
  <line x1="168" y1="80" x2="168" y2="92" stroke="var(--ink)" stroke-width="1"/>
  <text x="27" y="105" font-family="var(--mono)" font-size="8.5" fill="var(--ink-mute)" letter-spacing="0.04em">0</text>
  <text x="160" y="105" font-family="var(--mono)" font-size="8.5" fill="var(--ink-mute)" letter-spacing="0.04em">x</text>

  <path d="M36 62 C62 54 82 54 104 62 S146 77 168 60" fill="none" stroke="var(--accent)" stroke-width="1.8"/>
  <path d="M36 118 L70 98 L104 104 L136 72 L168 42" fill="none" stroke="var(--ink)" stroke-width="1.2" stroke-dasharray="5 4" opacity="0.45"/>

  <g>
    <rect x="75" y="72" width="38" height="18" rx="4" fill="var(--accent)" stroke="var(--ink)" stroke-width="1.4"/>
    <circle cx="84" cy="93" r="4.5" fill="var(--ink)"/>
    <circle cx="104" cy="93" r="4.5" fill="var(--ink)"/>
    <animateTransform attributeName="transform" type="translate" values="-38 0;44 0;-38 0" dur="5s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.55;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"/>
  </g>

  <text x="40" y="36" font-family="var(--mono)" font-size="10" fill="var(--ink-mute)" letter-spacing="0.06em">v = u + at</text>
</svg>`,
      code: args.code,
      prompt:
        "Predict the x-t and v-t graph shapes before pressing play. What changes when acceleration reverses the motion?",
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
