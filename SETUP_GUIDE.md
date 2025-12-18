# Vibe Debugger SDK - Setup Guide

## Prerequisites

1. **NPM Account**: Sign up at https://www.npmjs.com/signup
2. **GitHub Account**: For repository hosting
3. **NPM Access Token**: Create at https://www.npmjs.com/settings/tokens

## Step 1: Create GitHub Repository

```bash
cd /Users/yuvaraj/vibelog/sdk-packages
git init
git add .
git commit -m "Initial SDK implementation"
```

Create a new repository on GitHub (e.g., `vibedebugger-sdk`), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/vibedebugger-sdk.git
git branch -M main
git push -u origin main
```

## Step 2: Configure NPM Token in GitHub

1. Go to https://www.npmjs.com/settings/tokens
2. Click "Generate New Token" → "Classic Token"
3. Select "Automation" type
4. Copy the token

5. Go to your GitHub repository → Settings → Secrets and variables → Actions
6. Click "New repository secret"
7. Name: `NPM_TOKEN`
8. Value: Paste your NPM token
9. Click "Add secret"

## Step 3: Install Dependencies

```bash
cd /Users/yuvaraj/vibelog/sdk-packages
npm install
```

## Step 4: Build and Test Locally

```bash
# Build all packages
npm run build

# Test the build
ls -la packages/*/dist
```

## Step 5: Initialize Changesets

```bash
npx changeset init
```

This creates a `.changeset` folder for version management.

## Step 6: Create Your First Release

```bash
# Create a changeset
npm run changeset
# Follow the prompts:
# - Select packages to version (use spacebar to select all)
# - Choose "minor" for first release
# - Describe the changes

# Version the packages
npm run version-packages

# Commit the changes
git add .
git commit -m "Version packages"
git push
```

## Step 7: Publish via GitHub Actions

```bash
# Create and push a tag
git tag v0.1.0
git push --tags
```

GitHub Actions will automatically:
1. Build all packages
2. Publish to NPM
3. Create a GitHub release

## Step 8: Verify Publication

Check NPM:
- https://www.npmjs.com/package/@vibedebugger/core
- https://www.npmjs.com/package/@vibedebugger/node
- https://www.npmjs.com/package/@vibedebugger/next

## Manual Publishing (Alternative)

If you prefer to publish manually:

```bash
npm run build
npm login
npm run release
```

## Testing the Published Package

```bash
cd /Users/yuvaraj/vibelog/saas-platform
npm install @vibedebugger/next
```

Create `instrumentation.ts`:

```typescript
export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    require('@vibedebugger/next').register()
  }
}
```

Add to `.env.local`:

```env
VIBE_API_KEY=vib_6eb065160b4274348ba13c3aa41c158b
VIBE_PROJECT_ID=693ee6ee5b1a9dc27ba5abde
```

Restart your dev server and trigger an error!

## Troubleshooting

### "Package name already exists"

If `@vibedebugger` is taken, update all `package.json` files:

```json
{
  "name": "@YOUR_USERNAME/vibedebugger-core"
}
```

### "Permission denied"

Make sure you're logged in to NPM:

```bash
npm whoami
npm login
```

### Build fails

Check Node version:

```bash
node --version  # Should be >= 18
```

## Next Steps

1. ✅ Repository created
2. ✅ NPM token configured
3. ✅ Dependencies installed
4. ✅ Packages built
5. ⏳ Push to GitHub
6. ⏳ Create release tag
7. ⏳ Verify NPM publication
