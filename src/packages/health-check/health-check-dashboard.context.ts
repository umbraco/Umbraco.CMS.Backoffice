import { UmbHealthCheckContext } from './health-check.context.js';
import type { ManifestHealthCheck } from '@umbraco-cms/backoffice/extension-registry';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { UmbControllerHost, UmbBaseContextController } from '@umbraco-cms/backoffice/controller-api';

export class UmbHealthCheckDashboardContext extends UmbBaseContextController {
	#manifests: ManifestHealthCheck[] = [];
	set manifests(value: ManifestHealthCheck[]) {
		this.#manifests = value;
		this.#registerApis();
	}
	get manifests() {
		return this.#manifests;
	}

	public apis = new Map<string, UmbHealthCheckContext>();

	constructor(host: UmbControllerHost) {
		super(host, UMB_HEALTHCHECK_DASHBOARD_CONTEXT_TOKEN)
	}

	checkAll() {
		for (const [label, api] of this.apis.entries()) {
			api?.checkGroup?.(label);
		}
	}

	#registerApis() {
		this.apis.clear();
		this.#manifests.forEach((manifest) => {
			// the group name (label) is the unique key for a health check group
			this.apis.set(manifest.meta.label, new manifest.meta.api(this.getHostElement()));
		});
	}
}

export const UMB_HEALTHCHECK_DASHBOARD_CONTEXT_TOKEN = new UmbContextToken<UmbHealthCheckDashboardContext>(
	'UmbHealthCheckDashboardContext'
);
