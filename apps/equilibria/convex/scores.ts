import { internalMutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserId } from "@/convex/users";
import { api } from "./_generated/api";
import {
  getCurrentDayTimestamp,
  MS_IN_SEC,
  previousDayTimestamp,
  roundDownToDayDate,
  roundDownToDayTimestamp,
  SECS_IN_HOUR,
} from "@/util/date";
import { Id } from "./_generated/dataModel";
import { A } from "@mobily/ts-belt";

export const getWeekScores = query({
  args: {},
  handler: async (ctx, _args) => {
    const userId = await getUserId(ctx);

    // compute timestamps for seven days back
    const weekTimestamps = [];
    let dayTimestamp = getCurrentDayTimestamp();
    for (let i = 0; i < 7; i++) {
      weekTimestamps.push(dayTimestamp);
      dayTimestamp = previousDayTimestamp(dayTimestamp);
    }

    // Smallest value is the earliest timestamp & is last element
    const earliestTimestamp = weekTimestamps[weekTimestamps.length - 1];

    // Fetch scores for user for the last week
    const allScoresEver = await ctx.db
      .query("scores")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();
    const allScoresLastWeek = (
      await Promise.all(
        allScoresEver.map(async (s) => {
          const waterEntry = await ctx.db.get(s.waterId);
          if (waterEntry === null)
            throw new ConvexError(
              `Data corruption error: water ID ${s.userId} doesn't exist`
            );
          return {
            ...s,
            dateUnixTimestamp: waterEntry.dateUnixTimestamp,
          };
        })
      )
    ).filter((s) => s.dateUnixTimestamp >= earliestTimestamp);

    // Accumulate the score for each day
    const accumulatedData: Record<number, number> = {};
    weekTimestamps.forEach((t) => {
      accumulatedData[t] = 0;
    });
    for (let s of allScoresLastWeek) {
      // Compute timestamp and slot in for the right day
      const timestamp = roundDownToDayTimestamp(Number(s.dateUnixTimestamp));
      accumulatedData[timestamp] += Number(s.score);
    }

    return accumulatedData;
  },
});

/**
 * Returns username-score pairs in descending order
 */
export const getDailyLeaderboard = query({
  args: {},
  handler: async (ctx, _args) => {
    // grab all friends of user
    const userId = await getUserId(ctx);

    const friendLinks = await ctx.db
      .query("friends")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();

    // combine into one giant ID list
    const leaderboardIds = friendLinks.map((l) => l.friendId);
    leaderboardIds.push(userId);

    // Grab all score records for those in the friend-list, and filter for those today
    const todayTimestamp = getCurrentDayTimestamp();
    const allScoresFromLeaderboardParticipants = (
      await ctx.db.query("scores").collect()
    ).filter((s) => leaderboardIds.includes(s.userId));
    const leaderboardTodayScores = (
      await Promise.all(
        allScoresFromLeaderboardParticipants.map(async (s) => {
          const waterEntry = await ctx.db.get(s.waterId);
          if (waterEntry === null)
            throw new ConvexError(
              `Data corruption error: water ID ${s.userId} doesn't exist`
            );
          return {
            ...s,
            dateUnixTimestamp: waterEntry.dateUnixTimestamp,
          };
        })
      )
    ).filter((s) => Number(s.dateUnixTimestamp) >= todayTimestamp);

    // Tally up the scores to create a leaderboard output
    const leaderboardDataId: Record<Id<"users">, number> = {};
    leaderboardIds.forEach((id) => {
      leaderboardDataId[id] = 0;
    });
    for (const s of leaderboardTodayScores) {
      leaderboardDataId[s.userId] += Number(s.score);
    }

    // Obtain usernames from user IDs for better data presentation
    const leaderboardDataUsername: {
      username: string;
      name: string;
      score: number;
    }[] = [];
    for (const id of leaderboardIds) {
      const user = await ctx.db.get(id);
      const profile = await ctx.db
        .query("userProfiles")
        .withIndex("userId", (q) => q.eq("userId", id))
        .unique();
      if (user == null || profile == null)
        throw new ConvexError("Data corruption error: user not found by ID");
      leaderboardDataUsername.push({
        username: user.username,
        name: profile.name,
        score: leaderboardDataId[id],
      });
    }
    leaderboardDataUsername.sort((l, r) => r.score - l.score);

    // Add in their place in the leaderboard
    const leaderboardDataRanked = A.mapWithIndex(
      leaderboardDataUsername,
      (ix, d) => ({
        ...d,
        place: ix + 1,
      })
    );
    return leaderboardDataRanked;
  },
});

