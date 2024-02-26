import { UMB_CURRENT_USER_CONTEXT } from '../../current-user/current-user.context.js';
import { UmbBaseController } from '@umbraco-cms/backoffice/class-api';
import type {
	ManifestCondition,
	UmbConditionConfigBase,
	UmbConditionControllerArguments,
	UmbExtensionCondition,
} from '@umbraco-cms/backoffice/extension-api';

export class UmbUserPermissionCondition extends UmbBaseController implements UmbExtensionCondition {
	config: UserPermissionConditionConfig;
	permitted = false;
	#onChange: () => void;

	constructor(args: UmbConditionControllerArguments<UserPermissionConditionConfig>) {
		super(args.host);
		this.config = args.config;
		this.#onChange = args.onChange;

		this.consumeContext(UMB_CURRENT_USER_CONTEXT, (context) => {
			this.observe(
				context.currentUser,
				(currentUser) => {
					const fallbackPermissions = currentUser?.fallbackPermissions || [];
					this.permitted = this.config.verbs.every((verb) => fallbackPermissions.includes(verb));
					this.#onChange();
				},
				'umbUserPermissionConditionObserver',
			);
		});
	}
}

export type UserPermissionConditionConfig = UmbConditionConfigBase<'Umb.Condition.UserPermission'> & {
	/**
	 *
	 *
	 * @example
	 * ["Umb.Document.Update", "Umb.Document.Publish"]
	 */
	verbs: Array<string>;
};

export const manifest: ManifestCondition = {
	type: 'condition',
	name: 'User Permission Condition',
	alias: 'Umb.Condition.UserPermission',
	api: UmbUserPermissionCondition,
};
