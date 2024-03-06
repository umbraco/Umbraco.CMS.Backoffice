import { UmbUserStateEnum } from '../types.js';
import { UmbUserActionConditionBase } from './user-allow-action-base.condition.js';
import type { ManifestCondition } from '@umbraco-cms/backoffice/extension-api';

export class UmbUserAllowDisableActionCondition extends UmbUserActionConditionBase {
	async _onUserDataChange() {
		// don't allow the current user to disable themselves
		if (!this.userUnique || (await this.isCurrentUser())) {
			this.permitted = false;
			return;
		}

		this.permitted = this.userState !== UmbUserStateEnum.DISABLED;
	}
}

export const manifest: ManifestCondition = {
	type: 'condition',
	name: 'User Allow Disable Action Condition',
	alias: 'Umb.Condition.User.AllowDisableAction',
	api: UmbUserAllowDisableActionCondition,
};
