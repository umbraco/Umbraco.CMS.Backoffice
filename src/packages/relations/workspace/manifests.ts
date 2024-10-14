import { UMB_RELATION_TYPE_COLLECTION_ALIAS } from '@umbraco-cms/backoffice/relation-type';
import { UMB_WORKSPACE_ALIAS_CONDITION } from 'src/packages/core/workspace/conditions/const';

export const manifests: Array<UmbExtensionManifest> = [
	{
		type: 'workspace',
		kind: 'default',
		alias: 'Umb.Workspace.RelationsRoot',
		name: 'Relations Root Workspace',
		meta: {
			entityType: 'relations-root',
			headline: 'Relations',
		},
	},
	{
		type: 'workspaceView',
		kind: 'collection',
		alias: 'Umb.Workspace.RelationsRoot.Collection',
		name: 'Relations Root Collection Workspace View',
		meta: {
			label: 'Collection',
			pathname: 'collection',
			icon: 'icon-layers',
			collectionAlias: UMB_RELATION_TYPE_COLLECTION_ALIAS,
		},
		conditions: [
			{
				alias: UMB_WORKSPACE_ALIAS_CONDITION,
				match: 'Umb.Workspace.RelationsRoot',
			},
		],
	},
];
