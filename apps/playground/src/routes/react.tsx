import { createFileRoute } from '@tanstack/react-router';
import { ConvexProvider, ConvexReactClient, useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

export const Route = createFileRoute('/react')({
  component: ReactRoute,
});

function ReactRoute() {
  return (
    <ConvexProvider client={convex}>
      <SettingsDemo />
    </ConvexProvider>
  );
}

function SettingsDemo() {
  const value = useQuery(api.settings.get, { key: 'demo' });
  const setValue = useMutation(api.settings.set);
  const runAction = useAction(api.actions.logSettingValue);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCount = await setValue({ key: 'demo', value: e.target.value });
    console.log(newCount);
  };

  const handleAction = async () => {
    const result = await runAction({ key: 'demo' });
    console.log(result);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <h2>Convex React Demo</h2>

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
