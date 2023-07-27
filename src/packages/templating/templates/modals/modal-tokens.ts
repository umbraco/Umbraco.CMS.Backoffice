import { UMB_MODAL_TEMPLATING_QUERY_BUILDER_SIDEBAR_ALIAS } from './manifests.js';
import {
	TemplateQueryBuilderModalData,
	TemplateQueryBuilderModalResult,
} from './query-builder/query-builder.element.js';
import { UmbModalToken } from '@umbraco-cms/backoffice/modal';

export const UMB_TEMPLATE_QUERY_BUILDER_MODAL = new UmbModalToken<
	TemplateQueryBuilderModalData,
	TemplateQueryBuilderModalResult
>(UMB_MODAL_TEMPLATING_QUERY_BUILDER_SIDEBAR_ALIAS, {
	type: 'sidebar',
	size: 'large',
});
