import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: {
				manifests: 'manifests.ts',
				'entry-point': 'entry-point.ts',
				'action/index': './action/index.ts',
				'auth/index': './auth/index.ts',
				'collection/index': './collection/index.ts',
				'components/index': './components/index.ts',
				'content/index': './content/index.ts',
				'content-type/index': './content-type/index.ts',
				'culture/index': './culture/index.ts',
				'debug/index': './debug/index.ts',
				'entity/index': './entity/index.ts',
				'entity-action/index': './entity-action/index.ts',
				'entity-bulk-action/index': './entity-bulk-action/index.ts',
				'event/index': './event/index.ts',
				'extension-registry/index': './extension-registry/index.ts',
				'icon-registry/index': './icon-registry/index.ts',
				'id/index': './id/index.ts',
				'lit-element/index': './lit-element/index.ts',
				'localization/index': './localization/index.ts',
				'menu/index': './menu/index.ts',
				'modal/index': './modal/index.ts',
				//'models/index': './models/index.ts', // currently no index file so it is left out
				'notification/index': './notification/index.ts',
				'picker-input/index': './picker-input/index.ts',
				'property/index': './property/index.ts',
				'property-action/index': './property-action/index.ts',
				'property-editor/index': './property-editor/index.ts',
				'recycle-bin/index': './recycle-bin/index.ts',
				'repository/index': './repository/index.ts',
				'resources/index': './resources/index.ts',
				'router/index': './router/index.ts',
				'section/index': './section/index.ts',
				'server-file-system/index': './server-file-system/index.ts',
				//'settings/index': './settings/index.ts', // currently no index file so it is left out
				'sorter/index': './sorter/index.ts',
				'store/index': './store/index.ts',
				'style/index': './style/index.ts',
				'temporary-file/index': './temporary-file/index.ts',
				'themes/index': './themes/index.ts',
				'tree/index': './tree/index.ts',
				'utils/index': './utils/index.ts',
				'validation/index': './validation/index.ts',
				'variant/index': './variant/index.ts',
				'workspace/index': './workspace/index.ts',
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
