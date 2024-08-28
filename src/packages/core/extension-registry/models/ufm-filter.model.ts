import type { ManifestApi, UmbApi } from '@umbraco-cms/backoffice/extension-api';

export interface UmbUfmFilterApi extends UmbApi {
	filter(...args: Array<unknown>): string;
}

export interface MetaUfmFilter {
	alias: string;
}

export interface ManifestUfmFilter extends ManifestApi<UmbUfmFilterApi> {
	type: 'ufmFilter';
	meta: MetaUfmFilter;
}
