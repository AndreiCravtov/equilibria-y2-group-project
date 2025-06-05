import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getUserGoal = query({
  args: {
    uid: v.string(),
  },
  handler: async (ctx, args) => {
    const entry = await ctx.db
      .query("goals")
      .filter((q) => q.eq(q.field("uid"), args.uid))
      .collect();

    if (!entry) {
      // Return a default goal if none is found
      return { uid: args.uid, water_goal: 2000 };
    }
    return entry;
  },
});

export const addGoal = mutation({
  args: {
    uid: v.string(),
    water_goal: v.int64(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("goals", args);
  },
});