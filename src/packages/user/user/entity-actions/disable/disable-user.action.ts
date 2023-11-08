import { type UmbDisableUserRepository } from '../../repository/disable/disable-user.repository.js';
import { UmbUserItemRepository } from '../../repository/item/user-item.repository.js';
import { UmbEntityActionBase } from '@umbraco-cms/backoffice/entity-action';
import { UmbContextConsumerController } from '@umbraco-cms/backoffice/context-api';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';
import {
	type UmbModalManagerContext,
	UMB_MODAL_MANAGER_CONTEXT_TOKEN,
	UMB_CONFIRM_MODAL,
} from '@umbraco-cms/backoffice/modal';

export class UmbDisableUserEntityAction extends UmbEntityActionBase<UmbDisableUserRepository> {
	#modalManager?: UmbModalManagerContext;
	#itemRepository: UmbUserItemRepository;

	constructor(host: UmbControllerHostElement, repositoryAlias: string, unique: string) {
		super(host, repositoryAlias, unique);

		this.#itemRepository = new UmbUserItemRepository(this.host);

		new UmbContextConsumerController(this.host, UMB_MODAL_MANAGER_CONTEXT_TOKEN, (instance) => {
			this.#modalManager = instance;
		});
	}

	async execute() {
		if (!this.repository || !this.#modalManager) return;

		const { data } = await this.#itemRepository.requestItems([this.unique]);

		if (data) {
			const item = data[0];

			const modalContext = this.#modalManager.open(UMB_CONFIRM_MODAL, {
				headline: `Disable ${item.name}`,
				content: 'Are you sure you want to disable this user?',
				color: 'danger',
				confirmLabel: 'Disable',
			});

			await modalContext.onSubmit();
			await this.repository?.disable([this.unique]);
		}
	}
}
