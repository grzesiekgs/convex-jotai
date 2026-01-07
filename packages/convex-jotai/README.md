# convex-jotai

A lightweight bridge between [Convex](https://www.convex.dev/) and [Jotai](https://jotai.org/) that lets you manage Convex queries, mutations, and actions through Jotai atoms.
In concept it's similar to [`jotai-tanstack-query`](https://github.com/jotaijs/jotai-tanstack-query), meaning that it allows to access and modify `convex` state within `jotai` atoms.
Effectively it's drop in replacement for `convex/react`.

# Installation

```bash
# or any bundler of your choice
bun add convex jotai convex-jotai
```

## Peer Dependencies

| Package | Version |
|---------|---------|
| `convex` | `>=1.31` |
| `jotai` | `>=2.6` |

These versions can be downgraded. I've selected latest version as of 06.01.2025. Create a GitHub issue if you would like to change this.

# Quick Start

## Set up the Convex client in your Jotai store

```typescript
import { ConvexClient } from 'convex/browser';
import { createStore, Provider } from 'jotai';
import { convexClientAtom } from 'convex-jotai';

// Create the Convex client.
// Note that ConvexReactClient is wrapper around ConvexClient.
// It could be possible to use both convex/react and convex-jotai, but currently that would require ConvexReactClient to expose ConvexClient.
const convex = new ConvexClient(import.meta.env.VITE_CONVEX_URL);
// convexClientAtom has to be set before using any of convex atoms. It doesn't necessarily has to be set in module scope.
// Therefore it's possible to rely on default store provided by jotai Provider.
const store = createStore();
store.set(convexClientAtom, convex);

// Wrap your app with the Jotai Provider
const App: FC = () => {
  return (
    <Provider store={store}>
      <YourApp />
    </Provider>
  );
}
```

## Define your atoms

```typescript
import { convexQueryAtom, convexMutationAtom, convexActionAtom } from 'convex-jotai';
import { api } from '../convex/_generated/api';

const themeQueryAtom = convexQueryAtom(api.settings.get, () => ({ key: 'theme' }));
const settingsMutationAtom = convexMutationAtom(api.settings.set);
const eventActionAtom = convexActionAtom(api.actions.event);
```

## Use atoms in your other atoms or components

```typescript
import { atom, useAtomValue, useSetAtom } from 'jotai';

const backgroundColorAtom = atom((get) => {
  const theme = get(themeQueryAtom);
  // api.settings.get is still loading.
  if (!theme) {
    return '#FF0000';
  }

  if (theme === 'light') {
    return '#FFFFFF';
  }

  return '#000000';
})

const Settings: FC = () => {
  const backgroundColor = useAtomValue(backgroundColorAtom);
  const settingsMutation = useSetAtom(settingsMutationAtom);
  const runEventAction = useSetAtom(eventActionAtom);

  useEffect(() => {
    runEventAction({ event: 'settings-viewed' });
  }, [runEventAction])

  return (
    <div style={{ backgroundColor }}>
      <button onClick={() => settingsMutation({ key: 'theme', value: 'dark' })}>
        Set Dark Theme
      </button>
      <button onClick={() => settingsMutation({ key: 'theme', value: 'light' })}>
        Set Light Theme
      </button>
    </div>
  );
}
```
# Deep dive
More details about the implementation.

## More features
Find out what else `convex-jotai` can do.

### Dynamic query arguments
```tsx
const dynamicSettingsQueryAtom = convexQueryAtom(api.settings.get, (get) => {
  const userSelectedKey = get(userSelectedKeyAtom);

  return { key: userSelectedKey }
});
```

### Support for suspense
```tsx
const themeQueryPromiseAtom = convexQueryPromiseAtom(api.settings.get, () => ({ key: 'theme' }));
```

### Descriptive query result
```tsx
const themeQueryResultAtom = convexQueryResultAtom(api.settings.get, () => ({ key: 'theme' }));

const themeQueryResult = useAtomValue(themeQueryResultAtom);

if (themeQueryResult.status === 'loading') {
  ...
}

if (themeQueryResult.status === 'success') {
  themeQueryResult.data
  ...
}

if (themeQueryResult.status === 'error') {
  themeQueryResult.error
  ...
}
```

## `convex/react` vs `convex-jotai`

### Provider Setup
```tsx
// convex/react
import { ConvexProvider, ConvexReactClient } from 'convex/react';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

const App: FC = () => {
  return (
    <ConvexProvider client={convex}>
      <YourApp />
    </ConvexProvider>
  );
}

// convex/jotai
import { ConvexClient } from 'convex/browser';
import { createStore, Provider } from 'jotai';
import { convexClientAtom } from 'convex-jotai';

const convex = new ConvexClient(import.meta.env.VITE_CONVEX_URL);
const store = createStore();
store.set(convexClientAtom, convex);

const App: FC = () => {
  return (
    <Provider store={store}>
      <YourApp />
    </Provider>
  );
}
```


### Queries, mutations and actions

```tsx
// convex/react
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../convex/_generated/api';

const theme = useQuery(api.settings.get, { key: 'theme' });
const settingsMutation = useMutation(api.settings.set);
const runEventAction = useAction(api.actions.event);

// convex-jotai
import { convexQueryAtom } from 'convex-jotai';
import { useAtomValue, useSetAtom } from 'jotai';
import { api } from '../convex/_generated/api';

const themeQueryAtom = convexQueryAtom(api.settings.get, () => ({ key: 'theme' }));
const settingsMutationAtom = convexMutationAtom(api.settings.set);
const eventActionAtom = convexActionAtom(api.actions.event);

const theme = useAtomValue(themeQueryAtom);
const settingsMutation = useSetAtom(settingsMutationAtom);
const runEventAction = useSetAtom(eventActionAtom);
```

# Example

See the [playground app](../../apps/playground/README.md) for a complete working example comparing `convex/react` and `convex-jotai` side-by-side.

# License

[MIT](./LICENSE)
