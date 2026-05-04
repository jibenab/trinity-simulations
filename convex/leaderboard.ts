import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { incrementContentStats } from "./usage";
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
    const normalizedScore = Number.isFinite(args.score)
      ? Math.max(0, Math.floor(args.score))
      : 0;
    const normalizedTimeTaken =
      args.timeTaken !== undefined && Number.isFinite(args.timeTaken)
        ? Math.max(0, Math.floor(args.timeTaken))
        : undefined;

    const content = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!content || content.type !== "game") {
      throw new Error("Game not found");
    }

    const userId = await ensureViewerRecord(ctx, identity);
    const userName = identity.name ?? "Student";

    const existing = await ctx.db
      .query("leaderboard")
      .withIndex("by_content_user", (q) =>
        q.eq("contentId", content._id).eq("userId", userId),
      )
      .unique();

    if (!existing) {
      await incrementContentStats(ctx, content._id, { scoreSubmissions: 1 });
      return await ctx.db.insert("leaderboard", {
        contentId: content._id,
        userId,
        userName,
        score: normalizedScore,
        timeTaken: normalizedTimeTaken,
        createdAt: Date.now(),
      });
    }

    const betterScore = normalizedScore > existing.score;
    const sameScoreFasterTime =
      normalizedScore === existing.score &&
      normalizedTimeTaken !== undefined &&
      normalizedTimeTaken < (existing.timeTaken ?? Infinity);

    if (betterScore || sameScoreFasterTime) {
      await ctx.db.patch(existing._id, {
        score: normalizedScore,
        timeTaken: normalizedTimeTaken,
        userName,
        createdAt: Date.now(),
      });
    }

    await incrementContentStats(ctx, content._id, { scoreSubmissions: 1 });

    return existing._id;
  },
});
