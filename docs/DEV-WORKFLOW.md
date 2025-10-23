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
