import type { UmbUserGroupRepository } from '../../repository/user-group.repository.js';
import { html } from '@umbraco-cms/backoffice/external/lit';
import { UmbEntityBulkActionBase } from '@umbraco-cms/backoffice/entity-bulk-action';
import type { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';
import { UmbContextConsumerController } from '@umbraco-cms/backoffice/context-api';
import { UmbModalManagerContext, UMB_MODAL_MANAGER_CONTEXT, UMB_CONFIRM_MODAL } from '@umbraco-cms/backoffice/modal';

export class UmbDeleteUserGroupEntityBulkAction extends UmbEntityBulkActionBase<UmbUserGroupRepository> {
	#modalContext?: UmbModalManagerContext;

	constructor(host: UmbControllerHostElement, repositoryAlias: string, selection: Array<string>) {
		super(host, repositoryAlias, selection);

		new UmbContextConsumerController(host, UMB_MODAL_MANAGER_CONTEXT, (instance) => {
			this.#modalContext = instance;
		});
	}

	async execute() {
		if (!this.#modalContext || this.selection.length === 0) return;

		const modalContext = this.#modalContext.open(UMB_CONFIRM_MODAL, {
			data: {
				color: 'danger',
				headline: `Delete user groups?`,
				content: html`Are you sure you want to delete selected user groups?`,
				confirmLabel: 'Delete',
			},
		});

		await modalContext.onSubmit();

		//TODO: How should we handle bulk actions? right now we send a request per item we want to change.
		//TODO: For now we have to reload the page to see the update
		for (let index = 0; index < this.selection.length; index++) {
			const element = this.selection[index];
			await this.repository?.delete(element);
		}
	}
}
