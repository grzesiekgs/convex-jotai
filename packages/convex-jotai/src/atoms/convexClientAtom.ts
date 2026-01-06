import { ConvexClient } from 'convex/browser';
import { atom } from 'jotai';

export const convexClientAtom = atom<ConvexClient | null>(null);
