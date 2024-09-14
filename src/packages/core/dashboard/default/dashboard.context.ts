import { UMB_DASHBOARD_CONTEXT } from './dashboard.context.token.js';
import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import type { UmbApi } from '@umbraco-cms/backoffice/extension-api';

export class UmbDashboardContext extends UmbContextBase<UmbDashboardContext> implements UmbApi {
	constructor(host: UmbControllerHost) {
		super(host, UMB_DASHBOARD_CONTEXT);
		debugger;
	}
}

export { UmbDashboardContext as api };
