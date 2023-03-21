import type { Observable } from 'rxjs';
import { UmbVariantId } from '../../../variants/variant-id.class';
import type { UmbEntityWorkspaceContextInterface } from './workspace-entity-context.interface';
import { UmbWorkspaceSplitViewManager } from './workspace-split-view-manager.class';
import type { ValueModelBaseModel, VariantResponseModelBaseModel } from '@umbraco-cms/backend-api';

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
