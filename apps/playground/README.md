# Playground

This is an **example playground application** demonstrating how to use the `convex-jotai` library in a React application.

## Overview

The playground is a minimal [Vite](https://vitejs.dev/) + [React](https://react.dev/) application with [TanStack Router](https://tanstack.com/router) that showcases two different approaches to integrating [Convex](https://www.convex.dev/) with React:

- **`/react`** — Uses the official `convex/react` bindings with `ConvexProvider`
- **`/jotai`** — Uses `convex-jotai` for state management via [Jotai](https://jotai.org/) atoms

Both routes implement the same demo UI, making it easy to compare the two approaches side-by-side.

## Getting Started

### Running Locally

1. Install dependencies from the workspace root:

```bash
bun install
```

2. Start the local Convex backend (optional, if using local development):

```bash
docker-compose up -d   # Starts local Convex in Docker
bun run convex:dev     # Connects to local Convex
```

3. Start the playground:

```bash
bun run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Learn More

- See the [convex-jotai README](../../packages/convex-jotai/README.md) for library documentation
- Visit [Convex docs](https://docs.convex.dev/) for backend documentation
- Visit [Jotai docs](https://jotai.org/) for Jotai documentation
