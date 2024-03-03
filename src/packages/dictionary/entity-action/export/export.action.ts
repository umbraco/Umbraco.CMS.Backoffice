import type { UmbDictionaryExportRepository } from '../../repository/index.js';
import { UMB_EXPORT_DICTIONARY_MODAL } from './export-dictionary-modal.token.js';
import { UmbEntityActionBase } from '@umbraco-cms/backoffice/entity-action';
import { UMB_MODAL_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/modal';

export default class UmbExportDictionaryEntityAction extends UmbEntityActionBase<UmbDictionaryExportRepository> {
	async execute() {
		if (!this.unique) throw new Error('Unique is not available');

		const modalManager = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
		const modalContext = modalManager.open(this, UMB_EXPORT_DICTIONARY_MODAL, { data: { unique: this.unique } });

		const { includeChildren } = await modalContext.onSubmit();

		// Export the file
		const result = await this.repository?.requestExport(this.unique, includeChildren);
		const blobContent = await result?.data;

		if (!blobContent) return;
		const blob = new Blob([blobContent], { type: 'text/plain' });
		const a = document.createElement('a');
		const url = window.URL.createObjectURL(blob);

		// Download
		a.href = url;
		a.download = `${this.unique}.udt`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);

		// Clean up
		window.URL.revokeObjectURL(url);
	}
}
