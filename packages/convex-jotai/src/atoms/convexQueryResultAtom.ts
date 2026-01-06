import type { Atom } from 'jotai';
import type { ConvexQueryOptionsGetter, ConvexQueryResult } from '../types';
import { FunctionArgs, FunctionReference, FunctionReturnType } from 'convex/server';
import { atom } from 'jotai';
import { getLocalConvexQueryResult, assertConvexClient } from '../utils';
import { convexClientAtom } from './convexClientAtom';

export function convexQueryResultAtom<Query extends FunctionReference<'query'>>(
  query: Query,
  queryOptionsGetter: ConvexQueryOptionsGetter<Query>
): Atom<ConvexQueryResult<FunctionReturnType<Query>>> {
  type QueryResultType = ConvexQueryResult<FunctionReturnType<Query>>;
  const queryOptionsAtom = atom<FunctionArgs<Query>>((get) => queryOptionsGetter(get));
  const querySubscriptionAtom = atom((get) => {
    const convexClient = assertConvexClient(get(convexClientAtom));
    const queryOptions = get(queryOptionsAtom);
    const queryResultAtom = atom<QueryResultType>(
      getLocalConvexQueryResult(convexClient, query, queryOptions)
    );
    queryResultAtom.onMount = (setValue) => {
      // // Is there a point to call it there?
      // setValue(getLocalConvexQueryResult(convexClient, funcRef, queryOptions));
      return convexClient.onUpdate(
        query,
        queryOptions,
        (update) =>
          setValue({
            status: 'success',
            data: update,
          }),
        (error) =>
          setValue({
            status: 'error',
            error,
          })
      );
    };

    return queryResultAtom;
  });

  return atom<QueryResultType>((get) => {
    const queryResultAtom = get(querySubscriptionAtom);
    const queryResult = get(queryResultAtom);

    return queryResult;
  });
}
