import type { UmbUfmFilterApi } from '@umbraco-cms/backoffice/extension-registry';

class UmbUfmTruncateFilterApi implements UmbUfmFilterApi {
	filter(str: string, length: number, tail?: string) {
		if (tail === 'false') tail = '';
		if (tail === 'true') tail = '…';
		tail = !tail && tail !== '' ? '…' : tail;

		return str.slice(0, length).trim() + tail;
	}

	destroy() {}
}

export { UmbUfmTruncateFilterApi as api };
