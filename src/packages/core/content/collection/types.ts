import type { UmbContentTypeModel } from '@umbraco-cms/backoffice/content-type';
import type { UmbReadOnlyVariantStateManager } from '@umbraco-cms/backoffice/utils';
import type { UmbCollectionWorkspaceContext } from '@umbraco-cms/backoffice/workspace';

export interface UmbContentCollectionWorkspaceContext<ContentType extends UmbContentTypeModel>
	extends UmbCollectionWorkspaceContext<ContentType> {
	readOnlyState: UmbReadOnlyVariantStateManager;
}
