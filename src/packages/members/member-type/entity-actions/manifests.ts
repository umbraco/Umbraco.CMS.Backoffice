import { UMB_MEMBER_TYPE_ENTITY_TYPE, UMB_MEMBER_TYPE_ROOT_ENTITY_TYPE } from '../entity.js';
import { UMB_MEMBER_TYPE_DETAIL_REPOSITORY_ALIAS } from '../repository/detail/index.js';
import { UmbCreateMemberTypeEntityAction } from './create.action.js';
import { UmbDeleteEntityAction } from '@umbraco-cms/backoffice/entity-action';
import type { ManifestEntityAction } from '@umbraco-cms/backoffice/extension-registry';

const entityActions: Array<ManifestEntityAction> = [
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.MemberType.Create',
		name: 'Create Member Type Entity Action',
		weight: 1000,
		api: UmbCreateMemberTypeEntityAction,
		meta: {
			icon: 'icon-add',
			label: 'Create...',
			repositoryAlias: UMB_MEMBER_TYPE_DETAIL_REPOSITORY_ALIAS,
			entityTypes: [UMB_MEMBER_TYPE_ROOT_ENTITY_TYPE],
		},
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.MemberType.Delete',
		name: 'Delete Member Type Entity Action',
		weight: 100,
		api: UmbDeleteEntityAction,
		meta: {
			icon: 'icon-trash',
			label: 'Delete',
			repositoryAlias: UMB_MEMBER_TYPE_DETAIL_REPOSITORY_ALIAS,
			entityTypes: [UMB_MEMBER_TYPE_ENTITY_TYPE],
		},
	},
];

export const manifests = [...entityActions];
