# Publishing Guide

This guide explains how to publish `liquidglass-ui` to npm and deploy the documentation site.

## Prerequisites

1. npm account with publish access
2. GitHub repository created at `github.com/nitinkanish/liquidglass-ui`
3. GitHub Pages enabled for the repository

## Initial Setup

### 1. Create GitHub Repository

```bash
# Initialize and push to GitHub
git remote add origin https://github.com/nitinkanish/liquidglass-ui.git
git branch -M main
git push -u origin main
```

### 2. Configure npm Authentication

Add your npm token to GitHub Secrets:

1. Go to your repository Settings > Secrets and variables > Actions
2. Click "New repository secret"
3. Name: `NPM_TOKEN`
4. Value: Your npm access token (get one from https://www.npmjs.com/settings/YOUR_USERNAME/tokens)

### 3. Enable GitHub Pages

1. Go to repository Settings > Pages
2. Source: "GitHub Actions"
3. The docs will be deployed automatically on push to main

## Publishing Workflow

### 1. Update Version

```bash
cd packages/liquidglass-ui

# For patch release (0.1.0 -> 0.1.1)
npm version patch

# For minor release (0.1.0 -> 0.2.0)
npm version minor

# For major release (0.1.0 -> 1.0.0)
npm version major
```

### 2. Update Changelog

Edit `CHANGELOG.md` with the new version's changes following the Keep a Changelog format.

### 3. Commit and Tag

```bash
# Commit the version bump
git add .
git commit -m "chore: release v$(node -p "require('./packages/liquidglass-ui/package.json').version")"

# Create a tag
git tag v$(node -p "require('./packages/liquidglass-ui/package.json').version")

# Push with tags
git push && git push --tags
```

### 4. Automated Release

The GitHub Actions release workflow will:
1. Run tests
2. Build the library
3. Publish to npm

### Manual Publishing (if needed)

```bash
cd packages/liquidglass-ui

# Build
pnpm build

# Dry run to check what will be published
npm pack --dry-run

# Publish (requires npm login)
npm publish
```

## Verifying the Release

### Check npm

```bash
npm view liquidglass-ui
```

### Test Installation

```bash
# Create a test project
mkdir test-liquidglass && cd test-liquidglass
npm init -y
npm install liquidglass-ui react react-dom
```

### Check Documentation

Visit your GitHub Pages URL: `https://nitinkanish.github.io/liquidglass-ui`

## Troubleshooting

### npm publish fails with 403

- Ensure your npm token has publish permissions
- Check if the package name is available: `npm view liquidglass-ui`
- Verify you're logged in: `npm whoami`

### GitHub Actions fails

- Check the Actions tab for error logs
- Ensure all secrets are properly configured
- Verify the workflow files are correct

### Docs don't deploy

- Check GitHub Pages settings
- Ensure the build output is in `apps/docs/dist`
- Check the Actions workflow logs

## Release Checklist

- [ ] All tests pass (`pnpm test`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Docs build succeeds (`pnpm build:docs`)
- [ ] `npm pack --dry-run` shows correct files
- [ ] Version bumped in `packages/liquidglass-ui/package.json`
- [ ] CHANGELOG.md updated
- [ ] Committed and tagged
- [ ] Pushed to GitHub with tags
- [ ] GitHub Actions release workflow completed
- [ ] Package visible on npm
- [ ] Docs deployed to GitHub Pages

## Package Contents

The published package includes:

```
liquidglass-ui/
├── dist/
│   ├── index.js       # ESM bundle
│   ├── index.cjs      # CommonJS bundle
│   ├── index.d.ts     # TypeScript types (ESM)
│   ├── index.d.cts    # TypeScript types (CJS)
│   └── styles.css     # CSS styles
├── LICENSE
├── README.md
└── package.json
```
