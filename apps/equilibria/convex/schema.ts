import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,

  // Test table => TODO: remove later
  numbers: defineTable({
    value: v.number(),
  }),
  // products table for friday meeting
  products: defineTable({
      name: v.string(),
      calories: v.int64(),
  }),
  water: defineTable({
      uid: v.string(),
      date: v.string(), // or use "number" if you store timestamps
      water_intake: v.number(),
  }),
});
