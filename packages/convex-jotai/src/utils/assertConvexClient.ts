import { ConvexClient } from 'convex/browser';

export const assertConvexClient = (client: ConvexClient | null): ConvexClient => {
  if (typeof window === 'undefined') {
    throw new Error('convex-jotai: SSR is currently not supported.');
  }
  if (client === null) {
    throw new Error(
      'convex-jotai: convexClientAtom is not set. Follow the setup guide in the README.'
    );
  }

  return client;
};
