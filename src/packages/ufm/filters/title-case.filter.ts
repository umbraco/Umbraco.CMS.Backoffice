import type { UmbUfmFilterApi } from '@umbraco-cms/backoffice/extension-registry';

class UmbUfmTitleCaseFilterApi implements UmbUfmFilterApi {
	filter(str: string) {
		return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
	}

	destroy() {}
}

export { UmbUfmTitleCaseFilterApi as api };
