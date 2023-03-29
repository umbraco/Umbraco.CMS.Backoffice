import { DATA_TYPE_REPOSITORY_ALIAS } from '../repository/manifests';
import { manifests as createManifests } from './create/manifests';
import { UmbDeleteEntityAction } from '@umbraco-cms/backoffice/entity-action';
import { ManifestEntityAction } from '@umbraco-cms/backoffice/extensions-registry';

const entityActions: Array<ManifestEntityAction> = [
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

export const manifests = [...entityActions, ...createManifests];
