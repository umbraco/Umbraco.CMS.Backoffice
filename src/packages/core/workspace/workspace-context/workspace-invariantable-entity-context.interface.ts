import type { UmbEntityWorkspaceContextInterface } from './workspace-entity-context.interface.js';
import type { Observable } from '@umbraco-cms/backoffice/external/rxjs';
import type { ValueModelBaseModel } from '@umbraco-cms/backoffice/backend-api';

export interface UmbWorkspaceInvariantableEntityContextInterface<T = unknown>
	extends UmbEntityWorkspaceContextInterface<T> {
	getName(): void;
	setName(name: string): void;

	propertyDataByAlias(alias: string): Observable<ValueModelBaseModel | undefined>;
	propertyValueByAlias(alias: string): Observable<any | undefined>;
	getPropertyValue(alias: string): void;
	setPropertyValue(alias: string, value: unknown): void;
}
