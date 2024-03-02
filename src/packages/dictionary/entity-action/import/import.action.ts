import type { UmbDictionaryImportRepository } from '../../repository/index.js';
import { UMB_IMPORT_DICTIONARY_MODAL } from './import-dictionary-modal.token.js';
import { UmbEntityActionBase } from '@umbraco-cms/backoffice/entity-action';
import { UMB_MODAL_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/modal';

export default class UmbImportDictionaryEntityAction extends UmbEntityActionBase<UmbDictionaryImportRepository> {
	async execute() {
		const modalManager = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
		const modalContext = modalManager.open(this, UMB_IMPORT_DICTIONARY_MODAL, { data: { unique: this.unique } });
		await modalContext.onSubmit();
	}
}
