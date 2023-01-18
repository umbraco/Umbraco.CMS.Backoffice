import { v4 as uuid } from 'uuid';
import { UmbStoreItem } from '@umbraco-cms/stores/store';

export interface UmbTreeItem extends UmbStoreItem {
	name?: string | null;
	type?: string | null;
	icon?: string | null;
	hasChildren?: boolean;
	isContainer?: boolean;
	noAccess?: boolean;
	isProtected?: boolean;
	isPublished?: boolean;
	isEdited?: boolean;
	isElement?: boolean;
	isFolder?: boolean;
	isTrashed?: boolean;
}

export const createTreeItem = (
	unique: string | null | undefined,
	parentUnique: string | null | undefined,
	data: Partial<UmbTreeItem>
): UmbTreeItem => {
	return {
		unique: unique || uuid(),
		parentUnique: parentUnique || null,
		name: data.name,
		type: data.type,
		icon: data.icon,
		hasChildren: data.hasChildren,
		isContainer: data.isContainer,
		noAccess: data.noAccess,
		isProtected: data.isProtected,
		isPublished: data.isPublished,
		isEdited: data.isEdited,
		isElement: data.isElement,
		isFolder: data.isFolder,
		isTrashed: data.isTrashed,
	};
};

export const isTreeItem = (data: unknown): data is UmbTreeItem => {
	return (
		(data as UmbTreeItem).unique !== undefined &&
		(data as UmbTreeItem).parentUnique !== undefined &&
		(data as UmbTreeItem).hasChildren !== undefined
	);
};
