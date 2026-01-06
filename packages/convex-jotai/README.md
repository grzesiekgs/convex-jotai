# convex-jotai

A lightweight bridge between [Convex](https://www.convex.dev/) and [Jotai](https://jotai.org/) that lets you manage Convex queries, mutations, and actions through Jotai atoms.

## Installation

```bash
npm install convex-jotai convex jotai
# or
yarn add convex-jotai convex jotai
# or
pnpm add convex-jotai convex jotai
# or
bun add convex-jotai convex jotai
```

### Peer Dependencies

| Package | Version |
|---------|---------|
| `convex` | `>=1.31` |
| `jotai` | `>=2.6` |

## Quick Start

### 1. Set up the Convex client in your Jotai store

```typescript
import { ConvexClient } from 'convex/browser';
import { createStore, Provider } from 'jotai';
import { convexClientAtom } from 'convex-jotai';

// Create the Convex client
const convex = new ConvexClient(import.meta.env.VITE_CONVEX_URL);

// Create a Jotai store and set the client
const store = createStore();
store.set(convexClientAtom, convex);

// Wrap your app with the Jotai Provider
function App() {
  return (
    <Provider store={store}>
      <YourApp />
    </Provider>
  );
}
```

### 2. Create atoms for queries, mutations, and actions

```typescript
import { convexQueryAtom, convexMutationAtom, convexActionAtom } from 'convex-jotai';
import { api } from '../convex/_generated/api';

// Query atom - automatically subscribes to real-time updates
const settingsAtom = convexQueryAtom(api.settings.get, () => ({ key: 'theme' }));

// Mutation atom - for modifying data
const updateSettingsAtom = convexMutationAtom(api.settings.set);

// Action atom - for running server-side actions
const logActionAtom = convexActionAtom(api.actions.log);
```

### 3. Use atoms in your components

```typescript
import { useAtomValue, useSetAtom } from 'jotai';

function Settings() {
  const settings = useAtomValue(settingsAtom);
  const updateSettings = useSetAtom(updateSettingsAtom);
  const runLog = useSetAtom(logActionAtom);

  return (
    <div>
      <p>Current value: {settings ?? 'Loading...'}</p>
      <button onClick={() => updateSettings({ key: 'theme', value: 'dark' })}>
        Set Dark Theme
      </button>
      <button onClick={() => runLog({ message: 'Settings viewed' })}>
        Log View
      </button>
    </div>
  );
}
```

---

## Convex/React vs Convex-Jotai

Here's a side-by-side comparison of setting up Convex with the official `convex/react` bindings versus `convex-jotai`:

### Provider Setup

**convex/react:**

```tsx
import { ConvexProvider, ConvexReactClient } from 'convex/react';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

function App() {
  return (
    <ConvexProvider client={convex}>
      <YourApp />
    </ConvexProvider>
  );
}
```

**convex-jotai:**

```tsx
import { ConvexClient } from 'convex/browser';
import { createStore, Provider } from 'jotai';
import { convexClientAtom } from 'convex-jotai';

const convex = new ConvexClient(import.meta.env.VITE_CONVEX_URL);
const store = createStore();
store.set(convexClientAtom, convex);

function App() {
  return (
    <Provider store={store}>
      <YourApp />
    </Provider>
  );
}
```

### Queries

**convex/react:**

```tsx
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

function Component() {
  const value = useQuery(api.settings.get, { key: 'demo' });
  return <div>{value ?? 'Loading...'}</div>;
}
```

**convex-jotai:**

```tsx
import { useAtomValue } from 'jotai';
import { convexQueryAtom } from 'convex-jotai';
import { api } from '../convex/_generated/api';

// Define atom outside component
const valueAtom = convexQueryAtom(api.settings.get, () => ({ key: 'demo' }));

function Component() {
  const value = useAtomValue(valueAtom);
  return <div>{value ?? 'Loading...'}</div>;
}
```

### Mutations

**convex/react:**

```tsx
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

function Component() {
  const setValue = useMutation(api.settings.set);
  
  const handleClick = async () => {
    await setValue({ key: 'demo', value: 'new-value' });
  };
  
  return <button onClick={handleClick}>Update</button>;
}
```

**convex-jotai:**

```tsx
import { useSetAtom } from 'jotai';
import { convexMutationAtom } from 'convex-jotai';
import { api } from '../convex/_generated/api';

// Define atom outside component
const setValueAtom = convexMutationAtom(api.settings.set);

function Component() {
  const setValue = useSetAtom(setValueAtom);
  
  const handleClick = async () => {
    await setValue({ key: 'demo', value: 'new-value' });
  };
  
  return <button onClick={handleClick}>Update</button>;
}
```

### Actions

**convex/react:**

```tsx
import { useAction } from 'convex/react';
import { api } from '../convex/_generated/api';

function Component() {
  const runAction = useAction(api.actions.doSomething);
  
  return <button onClick={() => runAction({ param: 'value' })}>Run</button>;
}
```

**convex-jotai:**

```tsx
import { useSetAtom } from 'jotai';
import { convexActionAtom } from 'convex-jotai';
import { api } from '../convex/_generated/api';

// Define atom outside component
const runActionAtom = convexActionAtom(api.actions.doSomething);

function Component() {
  const runAction = useSetAtom(runActionAtom);
  
  return <button onClick={() => runAction({ param: 'value' })}>Run</button>;
}
```

### Key Differences

| Feature | convex/react | convex-jotai |
|---------|--------------|--------------|
| **Client type** | `ConvexReactClient` | `ConvexClient` (browser) |
| **Provider** | `<ConvexProvider>` | `<Provider store={...}>` (Jotai) |
| **Query definition** | Inside component via hooks | Outside component as atoms |
| **State management** | Built-in React hooks | Jotai atom primitives |
| **Reactive args** | Re-renders on arg change | Getter function `(get) => args` |
| **Cross-component state** | Requires lifting state | Atoms are naturally shared |
| **DevTools** | Convex dashboard | Jotai DevTools + Convex dashboard |

### When to Use convex-jotai

✅ **Use convex-jotai when:**

- You're already using Jotai for state management
- You want to compose Convex queries with other Jotai atoms
- You need fine-grained control over subscriptions
- You prefer defining data dependencies outside components
- You want to share query results across components without prop drilling

✅ **Use convex/react when:**

- You're not using Jotai in your project
- You prefer colocating data fetching with components
- You want the simplest possible setup

---

## API Reference

### `convexClientAtom`

An atom that holds the Convex client instance. Must be set before using other atoms.

```typescript
import { convexClientAtom } from 'convex-jotai';

store.set(convexClientAtom, convexClient);
```

### `convexQueryAtom(query, argsGetter)`

Creates an atom that subscribes to a Convex query with real-time updates.

**Parameters:**

- `query` — A Convex query function reference (e.g., `api.settings.get`)
- `argsGetter` — A function `(get) => args` that returns the query arguments

**Returns:** A read-only atom containing the query result (or `undefined` while loading)

```typescript
const userAtom = convexQueryAtom(api.users.get, () => ({ id: 'user-123' }));

// Reactive example - depends on another atom
const selectedIdAtom = atom<string | null>(null);
const selectedUserAtom = convexQueryAtom(api.users.get, (get) => {
  const id = get(selectedIdAtom);
  return { id: id ?? '' };
});
```

### `convexQueryResultAtom(query, argsGetter)`

Like `convexQueryAtom`, but returns the full result object with status.

**Returns:** An atom with type:

```typescript
type ConvexQueryResult<T> =
  | { status: 'loading'; data?: undefined; error?: undefined }
  | { status: 'success'; data: T; error?: undefined }
  | { status: 'error'; data?: undefined; error: Error };
```

### `convexMutationAtom(mutation, optimisticUpdate?)`

Creates a writable atom for executing Convex mutations.

**Parameters:**

- `mutation` — A Convex mutation function reference
- `optimisticUpdate` — Optional optimistic update function

**Returns:** A writable atom where `useSetAtom` returns a function to execute the mutation

```typescript
const updateUserAtom = convexMutationAtom(api.users.update);

// In component:
const updateUser = useSetAtom(updateUserAtom);
await updateUser({ id: 'user-123', name: 'New Name' });
```

### `convexActionAtom(action)`

Creates a writable atom for executing Convex actions.

**Parameters:**

- `action` — A Convex action function reference

**Returns:** A writable atom where `useSetAtom` returns a function to execute the action

```typescript
const sendEmailAtom = convexActionAtom(api.actions.sendEmail);

// In component:
const sendEmail = useSetAtom(sendEmailAtom);
await sendEmail({ to: 'user@example.com', subject: 'Hello' });
```

---

## Example

See the [playground app](../../apps/playground/README.md) for a complete working example comparing `convex/react` and `convex-jotai` side-by-side.

## License

MIT
