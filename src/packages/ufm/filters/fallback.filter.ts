import type { UmbUfmFilterApi } from '@umbraco-cms/backoffice/extension-registry';

class UmbUfmFallbackFilterApi implements UmbUfmFilterApi {
	filter(str: string, fallback: string) {
		return typeof str !== 'string' || str ? str : fallback;
	}

	destroy() {}
}

export { UmbUfmFallbackFilterApi as api };
