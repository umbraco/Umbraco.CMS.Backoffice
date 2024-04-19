import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: {
				manifest: 'manifests.ts',
				'umbraco-package': 'umbraco-package.ts',
				document: './documents/index.ts',
				'document-type': './document-types/index.ts',
				'document-blueprint': './document-blueprints/index.ts',
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
