import type { UmbWorkspaceSplitViewManager } from '../workspace-split-view-manager.class.js';
import type { UmbEntityWorkspaceContextInterface } from './workspace-entity-context.interface.js';
import type { Observable } from '@umbraco-cms/backoffice/external/rxjs';
import { UmbVariantId } from '@umbraco-cms/backoffice/variant';
import type { ValueModelBaseModel, VariantResponseModelBaseModel } from '@umbraco-cms/backoffice/backend-api';

export interface UmbWorkspaceVariableEntityContextInterface<T = unknown> extends UmbEntityWorkspaceContextInterface<T> {
	variants: Observable<Array<VariantResponseModelBaseModel>>;

	splitView: UmbWorkspaceSplitViewManager;

	getName(variantId?: UmbVariantId): void;
	setName(name: string, variantId?: UmbVariantId): void;

	getVariant(variantId: UmbVariantId): VariantResponseModelBaseModel | undefined;

	propertyDataByAlias(alias: string, variantId?: UmbVariantId): Observable<ValueModelBaseModel | undefined>;
	propertyValueByAlias(alias: string, variantId?: UmbVariantId): Observable<any | undefined>;
	getPropertyValue(alias: string, variantId?: UmbVariantId): void;
	setPropertyValue(alias: string, value: unknown, variantId?: UmbVariantId): void;
}
