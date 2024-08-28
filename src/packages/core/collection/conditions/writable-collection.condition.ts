import { UMB_COLLECTION_CONTEXT } from '../default/collection-default.context-token.js';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import type {
	UmbConditionConfigBase,
	UmbConditionControllerArguments,
	UmbExtensionCondition,
} from '@umbraco-cms/backoffice/extension-api';
import { UmbConditionBase } from '@umbraco-cms/backoffice/extension-registry';

export class UmbWritableCollectionCondition
	extends UmbConditionBase<UmbConditionConfigBase>
	implements UmbExtensionCondition
{
	constructor(host: UmbControllerHost, args: UmbConditionControllerArguments<UmbConditionConfigBase>) {
		super(host, args);

		this.consumeContext(UMB_COLLECTION_CONTEXT, (context) => {
			this.observe(context.readOnlyState.isOn, (value) => {
				this.permitted = value !== true;
			});
		});
	}
}

export { UmbWritableCollectionCondition as api };
