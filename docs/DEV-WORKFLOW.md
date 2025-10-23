# Development Workflow Guide

This guide covers the development workflows for roBrowserLegacy, including both the legacy build system and the modern Vite-based development server.

## Table of Contents

- [Build Systems](#build-systems)
- [Development Server](#development-server)
- [Production Builds](#production-builds)
- [Configuration](#configuration)

## Build Systems

roBrowserLegacy supports two build approaches:

1. **Legacy Builder** - The original RequireJS-based build system
2. **Vite Production Wrapper** - Modern development experience with Vite, wrapping legacy outputs

### Legacy Builder

The legacy builder uses RequireJS and Terser to bundle the application. This is the primary build system that generates `Online.js` and `ThreadEventHandler.js`.

#### Basic Usage

```bash
# Build Online.js, ThreadEventHandler.js, and index.html
npm run build -- -O -T -H

# Or use individual scripts
npm run build:online           # Build Online.js
npm run build:threadhandler    # Build ThreadEventHandler.js
npm run build:html             # Build index.html
```

#### All Build Options

```bash
npm run build -- -O          # Online.js
npm run build -- -T          # ThreadEventHandler.js
npm run build -- -H          # index.html
npm run build -- -V          # MapViewer.js
npm run build -- -G          # GrfViewer.js
npm run build -- -M          # ModelViewer.js
npm run build -- -S          # StrViewer.js
npm run build -- -E          # EffectViewer.js
npm run build -- --all       # Build all targets
npm run build -- --all --m   # Build all targets (minified)
```

#### Output Location

All legacy builds output to `dist/Web/`

### Vite Production Wrapper

The Vite production wrapper provides a modern build pipeline while preserving compatibility with the legacy outputs.

#### What It Does

1. Runs the legacy builder to generate `Online.js`, `ThreadEventHandler.js`, and `index.html`
2. Uses Vite to optimize and bundle static assets with cache-busting
3. Preserves the exact filenames for `Online.js` and `ThreadEventHandler.js` (required by game client)

#### Usage

```bash
npm run build:prodvite
```

This command:
- First runs: `npm run build -- -O -T -H` (legacy build)
- Then runs: `vite build` (Vite optimization)

#### Output Location

Output remains in `dist/Web/` with the same structure as legacy builds.

## Development Server

### Vite Dev Server (Recommended for Development)

Vite provides a fast, modern development server with Hot Module Replacement (HMR).

```bash
npm run dev
```

This starts the Vite dev server on port 5173 (or your configured `VITE_PORT`).

**Note:** The Vite dev server serves files for preview and development. For the full application to work, you need to first build the required files:

```bash
npm run build -- -O -T -H
npm run dev
```

### Live Server (Legacy)

The traditional live-server for serving built files:

```bash
npm run serve
```

This serves files from `dist/Web/` on port 8000.

### Preview Production Build

To preview a Vite production build locally:

```bash
npm run build:prodvite
npm run preview
```

This builds with Vite and then serves the production build on port 5173 (or your configured `VITE_PORT`).

## Configuration

### Configurable Dev Server Port

You can customize the Vite development server port to avoid conflicts or match your deployment requirements.

#### Method 1: Using .env File (Recommended)

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set your desired port:
   ```
   VITE_PORT=3000
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

The server will now run on your configured port.

#### Method 2: Environment Variable

Set the port directly when running commands:

```bash
VITE_PORT=3000 npm run dev
```

or

```bash
PORT=3000 npm run dev
```

#### Docker Configuration

When using Docker, the port configuration is automatically handled:

1. Set `VITE_PORT` in your `.env` file
2. Docker Compose will map the configured port from the container to your host

The `docker-compose.yaml` uses `${VITE_PORT:-5173}:5173`, which means:
- If `VITE_PORT` is set in `.env`, it uses that value for the host port
- Otherwise, defaults to 5173
- Container always uses 5173 internally

Example:
```bash
# .env
VITE_PORT=3000

# Now docker-compose will expose port 3000 on your host
docker-compose up -d ro-browser
```

Access the application at `http://localhost:3000` (or your configured port).

## Typical Workflows

### Starting Fresh Development

```bash
# 1. Install dependencies
npm install

# 2. Build required files
npm run build -- -O -T -H

# 3. Start dev server
npm run dev
```

### Making Changes to Source Files

```bash
# 1. Make your changes in src/

# 2. Rebuild affected components
npm run build:online        # If you changed Online.js related code
npm run build:threadhandler # If you changed ThreadEventHandler.js related code

# 3. Refresh your browser (dev server should reload automatically)
```

### Preparing a Production Build

```bash
# Option 1: Legacy build only
npm run build -- -O -T -H

# Option 2: Vite production wrapper (optimized assets)
npm run build:prodvite
```

### Testing Production Build Locally

```bash
# 1. Build for production
npm run build:prodvite

# 2. Preview the build
npm run preview
```

## Docker Workflow

For Docker-specific workflows, see [DOCKER-QUICKSTART.md](./DOCKER-QUICKSTART.md).

## Troubleshooting

### Port Already in Use

If you see a port conflict error:

1. Change the port in your `.env` file:
   ```
   VITE_PORT=3001
   ```

2. Or kill the process using the port:
   ```bash
   # Find the process
   lsof -i :5173
   
   # Kill it (replace PID with actual process ID)
   kill -9 PID
   ```

### Vite Build Fails

If `npm run build:prodvite` fails:

1. Ensure the legacy build runs successfully first:
   ```bash
   npm run build -- -O -T -H
   ```

2. Check that `dist/Web/` contains `Online.js`, `ThreadEventHandler.js`, and `index.html`

3. Try cleaning and rebuilding:
   ```bash
   rm -rf dist/
   npm run build -- -O -T -H
   npm run build:prodvite
   ```

### Changes Not Reflecting

If your changes aren't showing up:

1. Ensure you've rebuilt the affected components
2. Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
3. For Vite dev server, check the terminal for any errors

## Additional Resources

- [Main Getting Started Guide](../doc/README.md)
- [Docker Quick Start Guide](./DOCKER-QUICKSTART.md)
- [Vite Documentation](https://vitejs.dev/)
