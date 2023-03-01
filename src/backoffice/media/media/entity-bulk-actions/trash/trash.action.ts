import { html } from 'lit';
import type { UmbMediaRepository } from '../../repository/media.repository';
import { UmbEntityBulkActionBase } from '@umbraco-cms/entity-action';
import { UmbControllerHostInterface } from '@umbraco-cms/controller';
import { UmbContextConsumerController } from '@umbraco-cms/context-api';
import { UmbModalContext, UMB_MODAL_CONTEXT_TOKEN } from '@umbraco-cms/modal';

export class UmbMediaTrashEntityBulkAction extends UmbEntityBulkActionBase<UmbMediaRepository> {
	#modalService?: UmbModalContext;

	constructor(host: UmbControllerHostInterface, repositoryAlias: string, selection: Array<string>) {
		super(host, repositoryAlias, selection);

		new UmbContextConsumerController(host, UMB_MODAL_CONTEXT_TOKEN, (instance) => {
			this.#modalService = instance;
		});
	}

	async execute() {
		// TODO: show error
		if (!this.#modalService || !this.repository) return;

		// TODO: should we subscribe in cases like this?
		const { data } = await this.repository.requestTreeItems(this.selection);

		if (data) {
			// TODO: use correct markup
			const modalHandler = this.#modalService?.confirm({
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

			const { confirmed } = await modalHandler.onClose();
			if (confirmed) {
				await this.repository?.trash(this.selection);
			}
		}
	}
}
