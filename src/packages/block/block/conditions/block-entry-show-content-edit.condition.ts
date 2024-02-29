import { UMB_BLOCK_ENTRY_CONTEXT } from '../context/block-entry.context-token.js';
import { UmbBaseController } from '@umbraco-cms/backoffice/class-api';
import type {
	UmbConditionConfigBase,
	UmbConditionControllerArguments,
	UmbExtensionCondition,
} from '@umbraco-cms/backoffice/extension-api';

export class UmbBlockEntryShowContentEditCondition extends UmbBaseController implements UmbExtensionCondition {
	config: BlockEntryShowContentEditConditionConfig;
	permitted = false;
	#onChange: () => void;

	constructor(args: UmbConditionControllerArguments<BlockEntryShowContentEditConditionConfig>) {
		super(args.host);
		this.config = args.config;
		this.#onChange = args.onChange;

		this.consumeContext(UMB_BLOCK_ENTRY_CONTEXT, (context) => {
			this.observe(
				context.showContentEdit,
				(showContentEdit) => {
					this.permitted = !!showContentEdit;
					this.#onChange();
				},
				'observeEntryShowContentEdit',
			);
		});
	}
}

export default UmbBlockEntryShowContentEditCondition;

export type BlockEntryShowContentEditConditionConfig =
	UmbConditionConfigBase<'Umb.Condition.BlockEntryShowContentEdit'>;
