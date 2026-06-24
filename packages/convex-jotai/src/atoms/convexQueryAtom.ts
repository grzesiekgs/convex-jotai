import type { Atom } from 'jotai';
import type { FunctionReference, FunctionReturnType } from 'convex/server';
import { atom } from 'jotai';
import { ConvexQueryOptionsArgs } from '../types';
import { convexQueryResultAtom } from './convexQueryResultAtom';

export function convexQueryAtom<Query extends FunctionReference<'query'>>(
  query: Query,
  ...args: ConvexQueryOptionsArgs<Query>
): Atom<FunctionReturnType<Query>> {
  const queryResultAtom = convexQueryResultAtom(query, ...args);

  return atom<FunctionReturnType<Query>>((get) => {
    const queryResult = get(queryResultAtom);

    return queryResult.data;
  });
}
