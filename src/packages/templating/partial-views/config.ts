import { PartialViewResponseModel } from '@umbraco-cms/backoffice/backend-api';

export type PartialViewDetails = PartialViewResponseModel;

export const PARTIAL_VIEW_ENTITY_TYPE = 'partial-view';
export const PARTIAL_VIEW_ROOT_ENTITY_TYPE = 'partial-view-root';
export const PARTIAL_VIEW_FOLDER_ENTITY_TYPE = 'partial-view-folder';
export const PARTIAL_VIEW_FOLDER_EMPTY_ENTITY_TYPE = 'partial-view-folder-empty';

export const PARTIAL_VIEW_REPOSITORY_ALIAS = 'Umb.Repository.PartialViews';

export const PARTIAL_VIEW_TREE_ALIAS = 'Umb.Tree.PartialViews';

export const UMB_PARTIAL_VIEW_TREE_STORE_CONTEXT_TOKEN_ALIAS = 'Umb.Store.PartialViews.Tree';
export const UMB_PARTIAL_VIEW_STORE_CONTEXT_TOKEN_ALIAS = 'Umb.Store.PartialViews';
