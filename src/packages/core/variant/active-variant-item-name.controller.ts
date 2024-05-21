import { UmbVariantId } from './variant-id.class.js';
import type { UmbVariantModelBase } from './types.js';
import { UMB_APP_LANGUAGE_CONTEXT, type UmbAppLanguageContext } from '@umbraco-cms/backoffice/language';
import type { UmbVariantDatasetWorkspaceContext } from '@umbraco-cms/backoffice/workspace';
import { UMB_VARIANT_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/workspace';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbControllerBase } from '@umbraco-cms/backoffice/class-api';
import { UmbArrayState, UmbStringState } from '@umbraco-cms/backoffice/observable-api';

export class UmbActiveVariantItemNameController extends UmbControllerBase {
	#appLanguageContext?: UmbAppLanguageContext;
	#workspaceContext?: UmbVariantDatasetWorkspaceContext;
	#workspaceActiveVariantId?: UmbVariantId;
	#appDefaultCulture?: string;

	#name = new UmbStringState<string | undefined>(undefined);
	readonly name = this.#name.asObservable();

	#variants = new UmbArrayState<UmbVariantModelBase>([], (x) => x.culture);
	readonly variants = this.#variants.asObservable();

	constructor(host: UmbControllerHost) {
		super(host);

		this.consumeContext(UMB_APP_LANGUAGE_CONTEXT, (instance) => {
			this.#appLanguageContext = instance;
			this.#observeAppDefaultCulture();
			this.#computeName();
		});

		this.consumeContext(UMB_VARIANT_WORKSPACE_CONTEXT, (instance) => {
			if (!instance) return;
			this.#workspaceContext = instance;
			this.#observeWorkspaceActiveVariant();
			this.#computeName();
		});
	}

	/**
	 * Set the variants for the item.
	 * @param {Array<UmbVariantModelBase>} variants
	 * @memberof UmbActiveVariantItemNameController
	 */
	setVariants(variants: Array<UmbVariantModelBase>) {
		this.#variants.setValue(variants);
		this.#computeName();
	}

	/**
	 * Get the variants for the item.
	 * @return {*}
	 * @memberof UmbActiveVariantItemNameController
	 */
	getVariants() {
		return this.#variants.getValue();
	}

	#observeAppDefaultCulture() {
		this.observe(
			this.#appLanguageContext!.appDefaultLanguage,
			(value) => {
				this.#appDefaultCulture = value?.unique;
			},
			'umbAppDefaultCultureObserver',
		);
	}

	#observeWorkspaceActiveVariant() {
		this.observe(
			this.#workspaceContext?.splitView.activeVariantsInfo,
			(value) => {
				if (!value) return;
				this.#workspaceActiveVariantId = UmbVariantId.Create(value[0]);
			},
			'umbCollectionItemVariantNameObserver',
		);
	}

	#computeName() {
		const variants = this.#variants.getValue();

		const fallbackName =
			variants.find((variant) => variant.culture === this.#appDefaultCulture)?.name ?? variants[0].name ?? 'Unknown';
		const name = variants.find((variant) => this.#workspaceActiveVariantId?.compare(variant))?.name;
		const nameWithFallback = name ?? `(${fallbackName})`;
		if (nameWithFallback === this.#name.getValue()) return;
		this.#name.setValue(nameWithFallback);
	}
}
