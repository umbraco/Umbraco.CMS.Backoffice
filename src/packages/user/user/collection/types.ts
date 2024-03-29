import type { DirectionModel, UserOrderModel, UserStateModel } from '@umbraco-cms/backoffice/external/backend-api';

export interface UmbUserCollectionFilterModel {
	skip?: number;
	take?: number;
	orderBy?: UserOrderModel;
	orderDirection?: DirectionModel;
	userGroupIds?: string[];
	userStates?: UserStateModel[];
	filter?: string;
}
