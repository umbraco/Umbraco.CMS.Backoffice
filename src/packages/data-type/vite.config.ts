import { defineConfig } from 'vite';

const dist = '../../../dist-cms/packages/data-type';

export default defineConfig({
	build: {
		lib: {
			entry: ['index.ts', 'manifests.ts', 'umbraco-package.ts'],
			formats: ['es'],
		},
		outDir: dist,
		//sourcemap: true,
		rollupOptions: {
			external: [/^@umbraco/],
		},
	},
});
