# Docker Quick Start Guide

This guide focuses exclusively on running roBrowserLegacy using Docker and Docker Compose.

## Prerequisites

- Docker (20.10 or later)
- Docker Compose (v2.0 or later)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/MrAntares/roBrowserLegacy.git
cd roBrowserLegacy
```

### 2. Start the Development Environment

```bash
docker-compose up -d ro-browser
```

This starts the development container with:
- Node.js 20 environment
- Port 8000 exposed for the web server
- Port 5173 (default) exposed for Vite dev server (configurable via `VITE_PORT` in `.env`)
- Source code mounted at `/app`

**Configuring the Vite Port:**

To use a custom port for the Vite development server:

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set your desired port:
   ```
   VITE_PORT=3000
   ```

3. Restart the container:
   ```bash
   docker-compose down
   docker-compose up -d ro-browser
   ```

The Vite dev server will now be accessible at `http://localhost:3000` (or your configured port).

### 3. Access the Container

```bash
docker-compose exec ro-browser bash
```

### 4. Install Dependencies (First Time Only)

Inside the container:

```bash
npm install
```

### 5. Build the Client

Inside the container, build the necessary files:

```bash
# Build Online.js, ThreadEventHandler.js, and index.html
npm run build -- -O -T -H
```

Or build individual components:

```bash
npm run build:online           # Build Online.js
npm run build:threadhandler    # Build ThreadEventHandler.js
npm run build:html             # Build index.html
```

### 6. Serve the Built Files

The project includes a separate service to serve the built files with Apache, and you can also use Vite for modern development.

#### Option 1: Apache Server (Production-like)

First, make sure your files are built (see step 5), then:

```bash
docker-compose up -d serve-dist
```

Access the client at: `http://localhost:8080`

#### Option 2: Vite Dev Server (Development)

For modern development with Vite:

```bash
# Inside the ro-browser container
npm run dev
```

Access the client at: `http://localhost:5173` (or your configured `VITE_PORT`)

#### Option 3: Vite Production Wrapper

Build with Vite's production optimizations while preserving legacy outputs:

```bash
# Inside the ro-browser container
npm run build:prodvite
npm run preview
```

Access the preview at: `http://localhost:5173` (or your configured `VITE_PORT`)

For more details on build options and development workflows, see [DEV-WORKFLOW.md](./DEV-WORKFLOW.md).

## Development Workflow

### Using Live Server (Development Mode)

For development with live reload using the legacy live-server:

```bash
# Inside the ro-browser container
npm run serve
```

This serves the files from `dist/Web` with live reload at `http://localhost:8000`.

### Using Vite Dev Server (Modern Development)

For modern development with Vite's fast HMR:

```bash
# Inside the ro-browser container
npm run dev
```

This starts Vite's development server at `http://localhost:5173` (or your configured `VITE_PORT`).

**Note:** You need to build the required files first:
```bash
npm run build -- -O -T -H
npm run dev
```

To use development mode (loads source files directly):
1. Set `development: true` in your `dist/Web/index.html` roBrowser config
2. This loads files directly from `src/` for easier debugging

For comprehensive development workflows and build options, see [DEV-WORKFLOW.md](./DEV-WORKFLOW.md).

### Rebuilding After Changes

After making changes to source files:

```bash
# Inside the ro-browser container
npm run build:online
npm run build:threadhandler
npm run build:html
```

### Running wsproxy

The development container includes wsproxy pre-installed. To run it:

```bash
# Inside the ro-browser container
wsproxy --help  # See available options
```

Note: You may need to expose additional ports in `docker-compose.yaml` for wsproxy (e.g., port 5999).

## Docker Compose Services

### `ro-browser` (Development Service)

- **Purpose**: Development environment with Node.js and build tools
- **Port**: 8000
- **Usage**: Build client files, run development server
- **Access**: `docker-compose exec ro-browser bash`

### `serve-dist` (Production-like Service)

- **Purpose**: Serve built files using Apache
- **Port**: 8080
- **Usage**: Test production builds
- **Files served from**: `./dist/Web`

## Common Commands

### Start Services

```bash
# Start development environment
docker-compose up -d ro-browser

# Start production-like server
docker-compose up -d serve-dist

# Start both
docker-compose up -d
```

### Stop Services

```bash
docker-compose down
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f ro-browser
docker-compose logs -f serve-dist
```

### Rebuild Containers

If you've made changes to the Dockerfile:

```bash
docker-compose build
docker-compose up -d
```

## Build Options

The builder supports various targets:

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

## Troubleshooting

### Container Won't Start

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs ro-browser
```

### Permission Issues

If you encounter permission issues with mounted volumes:

```bash
# Inside the container
chown -R node:node /app
```

### Port Already in Use

If ports 8000 or 8080 are already in use, edit `docker-compose.yaml` to use different ports:

```yaml
ports:
  - "8001:8000"  # Map to host port 8001 instead
```

### Clean Start

To start fresh:

```bash
# Stop and remove containers
docker-compose down

# Remove built files
rm -rf dist/

# Start again
docker-compose up -d ro-browser
docker-compose exec ro-browser npm install
docker-compose exec ro-browser npm run build -- -O -T -H
```

## Next Steps

- See the [main documentation](../doc/README.md) for detailed setup of game servers, assets, and configuration
- Configure your game server connection in `dist/Web/index.html`
- Set up a [WebSocket proxy](https://github.com/MrAntares/roBrowserLegacy-wsProxy) for game server connectivity
- Set up a [Remote Client](https://github.com/MrAntares/roBrowserLegacy-RemoteClient-PHP) for serving game assets

## Additional Resources

- [Main Getting Started Guide](../doc/README.md) - Comprehensive setup guide
- [Original roBrowser Documentation](https://www.robrowser.com/)
- [Discord Community](https://discord.gg/8JdHwM4Kqm)
- [GitHub Discussions](https://github.com/MrAntares/roBrowserLegacy/discussions)
