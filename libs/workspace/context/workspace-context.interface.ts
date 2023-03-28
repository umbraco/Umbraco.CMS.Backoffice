import { Observable } from 'rxjs';
import { UmbControllerHostInterface } from '@umbraco-cms/backoffice/controller';

export interface UmbWorkspaceContextInterface<T = unknown> {
	host: UmbControllerHostInterface;
	repository: any; // TODO: add type
	isNew: Observable<boolean>;
	getIsNew(): boolean;
	setIsNew(value: boolean): void;
	// TODO: should we consider another name than entity type. File system files are not entities but still have this type.
	getEntityType(): string;
	getData(): T;
	destroy(): void;
	// TODO: temp solution to bubble validation errors to the UI
	setValidationErrors?(errorMap: any): void;
}
