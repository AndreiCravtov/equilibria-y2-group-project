import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {getAuthUserId} from "@convex-dev/auth/server";

export const getUserGoal = query({
  args: {},
  handler: async (ctx, args) => {
    const uid = await getAuthUserId(ctx);
    const entry = await ctx.db
      .query("goals")
      .filter((q) => q.eq(q.field("uid"), uid))
      .collect();

    if (!entry) {
      // Return a default goal if none is found
      return { uid, water_goal: 2000 };
    }
    return entry;
  },
});

export const addGoal = mutation({
  args: {
    water_goal: v.int64(),
  },
  handler: async (ctx, args) => {
    const uid = await getAuthUserId(ctx);
    if (!uid) return;
    await ctx.db.insert("goals", {uid, water_goal: args.water_goal});
  },
});