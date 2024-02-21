import { UMB_DOCUMENT_DETAIL_REPOSITORY_ALIAS } from '../../repository/index.js';
import { UMB_DOCUMENT_ENTITY_TYPE, UMB_DOCUMENT_ROOT_ENTITY_TYPE } from '../../entity.js';
import { UmbCreateDocumentEntityAction } from './create.action.js';
import type { ManifestEntityAction, ManifestModal } from '@umbraco-cms/backoffice/extension-registry';

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
			repositoryAlias: UMB_DOCUMENT_DETAIL_REPOSITORY_ALIAS,
			entityTypes: [UMB_DOCUMENT_ROOT_ENTITY_TYPE, UMB_DOCUMENT_ENTITY_TYPE],
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
		alias: 'Umb.Modal.Document.CreateOptions',
		name: 'Document Create Options Modal',
		js: () => import('./document-create-options-modal.element.js'),
	},
];

export const manifests = [...entityActions, ...modals];