export const getDailyScore = query({
  args: {},
  handler: async (ctx, _args) => {
    // grab all friends of user
    const userId = await getUserId(ctx);

    // Grab all score records by the user and filter for those for today
    const todayTimestamp = getCurrentDayTimestamp();
    const allScoresByUser = await ctx.db
      .query("scores")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();
    const userScoresToday = (
      await Promise.all(
        allScoresByUser.map(async (s) => {
          const waterEntry = await ctx.db.get(s.waterId);
          if (waterEntry === null)
            throw new ConvexError(
              `Data corruption error: water ID ${s.userId} doesn't exist`
            );
          return {
            ...s,
            dateUnixTimestamp: waterEntry.dateUnixTimestamp,
          };
        })
      )
    ).filter((s) => Number(s.dateUnixTimestamp) >= todayTimestamp);

    // Add them all up and return final score
    const userScores = userScoresToday.map((s) => s.score);
    return A.reduce(userScores, 0, (a, b) => a + Number(b));
  },
});

export const addScoreFromWaterIntake = internalMutation({
  args: {
    waterEntryId: v.id("water"),
  },
  handler: async (ctx, { waterEntryId }) => {
    const WATER_FREQ_PENALTY = 0.15;
    const FREQ_PENALTY_COOLDOWN = SECS_IN_HOUR;

    // Grab user profile and water entry
    const profile = await ctx.runQuery(api.userProfiles.getUserProfile);
    const waterEntry = await ctx.db.get(waterEntryId);
    if (waterEntry === null)
      throw new ConvexError(
        `Water entry with ID ${waterEntryId} doesn't exist`
      );

    let totalPenalty = 0;

    // Grab all previous water entries within the penalty window
    const earliestWaterEntryTimestamp =
      waterEntry.dateUnixTimestamp - BigInt(FREQ_PENALTY_COOLDOWN);
    const previousEntries = await ctx.db
      .query("water")
      .withIndex("by_user_timestamp", (q) =>
        q
          .gte("dateUnixTimestamp", earliestWaterEntryTimestamp)
          .lt("dateUnixTimestamp", waterEntry.dateUnixTimestamp)
      )
      .filter((q) => q.eq(q.field("userId"), profile.userId))
      .collect();
    previousEntries.sort((l, r) =>
      Number(r.dateUnixTimestamp - l.dateUnixTimestamp)
    );
    console.log(previousEntries);

    // Use most recent entry to apply frequency penalty
    if (previousEntries[0] !== undefined) {
      const mostPreviousEntryTimestamp = Number(
        previousEntries[0].dateUnixTimestamp
      );
      const penaltyFinishesTimestamp =
        mostPreviousEntryTimestamp + FREQ_PENALTY_COOLDOWN;
      const waterEntryTimestamp = Number(waterEntry.dateUnixTimestamp);

      // Penalty easing coefficient = how close it is to finishing (linear)
      const coeff =
        (penaltyFinishesTimestamp - waterEntryTimestamp) /
        FREQ_PENALTY_COOLDOWN;
      console.log("coeff", coeff);
      totalPenalty += coeff * WATER_FREQ_PENALTY;
      console.log("totalPenalty", totalPenalty);
    }

    // Compute score as percentage of user goal +buffs -penalties
    const percentage =
      (Number(waterEntry.waterIntake) / Number(profile.dailyTarget)) * 100;
    console.log("percentage", percentage);
    const score = Math.round(percentage * (1 - totalPenalty));

    // adjust score function to actually be good
    ctx.db.insert("scores", {
      userId: profile.userId,
      waterId: waterEntryId,
      score: BigInt(score),
    });
  },
});

export const removeScoreFromWaterIntake = internalMutation({
  args: {
    waterEntryId: v.id("water"),
  },
  handler: async (ctx, { waterEntryId }) => {
    // Grab scores
    const previousEntries = await ctx.db
      .query("scores")
      .withIndex("waterId", (q) => q.eq("waterId", waterEntryId))
      .collect();
    await Promise.all(previousEntries.map((e) => ctx.db.delete(e._id)));
  },
});
