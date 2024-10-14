import { UMB_WORKSPACE_ALIAS_CONDITION } from 'src/packages/core/workspace/conditions/const.js';
import { UMB_WEBHOOK_COLLECTION_ALIAS } from '../../collection/manifests.js';
import { UMB_WEBHOOK_ROOT_ENTITY_TYPE } from '../../entity.js';
import { UMB_WEBHOOK_ROOT_WORKSPACE_ALIAS } from './constants.js';

export const manifests: Array<UmbExtensionManifest> = [
	{
		type: 'workspace',
		kind: 'default',
		alias: UMB_WEBHOOK_ROOT_WORKSPACE_ALIAS,
		name: 'Webhook Root Workspace',
		meta: {
			entityType: UMB_WEBHOOK_ROOT_ENTITY_TYPE,
			headline: '#treeHeaders_webhooks',
		},
	},
	{
		type: 'workspaceView',
		kind: 'collection',
		alias: 'Umb.WorkspaceView.WebhookRoot.Collection',
		name: 'Webhook Root Collection Workspace View',
		meta: {
			label: 'Collection',
			pathname: 'collection',
			icon: 'icon-layers',
			collectionAlias: UMB_WEBHOOK_COLLECTION_ALIAS,
		},
		conditions: [
			{
				alias: UMB_WORKSPACE_ALIAS_CONDITION,
				match: UMB_WEBHOOK_ROOT_WORKSPACE_ALIAS,
			},
		],
	},
];
