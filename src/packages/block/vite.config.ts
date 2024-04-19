import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: {
				manifests: 'manifests.ts',
				'umbraco-package': 'umbraco-package.ts',
				'block-grid/index': './block-grid/index.ts',
				'block-list/index': './block-list/index.ts',
				'block-rte/index': './block-rte/index.ts',
				'block-type/index': './block-type/index.ts',
				'block/index': './block/index.ts',
			},
			formats: ['es'],
		},
		outDir: 'dist',
		//sourcemap: true,
		rollupOptions: {
			external: [/^@umbraco/],
		},
	},
});
