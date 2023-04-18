import type { ApiError, CancelError } from '@umbraco-cms/backoffice/backend-api';

export interface DataSourceResponse<T = undefined> {
	data?: T;
	error?: ApiError | CancelError;
}
