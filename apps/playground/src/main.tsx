import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root')!;

if (!rootElement) {
  throw new Error('Root element #root not found');
}

const reactRoot = ReactDOM.createRoot(rootElement);

reactRoot.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
