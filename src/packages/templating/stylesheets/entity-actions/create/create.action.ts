import { UMB_STYLESHEET_CREATE_OPTIONS_MODAL } from './options-modal/index.js';
import { UmbEntityActionBase } from '@umbraco-cms/backoffice/entity-action';
import { UMB_MODAL_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/modal';

export class UmbStylesheetCreateOptionsEntityAction extends UmbEntityActionBase<never> {
	async execute() {
		if (!this.repository) throw new Error('Repository is not available');

		const modalManager = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
		modalManager.open(this, UMB_STYLESHEET_CREATE_OPTIONS_MODAL, {
			data: {
				parentUnique: this.unique,
				entityType: this.entityType,
			},
		});
	}
}
