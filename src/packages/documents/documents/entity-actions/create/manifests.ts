import { DOCUMENT_REPOSITORY_ALIAS } from '../../repository/manifests.js';
import { UmbCreateDocumentEntityAction } from './create.action.js';
import { ManifestEntityAction, ManifestModal } from '@umbraco-cms/backoffice/extension-registry';
import { DOCUMENT_ENTITY_TYPE, DOCUMENT_ROOT_ENTITY_TYPE } from '@umbraco-cms/backoffice/document';

const entityActions: Array<ManifestEntityAction> = [
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Document.Create',
		name: 'Create Document Entity Action',
		weight: 1000,
		api: UmbCreateDocumentEntityAction,
		meta: {
			icon: 'icon-add',
			label: 'Create',
			repositoryAlias: DOCUMENT_REPOSITORY_ALIAS,
			entityTypes: [DOCUMENT_ROOT_ENTITY_TYPE, DOCUMENT_ENTITY_TYPE],
		},
		/* removed until we have permissions in place
		conditions: [
			{
				alias: 'Umb.Condition.UserPermission',
				// TODO: investigate why the match property is not typed
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				//@ts-ignore
				match: 'Umb.UserPermission.Document.Create',
			},
		],
		*/
	},
];

const modals: Array<ManifestModal> = [
	{
		type: 'modal',
		alias: 'Umb.Modal.CreateDocument',
		name: 'Create Document Modal',
		loader: () => import('./create-document-modal.element.js'),
	},
];

export const manifests = [...entityActions, ...modals];
