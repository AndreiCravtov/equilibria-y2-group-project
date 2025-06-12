import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,

  /**
   * Customized `users` schema to include a `username` field
   */
  users: defineTable({
    email: v.string(),
    username: v.string(),

    name: v.optional(v.string()),
    image: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  })
    .index("email", ["email"])
    .index("username", ["username"])
    .index("phone", ["phone"]),

  userProfiles: defineTable({
    userId: v.id("users"),
    name: v.string(),
    age: v.int64(),
    gender: v.union(v.literal("male"), v.literal("female")),
    weight: v.int64(),
    height: v.int64(),
    dailyTarget: v.int64(),
  }).index("userId", ["userId"]),

  water: defineTable({
    userId: v.id("users"),
    dateUnixTimestamp: v.int64(),
    waterIntake: v.int64(),
  }).index("userId", ["userId"]),

  goals: defineTable({
    userId: v.id("users"),
    waterGoal: v.int64(),
  }).index("userId", ["userId"]),

  friends: defineTable({
    userId: v.id("users"),
    friendId: v.id("users"),
  }).index("userId", ["userId"]),

  scores: defineTable({
    userId: v.id("users"),
    date: v.string(),
    score: v.int64(),
  }).index("userId", ["userId"]),
});
