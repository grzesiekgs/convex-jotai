import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const get = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const setting = await ctx.db
      .query('settings')
      .withIndex('by_key', (q) => q.eq('key', args.key))
      .unique();
    return setting?.value ?? '';
  },
});

export const getWithCount = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const setting = await ctx.db
      .query('settings')
      .withIndex('by_key', (q) => q.eq('key', args.key))
      .unique();
    return { value: setting?.value ?? '', count: setting?.count ?? 0 };
  },
});

export const set = mutation({
  args: { key: v.string(), value: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('settings')
      .withIndex('by_key', (q) => q.eq('key', args.key))
      .unique();
    const count = (existing?.count ?? 0) + 1;

    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value, count });
    } else {
      await ctx.db.insert('settings', { key: args.key, value: args.value, count });
    }

    return count;
  },
});
