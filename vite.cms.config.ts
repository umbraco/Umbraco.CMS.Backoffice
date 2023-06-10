import { defineConfig } from 'vite';

import { plugins } from './vite.config';
import { lstatSync, readdirSync } from 'fs';

const readFolders = (path) => readdirSync(path).filter((folder) => lstatSync(`${path}/${folder}`).isDirectory());
const createModuleDescriptors = (folderName) =>
	readFolders(`./src/${folderName}`).map((moduleName) => {
		return {
			name: moduleName,
			entry: `./src/${folderName}/${moduleName}/index.ts`,
		};
	});

const externals = createModuleDescriptors('external');
const exclude = [];
const allowed = externals.filter((module) => !exclude.includes(module.name));

export default defineConfig({
	build: {
		lib: {
			entry: allowed.map(m => m.entry),
			formats: ['es'],
		},
		rollupOptions: {
			external: [/^@umbraco-cms\//],
			output: {
				preserveModules: true,
				preserveModulesRoot: 'src',
				entryFileNames: '[name].js'
			}
		},
		outDir: 'dist-cms',
		emptyOutDir: false,
		sourcemap: true,
	},
	base: '/umbraco/backoffice/',
	mode: 'production',
	plugins: [...plugins],
});
