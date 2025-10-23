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
# Development Workflow

This guide explains how to use the modern Vite development server alongside the existing legacy build tools.

## Development Approaches

### Option 1: Vite Dev Server (Recommended for Development)

The Vite dev server provides fast live reload and hot module replacement (HMR) for HTML, CSS, and JavaScript files. This is ideal for rapid development and iteration.

**When to use Vite:**

- Active development with frequent file changes
- Testing HTML/CSS/JS edits with instant feedback
- Local development on macOS Safari, Chrome, or other modern browsers

**Limitations:**

- Dev server only - not for production builds
- Legacy builder still required for production outputs (Online.js, ThreadEventHandler.js)

### Option 2: Live Server (Existing Workflow)

The existing live-server setup continues to work as before and can be used if you prefer the traditional workflow.

**When to use live-server:**

- Testing built production files from `dist/Web`
- When Vite compatibility issues arise
- NW.js development (unchanged)

## Using Vite Dev Server

### Local Development (Outside Docker)

1. **Install dependencies** (first time only):

   ```bash
   npm install
   ```

2. **Start Vite dev server**:

   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to `http://localhost:5173/`

4. **Edit files**:
   Changes to HTML, CSS, and JS files will automatically reload in the browser.

### Docker Development

1. **Start the Docker container**:

   ```bash
   docker-compose up -d ro-browser
   ```

2. **Install dependencies** (first time only):

   ```bash
   docker-compose exec ro-browser npm install
   ```

3. **Start Vite dev server inside the container**:

   ```bash
   docker-compose exec ro-browser npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:5173/`

5. **Edit files**:
   Changes to files in your local repository will be reflected in the container via volume mounts, and Vite will automatically reload the browser.

### Preview Mode

To test the dev server with a preview of built files:

```bash
npm run preview
```

This serves the project on port 5173 similar to the dev server, useful for quick previews.

## Production Builds (Legacy Builder)

The existing builder workflow remains unchanged and is still required for production builds.

### Building for Production

**Build all production files**:

```bash
npm run build -- -O -T -H
```

This generates:

- `dist/Web/Online.js` - Main application bundle
- `dist/Web/ThreadEventHandler.js` - Worker thread handler
- `dist/Web/index.html` - HTML entry point

**Build individual components**:

```bash
npm run build:online           # Build Online.js
npm run build:threadhandler    # Build ThreadEventHandler.js
npm run build:html             # Build index.html
```

**Build with minification**:

```bash
npm run build -- --all --m
```

### Serving Production Builds

After building, you can serve the production files:

```bash
npm run serve
```

This uses live-server to serve files from `dist/Web` on port 8000.

## macOS Safari & HTTPS/WSS Considerations

### HTTPS Requirements

Safari (especially on macOS) may require HTTPS for certain features like WebSocket connections and service workers.

**For local development with HTTPS:**

You can configure Vite to use HTTPS by creating a local SSL certificate:

1. Generate a self-signed certificate (one-time setup):

   ```bash
   # macOS/Linux
   openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
     -keyout localhost-key.pem -out localhost.pem
   ```

2. Update `vite.config.ts` to use HTTPS:

   ```typescript
   import fs from 'fs';

   server: {
     https: {
       key: fs.readFileSync('localhost-key.pem'),
       cert: fs.readFileSync('localhost.pem'),
     },
     // ... other config
   }
   ```

3. Access via `https://localhost:5173/`

4. Accept the browser security warning for the self-signed certificate

### WebSocket Proxy (WSS)

For production deployments or when testing with real game servers, you'll need:

1. **WSProxy** configured for WebSocket-to-TCP communication
   - See [roBrowserLegacy-wsProxy](https://github.com/MrAntares/roBrowserLegacy-wsProxy)

2. **HTTPS/WSS** - If your site uses HTTPS, your WebSocket connections must use WSS
   - Configure your proxy to support WSS
   - Update connection URLs in your application config

### Browser-Specific Notes

**Safari:**

- May show stricter CORS policies - ensure your WebSocket proxy allows CORS if needed
- Service Workers require HTTPS in production
- IndexedDB works in HTTPS and localhost

**Chrome/Chromium:**

- More permissive for localhost development
- HTTPS still recommended for production-like testing

## Common Workflows

### Scenario 1: UI/CSS Development

1. Start Vite dev server: `npm run dev`
2. Edit CSS/HTML files in `src/UI/` or other directories
3. See changes instantly in browser at `http://localhost:5173/`

### Scenario 2: JavaScript Development

1. Start Vite dev server: `npm run dev`
2. Edit JavaScript files in `src/`
3. Browser automatically reloads with changes
4. For production testing, build with `npm run build -- -O -T -H`

### Scenario 3: Testing Production Build

1. Build production files: `npm run build -- -O -T -H`
2. Serve built files: `npm run serve`
3. Test at `http://localhost:8000/`

### Scenario 4: Docker Development

1. Start container: `docker-compose up -d ro-browser`
2. Enter container: `docker-compose exec ro-browser bash`
3. Inside container: `npm run dev`
4. Edit files locally, see changes at `http://localhost:5173/`

## Troubleshooting

### Vite Not Reloading

If Vite isn't detecting file changes in Docker:

- The config already uses polling (`usePolling: true`)
- Check that files are being saved correctly
- Try restarting the dev server

### Port Already in Use

If port 5173 is already in use:

- Stop the conflicting process
- Or edit `vite.config.ts` to use a different port
- Update `docker-compose.yaml` port mapping accordingly

### Browser Connection Refused

If you can't connect to `http://localhost:5173/`:

- Ensure the dev server is running (`npm run dev`)
- Check Docker port mappings in `docker-compose.yaml`
- Verify container is running: `docker-compose ps`

### Legacy Scripts Not Working

If existing scripts (`serve`, `live`, `build`) have issues:

- These remain unchanged and should work as before
- Check that dependencies are installed: `npm install`
- See [DOCKER-QUICKSTART.md](DOCKER-QUICKSTART.md) for Docker-specific help

## Next Steps

- **Game Server Setup**: See [main documentation](../doc/README.md)
- **WebSocket Proxy**: [roBrowserLegacy-wsProxy](https://github.com/MrAntares/roBrowserLegacy-wsProxy)
- **Remote Client**: [roBrowserLegacy-RemoteClient-PHP](https://github.com/MrAntares/roBrowserLegacy-RemoteClient-PHP)
- **Community**: [Discord](https://discord.gg/8JdHwM4Kqm) | [GitHub Discussions](https://github.com/MrAntares/roBrowserLegacy/discussions)

## Future Enhancements (Out of Scope for Now)

Future phases may include:

- Using Vite for production builds alongside legacy builder
- ES module refactoring
- TypeScript integration for new code
- Improved source maps and debugging

For now, Vite serves as a development-only tool, while the legacy builder handles production builds.
