# convex-jotai

A lightweight bridge between [Convex](https://www.convex.dev/) and [Jotai](https://jotai.org/).

## Packages

| Package | Description |
|---------|-------------|
| [**convex-jotai**](./packages/convex-jotai/README.md) | The publishable library — Jotai atoms for Convex queries, mutations, and actions |
| [**playground**](./apps/playground/README.md) | Example React app demonstrating convex-jotai usage |

## Quick Start

```bash
npm install convex-jotai convex jotai
```

See the [convex-jotai documentation](./packages/convex-jotai/README.md) for full usage instructions and API reference.

## Development

This is a Turborepo monorepo. To get started:

```bash
# Install dependencies
bun install

# Start development (all packages)
bun run dev

# Build all packages
bun run build

# Run specific package
bun run dev --filter=playground
bun run build --filter=convex-jotai
```

## License

MIT
