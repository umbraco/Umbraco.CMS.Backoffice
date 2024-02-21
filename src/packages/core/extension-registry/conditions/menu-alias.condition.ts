import { UMB_MENU_CONTEXT } from '../../menu/menu.context.js';
import { UmbBaseController } from '@umbraco-cms/backoffice/class-api';
import type {
	ManifestCondition,
	UmbConditionConfigBase,
	UmbConditionControllerArguments,
	UmbExtensionCondition,
} from '@umbraco-cms/backoffice/extension-api';

export type MenuAliasConditionConfig = UmbConditionConfigBase & {
	match: string;
};

export class UmbMenuAliasCondition extends UmbBaseController implements UmbExtensionCondition {
	config: MenuAliasConditionConfig;
	permitted = false;
	#onChange: () => void;

	constructor(args: UmbConditionControllerArguments<MenuAliasConditionConfig>) {
		super(args.host);
		this.config = args.config;
		this.#onChange = args.onChange;
		this.consumeContext(UMB_MENU_CONTEXT, (context) => {
			this.observe(context.alias, (MenuAlias) => {
				this.permitted = MenuAlias === this.config.match;
				this.#onChange();
			});
		});
	}
}

export const manifest: ManifestCondition = {
	type: 'condition',
	name: 'Menu Alias Condition',
	alias: 'Umb.Condition.MenuAlias',
	api: UmbMenuAliasCondition,
};
