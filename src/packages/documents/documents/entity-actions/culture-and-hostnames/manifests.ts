import { UMB_DOCUMENT_ENTITY_TYPE } from '../../entity.js';
import { UMB_USER_PERMISSION_DOCUMENT_CULTURE_AND_HOSTNAMES } from '../../user-permissions/index.js';
import { UmbDocumentCultureAndHostnamesEntityAction } from './culture-and-hostnames.action.js';
import type { ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';

const entityActions: Array<ManifestTypes> = [
	{
		type: 'entityAction',
		kind: 'default',
		alias: 'Umb.EntityAction.Document.CultureAndHostnames',
		name: 'Culture And Hostnames Document Entity Action',
		weight: 400,
		api: UmbDocumentCultureAndHostnamesEntityAction,
		forEntityTypes: [UMB_DOCUMENT_ENTITY_TYPE],
		meta: {
			icon: 'icon-home',
			label: '#actions_assigndomain',
		},
		conditions: [
			{
				alias: 'Umb.Condition.UserPermission.Document',
				allOf: [UMB_USER_PERMISSION_DOCUMENT_CULTURE_AND_HOSTNAMES],
			},
		],
	},
];

const manifestModals: Array<ManifestTypes> = [
	{
		type: 'modal',
		alias: 'Umb.Modal.CultureAndHostnames',
		name: 'Culture And Hostnames Modal',
		js: () => import('./modal/culture-and-hostnames-modal.element.js'),
	},
];

export const manifests: Array<ManifestTypes> = [...entityActions, ...manifestModals];
