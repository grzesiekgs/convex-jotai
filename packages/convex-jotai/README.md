# convex-jotai

A minimal bridge between [Convex](https://www.convex.dev/) and [Jotai](https://jotai.org/) that allows you to create atoms that automatically subscribe to Convex queries and stay in sync with server-side changes.

## Installation

```bash
npm install convex-jotai jotai convex
# or
bun add convex-jotai jotai convex
```

## Usage

### 1. Create the bridge

First, initialize the bridge with your Convex client:

```typescript
import { ConvexReactClient } from 'convex/react';
import { createConvexJotai } from 'convex-jotai';

// Create your Convex client
const convexClient = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

// Create the Jotai-Convex bridge
const { convexAtom } = createConvexJotai(convexClient);

export { convexAtom };
```

### 2. Create atoms for your queries

Use `convexAtom` to create atoms that subscribe to Convex queries:

```typescript
import { api } from '../convex/_generated/api';
import { convexAtom } from './convex-jotai';

// Create an atom that subscribes to a query
export const messagesAtom = convexAtom(api.messages.list, { channel: 'general' });

// The atom returns a state object with status, data, and error
// { status: 'loading', data: undefined, error: undefined }
// { status: 'success', data: [...messages], error: undefined }
// { status: 'error', data: undefined, error: Error }
```

### 3. Use atoms in your components

```typescript
import { useAtomValue } from 'jotai';
import { messagesAtom } from './atoms';

function Messages() {
  const messages = useAtomValue(messagesAtom);

  if (messages.status === 'loading') {
    return <div>Loading...</div>;
  }

  if (messages.status === 'error') {
    return <div>Error: {messages.error.message}</div>;
  }

  return (
    <ul>
      {messages.data.map((msg) => (
        <li key={msg._id}>{msg.text}</li>
      ))}
    </ul>
  );
}
```

### Static skip

You can skip a query by passing `'skip'` instead of arguments:

```typescript
// This query won't execute
const userAtom = convexAtom(api.users.get, 'skip');
```

### Reactive args (recommended)

For dynamic queries that depend on other atoms or need conditional skipping, pass a getter function:

```typescript
import { atom } from 'jotai';
import { api } from '../convex/_generated/api';
import { convexAtom } from './convex-jotai';

// Some state that controls the query
const userIdAtom = atom<string | null>(null);

// Reactive query - re-evaluates when userIdAtom changes
const userProfileAtom = convexAtom(api.users.getProfile, (get) => {
  const userId = get(userIdAtom);
  return userId ? { id: userId } : 'skip';
});
```

When the getter function's dependencies change:

- The args are re-evaluated
- If the resulting query hash changes, the old subscription is cleaned up
- A new subscription is started for the new query
- Skip/unskip transitions are handled automatically

#### More reactive examples

```typescript
// Dependent queries - wait for first query before running second
const channelAtom = convexAtom(api.channels.getCurrent, {});
const messagesAtom = convexAtom(api.messages.list, (get) => {
  const channel = get(channelAtom);
  return channel.status === 'success' ? { channelId: channel.data._id } : 'skip';
});

// Feature flag - only fetch when panel is open
const isPanelOpenAtom = atom(false);
const analyticsAtom = convexAtom(api.analytics.dashboard, (get) => {
  return get(isPanelOpenAtom) ? {} : 'skip';
});

// Search with debounced input
const searchQueryAtom = atom('');
const searchResultsAtom = convexAtom(api.search.query, (get) => {
  const query = get(searchQueryAtom);
  return query.length >= 3 ? { query } : 'skip';
});
```

## API

### `createConvexJotai(convexClient)`

Creates a Jotai-Convex bridge instance.

**Parameters:**

- `convexClient` - A `ConvexReactClient` instance

**Returns:**

- An object containing:
  - `convexAtom` - Factory function to create query atoms

### `convexAtom(funcRef, args)`

Creates an atom that subscribes to a Convex query.

**Parameters:**

- `funcRef` - A Convex function reference (e.g., `api.messages.list`)
- `args` - One of:
  - Query arguments object (static)
  - `'skip'` to disable the query (static)
  - `(get) => args | 'skip'` - A getter function for reactive args

**Returns:**

- A Jotai atom with type `ConvexAtomState<T>`:
  - `{ status: 'loading', data: undefined, error: undefined }` - Query is loading or skipped
  - `{ status: 'success', data: T, error: undefined }` - Query succeeded
  - `{ status: 'error', data: undefined, error: Error }` - Query failed

## How it works

The bridge uses Convex's `watchQuery` API to subscribe to query updates. When a query result changes on the server, the corresponding atom automatically updates, triggering re-renders in any components that use it.

**Subscription sharing:** Multiple atoms watching the same query (same function + arguments) share a single subscription to Convex, optimizing network usage.

**Reactive args:** When using a getter function for args, the atom re-evaluates the args on each read. If the computed query hash changes, the old subscription is cleaned up and a new one is started automatically.

## License

MIT
