import { manifests as workspaceViewManifests } from './views/manifests.js';
import { UMB_BLOCK_GRID_TYPE_WORKSPACE_ALIAS } from './index.js';
import type { ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<ManifestTypes> = [
	...workspaceViewManifests,
	{
		type: 'workspace',
		kind: 'routable',
		name: 'Block Grid Type Workspace',
		alias: UMB_BLOCK_GRID_TYPE_WORKSPACE_ALIAS,
		api: () => import('../../block-type/workspace/block-type-workspace.context.js'),
		meta: {
			entityType: 'block-grid-type',
		},
	},
];
