import { UmbEntityActionBase } from '../../entity-action.js';
import { UmbContextConsumerController } from '@umbraco-cms/backoffice/context-api';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';
import {
	UmbModalManagerContext,
	UMB_MODAL_MANAGER_CONTEXT_TOKEN,
	UMB_CONFIRM_MODAL,
} from '@umbraco-cms/backoffice/modal';
import { UmbItemRepository } from '@umbraco-cms/backoffice/repository';

export class UmbTrashEntityAction<
	T extends UmbItemRepository<any> & { trash(unique: string): Promise<void> },
> extends UmbEntityActionBase<T> {
	#modalContext?: UmbModalManagerContext;

	constructor(host: UmbControllerHostElement, repositoryAlias: string, unique: string) {
		super(host, repositoryAlias, unique);

		new UmbContextConsumerController(this._host, UMB_MODAL_MANAGER_CONTEXT_TOKEN, (instance) => {
			this.#modalContext = instance;
		});
	}

	async execute() {
		if (!this.repository) return;

		const { data } = await this.repository.requestItems([this.unique]);

		if (data) {
			const item = data[0];

			const modalContext = this.#modalContext?.open(UMB_CONFIRM_MODAL, {
				data: {
					headline: `Trash ${item.name}`,
					content: 'Are you sure you want to move this item to the recycle bin?',
					color: 'danger',
					confirmLabel: 'Trash',
				},
			});

			modalContext?.onSubmit().then(() => {
				this.repository?.trash(this.unique);
			});
		}
	}
}
