import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: {
				manifests: 'manifests.ts',
				'umbraco-package': 'umbraco-package.ts',
				'member/index': './member/index.ts',
				'member-group/index': './member-group/index.ts',
				'member-type/index': './member-type/index.ts',
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
