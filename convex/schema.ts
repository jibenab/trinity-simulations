import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const contentType = v.union(v.literal("simulation"), v.literal("game"));
const subject = v.union(
  v.literal("Physics"),
  v.literal("Chemistry"),
  v.literal("Biology"),
  v.literal("Math"),
);
const level = v.union(v.literal("Intro"), v.literal("Core"), v.literal("Advanced"));

export default defineSchema({
  content: defineTable({
    slug: v.string(),
    type: contentType,
    title: v.string(),
    subject,
    grade: v.string(),
    chapter: v.string(),
    level,
    minutes: v.number(),
    concepts: v.array(v.string()),
    svgCode: v.string(),
    code: v.string(),
    prompt: v.optional(v.string()),
    published: v.boolean(),
    featured: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_type_published", ["type", "published"])
    .index("by_subject", ["subject"]),
  leaderboard: defineTable({
    contentId: v.id("content"),
    userId: v.id("users"),
    userName: v.string(),
    score: v.number(),
    createdAt: v.number(),
  })
    .index("by_content_score", ["contentId", "score"])
    .index("by_content_user", ["contentId", "userId"]),
  users: defineTable({
    email: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
    tokenIdentifier: v.string(),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"]),
});
