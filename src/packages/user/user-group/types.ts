import type { UmbUserGroupEntityType } from './entity.js';

export interface UmbUserGroupDetailModel {
	unique: string;
	entityType: UmbUserGroupEntityType;
	isSystemGroup: boolean;
	name: string;
	icon: string | null;
	sections: Array<string>;
	languages: Array<string>;
	hasAccessToAllLanguages: boolean;
	documentStartNode: { unique: string } | null;
	documentRootAccess: boolean;
	mediaStartNode: { unique: string } | null;
	mediaRootAccess: boolean;
	fallbackPermissions: Array<string>;
	// TODO: add type
	permissions: Array<any>;
}
