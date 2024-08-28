import type { UmbUfmFilterApi } from '@umbraco-cms/backoffice/extension-registry';

class UmbUfmLowercaseFilterApi implements UmbUfmFilterApi {
	filter(str: string) {
		return str.toLocaleLowerCase();
	}

	destroy() {}
}

export { UmbUfmLowercaseFilterApi as api };
