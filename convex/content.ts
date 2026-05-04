import { v } from "convex/values";

import { isAdminEmail } from "../lib/isAdmin";
import { query, mutation } from "./_generated/server";
import { requireAdminIdentity, requireIdentity } from "./users";

const subjectValidator = v.union(
  v.literal("Physics"),
  v.literal("Chemistry"),
  v.literal("Biology"),
  v.literal("Math"),
);
const levelValidator = v.union(
  v.literal("Intro"),
  v.literal("Core"),
  v.literal("Advanced"),
);

const contentArgs = {
  slug: v.string(),
  type: v.union(v.literal("simulation"), v.literal("game")),
  title: v.string(),
  subject: subjectValidator,
  grade: v.string(),
  chapter: v.string(),
  level: v.optional(levelValidator),
  minutes: v.optional(v.number()),
  concepts: v.optional(v.array(v.string())),
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
    await requireAdminIdentity(ctx);
    return (await ctx.db.query("content").collect()).sort(
      (a, b) => b.updatedAt - a.updatedAt,
    );
  },
});

export const listAdminWithStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminIdentity(ctx);
    const rows = await ctx.db
      .query("content")
      .withIndex("by_updatedAt")
      .order("desc")
      .take(500);

    const enriched = [];
    for (const item of rows) {
      const stats = await ctx.db
        .query("contentStats")
        .withIndex("by_contentId", (q) => q.eq("contentId", item._id))
        .unique();

      enriched.push({
        ...item,
        stats: {
          simulationUses: stats?.simulationUses ?? 0,
          gamePlays: stats?.gamePlays ?? 0,
          scoreSubmissions: stats?.scoreSubmissions ?? 0,
          lastUsedAt: stats?.lastUsedAt,
        },
      });
    }

    return enriched.sort((a, b) => b.updatedAt - a.updatedAt);
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
    await requireAdminIdentity(ctx);
    return await ctx.db.get(args.id);
  },
});

export const listChapters = query({
  args: {
    subject: v.optional(subjectValidator),
    grade: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminIdentity(ctx);
    const rows = await ctx.db.query("content").collect();

    return Array.from(
      new Set(
        rows
          .filter((item) => {
            if (args.subject && item.subject !== args.subject) return false;
            if (args.grade && item.grade !== args.grade) return false;
            return true;
          })
          .map((item) => item.chapter.trim())
          .filter(Boolean),
      ),
    ).sort((a, b) => a.localeCompare(b));
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
    const { id, ...contentFields } = args;

    if (id) {
      await ctx.db.patch(id, {
        ...contentFields,
        updatedAt: now,
      });
      return id;
    }

    return await ctx.db.insert("content", {
      ...contentFields,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const setFeatured = mutation({
  args: {
    id: v.id("content"),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    if (!isAdminEmail(identity.email)) {
      throw new Error("Forbidden");
    }

    await ctx.db.patch(args.id, {
      featured: args.featured,
      updatedAt: Date.now(),
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
