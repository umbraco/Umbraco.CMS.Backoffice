import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: {
				manifest: 'manifests.ts',
				'umbraco-package': 'umbraco-package.ts',
				'documents/index': './documents/index.ts',
				'document-types/index': './document-types/index.ts',
				'document-blueprints/index': './document-blueprints/index.ts',
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
