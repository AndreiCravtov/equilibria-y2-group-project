import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserId } from "@/convex/users";
import { api } from "./_generated/api";
import {
  getCurrentDayTimestamp,
  MS_IN_SEC,
  previousDayTimestamp,
  roundDownToDayDate,
  roundDownToDayTimestamp,
} from "@/util/date";

export const getWeekData = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    // compute timestamps for seven days back
    const weekTimestamps = [];
    let dayTimestamp = getCurrentDayTimestamp();
    for (let i = 0; i < 7; i++) {
      weekTimestamps.push(dayTimestamp);
      dayTimestamp = previousDayTimestamp(dayTimestamp);
    }

    // Smallest value is the earliest timestamp & it should be converted to milliseconds
    // Since the DB uses that instead of seconds timestamp
    const earliestMsTimestamp = weekTimestamps[6] * MS_IN_SEC;

    // Fetch scores for user for the last week
    const allScores = await ctx.db
      .query("scores")
      .withIndex("userId", (q) =>
        q.eq("userId", userId).gte("_creationTime", earliestMsTimestamp)
      )
      .collect();

    // Accumulate the score for each day
    const accumulatedData: Record<number, number> = {};
    for (let s of allScores) {
      // Compute timestamp and slot in for the right day
      const timestamp = roundDownToDayTimestamp(
        Number(s._creationTime) / MS_IN_SEC
      );

      // Find the right slot and add to the score, creating it if it doesn't exist
      if (accumulatedData[timestamp] === undefined) {
        accumulatedData[timestamp] = Number(s.score);
      } else {
        accumulatedData[timestamp] += Number(s.score);
      }
    }

    return accumulatedData;
  },
});

export const addScoreFromWaterIntake = internalMutation({
  args: {
    dateUnixTimestamp: v.int64(),
    waterIntake: v.int64(),
  },
  handler: async (ctx, { dateUnixTimestamp, waterIntake }) => {
    const profile = await ctx.runQuery(api.userProfiles.getUserProfile);

    // adjust score function to actually be good
    ctx.db.insert("scores", {
      userId: profile.userId,
      score: waterIntake,
    });
  },
});
