import { DOCUMENT_REPOSITORY_ALIAS } from '../repository/manifests';
import { UmbCreateDocumentEntityAction } from './create.action';
import { UmbPublishDocumentEntityAction } from './publish.action';
import { UmbDocumentCultureAndHostnamesEntityAction } from './culture-and-hostnames.action';
import { UmbCreateDocumentBlueprintEntityAction } from './create-blueprint.action';
import { UmbDocumentPublicAccessEntityAction } from './public-access.action';
import { UmbDocumentPermissionsEntityAction } from './permissions.action';
import { UmbUnpublishDocumentEntityAction } from './unpublish.action';
import { UmbRollbackDocumentEntityAction } from './rollback.action';
import {
	UmbCopyEntityAction,
	UmbMoveEntityAction,
	UmbTrashEntityAction,
	UmbSortChildrenOfEntityAction,
} from '@umbraco-cms/entity-action';
import { ManifestEntityAction } from '@umbraco-cms/extensions-registry';

const entityType = 'document';

const entityActions: Array<ManifestEntityAction> = [
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Document.Create',
		name: 'Create Document Entity Action',
		weight: 1000,
		meta: {
			entityType,
			icon: 'umb:add',
			label: 'Create',
			repositoryAlias: DOCUMENT_REPOSITORY_ALIAS,
			api: UmbCreateDocumentEntityAction,
		},
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Document.Trash',
		name: 'Trash Document Entity Action',
		weight: 900,
		meta: {
			entityType,
			icon: 'umb:trash',
			label: 'Trash',
			repositoryAlias: DOCUMENT_REPOSITORY_ALIAS,
			api: UmbTrashEntityAction,
		},
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Document.CreateBlueprint',
		name: 'Create Document Blueprint Entity Action',
		weight: 800,
		meta: {
			entityType,
			icon: 'umb:blueprint',
			label: 'Create Content Template',
			repositoryAlias: DOCUMENT_REPOSITORY_ALIAS,
			api: UmbCreateDocumentBlueprintEntityAction,
		},
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Document.Move',
		name: 'Move Document Entity Action',
		weight: 700,
		meta: {
			entityType,
			icon: 'umb:enter',
			label: 'Move',
			repositoryAlias: DOCUMENT_REPOSITORY_ALIAS,
			api: UmbMoveEntityAction,
		},
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Document.Copy',
		name: 'Copy Document Entity Action',
		weight: 600,
		meta: {
			entityType,
			icon: 'umb:documents',
			label: 'Copy',
			repositoryAlias: DOCUMENT_REPOSITORY_ALIAS,
			api: UmbCopyEntityAction,
		},
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Document.Sort',
		name: 'Sort Document Entity Action',
		weight: 500,
		meta: {
			entityType,
			icon: 'umb:navigation-vertical',
			label: 'Sort',
			repositoryAlias: DOCUMENT_REPOSITORY_ALIAS,
			api: UmbSortChildrenOfEntityAction,
		},
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Document.CultureAndHostnames',
		name: 'Culture And Hostnames Document Entity Action',
		weight: 400,
		meta: {
			entityType,
			icon: 'umb:home',
			label: 'Culture And Hostnames',
			repositoryAlias: DOCUMENT_REPOSITORY_ALIAS,
			api: UmbDocumentCultureAndHostnamesEntityAction,
		},
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Document.Permissions',
		name: 'Document Permissions Entity Action',
		meta: {
			entityType,
			icon: 'umb:vcard',
			label: 'Permissions',
			repositoryAlias: DOCUMENT_REPOSITORY_ALIAS,
			api: UmbDocumentPermissionsEntityAction,
		},
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Document.PublicAccess',
		name: 'Document Permissions Entity Action',
		meta: {
			entityType,
			icon: 'umb:lock',
			label: 'Public Access',
			repositoryAlias: DOCUMENT_REPOSITORY_ALIAS,
			api: UmbDocumentPublicAccessEntityAction,
		},
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Document.Publish',
		name: 'Publish Document Entity Action',
		meta: {
			entityType,
			icon: 'umb:globe',
			label: 'Publish',
			repositoryAlias: DOCUMENT_REPOSITORY_ALIAS,
			api: UmbPublishDocumentEntityAction,
		},
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Document.Unpublish',
		name: 'Unpublish Document Entity Action',
		meta: {
			entityType,
			icon: 'umb:globe',
			label: 'Unpublish',
			repositoryAlias: DOCUMENT_REPOSITORY_ALIAS,
			api: UmbUnpublishDocumentEntityAction,
		},
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Document.Rollback',
		name: 'Rollback Document Entity Action',
		meta: {
			entityType,
			icon: 'umb:undo',
			label: 'Rollback',
			repositoryAlias: DOCUMENT_REPOSITORY_ALIAS,
			api: UmbRollbackDocumentEntityAction,
		},
	},
];

export const manifests = [...entityActions];
