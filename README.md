# convex-jotai monorepo

This workspace contains:

- `packages/convex-jotai`: a publishable bridge between Convex queries and Jotai atoms
- `apps/playground`: a TanStack Start powered playground for exercising the library

Everything is written in TypeScript and driven through Turborepo.

## Getting started

```bash
bun install
```

`bun install` boots the workspace, but you can also use `npm`, `yarn`, or `pnpm` if you prefer.

To bootstrap everything for local work you can rely on Turborepo:

```bash
bun run dev
```

That command starts the `playground` app with `start dev` while also running any other development tasks in a single workspace. Use filters to scope your work:

```bash
bun run dev -- --filter=playground
```

## Working with the library

convex-jotai is published to npm and ships with an async helper that wraps `ConvexClient` calls in a Jotai atom.

```ts
import { ConvexClient } from 'convex';
import { convexQueryAtom } from 'convex-jotai';

const client = new ConvexClient({ url: 'https://your-app.convex.cloud' });
const todosAtom = convexQueryAtom(client, 'listTodos');
```

Run a build for just the package with:

```bash
bun run build -- --filter=convex-jotai
```

## Exploring the playground

`apps/playground` now runs on Vite and demonstrates the atoms and mock Convex client inside a minimal TanStack Router tree. The layout keeps the Suspense-enabled message panel in sync with the router so you can confirm `convex-jotai` wiring without a backend.

You can publish the UI locally with:

```bash
bun run dev -- --filter=playground
```

and build it with:

```bash
bun run build -- --filter=playground
```
