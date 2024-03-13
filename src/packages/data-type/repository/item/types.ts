import type { UmbDataTypeEntityType } from '../../entity.js';

export interface UmbDataTypeItemModel {
	unique: string;
	entityType: UmbDataTypeEntityType;
	name: string;
	propertyEditorUiAlias: string;
}
