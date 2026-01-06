import { createRootRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <header>
        <nav>
          <Link to='/'>index</Link>
          {' | '}
          <Link to='/jotai'>jotai</Link>
          {' | '}
          <Link to='/react'>react</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
