import { UmbEntityActionBase } from '@umbraco-cms/backoffice/entity-action';
import type { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';
import { UMB_MODAL_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/modal';
import { UMB_CULTURE_AND_HOSTNAMES_MODAL, type UmbDocumentDetailRepository } from '@umbraco-cms/backoffice/document';

export class UmbDocumentCultureAndHostnamesEntityAction extends UmbEntityActionBase<UmbDocumentDetailRepository> {
	#modalContext?: typeof UMB_MODAL_MANAGER_CONTEXT.TYPE;

	constructor(host: UmbControllerHostElement, repositoryAlias: string, unique: string, entityType: string) {
		super(host, repositoryAlias, unique, entityType);

		this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (instance) => {
			this.#modalContext = instance;
		});
	}

	async execute() {
		if (!this.repository) return;
		this._openModal(this.unique || null);
	}

	private async _openModal(unique: string | null) {
		if (!this.#modalContext) return;
		this.#modalContext.open(UMB_CULTURE_AND_HOSTNAMES_MODAL, {
			data: { unique },
		});
	}
}
