import type { FunctionArgs, FunctionReference, FunctionReturnType } from 'convex/server';
import { getFunctionName } from 'convex/server';
import { ConvexClient } from 'convex/browser';
import { ConvexQueryResult } from '../types';

export function getLocalConvexQueryResult<Query extends FunctionReference<'query'>>(
  convexClient: ConvexClient,
  funcRef: Query,
  queryOptions: FunctionArgs<Query>
): ConvexQueryResult<FunctionReturnType<Query>> {
  try {
    const result = convexClient.client.localQueryResult(getFunctionName(funcRef), queryOptions);

    if (result === undefined) {
      return {
        status: 'loading',
      };
    }

    return {
      status: 'success',
      data: result,
      error: undefined,
    };
  } catch (possiblyError) {
    const error = possiblyError instanceof Error ? possiblyError : new Error(String(possiblyError));

    return {
      status: 'error',
      error,
    };
  }
}
