import type { UmbDocumentTypeEntityType } from '../../entity.js';

export type UmbDocumentTypeItemModel = {
	unique: string;
	entityType: UmbDocumentTypeEntityType;
	name: string;
	isElement: boolean;
	icon?: string | null;
};
