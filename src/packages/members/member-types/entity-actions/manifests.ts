import { MEMBER_TYPES_REPOSITORY_ALIAS } from '../repository/manifests.js';
import { UmbDeleteEntityAction } from '@umbraco-cms/backoffice/entity-action';
import type { ManifestEntityAction } from '@umbraco-cms/backoffice/extension-registry';

const entityType = 'member-type';
const repositoryAlias = MEMBER_TYPES_REPOSITORY_ALIAS;

const entityActions: Array<ManifestEntityAction> = [
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.MemberType.Delete',
		name: 'Delete Member Type Entity Action',
		weight: 100,
		api: UmbDeleteEntityAction,
		meta: {
			icon: 'icon-trash',
			label: 'Delete',
			repositoryAlias,
			entityTypes: [entityType],
		},
	},
];

export const manifests = [...entityActions];
