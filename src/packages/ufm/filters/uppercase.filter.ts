import type { UmbUfmFilterApi } from '@umbraco-cms/backoffice/extension-registry';

class UmbUfmUppercaseFilterApi implements UmbUfmFilterApi {
	filter(str: string) {
		return str.toLocaleUpperCase();
	}

	destroy() {}
}

export { UmbUfmUppercaseFilterApi as api };
