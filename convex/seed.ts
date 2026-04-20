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
