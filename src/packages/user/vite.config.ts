import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: {
				manifests: 'manifests.ts',
				'umbraco-package': 'umbraco-package.ts',
				'user/index': './user/index.ts',
				'user-group/index': './user-group/index.ts',
				'user-permission/index': './user-permission/index.ts',
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
