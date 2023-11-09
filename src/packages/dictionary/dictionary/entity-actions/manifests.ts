import { DICTIONARY_REPOSITORY_ALIAS } from '../repository/manifests.js';
import UmbReloadDictionaryEntityAction from './reload.action.js';
import UmbImportDictionaryEntityAction from './import/import.action.js';
import UmbExportDictionaryEntityAction from './export/export.action.js';
import UmbCreateDictionaryEntityAction from './create/create.action.js';
import { UmbDeleteEntityAction, UmbMoveEntityAction } from '@umbraco-cms/backoffice/entity-action';
import type { ManifestEntityAction, ManifestModal } from '@umbraco-cms/backoffice/extension-registry';

const entityType = 'dictionary-item';
const repositoryAlias = DICTIONARY_REPOSITORY_ALIAS;

const entityActions: Array<ManifestEntityAction> = [
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Dictionary.Create',
		name: 'Create Dictionary Entity Action',
		weight: 600,
		api: UmbCreateDictionaryEntityAction,
		meta: {
			icon: 'icon-add',
			label: 'Create',
			repositoryAlias,
			entityTypes: [entityType],
		},
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Dictionary.Move',
		name: 'Move Dictionary Entity Action',
		weight: 500,
		api: UmbMoveEntityAction,
		meta: {
			icon: 'icon-enter',
			label: 'Move',
			repositoryAlias,
			entityTypes: [entityType],
		},
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Dictionary.Export',
		name: 'Export Dictionary Entity Action',
		weight: 400,
		api: UmbExportDictionaryEntityAction,
		meta: {
			icon: 'icon-download-alt',
			label: 'Export',
			repositoryAlias,
			entityTypes: [entityType],
		},
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Dictionary.Import',
		name: 'Import Dictionary Entity Action',
		weight: 300,
		api: UmbImportDictionaryEntityAction,
		meta: {
			icon: 'icon-page-up',
			label: 'Import',
			repositoryAlias,
			entityTypes: [entityType],
		},
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Dictionary.Reload',
		name: 'Reload Dictionary Entity Action',
		weight: 200,
		api: UmbReloadDictionaryEntityAction,
		meta: {
			icon: 'icon-refresh',
			label: 'Reload',
			repositoryAlias,
			entityTypes: [entityType],
		},
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Dictionary.Delete',
		name: 'Delete Dictionary Entity Action',
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

const modals: Array<ManifestModal> = [
	{
		type: 'modal',
		alias: 'Umb.Modal.CreateDictionary',
		name: 'Create Dictionary Modal',
		loader: () => import('./create/create-dictionary-modal.element.js'),
	},
	{
		type: 'modal',
		alias: 'Umb.Modal.ExportDictionary',
		name: 'Export Dictionary Modal',
		loader: () => import('./export/export-dictionary-modal.element.js'),
	},
	{
		type: 'modal',
		alias: 'Umb.Modal.ImportDictionary',
		name: 'Import Dictionary Modal',
		loader: () => import('./import/import-dictionary-modal.element.js'),
	},
];

export const manifests = [...entityActions, ...modals];
