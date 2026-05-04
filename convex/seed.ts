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
    const existing = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", "periodic-table-game"))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        code: args.code,
        updatedAt: Date.now(),
      });
      return { action: "updated", id: existing._id };
    }

    const id = await ctx.db.insert("content", {
      slug: "periodic-table-game",
      type: "game",
      title: "Periodic Table Drill",
      subject: "Chemistry",
      grade: "Class 10",
      chapter: "Periodic Classification of Elements",
      level: "Core",
      minutes: 10,
      concepts: [
        "periodic trends",
        "valency",
        "ionisation energy",
        "metallic character",
      ],
      svgCode: `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
  <rect width="80" height="60" fill="#0C1115"/>
  <g fill="none" stroke="#EFF2F5" stroke-width="1">
    <rect x="10" y="12" width="10" height="10"/>
    <rect x="58" y="12" width="10" height="10"/>
    <rect x="10" y="26" width="10" height="10"/>
    <rect x="24" y="26" width="10" height="10"/>
    <rect x="38" y="26" width="10" height="10"/>
    <rect x="52" y="26" width="10" height="10"/>
    <rect x="10" y="40" width="10" height="10"/>
    <rect x="24" y="40" width="10" height="10"/>
    <rect x="38" y="40" width="10" height="10"/>
    <rect x="52" y="40" width="10" height="10"/>
  </g>
  <text x="14.5" y="19.5" fill="#EFF2F5" font-family="monospace" font-size="5" text-anchor="middle">A</text>
  <text x="63" y="19.5" fill="#EFF2F5" font-family="monospace" font-size="5" text-anchor="middle">B</text>
  <circle cx="43" cy="45" r="2.5" fill="oklch(0.52 0.12 200)"/>
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
      svgCode: `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
  <rect width="80" height="60" fill="#0C1115"/>
  <circle cx="54" cy="32" r="13" fill="none" stroke="#EFF2F5" stroke-width="1.5"/>
  <rect x="13" y="25" width="30" height="8" rx="4" fill="none" stroke="#EFF2F5" stroke-width="1.5"/>
  <g fill="oklch(0.52 0.12 200)">
    <circle cx="23" cy="18" r="2"/>
    <circle cx="32" cy="40" r="2"/>
    <circle cx="49" cy="28" r="2"/>
    <circle cx="59" cy="36" r="2"/>
  </g>
  <g stroke="#EFF2F5" stroke-width="1.2" stroke-linecap="round">
    <path d="M37 20c6-7 15-7 22 0"/>
    <path d="M37 20l5 .4"/>
    <path d="M37 20l2.2 4.5"/>
  </g>
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
