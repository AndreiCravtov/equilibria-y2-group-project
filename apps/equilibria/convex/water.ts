import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {getAuthUserId} from "@convex-dev/auth/server";

export const getWaterByDate = query({
  args: {// pass user ID from Convex auth
    date: v.string()
  },
  handler: async (ctx, args) => {
    const uid = await getAuthUserId(ctx);
    const entries = await ctx.db
      .query("water")
      .filter((q) =>
        q.and(
          q.eq(q.field("uid"), uid),
          q.eq(q.field("date"), args.date)
        )
      )
      .collect();

    return entries;
  },
});

export const addWaterEntry = mutation({
  args: {
    date: v.string(),
    water_intake: v.int64(),
  },
  handler: async (ctx, args) => {
    const uid = await getAuthUserId(ctx);
    if (!uid) return;
    await ctx.db.insert("water", {uid, date: args.date, water_intake: args.water_intake});
  },
});