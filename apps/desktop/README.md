# SPARK Desktop

Electron + React desktop workspace for SPARK.

This package is intentionally nested under `apps/desktop`. The repository root remains the authoritative place for install, lockfile, and top-level scripts.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
npm install
```

Run install from the repository root. Do not maintain a second `package-lock.json` in this workspace.

### Development

```bash
npm run desktop:dev
```

### Build

```bash
npm run desktop:build
```

Platform-specific builds are exposed from the root package:

```bash
npm run desktop:build:win
npm run desktop:build:mac
```
