import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserId } from "@/convex/users";

// TODO: fix this to use unix timestamp
// export const getWeekData = query({
//   handler: async (ctx, args) => {
//     const userId = await getUserId(ctx);
//     const now = new Date();
//     const days: string[] = [];

//     // Helper to format date as YYYY-MM-DD
//     const formatDateISO = (date: Date) => date.toISOString().split("T")[0];

//     // Helper to format MM.DD label
//     const formatLabel = (date: Date) =>
//       `${(date.getMonth() + 1).toString().padStart(2, "0")}.${date
//         .getDate()
//         .toString()
//         .padStart(2, "0")}`;

//     // Build last 7 days list
//     for (let i = 6; i >= 0; i--) {
//       const d = new Date(now);
//       d.setDate(d.getDate() - i);
//       days.push(formatDateISO(d));
//     }

//     // Fetch scores for user
//     const allScores = await ctx.db
//       .query("scores")
//       .withIndex("userId", (q) => q.eq("userId", userId))
//       .collect();

//     // Build lookup: { date: score }
//     const scoreMap = new Map(allScores.map((s) => [s.date, Number(s.score)]));
//     console.log(scoreMap);

//     // Build full data for 7 days
//     const result = days.map((isoDate) => {
//       const date = new Date(isoDate);
//       console.log(isoDate);
//       return {
//         value: scoreMap.get(isoDate) ?? 0,
//         label: formatLabel(date),
//         frontColor: (scoreMap.get(isoDate) ?? 0) > 15 ? "#FBBF24" : "#0954A5",
//       };
//     });

//     return result;
//   },
// });

export const addScoreFromWaterIntake = internalMutation({
  args: {
    userId: v.id("users"),
    score: v.int64(),
  },
  handler: async (ctx, { userId, score }) => {
    ctx.db.insert("scores", {
      userId,
      score,
    });
  },
});
