import { Result } from "@/util/result";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserId, tryGetUserId } from "./users";
import { getAuthUserId } from "@convex-dev/auth/server";
import {
  MS_IN_SEC,
  nextDayTimestamp,
  roundDownToDayDate,
  roundDownToDayTimestamp,
  SECS_IN_DAY,
} from "@/util/date";

export function extractDate(d: String) {
  return d.split("T")[0];
}

export const getWaterByDate = query({
  args: {
    dateUnixTimestamp: v.int64(),
  },
  handler: async (ctx, { dateUnixTimestamp }) => {
    const userId = await getUserId(ctx);

    // compute current day and next day
    const currentDay = roundDownToDayTimestamp(Number(dateUnixTimestamp));
    const nextDay = nextDayTimestamp(currentDay);

    const entries = await ctx.db
      .query("water")
      .withIndex("userId", (q) => q.eq("userId", userId))
      // filter the entries to return only those matching a condition
      .filter((q) =>
        q.and(
          q.gte(q.field("dateUnixTimestamp"), BigInt(currentDay)),
          q.lt(q.field("dateUnixTimestamp"), BigInt(nextDay))
        )
      )
      .collect();
    return entries;
  },
});

export const addWaterEntry = mutation({
  args: {
    dateUnixTimestamp: v.int64(),
    waterIntake: v.int64(),
  },
  handler: async (ctx, { dateUnixTimestamp, waterIntake }) => {
    const userId = await getUserId(ctx);

    // TODO: if backdating, ignore hour
    const currentDay = roundDownToDayTimestamp(Number(dateUnixTimestamp));

    await ctx.db.insert("water", {
      userId,
      dateUnixTimestamp,
      waterIntake,
    });
  },
});
