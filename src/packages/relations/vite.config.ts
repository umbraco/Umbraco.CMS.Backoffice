import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: {
				manifests: 'manifests.ts',
				'umbraco-package': 'umbraco-package.ts',
				'relation-types/index': './relation-types/index.ts',
				'relations/index': './relations/index.ts',
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
