import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { getUserId } from "./users";

export const getUserGoal = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    const entry = await ctx.db
      .query("goals")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    if (!entry) {
      // Return a default goal if none is found
      return { userId, waterGoal: 2000 };
    }
    return entry;
  },
});

export const addGoal = mutation({
  args: {
    waterGoal: v.int64(),
  },
  handler: async (ctx, { waterGoal }) => {
    const userId = await getUserId(ctx);

    await ctx.db.insert("goals", { userId, waterGoal });
  },
});
