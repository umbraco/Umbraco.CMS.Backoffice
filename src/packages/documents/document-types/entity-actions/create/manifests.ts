import {
	UMB_DOCUMENT_TYPE_ENTITY_TYPE,
	UMB_DOCUMENT_TYPE_FOLDER_ENTITY_TYPE,
	UMB_DOCUMENT_TYPE_ROOT_ENTITY_TYPE,
} from '../../entity.js';
import { UmbCreateDataTypeEntityAction } from './create.action.js';
import type { ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';

const entityActions: Array<ManifestTypes> = [
	{
		type: 'entityAction',
		kind: 'default',
		alias: 'Umb.EntityAction.DocumentType.Create',
		name: 'Create Document Type Entity Action',
		weight: 1000,
		api: UmbCreateDataTypeEntityAction,
		forEntityTypes: [
			UMB_DOCUMENT_TYPE_ENTITY_TYPE,
			UMB_DOCUMENT_TYPE_ROOT_ENTITY_TYPE,
			UMB_DOCUMENT_TYPE_FOLDER_ENTITY_TYPE,
		],
		meta: {
			icon: 'icon-add',
			label: 'Create...',
		},
	},
	{
		type: 'modal',
		alias: 'Umb.Modal.DocumentTypeCreateOptions',
		name: 'Document Type Create Options Modal',
		js: () => import('./modal/document-type-create-options-modal.element.js'),
	},
];

export const manifests = [...entityActions];
