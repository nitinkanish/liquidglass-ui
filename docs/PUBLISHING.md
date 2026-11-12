# Publishing Guide

This guide explains how to publish `@nkanish/liquidglass-ui` to npm and deploy the documentation site.

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

Add your npm token to GitHub Secrets for automated publishing:

1. Go to your repository Settings > Secrets and variables > Actions
2. Click "New repository secret"
3. Name: `NPM_TOKEN`
4. Value: Your npm access token (get one from https://www.npmjs.com/settings/YOUR_USERNAME/tokens)

### 3. Enable GitHub Pages

1. Go to repository Settings > Pages
2. Source: "GitHub Actions"
3. The docs will be deployed automatically on push to main

## Publishing to npm

### Manual Publishing (Recommended for First Release)

```bash
# 1. Login to npm (run once)
npm login
# Enter your npm username, password, and email when prompted
# If using 2FA, you'll be prompted for your OTP

# 2. Verify you're logged in
npm whoami

# 3. Navigate to the package directory
cd packages/liquidglass-ui

# 4. Build the package
pnpm build

# 5. Run tests to ensure everything works
pnpm test

# 6. Preview what will be published (dry run)
npm pack --dry-run

# 7. Publish to npm with public access
npm publish --access public

# 8. Verify the package is published
npm view @nkanish/liquidglass-ui
```

### Tag-Based Release Workflow (After First Release)

For subsequent releases, use the tag-based workflow:

```bash
# 1. Update the version
cd packages/liquidglass-ui

# For patch release (0.1.0 -> 0.1.1)
npm version patch

# For minor release (0.1.0 -> 0.2.0)
npm version minor

# For major release (0.1.0 -> 1.0.0)
npm version major

# 2. Update CHANGELOG.md with release notes

# 3. Commit the version bump
git add .
git commit -m "chore: release v$(node -p "require('./packages/liquidglass-ui/package.json').version")"

# 4. Create a git tag
VERSION=$(node -p "require('./packages/liquidglass-ui/package.json').version")
git tag "v$VERSION"

# 5. Push with tags
git push origin main
git push origin "v$VERSION"
```

The GitHub Actions release workflow will automatically:
1. Run tests
2. Build the library
3. Publish to npm (when tag is pushed)

### Publishing Pre-releases

```bash
# For alpha releases
npm version prerelease --preid=alpha
# 0.1.0 -> 0.1.1-alpha.0

# For beta releases
npm version prerelease --preid=beta
# 0.1.1-alpha.0 -> 0.1.1-beta.0

# Publish with a tag
npm publish --access public --tag next
```

## Verifying the Release

### Check npm

```bash
# View package info
npm view @nkanish/liquidglass-ui

# Check latest version
npm view @nkanish/liquidglass-ui version

# Check all versions
npm view @nkanish/liquidglass-ui versions
```

### Test Installation

```bash
# Create a test project
mkdir test-liquidglass && cd test-liquidglass
npm init -y
npm install @nkanish/liquidglass-ui react react-dom

# Verify the import works
node -e "require('@nkanish/liquidglass-ui')"
```

### Check Documentation

Visit your GitHub Pages URL: https://liquidglass-ui-docs.vercel.app/

## Troubleshooting

### npm publish fails with 403

- Ensure your npm token has publish permissions
- Check if the package name is available: `npm view @nkanish/liquidglass-ui`
- Verify you're logged in: `npm whoami`
- If using 2FA, ensure you enter the correct OTP

### npm publish fails with E402 Payment Required

The package name may require a paid account. Use `npm publish --access public` to publish as a public scoped package.

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
- [ ] Docs build succeeds (`pnpm --filter @liquidglass/docs build`)
- [ ] `npm pack --dry-run` shows correct files
- [ ] Version bumped in `packages/liquidglass-ui/package.json`
- [ ] CHANGELOG.md updated
- [ ] Committed and tagged
- [ ] Pushed to GitHub with tags
- [ ] GitHub Actions release workflow completed
- [ ] Package visible on npm (`npm view @nkanish/liquidglass-ui`)
- [ ] Docs deployed to GitHub Pages

## Package Contents

The published package includes:

```
liquidglass-ui-0.1.0.tgz
├── dist/
│   ├── index.js       # ESM bundle (175 KB)
│   ├── index.cjs      # CommonJS bundle (187 KB)
│   ├── index.d.ts     # TypeScript types (ESM)
│   ├── index.d.cts    # TypeScript types (CJS)
│   ├── index.js.map   # Source map
│   ├── index.cjs.map  # Source map
│   └── styles.css     # CSS styles (10 KB)
├── LICENSE
├── README.md
└── package.json
```

Total package size: ~192 KB (compressed)
