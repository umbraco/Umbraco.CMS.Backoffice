import type { UmbChangeUserPasswordRepository } from '../../repository/change-password/change-user-password.repository.js';
import { UmbEntityActionBase } from '@umbraco-cms/backoffice/entity-action';
import type { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';
import {
	type UmbModalManagerContext,
	UMB_MODAL_MANAGER_CONTEXT,
	UMB_CHANGE_PASSWORD_MODAL,
} from '@umbraco-cms/backoffice/modal';

export class UmbChangeUserPasswordEntityAction extends UmbEntityActionBase<UmbChangeUserPasswordRepository> {
	#modalManager?: UmbModalManagerContext;

	constructor(host: UmbControllerHostElement, repositoryAlias: string, unique: string, entityType: string) {
		super(host, repositoryAlias, unique, entityType);

		this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (instance) => {
			this.#modalManager = instance;
		});
	}

	async execute() {
		if (!this.repository || !this.#modalManager) return;

		const modalContext = this.#modalManager.open(UMB_CHANGE_PASSWORD_MODAL, {
			data: {
				userId: this.unique,
			},
		});

		const data = await modalContext.onSubmit();
		await this.repository?.changePassword(this.unique, data.newPassword);
	}
}
