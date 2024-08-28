import type { Observable } from '@umbraco-cms/backoffice/external/rxjs';
import type { ManifestCollection } from '@umbraco-cms/backoffice/extension-registry';
import type { UmbPaginationManager, UmbReadOnlyStateManager } from '@umbraco-cms/backoffice/utils';

export interface UmbCollectionBulkActionPermissions {
	allowBulkCopy: boolean;
	allowBulkDelete: boolean;
	allowBulkMove: boolean;
	allowBulkPublish: boolean;
	allowBulkUnpublish: boolean;
}

export interface UmbCollectionConfiguration {
	unique?: string;
	dataTypeId?: string;
	allowedEntityBulkActions?: UmbCollectionBulkActionPermissions;
	layouts?: Array<UmbCollectionLayoutConfiguration>;
	orderBy?: string;
	orderDirection?: string;
	pageSize?: number;
	userDefinedProperties?: Array<UmbCollectionColumnConfiguration>;
}

export interface UmbCollectionColumnConfiguration {
	alias: string;
	header: string;
	// TODO: [LK] Figure out why the server API needs an int (1|0) instead of a boolean.
	isSystem: 1 | 0;
	elementName?: string;
	// TODO: [LK] Remove `nameTemplate`, to be replaced with `elementName`.
	nameTemplate?: string;
}

export interface UmbCollectionLayoutConfiguration {
	icon?: string;
	name: string;
	collectionView: string;
}

export interface UmbCollectionContext {
	setConfig(config: UmbCollectionConfiguration): void;
	getConfig(): UmbCollectionConfiguration | undefined;
	setManifest(manifest: ManifestCollection): void;
	getManifest(): ManifestCollection | undefined;
	requestCollection(): Promise<void>;
	pagination: UmbPaginationManager;
	items: Observable<any[]>;
	totalItems: Observable<number>;
	readOnlyState?: UmbReadOnlyStateManager;
}
