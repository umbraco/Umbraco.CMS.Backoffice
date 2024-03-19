import type { UmbMemberEntityType } from '../entity.js';

export interface UmbMemberCollectionFilterModel {
	skip?: number;
	take?: number;
	memberTypeId?: string;
	filter?: string;
}

export interface UmbMemberCollectionModel {
	unique: string;
	entityType: UmbMemberEntityType;
	variants: Array<any>;
}
