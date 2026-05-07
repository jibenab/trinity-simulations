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
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", "lever-lab"))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        code: args.code,
        updatedAt: Date.now(),
      });
      return { action: "updated", id: existing._id };
    }

    const id = await ctx.db.insert("content", {
      slug: "lever-lab",
      type: "game",
      title: "Lever Lab",
      subject: "Physics",
      grade: "Class 8",
      chapter: "Force and Pressure",
      level: "Core",
      minutes: 10,
      concepts: ["lever", "fulcrum", "load", "effort", "mechanical advantage"],
      svgCode: `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
  <rect width="80" height="60" fill="#0C1115"/>
  <line x1="8" y1="38" x2="72" y2="38" stroke="#EFF2F5" stroke-width="2.5" stroke-linecap="round"/>
  <polygon points="40,38 32,52 48,52" fill="none" stroke="#EFF2F5" stroke-width="1.5" stroke-linejoin="round"/>
  <rect x="10" y="26" width="14" height="12" fill="none" stroke="#EFF2F5" stroke-width="1.2"/>
  <line x1="63" y1="24" x2="63" y2="38" stroke="#EFF2F5" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="59" y1="26" x2="67" y2="26" stroke="#EFF2F5" stroke-width="1.5" stroke-linecap="round"/>
</svg>`,
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
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const content = {
      slug: "electric-charges",
      type: "simulation" as const,
      title: "Electric Charges",
      subject: "Physics" as const,
      grade: "Class 12",
      chapter: "Electric Charges and Fields",
      level: "Core" as const,
      minutes: 12,
      concepts: [
        "electric charge",
        "conductors",
        "charge redistribution",
        "electrostatic equilibrium",
        "charging by contact",
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

  <g opacity="0.18">
    <circle cx="70" cy="70" r="36" fill="none" stroke="var(--ink)" stroke-width="1"/>
    <circle cx="132" cy="70" r="24" fill="none" stroke="var(--ink)" stroke-width="1"/>
  </g>

  <line x1="98" y1="70" x2="108" y2="70" stroke="var(--ink)" stroke-width="1" stroke-dasharray="3 4"/>
  <circle cx="70" cy="70" r="34" fill="none" stroke="var(--ink)" stroke-width="1.2"/>
  <circle cx="132" cy="70" r="24" fill="none" stroke="var(--ink)" stroke-width="1.2"/>
  <path d="M49 43 C64 30 84 32 96 46" fill="none" stroke="var(--ink)" stroke-width="1" opacity="0.25"/>
  <path d="M112 50 C124 40 142 40 153 52" fill="none" stroke="var(--ink)" stroke-width="1" opacity="0.25"/>

  <g fill="var(--ink)">
    <circle cx="70" cy="37" r="3.2"/>
    <circle cx="40" cy="73" r="3.2"/>
    <circle cx="72" cy="103" r="3.2"/>
    <circle cx="101" cy="66" r="3.2"/>
    <circle cx="132" cy="47" r="2.8"/>
    <circle cx="153" cy="75" r="2.8"/>
  </g>

  <g>
    <circle cx="70" cy="70" r="4.8" fill="var(--accent)" stroke="var(--ink)" stroke-width="1.5">
      <animate attributeName="cx" values="70;132;70" dur="4s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"/>
      <animate attributeName="cy" values="70;70;70" dur="4s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"/>
    </circle>
  </g>

  <text x="64" y="76" font-family="var(--mono)" font-size="10" fill="var(--ink-mute)" letter-spacing="0.06em">+</text>
  <text x="126" y="76" font-family="var(--mono)" font-size="10" fill="var(--ink-mute)" letter-spacing="0.06em">q</text>
</svg>`,
      code: args.code,
      prompt:
        "Bring conductors into contact. How does the final charge depend on conductor size?",
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
        "ejaculatory duct",
        "urethra",
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

  <circle cx="54" cy="78" r="35" fill="none" stroke="var(--ink)" stroke-width="1.2"/>
  <circle cx="54" cy="78" r="22" fill="none" stroke="var(--ink)" stroke-width="1" opacity="0.12"/>
  <circle cx="86" cy="52" r="16" fill="none" stroke="var(--ink)" stroke-width="1.2"/>
  <circle cx="150" cy="73" r="24" fill="none" stroke="var(--ink)" stroke-width="1.2"/>

  <path d="M40 78 C35 66 54 61 56 75 C59 93 80 88 74 70 C69 53 95 52 95 70 C95 92 121 91 118 72 C115 53 137 51 150 66" fill="none" stroke="var(--ink)" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M150 66 C165 76 165 94 149 103" fill="none" stroke="var(--ink)" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M73 49 C88 36 112 36 128 48" fill="none" stroke="var(--ink)" stroke-width="1" stroke-dasharray="4 5" opacity="0.28"/>
  <path d="M118 96 C102 111 77 113 60 99" fill="none" stroke="var(--ink)" stroke-width="1" stroke-dasharray="4 5" opacity="0.28"/>

  <g fill="none" stroke="var(--ink)" stroke-width="1" opacity="0.12">
    <circle cx="42" cy="72" r="4"/>
    <circle cx="58" cy="88" r="4"/>
    <circle cx="77" cy="68" r="4"/>
    <circle cx="99" cy="80" r="4"/>
    <circle cx="126" cy="70" r="4"/>
  </g>

  <circle cx="40" cy="78" r="4.5" fill="var(--accent)" stroke="var(--ink)" stroke-width="1.5">
    <animate attributeName="cx" values="40;56;74;95;118;150;149;40" dur="5s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.15;0.3;0.45;0.6;0.8;0.9;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1"/>
    <animate attributeName="cy" values="78;75;70;70;72;66;103;78" dur="5s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.15;0.3;0.45;0.6;0.8;0.9;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1"/>
  </circle>

  <text x="36" y="119" font-family="var(--mono)" font-size="10" fill="var(--ink-mute)" letter-spacing="0.06em">TUBULE</text>
  <text x="131" y="119" font-family="var(--mono)" font-size="10" fill="var(--ink-mute)" letter-spacing="0.06em">DUCT</text>
</svg>`,
      code: args.code,
      prompt:
        "Trace each stage. Where does sperm mature before it enters the vas deferens?",
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
