import type { UmbMediaRepository } from '../../repository/media.repository.js';
import { html } from '@umbraco-cms/backoffice/external/lit';
import { UmbEntityBulkActionBase } from '@umbraco-cms/backoffice/entity-bulk-action';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';
import { UmbContextConsumerController } from '@umbraco-cms/backoffice/context-api';
import { UmbModalManagerContext, UMB_MODAL_MANAGER_CONTEXT, UMB_CONFIRM_MODAL } from '@umbraco-cms/backoffice/modal';

export class UmbMediaTrashEntityBulkAction extends UmbEntityBulkActionBase<UmbMediaRepository> {
	#modalContext?: UmbModalManagerContext;

	constructor(host: UmbControllerHostElement, repositoryAlias: string, selection: Array<string>) {
		super(host, repositoryAlias, selection);

		new UmbContextConsumerController(host, UMB_MODAL_MANAGER_CONTEXT, (instance) => {
			this.#modalContext = instance;
		});
	}

	async execute() {
		alert('not implemented');
		// TODO: show error
		if (!this.#modalContext || !this.repository) return;

		// TODO: should we subscribe in cases like this?
		/*
		const { data } = await this.repository.requestItemsLegacy(this.selection);

		if (data) {
			// TODO: use correct markup
			const modalContext = this.#modalContext?.open(UMB_CONFIRM_MODAL, {
				headline: `Deleting ${this.selection.length} items`,
				content: html`
					This will delete the following files:
					<ul style="list-style-type: none; padding: 0; margin: 0; margin-top: var(--uui-size-space-2);">
						${data.map((item) => html`<li>${item.name}</li>`)}
					</ul>
				`,
				color: 'danger',
				confirmLabel: 'Delete',
			});

			await modalContext.onSubmit();
			await this.repository?.trash(this.selection);
		}
		*/
	}
}
