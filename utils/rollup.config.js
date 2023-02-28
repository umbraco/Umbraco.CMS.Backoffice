import esbuild from 'rollup-plugin-esbuild';
import pluginJson from '@rollup/plugin-json';
//import { nodeResolve } from '@rollup/plugin-node-resolve';

/** @type {import('rollup').RollupOptions} */
export default {
	input: 'index.ts',
	external: [/^@umbraco-cms\//, /^@umbraco-ui\//, /^lit/, /^rxjs/],
	output: {
		file: 'dist/index.js',
		format: 'es',
		sourcemap: true,
	},
	plugins: [pluginJson(), esbuild({ sourceMap: true })],
};
