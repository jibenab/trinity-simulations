import { query } from "./_generated/server";
import type { GenericMutationCtx, GenericQueryCtx } from "convex/server";

import { isAdminEmail } from "../lib/isAdmin";

type ViewerIdentity = NonNullable<Awaited<ReturnType<GenericQueryCtx<any>["auth"]["getUserIdentity"]>>>;

export async function requireIdentity(
  ctx: GenericQueryCtx<any> | GenericMutationCtx<any>,
) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthenticated");
  }
  return identity;
}

export async function requireAdminIdentity(
  ctx: GenericQueryCtx<any> | GenericMutationCtx<any>,
) {
  const identity = await requireIdentity(ctx);
  if (!isAdminEmail(identity.email)) {
    throw new Error("Forbidden");
  }
  return identity;
}

export async function ensureViewerRecord(
  ctx: GenericMutationCtx<any>,
  identity: ViewerIdentity,
) {
  const existing = await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .unique();

  const email = identity.email ?? `${identity.subject}@unknown.local`;
  const name = identity.name ?? email.split("@")[0] ?? "Student";
  const image =
    typeof identity.pictureUrl === "string" ? identity.pictureUrl : undefined;

  if (existing) {
    await ctx.db.patch(existing._id, {
      email,
      name,
      image,
      tokenIdentifier: identity.tokenIdentifier,
    });
    return existing._id;
  }

  return await ctx.db.insert("users", {
    email,
    name,
    image,
    tokenIdentifier: identity.tokenIdentifier,
  });
}

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    return {
      email: identity.email ?? user?.email ?? null,
      name: identity.name ?? user?.name ?? "Student",
      image:
        (typeof identity.pictureUrl === "string" ? identity.pictureUrl : undefined) ??
        user?.image,
      isAdmin: isAdminEmail(identity.email),
    };
  },
});

export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return isAdminEmail(identity?.email);
  },
});
