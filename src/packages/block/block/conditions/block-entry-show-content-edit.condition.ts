import { UMB_BLOCK_ENTRY_CONTEXT } from '../context/block-entry.context-token.js';
import { UmbConditionBase } from '@umbraco-cms/backoffice/extension-registry';
import type {
	UmbConditionConfigBase,
	UmbConditionControllerArguments,
	UmbExtensionCondition,
} from '@umbraco-cms/backoffice/extension-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';

export class UmbBlockEntryShowContentEditCondition
	extends UmbConditionBase<BlockEntryShowContentEditConditionConfig>
	implements UmbExtensionCondition
{
	constructor(
		host: UmbControllerHost,
		args: UmbConditionControllerArguments<BlockEntryShowContentEditConditionConfig>,
	) {
		super(host, args);

		this.consumeContext(UMB_BLOCK_ENTRY_CONTEXT, (context) => {
			this.observe(
				context.showContentEdit,
				(showContentEdit) => {
					this.permitted = !!showContentEdit;
				},
				'observeEntryShowContentEdit',
			);
		});
	}
}

export default UmbBlockEntryShowContentEditCondition;

export type BlockEntryShowContentEditConditionConfig =
	UmbConditionConfigBase<'Umb.Condition.BlockEntryShowContentEdit'>;
