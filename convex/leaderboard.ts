import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { ensureViewerRecord, requireIdentity } from "./users";

export const topScores = query({
  args: {
    slug: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const content = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!content || content.type !== "game") {
      return [];
    }

    const limit = Math.max(1, Math.min(args.limit ?? 10, 50));
    return await ctx.db
      .query("leaderboard")
      .withIndex("by_content_score", (q) => q.eq("contentId", content._id))
      .order("desc")
      .take(limit);
  },
});

export const submitScore = mutation({
  args: {
    slug: v.string(),
    score: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const normalizedScore = Math.max(0, Math.floor(args.score));

    const content = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!content || content.type !== "game") {
      throw new Error("Game not found");
    }

    const userId = await ensureViewerRecord(ctx, identity);
    const userName = identity.name ?? "Student";

    const existing = (
      await ctx.db
        .query("leaderboard")
        .withIndex("by_content_score", (q) => q.eq("contentId", content._id))
        .collect()
    ).find((row) => row.userId === userId);

    if (!existing) {
      return await ctx.db.insert("leaderboard", {
        contentId: content._id,
        userId,
        userName,
        score: normalizedScore,
        createdAt: Date.now(),
      });
    }

    if (normalizedScore > existing.score) {
      await ctx.db.patch(existing._id, {
        score: normalizedScore,
        userName,
        createdAt: Date.now(),
      });
    }

    return existing._id;
  },
});
