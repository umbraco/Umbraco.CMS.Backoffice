import type { UmbVariantId } from '../../../variant/variant-id.class.js';
import type { UmbPropertyDatasetContext } from '../../../property/property-dataset/property-dataset-context.interface.js';
import type { UmbSubmittableWorkspaceContext } from './submittable-workspace-context.interface.js';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import type { Observable } from '@umbraco-cms/backoffice/external/rxjs';

export interface UmbInvariantDatasetWorkspaceContext extends UmbSubmittableWorkspaceContext {
	// Name:
	name: Observable<string | undefined>;
	getName(): string | undefined;
	setName(name: string): void;

	// Property:
	propertyValueByAlias<ReturnType = unknown>(alias: string): Promise<Observable<ReturnType | undefined>>;
	getPropertyValue<ReturnType = unknown>(alias: string): ReturnType;
	setPropertyValue(alias: string, value: unknown): Promise<void>;

	createPropertyDatasetContext(host: UmbControllerHost, variantId?: UmbVariantId): UmbPropertyDatasetContext;
}

/**
 * @deprecated Use UmbInvariantWorkspaceContextInterface instead — Will be removed before RC.
 * TODO: Delete before RC.
 */
export interface UmbInvariantableWorkspaceContextInterface extends UmbInvariantDatasetWorkspaceContext {}
