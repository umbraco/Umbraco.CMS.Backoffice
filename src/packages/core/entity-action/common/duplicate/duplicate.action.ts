import { UmbEntityActionBase } from '../../entity-action-base.js';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import type { UmbEntityActionArgs } from '@umbraco-cms/backoffice/entity-action';
import { UmbExtensionApiInitializer } from '@umbraco-cms/backoffice/extension-api';
import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';
import type { MetaEntityActionDuplicateKind } from '@umbraco-cms/backoffice/extension-registry';
import { UMB_MODAL_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/modal';
import type { UmbDuplicateRepository, UmbItemRepository } from '@umbraco-cms/backoffice/repository';

export class UmbDuplicateEntityAction extends UmbEntityActionBase<MetaEntityActionDuplicateKind> {
	// TODO: make base type for item and detail models
	#itemRepository?: UmbItemRepository<any>;
	#duplicateRepository?: UmbDuplicateRepository;
	#init: Promise<unknown>;

	constructor(host: UmbControllerHost, args: UmbEntityActionArgs<MetaEntityActionDuplicateKind>) {
		super(host, args);

		// TODO: We should properly look into how we can simplify the one time usage of a extension api, as its a bit of overkill to take conditions/overwrites and observation of extensions into play here: [NL]
		// But since this happens when we execute an action, it does most likely not hurt any users, but it is a bit of a overkill to do this for every action: [NL]
		this.#init = Promise.all([
			new UmbExtensionApiInitializer(
				this._host,
				umbExtensionsRegistry,
				this.args.meta.itemRepositoryAlias,
				[this._host],
				(permitted, ctrl) => {
					this.#itemRepository = permitted ? (ctrl.api as UmbItemRepository<any>) : undefined;
				},
			).asPromise(),

			new UmbExtensionApiInitializer(
				this._host,
				umbExtensionsRegistry,
				this.args.meta.duplicateRepositoryAlias,
				[this._host],
				(permitted, ctrl) => {
					this.#duplicateRepository = permitted ? (ctrl.api as UmbDuplicateRepository) : undefined;
				},
			).asPromise(),
		]);
	}

	async execute() {
		if (!this.args.unique) throw new Error('Unique is not available');
		await this.#init;

		const modalManager = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
		const modalContext = modalManager.open(this, this.args.meta.pickerModal) as any; // TODO: make generic picker interface with selection
		const value = await modalContext.onSubmit();
		if (!value) return;
		await this.#duplicateRepository!.duplicate(this.args.unique, value.selection[0]);
	}
}

export default UmbDuplicateEntityAction;
