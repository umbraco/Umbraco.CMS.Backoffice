import type {
	EntityTreeItemResponseModel,
	FolderTreeItemResponseModel,
	PackageManifestResponseModel,
} from '@umbraco-cms/backoffice/backend-api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HTMLElementConstructor<T = HTMLElement> = new (...args: any[]) => T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ClassConstructor<T> = new (...args: any[]) => T;

// Users
// TODO: would the right name be Node? as entity is just something with a Key. But node is something in a content structure, aka. with hasChildren and parentId.
export interface Entity {
	id: string;
	name: string;
	icon: string;
	type: string;
	hasChildren: boolean;
	parentId: string | null;
}

/** Tried to find a common base of our entities — used by Entity Workspace Context */
export type BaseEntity = {
	id?: string;
	name?: string;
};

export interface UserGroupEntity extends Entity {
	type: 'user-group';
}

// Media Types

export interface MediaTypeDetails extends FolderTreeItemResponseModel {
	id: string; // TODO: Remove this when the backend is fixed
	alias: string;
	properties: [];
}

// Member Groups
export interface MemberGroupDetails extends EntityTreeItemResponseModel {
	id: string; // TODO: Remove this when the backend is fixed
}

export interface MemberDetails extends EntityTreeItemResponseModel {
	id: string; // TODO: Remove this when the backend is fixed
}

export interface SwatchDetails {
	label: string;
	value: string;
}

export type UmbPackage = PackageManifestResponseModel;

export type PackageManifestResponse = UmbPackage[];

export type UmbPackageWithMigrationStatus = UmbPackage & {
	hasPendingMigrations: boolean;
};
