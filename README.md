# Vibe Debugger SDK

Server-side error monitoring for modern applications.

## Packages

- **[@vibedebugger/core](./packages/core)** - Core utilities and transport layer
- **[@vibedebugger/node](./packages/node)** - Node.js SDK for Express, NestJS, etc.
- **[@vibedebugger/next](./packages/next)** - Next.js specific SDK

## Quick Start

### Next.js

```bash
npm install @vibedebugger/next
```

Create `instrumentation.ts` in your project root:

```typescript
export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    require('@vibedebugger/next').register()
  }
}
```

Add environment variables:

```env
VIBE_API_KEY=your_api_key_here
VIBE_PROJECT_ID=your_project_id
```

### Node.js (Express)

```bash
npm install @vibedebugger/node
```

```typescript
import { init, errorHandler } from '@vibedebugger/node'

init({
  apiKey: process.env.VIBE_API_KEY,
  projectId: process.env.VIBE_PROJECT_ID
})

// Add error handler middleware (must be last)
app.use(errorHandler)
```

## Development

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm run test
```

## Publishing

This repository uses automated publishing via GitHub Actions.

1. Make your changes
2. Run `npm run changeset` to create a changeset
3. Commit and push
4. Create a new tag: `git tag v0.1.0 && git push --tags`
5. GitHub Actions will automatically publish to NPM

## Manual Publishing

```bash
npm run build
npm run release
```

## License

MIT
