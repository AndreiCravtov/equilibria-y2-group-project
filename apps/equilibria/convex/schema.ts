import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,

  userProfiles: defineTable({
    userId: v.id("users"),
    age: v.int64(),
    gender: v.union(v.literal("male"), v.literal("female")),
  }).index("userId", ["userId"]),

  water: defineTable({
    userId: v.id("users"),
    date: v.string(), // or use "number" if you store timestamps
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
});
