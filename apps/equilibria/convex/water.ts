import { Result } from "@/util/result";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserId, tryGetUserId } from "./users";
import { getAuthUserId } from "@convex-dev/auth/server";

export function extractDate(d: String) {
  return d.split("T")[0];
}

export const getWaterByDate = query({
  args: {
    date: v.string(),
  },
  handler: async (ctx, { date }) => {
    const userId = await getUserId(ctx);

    const entries = await ctx.db
      .query("water")
      .filter((q) => q.and(q.eq(q.field("userId"), userId)))
      .collect();

    // filter the entries to return only those matching a condition
    return entries.filter((entry) => extractDate(entry.date) === date);
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
