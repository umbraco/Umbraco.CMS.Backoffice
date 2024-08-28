import type { UmbUfmFilterApi } from '@umbraco-cms/backoffice/extension-registry';

class UmbUfmStripHtmlFilterApi implements UmbUfmFilterApi {
	filter(value: string | { markup: string } | undefined | null) {
		if (!value) return '';

		const markup = typeof value === 'object' && Object.hasOwn(value, 'markup') ? value.markup : (value as string);
		const parser = new DOMParser();
		const doc = parser.parseFromString(markup, 'text/html');

		return doc.body.textContent ?? '';
	}

	destroy() {}
}

export { UmbUfmStripHtmlFilterApi as api };
