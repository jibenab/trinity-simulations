import { v } from "convex/values";

import type { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { mutation } from "./_generated/server";
import { requireIdentity } from "./users";

type StatIncrement = {
  simulationUses?: number;
  gamePlays?: number;
  scoreSubmissions?: number;
};

export async function incrementContentStats(
  ctx: MutationCtx,
  contentId: Id<"content">,
  increment: StatIncrement,
) {
  const now = Date.now();
  const existing = await ctx.db
    .query("contentStats")
    .withIndex("by_contentId", (q) => q.eq("contentId", contentId))
    .unique();

  if (!existing) {
    await ctx.db.insert("contentStats", {
      contentId,
      simulationUses: increment.simulationUses ?? 0,
      gamePlays: increment.gamePlays ?? 0,
      scoreSubmissions: increment.scoreSubmissions ?? 0,
      lastUsedAt:
        increment.simulationUses || increment.gamePlays ? now : undefined,
      updatedAt: now,
    });
    return;
  }

  await ctx.db.patch(existing._id, {
    simulationUses: existing.simulationUses + (increment.simulationUses ?? 0),
    gamePlays: existing.gamePlays + (increment.gamePlays ?? 0),
    scoreSubmissions:
      existing.scoreSubmissions + (increment.scoreSubmissions ?? 0),
    lastUsedAt:
      increment.simulationUses || increment.gamePlays
        ? now
        : existing.lastUsedAt,
    updatedAt: now,
  });
}

export const recordContentUse = mutation({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    await requireIdentity(ctx);

    const content = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!content || !content.published) {
      return null;
    }

    await incrementContentStats(
      ctx,
      content._id,
      content.type === "game" ? { gamePlays: 1 } : { simulationUses: 1 },
    );

    return null;
  },
});
