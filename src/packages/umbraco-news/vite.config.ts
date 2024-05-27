import { defineConfig } from 'vite';
import { rmSync } from 'fs';

const dist = '../../../dist-cms/packages/umbraco-news';

rmSync(dist, { recursive: true, force: true });

export default defineConfig({
	build: {
		lib: {
			entry: ['manifests.ts', 'umbraco-package.ts'],
			formats: ['es'],
		},
		outDir: dist,
		//sourcemap: true,
		rollupOptions: {
			external: [/^@umbraco/],
		},
	},
});
