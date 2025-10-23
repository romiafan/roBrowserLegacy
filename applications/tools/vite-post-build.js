#!/usr/bin/env node

/**
 * Post-build script for Vite production wrapper
 * Copies the Vite build output back to dist/Web while preserving
 * Online.js and ThreadEventHandler.js from the legacy build
 */

const fs = require('fs');
const path = require('path');

const viteBuildDir = '.vite-build-tmp';
const targetDir = 'dist/Web';

// Files to preserve from legacy build (don't overwrite with Vite output)
const preserveFiles = ['Online.js', 'ThreadEventHandler.js'];

function copyRecursive(src, dest, preserveList = []) {
	if (!fs.existsSync(src)) {
		console.log(`Source directory ${src} does not exist, skipping copy`);
		return;
	}

	const stats = fs.statSync(src);

	if (stats.isDirectory()) {
		if (!fs.existsSync(dest)) {
			fs.mkdirSync(dest, { recursive: true });
		}

		const entries = fs.readdirSync(src);
		for (const entry of entries) {
			const srcPath = path.join(src, entry);
			const destPath = path.join(dest, entry);
			copyRecursive(srcPath, destPath, preserveList);
		}
	} else {
		// Check if this file should be preserved
		const fileName = path.basename(src);
		if (preserveList.includes(fileName)) {
			console.log(`Preserving ${fileName} from legacy build`);
			return;
		}

		// Copy the file
		fs.copyFileSync(src, dest);
		console.log(`Copied ${src} -> ${dest}`);
	}
}

console.log('Post-processing Vite build...');
console.log(`Source: ${viteBuildDir}`);
console.log(`Target: ${targetDir}`);
console.log(`Preserving: ${preserveFiles.join(', ')}`);

// Copy files from Vite build to dist/Web, preserving specified files
copyRecursive(viteBuildDir, targetDir, preserveFiles);

// Clean up temporary Vite build directory
if (fs.existsSync(viteBuildDir)) {
	fs.rmSync(viteBuildDir, { recursive: true, force: true });
	console.log(`Cleaned up temporary directory: ${viteBuildDir}`);
}

console.log('Post-processing complete!');
