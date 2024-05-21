import type { UmbEditableDocumentCollectionItemModel } from '../../../types.js';
import { css, customElement, html, nothing, property, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbTableColumn, UmbTableColumnLayoutElement, UmbTableItem } from '@umbraco-cms/backoffice/components';
import type { UUIButtonElement } from '@umbraco-cms/backoffice/external/uui';
import { UmbVariantId } from '@umbraco-cms/backoffice/variant';
import { UMB_APP_LANGUAGE_CONTEXT, type UmbAppLanguageContext } from '@umbraco-cms/backoffice/language';
import type { UmbVariantDatasetWorkspaceContext } from '@umbraco-cms/backoffice/workspace';
import { UMB_VARIANT_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/workspace';

@customElement('umb-document-table-column-name')
export class UmbDocumentTableColumnNameElement extends UmbLitElement implements UmbTableColumnLayoutElement {
	column!: UmbTableColumn;
	item!: UmbTableItem;

	@property({ attribute: false })
	value!: UmbEditableDocumentCollectionItemModel;

	@state()
	_workspaceActiveVariantId?: UmbVariantId;

	@state()
	_appDefaultCulture?: string;

	#onClick(event: Event & { target: UUIButtonElement }) {
		event.preventDefault();
		event.stopPropagation();
		window.history.pushState(null, '', event.target.href);
	}

	#appLanguageContext?: UmbAppLanguageContext;
	#workspaceContext?: UmbVariantDatasetWorkspaceContext;

	constructor() {
		super();

		this.consumeContext(UMB_APP_LANGUAGE_CONTEXT, (instance) => {
			this.#appLanguageContext = instance;
			this.#observeDefaultCulture();
		});

		this.consumeContext(UMB_VARIANT_WORKSPACE_CONTEXT, (instance) => {
			if (!instance) return;
			this.#workspaceContext = instance;
			this.#observeWorkspaceActiveVariant();
		});
	}

	#observeDefaultCulture() {
		this.observe(this.#appLanguageContext!.appDefaultLanguage, (value) => {
			this._appDefaultCulture = value?.unique;
		});
	}

	#observeWorkspaceActiveVariant() {
		this.observe(
			this.#workspaceContext?.splitView.activeVariantsInfo,
			(value) => {
				if (!value) return;
				this._workspaceActiveVariantId = UmbVariantId.Create(value[0]);
			},
			'umbCollectionItemVariantNameObserver',
		);
	}

	#getItemVariantName() {
		const item = this.value.item;

		const fallbackName =
			item.variants.find((variant) => variant.culture === this._appDefaultCulture)?.name ??
			item.variants[0].name ??
			'Unknown';
		const name = item.variants.find((variant) => this._workspaceActiveVariantId?.compare(variant))?.name;
		return name ?? `(${fallbackName})`;
	}

	render() {
		if (!this.value) return nothing;
		return html`
			<uui-button
				compact
				href=${this.value.editPath}
				label=${this.#getItemVariantName()}
				@click=${this.#onClick}></uui-button>
		`;
	}

	static styles = [
		css`
			uui-button {
				text-align: left;
			}
		`,
	];
}

export default UmbDocumentTableColumnNameElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-document-table-column-name': UmbDocumentTableColumnNameElement;
	}
}
