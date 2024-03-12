import type { UmbUserEntityType } from '../../entity.js';

export interface UmbUserItemModel {
	unique: string;
	entityType: UmbUserEntityType;
	name: string;
}
