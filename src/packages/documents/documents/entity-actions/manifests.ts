import { UMB_DOCUMENT_DETAIL_REPOSITORY_ALIAS } from '../repository/index.js';
import { UMB_DOCUMENT_ENTITY_TYPE, UMB_DOCUMENT_ROOT_ENTITY_TYPE } from '../entity.js';
import { UmbPublishDocumentEntityAction } from './publish.action.js';
import { UmbCreateDocumentBlueprintEntityAction } from './create-blueprint.action.js';
import { UmbUnpublishDocumentEntityAction } from './unpublish.action.js';
import { UmbRollbackDocumentEntityAction } from './rollback.action.js';
import { manifests as createManifests } from './create/manifests.js';
import { manifests as publicAccessManifests } from './public-access/manifests.js';
import { manifests as cultureAndHostnamesManifests } from './culture-and-hostnames/manifests.js';
import {
	UmbCopyEntityAction,
	UmbMoveEntityAction,
	UmbSortChildrenOfEntityAction,
} from '@umbraco-cms/backoffice/entity-action';
import type { ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';

const entityActions: Array<ManifestTypes> = [
	...createManifests,
	...publicAccessManifests,
	...cultureAndHostnamesManifests,
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Document.CreateBlueprint',
		name: 'Create Document Blueprint Entity Action',
		weight: 800,
		api: UmbCreateDocumentBlueprintEntityAction,
		meta: {
			icon: 'icon-blueprint',
			label: 'Create Document Blueprint (TBD)',
			repositoryAlias: UMB_DOCUMENT_DETAIL_REPOSITORY_ALIAS,
			entityTypes: [UMB_DOCUMENT_ENTITY_TYPE],
		},
		conditions: [
			{
				alias: 'Umb.Condition.UserPermission',
				verb: 'Umb.Document.CreateBlueprint',
			},
		],
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Document.Move',
		name: 'Move Document Entity Action ',
		weight: 700,
		api: UmbMoveEntityAction,
		meta: {
			icon: 'icon-enter',
			label: 'Move (TBD)',
			repositoryAlias: UMB_DOCUMENT_DETAIL_REPOSITORY_ALIAS,
			entityTypes: [UMB_DOCUMENT_ENTITY_TYPE],
		},
		conditions: [
			{
				alias: 'Umb.Condition.UserPermission',
				verb: 'Umb.Document.Move',
			},
		],
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Document.Duplicate',
		name: 'Duplicate Document Entity Action',
		weight: 600,
		api: UmbCopyEntityAction,
		meta: {
			icon: 'icon-documents',
			label: 'Duplicate (TBD)',
			repositoryAlias: UMB_DOCUMENT_DETAIL_REPOSITORY_ALIAS,
			entityTypes: [UMB_DOCUMENT_ENTITY_TYPE],
		},
		conditions: [
			{
				alias: 'Umb.Condition.UserPermission',
				verb: 'Umb.Document.Duplicate',
			},
		],
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Document.Sort',
		name: 'Sort Document Entity Action',
		weight: 500,
		api: UmbSortChildrenOfEntityAction,
		meta: {
			icon: 'icon-navigation-vertical',
			label: 'Sort (TBD)',
			repositoryAlias: UMB_DOCUMENT_DETAIL_REPOSITORY_ALIAS,
			entityTypes: [UMB_DOCUMENT_ROOT_ENTITY_TYPE, UMB_DOCUMENT_ENTITY_TYPE],
		},
		conditions: [
			{
				alias: 'Umb.Condition.UserPermission',
				verb: 'Umb.Document.Sort',
			},
		],
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Document.Publish',
		name: 'Publish Document Entity Action',
		api: UmbPublishDocumentEntityAction,
		meta: {
			icon: 'icon-globe',
			label: 'Publish',
			repositoryAlias: UMB_DOCUMENT_DETAIL_REPOSITORY_ALIAS,
			entityTypes: [UMB_DOCUMENT_ENTITY_TYPE],
		},
		conditions: [
			{
				alias: 'Umb.Condition.UserPermission',
				verb: 'Umb.Document.Publish',
			},
		],
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Document.Unpublish',
		name: 'Unpublish Document Entity Action',
		api: UmbUnpublishDocumentEntityAction,
		meta: {
			icon: 'icon-globe',
			label: 'Unpublish',
			repositoryAlias: UMB_DOCUMENT_DETAIL_REPOSITORY_ALIAS,
			entityTypes: [UMB_DOCUMENT_ENTITY_TYPE],
		},
		conditions: [
			{
				alias: 'Umb.Condition.UserPermission',
				verb: 'Umb.Document.Unpublish',
			},
		],
	},
	{
		type: 'entityAction',
		alias: 'Umb.EntityAction.Document.Rollback',
		name: 'Rollback Document Entity Action',
		api: UmbRollbackDocumentEntityAction,
		meta: {
			icon: 'icon-undo',
			label: 'Rollback (TBD)',
			repositoryAlias: UMB_DOCUMENT_DETAIL_REPOSITORY_ALIAS,
			entityTypes: [UMB_DOCUMENT_ENTITY_TYPE],
		},
		conditions: [
			{
				alias: 'Umb.Condition.UserPermission',
				verb: 'Umb.Document.Rollback',
			},
		],
	},
];

export const manifests = [...entityActions];
