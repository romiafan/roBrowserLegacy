import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

// Read port from environment variables with fallback to default
const port = parseInt(process.env.VITE_PORT || process.env.PORT || '5173', 10);

export default defineConfig({
	// Root directory - serve from dist/Web for dev server
	root: 'dist/Web',
	
	// Base public path
	base: './',

	// Dev server configuration
	server: {
		port: port,
		host: '0.0.0.0', // Allow external connections (needed for Docker)
		strictPort: false, // Allow fallback to next available port
	},

	// Preview server configuration
	preview: {
		port: port,
		host: '0.0.0.0',
		strictPort: false,
	},

	// Build configuration for production wrapper
	build: {
		// Output to a temporary directory first, then we'll copy back
		outDir: path.resolve(__dirname, '.vite-build-tmp'),
		emptyOutDir: true,
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, 'dist/Web/index.html'),
			},
		},
		// Don't minify to preserve structure
		minify: false,
	},

	plugins: [
		viteStaticCopy({
			targets: [
				// Copy the large JS files as-is (they're already built by legacy builder)
				{
					src: path.resolve(__dirname, 'dist/Web/Online.js'),
					dest: '.',
				},
				{
					src: path.resolve(__dirname, 'dist/Web/ThreadEventHandler.js'),
					dest: '.',
				},
				// Copy the src directory if it exists
				{
					src: path.resolve(__dirname, 'dist/Web/src'),
					dest: '.',
				},
			],
		}),
	],

	// Resolve configuration
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
