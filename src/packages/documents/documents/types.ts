import type { UmbDocumentEntityType } from './entity.js';
import type { UmbVariantModel, UmbVariantOptionModel, UmbVariantPublishModel } from '@umbraco-cms/backoffice/variant';
import type { UmbReferenceByUnique } from '@umbraco-cms/backoffice/models';
import { DocumentVariantStateModel as UmbDocumentVariantState } from '@umbraco-cms/backoffice/external/backend-api';
export { UmbDocumentVariantState };

export interface UmbDocumentDetailModel {
	documentType: {
		unique: string;
		collection: UmbReferenceByUnique | null;
	};
	entityType: UmbDocumentEntityType;
	isTrashed: boolean;
	template: { unique: string } | null;
	unique: string;
	urls: Array<UmbDocumentUrlInfoModel>;
	values: Array<UmbDocumentValueModel>;
	variants: Array<UmbDocumentVariantModel>;
}

export interface UmbDocumentVariantModel extends UmbVariantModel {
	state: UmbDocumentVariantState | null;
	publishDate: string | null;
}

export interface UmbDocumentUrlInfoModel {
	culture: string | null;
	url: string;
}

export interface UmbDocumentValueModel<ValueType = unknown> {
	culture: string | null;
	segment: string | null;
	alias: string;
	value: ValueType;
}

export interface UmbDocumentVariantOptionModel extends UmbVariantOptionModel<UmbDocumentVariantModel> {}

export interface UmbDocumentVariantPublishModel extends UmbVariantPublishModel {}
