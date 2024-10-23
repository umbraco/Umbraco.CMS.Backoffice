import type { UMB_TEMPLATE_HAS_NO_CHILDREN_CONDITION_ALIAS } from './const.js';
import type { UmbConditionConfigBase } from '@umbraco-cms/backoffice/extension-api';

export type UmbTemplateHasNoChildrenConditionConfig = UmbConditionConfigBase<
	typeof UMB_TEMPLATE_HAS_NO_CHILDREN_CONDITION_ALIAS
>;

declare global {
	interface UmbExtensionConditionConfigMap {
		umbTemplateHasNoChildren: UmbTemplateHasNoChildrenConditionConfig;
	}
}
