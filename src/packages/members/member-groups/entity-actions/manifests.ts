import { MEMBER_GROUP_REPOSITORY_ALIAS } from '../repository/manifests.js';
import type { ManifestEntityAction } from '@umbraco-cms/backoffice/extension-registry';
import { UmbDeleteEntityAction } from '@umbraco-cms/backoffice/entity-action';

const entityActions: Array<ManifestEntityAction> = [
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.MemberGroup.Delete',
		name: 'Delete Member Group Entity Action ',
		meta: {
			icon: 'umb:trash',
			label: 'Delete',
			api: UmbDeleteEntityAction,
			repositoryAlias: MEMBER_GROUP_REPOSITORY_ALIAS,
			entityTypes: ['member-group'],
		},
	},
];

export const manifests = [...entityActions];
