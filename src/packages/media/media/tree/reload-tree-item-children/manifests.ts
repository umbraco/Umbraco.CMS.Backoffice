import { UMB_MEDIA_ENTITY_TYPE, UMB_MEDIA_ROOT_ENTITY_TYPE } from '../../entity.js';
import { UMB_IS_SECTION_SIDEBAR_CONDITION_ALIAS } from '@umbraco-cms/backoffice/section';

export const manifests: Array<UmbExtensionManifest> = [
	{
		type: 'entityAction',
		kind: 'reloadTreeItemChildren',
		alias: 'Umb.EntityAction.Media.Tree.ReloadChildrenOf',
		name: 'Reload Media Tree Item Children Entity Action',
		forEntityTypes: [UMB_MEDIA_ENTITY_TYPE, UMB_MEDIA_ROOT_ENTITY_TYPE],
		conditions: [
			{
				alias: UMB_IS_SECTION_SIDEBAR_CONDITION_ALIAS,
			},
		],
	},
];
