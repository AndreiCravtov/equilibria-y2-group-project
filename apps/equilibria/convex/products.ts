import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    calories: v.int64(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("products", {
      name: args.name,
      calories: args.calories,
    });
  },
});