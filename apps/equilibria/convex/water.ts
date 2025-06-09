import { Result } from "@/util/result";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserId, tryGetUserId } from "./users";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getWaterByUserAndDate = query({
  args: {
    userId: v.string(), // pass user ID from Convex auth
    date: v.string(),
  },
  handler: async (ctx, { userId, date }) => {
    const entries = await ctx.db
      .query("water")
      .filter((q) =>
        q.and(q.eq(q.field("userId"), userId), q.eq(q.field("date"), date))
      )
      .collect();

    return entries;
  },
});

export const getWaterByDate = query({
  args: {
    date: v.string(),
  },
  handler: async (ctx, { date }) => {
    const userId = await getUserId(ctx);

    return await ctx.db
      .query("water")
      .filter((q) =>
        q.and(q.eq(q.field("userId"), userId), q.eq(q.field("date"), date))
      )
      .collect();
  },
});

export const addWaterEntry = mutation({
  args: {
    date: v.string(),
    waterIntake: v.int64(),
  },
  handler: async (ctx, { date, waterIntake }) => {
    const userId = await getUserId(ctx);

    await ctx.db.insert("water", {
      userId,
      date,
      waterIntake: waterIntake,
    });
  },
});
