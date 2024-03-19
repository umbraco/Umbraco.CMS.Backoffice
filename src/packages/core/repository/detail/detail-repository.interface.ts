import type {
	UmbRepositoryErrorResponse,
	UmbRepositoryResponse,
	UmbRepositoryResponseWithAsObservable,
} from '../types.js';
import type { UmbApi } from '@umbraco-cms/backoffice/extension-api';
import type { Observable } from '@umbraco-cms/backoffice/external/rxjs';

export interface UmbDetailRepository<DetailModelType> extends UmbApi {
	createScaffold(preset?: Partial<DetailModelType>): Promise<UmbRepositoryResponse<DetailModelType>>;
	requestByUnique(unique: string): Promise<UmbRepositoryResponseWithAsObservable<DetailModelType>>;
	byUnique(unique: string): Promise<Observable<DetailModelType | undefined>>;
	create(data: DetailModelType, parentUnique: string | null): Promise<UmbRepositoryResponse<DetailModelType>>;
	save(data: DetailModelType): Promise<UmbRepositoryResponse<DetailModelType>>;
	delete(unique: string): Promise<UmbRepositoryErrorResponse>;
}
