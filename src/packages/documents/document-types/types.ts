import type { UmbDocumentTypeEntityType } from './entity.js';
import type { UmbContentTypeModel } from '@umbraco-cms/backoffice/content-type';

export interface UmbDocumentTypeDetailModel extends UmbContentTypeModel {
	entityType: UmbDocumentTypeEntityType;
	allowedTemplates: Array<{ id: string }>;
	defaultTemplate: { id: string } | null;
	cleanup: UmbDocumentTypeCleanupModel;
}

export type UmbDocumentTypeCleanupModel = {
	preventCleanup: boolean;
	keepAllVersionsNewerThanDays?: number | null;
	keepLatestVersionPerDayForDays?: number | null;
};

export interface UmbDocumentTypeCompositionRequestModel {
	unique: string | null;
	isElement: boolean;
	currentPropertyAliases: Array<string>;
	currentCompositeUniques: Array<string>;
}

export interface UmbDocumentTypeCompositionCompatibleModel {
	unique: string;
	name: string;
	icon: string;
	folderPath: Array<string>;
	isCompatible: boolean;
}

export interface UmbDocumentTypeCompositionReferenceModel {
	unique: string;
	name: string;
	icon: string;
}
