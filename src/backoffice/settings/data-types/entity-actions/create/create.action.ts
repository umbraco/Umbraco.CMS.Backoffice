import { UmbDataTypeRepository } from '../../repository/data-type.repository';
import { UMB_CREATE_DATA_TYPE_MODAL } from './modal';
import { UmbEntityActionBase } from '@umbraco-cms/backoffice/entity-action';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';
import { UmbModalContext, UMB_MODAL_CONTEXT_TOKEN } from '@umbraco-cms/backoffice/modal';
import { UmbContextConsumerController } from '@umbraco-cms/backoffice/context-api';

export class UmbCreateDataTypeEntityAction extends UmbEntityActionBase<UmbDataTypeRepository> {
	#modalContext?: UmbModalContext;

	constructor(host: UmbControllerHostElement, repositoryAlias: string, unique: string) {
		super(host, repositoryAlias, unique);

		new UmbContextConsumerController(this.host, UMB_MODAL_CONTEXT_TOKEN, (instance) => {
			this.#modalContext = instance;
		});
	}

	async execute() {
		if (!this.#modalContext) throw new Error('Modal context is not available');
		if (!this.repository) throw new Error('Repository is not available');

		this.#modalContext?.open(UMB_CREATE_DATA_TYPE_MODAL, {
			parentKey: this.unique,
		});
	}
}
