import type { UmbUfmFilterApi } from '@umbraco-cms/backoffice/extension-registry';

class UmbUfmWordLimitFilterApi implements UmbUfmFilterApi {
	filter(str: string, limit: number) {
		const words = str.split(/\s+/);
		return words.length > limit ? words.slice(0, limit).join(' ') : str;
	}

	destroy() {}
}

export { UmbUfmWordLimitFilterApi as api };
