import { UMB_ACTION_EVENT_CONTEXT } from '@umbraco-cms/backoffice/action';
import { UmbEntityActionBase } from '@umbraco-cms/backoffice/entity-action';
import { UmbRequestReloadStructureForEntityEvent } from '@umbraco-cms/backoffice/event';
import type { MetaEntityActionFolderKind } from '@umbraco-cms/backoffice/extension-registry';
import { UMB_MODAL_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/modal';
import { UMB_FOLDER_UPDATE_MODAL } from '@umbraco-cms/backoffice/tree';

export class UmbUpdateFolderEntityAction extends UmbEntityActionBase<MetaEntityActionFolderKind> {
	async execute() {
		if (!this.args.unique) throw new Error('Unique is not available');

		const modalManager = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
		const modalContext = modalManager.open(this, UMB_FOLDER_UPDATE_MODAL, {
			data: {
				folderRepositoryAlias: this.args.meta.folderRepositoryAlias,
				unique: this.args.unique,
			},
		});

		await modalContext.onSubmit();

		const actionEventContext = await this.getContext(UMB_ACTION_EVENT_CONTEXT);
		const event = new UmbRequestReloadStructureForEntityEvent({
			unique: this.args.unique,
			entityType: this.args.entityType,
		});

		actionEventContext.dispatchEvent(event);
	}
}
