import { query } from "./_generated/server";
import { getUserId } from "./users";
import { USER_PROFILE_MISSING } from "./errors";

export const tryGetUserProfile = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    return (
      (await ctx.db
        .query("userProfiles")
        .withIndex("userId", (q) => q.eq("userId", userId))
        .unique()) ?? USER_PROFILE_MISSING
    );
  },
});
