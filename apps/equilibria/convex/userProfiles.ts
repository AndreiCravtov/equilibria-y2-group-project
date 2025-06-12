import { mutation, query } from "./_generated/server";
import { getUserId } from "./users";
import { USER_PROFILE_MISSING } from "./errors";
import { v } from "convex/values";
import { api } from "./_generated/api";

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

export const updateUserProfile = mutation({
  args: {
    name: v.string(),
    age: v.int64(),
    gender: v.union(v.literal("male"), v.literal("female")),
    weight: v.int64(),
    height: v.int64(),
  },
  handler: async (ctx, { name, age, gender, weight, height }) => {
    const userId = await getUserId(ctx);
    const profile = await ctx.runQuery(api.userProfiles.tryGetUserProfile);
    // user profile must already exist
    if (profile === USER_PROFILE_MISSING)
      throw new Error("Tried to update non-existent user profile");

    await ctx.db.patch(profile._id, {
      name,
      age,
      gender,
      weight,
      height,
    });
  },
});

export const createUserProfile = mutation({
  args: {
    name: v.string(),
    age: v.int64(),
    gender: v.union(v.literal("male"), v.literal("female")),
    weight: v.int64(),
    height: v.int64(),
  },
  handler: async (ctx, { name, age, gender, weight, height }) => {
    const userId = await getUserId(ctx);

    // Ensure profile doesn't already exist
    const userProfile = await ctx.runQuery(api.userProfiles.tryGetUserProfile);
    if (userProfile !== "USER_PROFILE_MISSING")
      throw new Error("User profile already exists");

    // Add new profile
    await ctx.db.insert("userProfiles", {
      userId,
      name,
      age,
      gender,
      weight,
      height,
    });
  },
});
