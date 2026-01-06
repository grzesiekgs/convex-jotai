import type { Atom } from 'jotai';
import type { FunctionReference, FunctionReturnType } from 'convex/server';
import { atom } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { ConvexQueryOptionsGetter, ConvexQueryResult } from '../types';
import { convexQueryResultAtom } from './convexQueryResultAtom';

export function convexQueryPromiseAtom<Query extends FunctionReference<'query'>>(
  query: Query,
  queryOptionsGetter: ConvexQueryOptionsGetter<Query>
): Atom<Promise<FunctionReturnType<Query>>> {
  const queryResultAtom = convexQueryResultAtom(query, queryOptionsGetter);
  const queryPromiseStateAtom = selectAtom<
    ConvexQueryResult<FunctionReturnType<Query>>,
    { promiseWithResolvers: PromiseWithResolvers<FunctionReturnType<Query>>; resolved: boolean }
  >(queryResultAtom, (queryResult, prevState) => {
    const state = prevState ?? {
      promiseWithResolvers: Promise.withResolvers<FunctionReturnType<Query>>(),
      resolved: false,
    };
    // Query not resolved.
    if (queryResult.status === 'loading') {
      // Continue the not resolved state.
      if (!state.resolved) {
        return state;
      }
      // Reset to not resolved state.
      return {
        promiseWithResolvers: Promise.withResolvers<FunctionReturnType<Query>>(),
        resolved: false,
      };
    }
    // Query resolved.
    return { promiseWithResolvers: state.promiseWithResolvers, resolved: true };
  });

  return atom<Promise<FunctionReturnType<Query>>>(
    (get) => get(queryPromiseStateAtom).promiseWithResolvers.promise
  );
}
