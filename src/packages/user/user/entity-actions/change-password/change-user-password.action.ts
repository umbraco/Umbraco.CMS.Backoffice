import { UmbChangeUserPasswordRepository } from '../../repository/index.js';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import type { UmbEntityActionArgs } from '@umbraco-cms/backoffice/entity-action';
import { UmbEntityActionBase } from '@umbraco-cms/backoffice/entity-action';
import { UMB_MODAL_MANAGER_CONTEXT, UMB_CHANGE_PASSWORD_MODAL } from '@umbraco-cms/backoffice/modal';
import UmbCurrentUserRepository from 'src/packages/user/current-user/repository/current-user.repository.js';

export class UmbChangeUserPasswordEntityAction extends UmbEntityActionBase<never> {
	constructor(host: UmbControllerHost, args: UmbEntityActionArgs<never>) {
		super(host, args);
	}

	override async execute() {
		if (!this.args.unique) throw new Error('Unique is not available');

		const modalManager = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
		const modalContext = modalManager.open(this, UMB_CHANGE_PASSWORD_MODAL, {
			data: {
				user: {
					unique: this.args.unique,
				},
			},
		});

		const data = await modalContext.onSubmit();

		if(data.isCurrentUser){
			const repository = new UmbCurrentUserRepository(this);
			await repository.changePassword(data.newPassword, data.oldPassword);
		}
		else{
			const repository = new UmbChangeUserPasswordRepository(this);
			await repository.changePassword(this.args.unique, data.newPassword);
		}
		
	}
}

export { UmbChangeUserPasswordEntityAction as api };
