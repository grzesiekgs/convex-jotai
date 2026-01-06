import type { Atom } from 'jotai';
import type { FunctionReference, FunctionReturnType } from 'convex/server';
import { atom } from 'jotai';
import { ConvexQueryOptionsGetter } from '../types';
import { convexQueryResultAtom } from './convexQueryResultAtom';

export function convexQueryAtom<Query extends FunctionReference<'query'>>(
  query: Query,
  queryOptionsGetter: ConvexQueryOptionsGetter<Query>
): Atom<FunctionReturnType<Query>> {
  const queryResultAtom = convexQueryResultAtom(query, queryOptionsGetter);

  return atom<FunctionReturnType<Query>>((get) => {
    const queryResult = get(queryResultAtom);

    return queryResult.data;
  });
}
