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

    const limit = Math.max(1, Math.min(args.limit ?? 20, 20));
    const rows = await ctx.db
      .query("leaderboard")
      .withIndex("by_content_score", (q) => q.eq("contentId", content._id))
      .order("desc")
      .take(100);

    return rows
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const ta = a.timeTaken ?? Infinity;
        const tb = b.timeTaken ?? Infinity;
        return ta - tb;
      })
      .slice(0, limit);
  },
});

export const submitScore = mutation({
  args: {
    slug: v.string(),
    score: v.number(),
    timeTaken: v.optional(v.number()),
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
        timeTaken: args.timeTaken,
        createdAt: Date.now(),
      });
    }

    const betterScore = normalizedScore > existing.score;
    const sameScoreFasterTime =
      normalizedScore === existing.score &&
      args.timeTaken !== undefined &&
      args.timeTaken < (existing.timeTaken ?? Infinity);

    if (betterScore || sameScoreFasterTime) {
      await ctx.db.patch(existing._id, {
        score: normalizedScore,
        timeTaken: args.timeTaken,
        userName,
        createdAt: Date.now(),
      });
    }

    return existing._id;
  },
});
