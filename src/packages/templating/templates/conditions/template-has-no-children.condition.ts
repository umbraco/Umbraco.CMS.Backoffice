import { UMB_TEMPLATE_HAS_NO_CHILDREN_CONDITION_ALIAS } from './const.js';
import type { UmbTemplateHasNoChildrenConditionConfig } from './types.js';
import { UmbConditionBase } from '@umbraco-cms/backoffice/extension-registry';
import { UMB_TREE_ITEM_CONTEXT } from '@umbraco-cms/backoffice/tree';
import type { UmbConditionControllerArguments, UmbExtensionCondition } from '@umbraco-cms/backoffice/extension-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';

const ObserveSymbol = Symbol();

export class UmbTemplateHasNoChildrenCondition
	extends UmbConditionBase<UmbTemplateHasNoChildrenConditionConfig>
	implements UmbExtensionCondition
{
	constructor(host: UmbControllerHost, args: UmbConditionControllerArguments<UmbTemplateHasNoChildrenConditionConfig>) {
		super(host, args);

		this.consumeContext(UMB_TREE_ITEM_CONTEXT, (context) => {
			this.observe(
				context.hasChildren,
				(hasChildren) => {
					this.permitted = hasChildren === false;
				},
				ObserveSymbol,
			);
		});
	}
}

export const manifest: UmbExtensionManifest = {
	type: 'condition',
	name: 'Template Has No Children Condition',
	alias: UMB_TEMPLATE_HAS_NO_CHILDREN_CONDITION_ALIAS,
	api: UmbTemplateHasNoChildrenCondition,
};
