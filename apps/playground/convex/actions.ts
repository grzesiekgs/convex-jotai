import { action } from './_generated/server';
import { api } from './_generated/api';
import { v } from 'convex/values';

export const logSettingValue = action({
  args: { key: v.string() },
  handler: async (ctx, args): Promise<{ value: string; count: number }> => {
    const result = await ctx.runQuery(api.settings.getWithCount, { key: args.key });
    console.log(
      `[Action] Setting "${args.key}" has value: "${result.value}", count: ${result.count}`
    );
    return result;
  },
});
