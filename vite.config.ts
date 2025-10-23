import { defineConfig } from 'vite';

// Vite configuration for development server only
// Production builds continue to use builder-web.js
export default defineConfig({
	// Serve from project root, treating it as a static site
	root: '.',

	// Set dist/Web as the public/output directory for built files
	publicDir: 'dist/Web',

	server: {
		port: 5173,
		host: '0.0.0.0', // Allow access from outside Docker container
		// Enable file watching inside Docker containers
		watch: {
			usePolling: true,
			interval: 100
		},
		// Disable CORS for local development
		cors: true
	},

	preview: {
		port: 5173,
		host: '0.0.0.0'
	}

	// No build configuration - we're only using Vite for dev server
	// Production builds continue to use the existing builder-web.js
});
