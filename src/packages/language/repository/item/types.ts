import type { UmbLanguageEntityType } from '../../entity.js';

export interface UmbLanguageItemModel {
	unique: string;
	entityType: UmbLanguageEntityType;
	name: string;
}
