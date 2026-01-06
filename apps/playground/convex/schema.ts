import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  settings: defineTable({
    key: v.string(),
    value: v.string(),
    count: v.number(),
  }).index('by_key', ['key']),
});
