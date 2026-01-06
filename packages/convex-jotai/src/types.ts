import { FunctionArgs, FunctionReference } from 'convex/server';
import { Getter } from 'jotai';

export type ConvexQueryOptionsGetter<Query extends FunctionReference<'query'>> = (
  get: Getter
) => FunctionArgs<Query>;

// TODO Reserved for future options
export interface CreateConvexJotaiOptions {}

export type ConvexQueryErrorResult = { status: 'error'; data?: never; error: Error };
export type ConvexQueryLoadingResult = { status: 'loading'; data?: never; error?: never };
export type ConvexQuerySuccessResult<T> = { status: 'success'; data: T; error?: never };

export type ConvexQueryResult<T> =
  | ConvexQueryErrorResult
  | ConvexQueryLoadingResult
  | ConvexQuerySuccessResult<T>;
