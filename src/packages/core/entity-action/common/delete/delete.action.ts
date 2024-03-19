import { UmbEntityActionBase } from '../../entity-action-base.js';
import { createExtensionApiByAlias, type MetaEntityActionDeleteKind } from '@umbraco-cms/backoffice/extension-registry';
import { umbConfirmModal } from '@umbraco-cms/backoffice/modal';
import type { UmbDetailRepository, UmbItemRepository } from '@umbraco-cms/backoffice/repository';
import { UMB_ACTION_EVENT_CONTEXT } from '@umbraco-cms/backoffice/action';
import { UmbRequestReloadStructureForEntityEvent } from '@umbraco-cms/backoffice/event';

export class UmbDeleteEntityAction extends UmbEntityActionBase<MetaEntityActionDeleteKind> {
	// TODO: make base type for item and detail models

	async execute() {
		if (!this.args.unique) throw new Error('Cannot delete an item without a unique identifier.');

		const itemRepository = await createExtensionApiByAlias<UmbItemRepository<any>>(
			this,
			this.args.meta.itemRepositoryAlias,
		);

		const { data } = await itemRepository.requestItems([this.args.unique]);
		const item = data?.[0];
		if (!item) throw new Error('Item not found.');

		// TODO: handle items with variants
		await umbConfirmModal(this._host, {
			headline: `Delete`,
			content: `Are you sure you want to delete ${item.name}?`,
			color: 'danger',
			confirmLabel: 'Delete',
		});

		const detailRepository = await createExtensionApiByAlias<UmbDetailRepository<any>>(
			this,
			this.args.meta.detailRepositoryAlias,
		);
		await detailRepository.delete(this.args.unique);

		const actionEventContext = await this.getContext(UMB_ACTION_EVENT_CONTEXT);
		const event = new UmbRequestReloadStructureForEntityEvent({
			unique: this.args.unique,
			entityType: this.args.entityType,
		});

		actionEventContext.dispatchEvent(event);
	}
}
export default UmbDeleteEntityAction;
