import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: ['manifests.ts', 'umbraco-package.ts'],
			formats: ['es'],
		},
		outDir: 'dist',
		//sourcemap: true,
		rollupOptions: {
			external: [/^@umbraco/],
		},
	},
});
