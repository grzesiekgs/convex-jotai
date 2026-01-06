import { createFileRoute } from '@tanstack/react-router';
import { ConvexClient } from 'convex/browser';
import { createStore, Provider, useAtomValue, useSetAtom } from 'jotai';
import {
  convexActionAtom,
  convexClientAtom,
  convexMutationAtom,
  convexQueryAtom,
} from 'convex-jotai';
import { api } from '../../convex/_generated/api';

export const Route = createFileRoute('/jotai')({
  component: JotaiRoute,
});

const convex = new ConvexClient(import.meta.env.VITE_CONVEX_URL);

const store = createStore();

store.set(convexClientAtom, convex);

function JotaiRoute() {
  return (
    <Provider store={store}>
      <JotaiSettingsDemo />
    </Provider>
  );
}

const queryAtom = convexQueryAtom(api.settings.get, () => ({
  key: 'demo',
}));

const mutationAtom = convexMutationAtom(api.settings.set);
const actionAtom = convexActionAtom(api.actions.logSettingValue);

function JotaiSettingsDemo() {
  const value = useAtomValue(queryAtom);
  const setValue = useSetAtom(mutationAtom);
  const runAction = useSetAtom(actionAtom);
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = await setValue({ key: 'demo', value: e.target.value });
    console.log(result);
  };

  const handleAction = async () => {
    const result = await runAction({ key: 'demo' });
    console.log(result);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <h2>Convex Jotai Demo</h2>
      <div>
        <label htmlFor='input'>Mutation input:</label>
        <input
          id='input'
          type='text'
          onChange={handleChange}
          placeholder='Type something...'
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
        />
      </div>

      <div>
        <label>Query preview:</label>
        <div
          style={{
            padding: '0.5rem',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            minHeight: '2rem',
            marginTop: '0.25rem',
          }}
        >
          {value === undefined ? 'Loading...' : value || '(empty)'}
        </div>
      </div>
      <div>
        <label>Query preview:</label>
        <button onClick={handleAction}>action preview</button>
      </div>
    </div>
  );
}
