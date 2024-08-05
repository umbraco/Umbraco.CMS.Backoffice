import type { Observable } from '@umbraco-cms/backoffice/external/rxjs';
import type { ManifestCollection } from '@umbraco-cms/backoffice/extension-registry';
import type { UmbPaginationManager } from '@umbraco-cms/backoffice/utils';
import type { UmbEntityModel } from '@umbraco-cms/backoffice/entity';

export interface UmbCollectionItemModel extends UmbEntityModel {
	unique: string;
	icon?: string;
	name?: string;
}

export interface UmbCollectionRootModel extends UmbEntityModel {
	unique: null;
	hasChildren: boolean;
	name: string;
	icon: string | null;
}

export type UmbCollectionSelectionConfiguration = {
	multiple?: boolean;
	selectable?: boolean;
	selection?: Array<string | null>;
};

// TODO: this interface should only be applied for content collections.
export interface UmbCollectionBulkActionPermissions {
	allowBulkCopy: boolean;
	allowBulkDelete: boolean;
	allowBulkMove: boolean;
	allowBulkPublish: boolean;
	allowBulkUnpublish: boolean;
}

// TODO: this interface should only be applied for content collections.
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

// TODO: this interface should only be applied for content collections.
export interface UmbCollectionColumnConfiguration {
	alias: string;
	header: string;
	// TODO: [LK] Figure out why the server API needs an int (1|0) instead of a boolean.
	isSystem: 1 | 0;
	elementName?: string;
	// TODO: [LK] Remove `nameTemplate`, to be replaced with `elementName`.
	nameTemplate?: string;
}

// TODO: this interface should only be applied for content collections.
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
}
