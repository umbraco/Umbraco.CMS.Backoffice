import { UMB_USER_GROUP_ENTITY_TYPE } from '../index.js';
import type { UmbUserGroupWorkspaceContext } from './user-group-workspace.context.js';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import type { UmbSaveableWorkspaceContextInterface } from '@umbraco-cms/backoffice/workspace';

export const UMB_USER_GROUP_WORKSPACE_CONTEXT = new UmbContextToken<
	UmbSaveableWorkspaceContextInterface,
	UmbUserGroupWorkspaceContext
>(
	'UmbWorkspaceContext',
	undefined,
	(context): context is UmbUserGroupWorkspaceContext => context.getEntityType?.() === UMB_USER_GROUP_ENTITY_TYPE,
);
