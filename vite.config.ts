import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
// import { createRequire } from 'node:module';

// const require = createRequire(import.meta.url);

export default defineConfig({
	plugins: [
		sveltekit(),
	],
	server: {
		host: true,
		port: 3300
	}
});

/**
 * import { nodePolyfills } from 'vite-plugin-node-polyfills';
 * 
 * plugins: [
		nodePolyfills(),
		sveltekit()
	],
 */
