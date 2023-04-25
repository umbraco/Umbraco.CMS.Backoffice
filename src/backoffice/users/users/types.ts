import type { DirectionModel, UserOrderModel, UserStateModel } from '@umbraco-cms/backoffice/backend-api';

export interface UmbUserCollectionFilter {
	skip?: number;
	take?: number;
	orderBy?: UserOrderModel;
	orderDirection?: DirectionModel;
	userGroupIds?: string[];
	userStates?: UserStateModel[];
	filter?: string;
}
