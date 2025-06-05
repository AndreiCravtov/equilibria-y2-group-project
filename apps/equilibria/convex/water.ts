import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getWaterByUserAndDate = query({
  args: {
    uid: v.string(), // pass user ID from Convex auth
    date: v.string()
  },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("water")
      .filter((q) =>
        q.and(
          q.eq(q.field("uid"), args.uid),
          q.eq(q.field("date"), args.date)
        )
      )
      .collect();

    return entries;
  },
});

export const addWaterEntry = mutation({
  args: {
    uid: v.string(),
    date: v.string(),
    water_intake: v.int64(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("water", args);
  },
});