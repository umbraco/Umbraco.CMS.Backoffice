import { Observable } from 'rxjs';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';

export interface UmbWorkspaceContextInterface<T = unknown> {
	host: UmbControllerHostElement;
	repository: any; // TODO: add type
	isNew: Observable<boolean>;
	getIsNew(): boolean;
	setIsNew(value: boolean): void;
	getEntityType(): string;
	getData(): T;
	destroy(): void;
	// TODO: temp solution to bubble validation errors to the UI
	setValidationErrors?(errorMap: any): void;
}
