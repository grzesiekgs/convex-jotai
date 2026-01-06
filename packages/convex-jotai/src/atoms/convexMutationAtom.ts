import { FunctionArgs, FunctionReference, FunctionReturnType } from 'convex/server';
import { atom, WritableAtom } from 'jotai';
import { assertConvexClient } from '../utils';
import { convexClientAtom } from './convexClientAtom';
import { OptimisticUpdate } from 'convex/browser';

export function convexMutationAtom<Mutation extends FunctionReference<'mutation'>>(
  mutation: Mutation,
  optimisticUpdate?: OptimisticUpdate<FunctionArgs<Mutation>>
): WritableAtom<null, [FunctionArgs<Mutation>], FunctionReturnType<Mutation>> {
  return atom(null, (get, _set, args) => {
    const client = assertConvexClient(get(convexClientAtom));

    return client.mutation(mutation, args, {
      optimisticUpdate,
    });
  });
}
