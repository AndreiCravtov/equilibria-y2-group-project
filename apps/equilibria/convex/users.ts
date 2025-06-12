import { Auth } from "convex/server";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Result, ResultAsync } from "@/util/result";
import { USER_NOT_AUTHENTICATED, UserNotAuthenticated } from "./errors";
import { Id } from "./_generated/dataModel";
import { v } from "convex/values";

export const tryGetUserId = async (ctx: {
  auth: Auth;
}): ResultAsync<Id<"users">, UserNotAuthenticated> => {
  const userId = await getAuthUserId(ctx);
  if (!userId) return Result.Error(USER_NOT_AUTHENTICATED);
  return Result.Data(userId);
};

export const getUserId = async (ctx: { auth: Auth }): Promise<Id<"users">> => {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw Error(USER_NOT_AUTHENTICATED);
  return userId;
};

export const getCurrentUser = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), userId))
      .first();
  },
});

export const getUserById = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user; // will return `null` if not found
  },
});
