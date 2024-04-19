import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: ['index.ts', 'manifests.ts', 'umbraco-package.ts'],
			formats: ['es'],
		},
		outDir: 'dist',
		sourcemap: true,
		rollupOptions: {
			external: [/^@umbraco/],
		},
	},
});
