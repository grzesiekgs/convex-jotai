import { FunctionArgs, FunctionReference, FunctionReturnType } from 'convex/server';
import { atom, WritableAtom } from 'jotai';
import { assertConvexClient } from '../utils';
import { convexClientAtom } from './convexClientAtom';

export function convexActionAtom<Action extends FunctionReference<'action'>>(
  action: Action
): WritableAtom<null, [FunctionArgs<Action>], FunctionReturnType<Action>> {
  return atom(null, (get, _set, args) => {
    const client = assertConvexClient(get(convexClientAtom));

    return client.action(action, args);
  });
}
