import { DATA_TYPE_REPOSITORY_ALIAS } from '../repository/manifests';
import { UmbCreateDataTypeEntityAction } from './create/create.action';
import { UmbDeleteEntityAction } from '@umbraco-cms/backoffice/entity-action';
import { ManifestEntityAction } from '@umbraco-cms/backoffice/extensions-registry';

const entityActions: Array<ManifestEntityAction> = [
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.DataType.Create',
		name: 'Create Data Type Entity Action',
		weight: 900,
		meta: {
			icon: 'umb:add',
			label: 'Create',
			repositoryAlias: DATA_TYPE_REPOSITORY_ALIAS,
			api: UmbCreateDataTypeEntityAction,
		},
		conditions: {
			entityType: 'data-type-root',
		},
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.DataType.Delete',
		name: 'Delete Data Type Entity Action',
		weight: 900,
		meta: {
			icon: 'umb:trash',
			label: 'Delete',
			repositoryAlias: DATA_TYPE_REPOSITORY_ALIAS,
			api: UmbDeleteEntityAction,
		},
		conditions: {
			entityType: 'data-type',
		},
	},
];

export const manifests = [...entityActions];
