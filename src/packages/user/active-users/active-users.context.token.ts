import type { UmbActiveUsersContext } from './active-users.context.js';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';

export const UMB_ACTIVE_USERS_CONTEXT = new UmbContextToken<UmbActiveUsersContext>('UmbActiveUsersContext');
