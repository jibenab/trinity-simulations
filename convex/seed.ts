import { mutation } from "./_generated/server";
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
