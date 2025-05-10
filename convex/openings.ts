import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const saveOpening = mutation({
  args: {
    name: v.string(),
    pgn: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    return await ctx.db.insert("openings", {
      userId,
      name: args.name,
      pgn: args.pgn,
    });
  },
});

export const listOpenings = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    
    return await ctx.db
      .query("openings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});
