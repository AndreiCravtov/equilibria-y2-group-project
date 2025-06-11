import { mutation, query } from '@/convex/_generated/server'
import { v } from 'convex/values'
import {getUserId} from "@/convex/users";

export const addFriend = mutation({
  args: {
    friendId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const friendId = args.friendId; // Assuming friendId is valid

    // Prevent duplicate friendships
    const existing = await ctx.db
      .query('friends')
      .withIndex('userId', (q) => q.eq('userId', userId))
      .collect()

    const alreadyFriends = existing.some(f => f.friendId === friendId)

    if (alreadyFriends) {
      throw new Error('You are already friends.')
    }

    await ctx.db.insert('friends', {
      userId,
      friendId,
    })
  },
})

export const getFriendList = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    const friendLinks = await ctx.db
      .query("friends")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();

    return friendLinks.map((link) => link.friendId);
  },
});

export const getLeaderboardList = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    const friendLinks = await ctx.db
      .query("friends")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();

    const friendIds = friendLinks.map(link => link.friendId);

    // Combine with current userId
    const allIds = [...new Set([...friendIds, userId])];

    return allIds; // array of userId strings
  },
});
