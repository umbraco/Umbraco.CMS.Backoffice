import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: ['index.ts'],
			formats: ['es'],
		},
		outDir: 'dist',
		sourcemap: true,
		rollupOptions: {
			external: [/^@umbraco/],
		},
	},
});
