import { UmbHealthCheckContext } from './health-check.context';
import type { ManifestHealthCheck } from '@umbraco-cms/models';
import { UmbContextToken } from '@umbraco-cms/context-api';

export class UmbHealthCheckDashboardContext {
	#manifests: ManifestHealthCheck[] = [];
	set manifests(value: ManifestHealthCheck[]) {
		this.#manifests = value;
		this.#registerApis();
	}
	get manifests() {
		return this.#manifests;
	}

	public apis = new Map<string, UmbHealthCheckContext>();
	public host: HTMLElement;

	constructor(host: HTMLElement) {
		this.host = host;
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
			this.apis.set(manifest.meta.label, new manifest.meta.api(this.host));
		});
	}
}

export const UMB_HEALTHCHECK_DASHBOARD_CONTEXT_TOKEN = new UmbContextToken<UmbHealthCheckDashboardContext>(
	'UmbHealthCheckDashboardContext'
);
