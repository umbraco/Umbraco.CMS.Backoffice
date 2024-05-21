import type { UmbEntityActionArgs } from '@umbraco-cms/backoffice/entity-action';
import { UmbEntityActionBase, UmbRequestReloadChildrenOfEntityEvent } from '@umbraco-cms/backoffice/entity-action';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UMB_ACTION_EVENT_CONTEXT } from '@umbraco-cms/backoffice/action';
import type { MetaEntityActionReloadTreeItemChildrenKind } from '@umbraco-cms/backoffice/extension-registry';

export class UmbReloadTreeItemChildrenEntityAction extends UmbEntityActionBase<MetaEntityActionReloadTreeItemChildrenKind> {
	constructor(host: UmbControllerHost, args: UmbEntityActionArgs<MetaEntityActionReloadTreeItemChildrenKind>) {
		super(host, args);
	}

	async execute() {
		const eventContext = await this.getContext(UMB_ACTION_EVENT_CONTEXT);

		eventContext.dispatchEvent(
			new UmbRequestReloadChildrenOfEntityEvent({
				unique: this.args.unique,
				entityType: this.args.entityType,
			}),
		);
	}
}

export { UmbReloadTreeItemChildrenEntityAction as api };
