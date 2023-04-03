import { UmbEntityActionBase } from '@umbraco-cms/backoffice/entity-action';
import { UmbContextConsumerController } from '@umbraco-cms/backoffice/context-api';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';
import { UmbModalContext, UMB_MODAL_CONTEXT_TOKEN, UMB_CONFIRM_MODAL } from '@umbraco-cms/backoffice/modal';

export class UmbDeleteFolderEntityAction<
	T extends { deleteFolder(unique: string): Promise<void>; requestTreeItems(uniques: Array<string>): any }
> extends UmbEntityActionBase<T> {
	#modalContext?: UmbModalContext;

	constructor(host: UmbControllerHostElement, repositoryAlias: string, unique: string) {
		super(host, repositoryAlias, unique);

		new UmbContextConsumerController(this.host, UMB_MODAL_CONTEXT_TOKEN, (instance) => {
			this.#modalContext = instance;
		});
	}

	async execute() {
		if (!this.repository || !this.#modalContext) return;

		const { data } = await this.repository.requestTreeItems([this.unique]);

		if (data) {
			const item = data[0];

			// TODO: maybe we can show something about how many items are part of the folder?
			const modalHandler = this.#modalContext.open(UMB_CONFIRM_MODAL, {
				headline: `Delete folder ${item.name}`,
				content: 'Are you sure you want to delete this folder?',
				color: 'danger',
				confirmLabel: 'Delete',
			});

			await modalHandler.onSubmit();
			await this.repository?.deleteFolder(this.unique);
		}
	}
}
