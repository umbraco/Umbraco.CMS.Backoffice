import { UMB_USER_ROOT_ENTITY_TYPE } from '../../entity.js';
import type { ManifestTypes, UmbExtensionManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<ManifestTypes | UmbExtensionManifestKind> = [
	{
		type: 'workspace',
		alias: 'Umb.Workspace.UserRoot',
		name: 'User Root Workspace View',
		element: () => import('./user-root-workspace.element.js'),
		meta: {
			entityType: UMB_USER_ROOT_ENTITY_TYPE,
		},
	},
];
