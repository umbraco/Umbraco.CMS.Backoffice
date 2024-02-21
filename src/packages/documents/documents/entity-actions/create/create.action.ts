import type { UmbDocumentDetailRepository } from '../../repository/index.js';
import { UmbDocumentItemRepository } from '../../repository/index.js';
import type { UmbDocumentCreateOptionsModalData } from './document-create-options-modal.token.js';
import { UMB_DOCUMENT_CREATE_OPTIONS_MODAL } from './document-create-options-modal.token.js';
import { UmbEntityActionBase } from '@umbraco-cms/backoffice/entity-action';
import type { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';
import type { UmbModalManagerContext } from '@umbraco-cms/backoffice/modal';
import { UMB_MODAL_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/modal';

export class UmbCreateDocumentEntityAction extends UmbEntityActionBase<UmbDocumentDetailRepository> {
	#modalContext?: UmbModalManagerContext;
	#itemRepository;

	constructor(host: UmbControllerHostElement, repositoryAlias: string, unique: string, entityType: string) {
		super(host, repositoryAlias, unique, entityType);

		this.#itemRepository = new UmbDocumentItemRepository(host);

		this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (instance) => {
			this.#modalContext = instance;
		});
	}

	async execute() {
		if (!this.repository) return;

		// default to root
		let documentItem = null;

		if (this.unique) {
			// get document item to get the doc type id
			const { data, error } = await this.#itemRepository.requestItems([this.unique]);
			if (error || !data) throw new Error(`Failed to load document item`);
			documentItem = data[0];
		}

		this._openModal({
			document: documentItem ? { unique: documentItem.unique } : null,
			documentType: documentItem ? { unique: documentItem.documentType.unique } : null,
		});
	}

	private async _openModal(modalData: UmbDocumentCreateOptionsModalData) {
		if (!this.#modalContext) return;
		this.#modalContext.open(UMB_DOCUMENT_CREATE_OPTIONS_MODAL, {
			data: modalData,
		});
	}
}
