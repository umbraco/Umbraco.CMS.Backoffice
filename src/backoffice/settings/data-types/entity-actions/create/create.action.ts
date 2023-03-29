import { UmbDataTypeRepository } from '../../repository/data-type.repository';
import { UMB_CREATE_DATA_TYPE_MODAL_TOKEN } from './modal';
import { UmbEntityActionBase } from '@umbraco-cms/backoffice/entity-action';
import { UmbControllerHostInterface } from '@umbraco-cms/backoffice/controller';
import { UmbModalContext, UMB_MODAL_CONTEXT_TOKEN } from '@umbraco-cms/backoffice/modal';
import { UmbContextConsumerController } from '@umbraco-cms/backoffice/context-api';

export class UmbCreateDataTypeEntityAction extends UmbEntityActionBase<UmbDataTypeRepository> {
	#modalContext?: UmbModalContext;

	constructor(host: UmbControllerHostInterface, repositoryAlias: string, unique: string) {
		super(host, repositoryAlias, unique);

		new UmbContextConsumerController(this.host, UMB_MODAL_CONTEXT_TOKEN, (instance) => {
			this.#modalContext = instance;
		});
	}

	async execute() {
		debugger;
		// TODO: what to do if modal service is not available?
		if (!this.#modalContext) return;
		if (!this.repository) return;

		const { data } = await this.repository.requestByKey(this.unique);

		if (data && data.contentTypeKey) {
			this.#modalContext?.open(UMB_CREATE_DATA_TYPE_MODAL_TOKEN);
		}
	}
}
