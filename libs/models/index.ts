import {
	ContentTreeItem,
	DocumentTreeItem,
	DocumentTypeTreeItem,
	EntityTreeItem,
	FolderTreeItem,
	PagedEntityTreeItem,
	ProblemDetails,
} from '@umbraco-cms/backend-api';
import { Observable } from 'rxjs';

// Extension Manifests
export * from '@umbraco-cms/extensions-registry';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HTMLElementConstructor<T = HTMLElement> = new (...args: any[]) => T;

// Users
// TODO: would the right name be Node? as entity is just something with a Key. But node is something in a content structure, aka. with hasChildren and parentKey.
export interface Entity {
	key: string;
	name: string;
	icon: string;
	type: string;
	hasChildren: boolean;
	parentKey: string | null;
}

export interface ContentDetails extends ContentTreeItem {
	isTrashed: boolean; // TODO: remove only temp part of refactor
	properties: Array<ContentProperty>;
	//data: Array<ContentPropertyData>;
	//layout?: any; // TODO: define layout type - make it non-optional
}

export interface UserEntity extends Entity {
	type: 'user';
}

export type UserStatus = 'enabled' | 'inactive' | 'invited' | 'disabled';
export interface UserDetails extends UserEntity {
	email: string;
	status: UserStatus;
	language: string;
	lastLoginDate?: string;
	lastLockoutDate?: string;
	lastPasswordChangeDate?: string;
	updateDate: string;
	createDate: string;
	failedLoginAttempts: number;
	userGroups: Array<string>;
	contentStartNodes: Array<string>;
	mediaStartNodes: Array<string>;
}

export interface UserGroupEntity extends Entity {
	type: 'user-group';
}

export interface UserGroupDetails extends UserGroupEntity {
	sections: Array<string>;
	contentStartNode?: string;
	mediaStartNode?: string;
	permissions: Array<string>;
}

// Data Types
export interface DataTypeDetails extends FolderTreeItem {
	key: string; // TODO: Remove this when the backend is fixed
	propertyEditorModelAlias: string | null;
	propertyEditorUIAlias: string | null;
	data: Array<DataTypePropertyData>;
}

export interface DataTypePropertyData {
	alias: string;
	value: any;
}

// Document Types
export interface DocumentTypeDetails extends DocumentTypeTreeItem {
	key: string; // TODO: Remove this when the backend is fixed
	alias: string;
	properties: [];
}

// TODO: Make sure Entity Type/interface.
export interface MemberTypeDetails extends EntityTreeItem {
	key: string; // TODO: Remove this when the backend is fixed
	alias: string;
	properties: [];
}

// Content
export interface ContentProperty {
	alias: string;
	label: string;
	description: string;
	dataTypeKey: string;
}

export interface ContentPropertyData {
	alias: string;
	value: any;
}

// Documents
export interface DocumentDetails extends DocumentTreeItem {
	key: string; // TODO: Remove this when the backend is fixed
	isTrashed: boolean; // TODO: remove only temp part of refactor
	properties: Array<ContentProperty>;
	data: Array<ContentPropertyData>;
	variants: Array<any>; // TODO: define variant data
	//layout?: any; // TODO: define layout type - make it non-optional
}

// Media
export interface MediaDetails extends ContentTreeItem {
	key: string; // TODO: Remove this when the backend is fixed
	isTrashed: boolean; // TODO: remove only temp part of refactor
	properties: Array<ContentProperty>;
	data: Array<ContentPropertyData>;
	variants: Array<any>; // TODO: define variant data
	//layout?: any; // TODO: define layout type - make it non-optional
}

// Media Types

export interface MediaTypeDetails extends FolderTreeItem {
	key: string; // TODO: Remove this when the backend is fixed
	alias: string;
	properties: [];
}

// Member Groups
export interface MemberGroupDetails extends EntityTreeItem {
	key: string; // TODO: Remove this when the backend is fixed
}

// Dictionary
export interface DictionaryDetails extends EntityTreeItem {
	key: string; // TODO: Remove this when the backend is fixed
}

// Document Blueprint
export interface DocumentBlueprintDetails {
	key: string;
	name: string;
	type: 'document-blueprint';
	properties: Array<any>;
	data: Array<any>;
	icon: string;
	documentTypeKey: string;
}

export interface DataSourceResponse<T = undefined> {
	data?: T;
	error?: ProblemDetails;
}

// TODO; figure out why we can't add UmbControllerHostInterface as host type
export interface UmbTreeRepositoryFactory {
	new (host: any): UmbTreeRepository;
}

export interface UmbTreeRepository {
	requestRootItems: () => Promise<{
		data: PagedEntityTreeItem | undefined;
		error: ProblemDetails | undefined;
	}>;
	requestChildrenOf: (parentKey: string | null) => Promise<{
		data: PagedEntityTreeItem | undefined;
		error: ProblemDetails | undefined;
	}>;
	requestItems: (keys: string[]) => Promise<{
		data: Array<EntityTreeItem> | undefined;
		error: ProblemDetails | undefined;
	}>;
	rootItems: () => Promise<Observable<EntityTreeItem[]>>;
	childrenOf: (parentKey: string | null) => Promise<Observable<EntityTreeItem[]>>;
	items: (keys: string[]) => Promise<Observable<EntityTreeItem[]>>;
}
