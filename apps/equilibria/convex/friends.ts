import { mutation, query } from '@/convex/_generated/server'
import { v } from 'convex/values'
import {getUserId} from "@/convex/users";

export const addFriend = mutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const username = args.username;

    // Find the user by username
    const matchingUsers = await ctx.db
      .query('users')
      .withIndex('username',
        (q) => q.eq('username', username)
      )
      .collect();

    if (matchingUsers.length === 0) {
      throw new Error('User not found.');
    }

    const friend = matchingUsers[0];
    const friendId = friend._id;

    if (friendId === userId) {
      throw new Error("You can't add yourself as a friend.");
    }

    // Prevent duplicate friendships
    const existing = await ctx.db
      .query('friends')
      .withIndex('userId', (q) => q.eq('userId', userId))
      .collect();

    const alreadyFriends = existing.some((f) => f.friendId === friendId);

    if (alreadyFriends) {
      throw new Error('You are already friends.');
    }

    await ctx.db.insert('friends', {
      userId,
      friendId,
    });
  },
});

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
  handler: async (ctx) => {
    const userId = await getUserId(ctx);

    const friendLinks = await ctx.db
      .query("friends")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const userIds = [userId, ...friendLinks.map((f) => f.friendId)];
    const leaderboard = await Promise.all(
      userIds.map(async (uid) => {
        const user = await ctx.db.get(uid);
        if (!user) return null;
        const scoreEntry = await ctx.db
          .query("scores")
          .filter((q) =>
            q.and(
              q.eq(q.field("userId"), uid),
              q.eq(q.field("date"), today)
            )
          )
          .first();

        return {
          id: uid,
          username: user.username,
          score: scoreEntry?.score ?? 0,
        };
      })
    );
    return leaderboard;
  },
});
