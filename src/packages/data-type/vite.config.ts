import { defineConfig } from 'vite';

const dist = '../../../dist-cms/packages/data-type';

export default defineConfig({
	build: {
		lib: {
			entry: ['manifests.ts'],
			formats: ['es'],
		},
		outDir: dist,
		//sourcemap: true,
		rollupOptions: {
			external: [/^@umbraco/],
		},
	},
});
