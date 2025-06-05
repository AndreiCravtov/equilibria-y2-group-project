import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    // if (!userId) return "cant findUser";

    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), userId))
      .first();
  },
});
