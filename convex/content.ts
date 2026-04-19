import { v } from "convex/values";

import { isAdminEmail } from "../lib/isAdmin";
import { query, mutation } from "./_generated/server";
import { requireIdentity } from "./users";

const contentArgs = {
  slug: v.string(),
  type: v.union(v.literal("simulation"), v.literal("game")),
  title: v.string(),
  subject: v.union(
    v.literal("Physics"),
    v.literal("Chemistry"),
    v.literal("Biology"),
    v.literal("Math"),
  ),
  grade: v.string(),
  chapter: v.string(),
  level: v.union(v.literal("Intro"), v.literal("Core"), v.literal("Advanced")),
  minutes: v.number(),
  concepts: v.array(v.string()),
  svgCode: v.string(),
  code: v.string(),
  prompt: v.optional(v.string()),
  published: v.boolean(),
  featured: v.boolean(),
};

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("content").collect();
    return rows
      .filter((item) => item.published)
      .sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return b.updatedAt - a.updatedAt;
      });
  },
});

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    return (await ctx.db.query("content").collect()).sort(
      (a, b) => b.updatedAt - a.updatedAt,
    );
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const getById = query({
  args: { id: v.id("content") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("content")),
    ...contentArgs,
  },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    if (!isAdminEmail(identity.email)) {
      throw new Error("Forbidden");
    }

    const existingBySlug = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existingBySlug && existingBySlug._id !== args.id) {
      throw new Error("Slug already exists");
    }

    const now = Date.now();

    if (args.id) {
      await ctx.db.patch(args.id, {
        ...args,
        updatedAt: now,
      });
      return args.id;
    }

    return await ctx.db.insert("content", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("content") },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    if (!isAdminEmail(identity.email)) {
      throw new Error("Forbidden");
    }

    await ctx.db.delete(args.id);
  },
});
