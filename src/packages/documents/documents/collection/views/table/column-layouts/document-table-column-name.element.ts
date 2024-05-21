import type { UmbEditableDocumentCollectionItemModel } from '../../../types.js';
import { css, customElement, html, ifDefined, nothing, property, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbTableColumn, UmbTableColumnLayoutElement, UmbTableItem } from '@umbraco-cms/backoffice/components';
import type { UUIButtonElement } from '@umbraco-cms/backoffice/external/uui';
import { UmbActiveVariantItemNameController } from '@umbraco-cms/backoffice/variant';

@customElement('umb-document-table-column-name')
export class UmbDocumentTableColumnNameElement extends UmbLitElement implements UmbTableColumnLayoutElement {
	column!: UmbTableColumn;
	item!: UmbTableItem;

	#value: UmbEditableDocumentCollectionItemModel | undefined;
	@property({ attribute: false })
	public get value(): UmbEditableDocumentCollectionItemModel | undefined {
		return this.#value;
	}
	public set value(value: UmbEditableDocumentCollectionItemModel | undefined) {
		this.#value = value;
		this.#variantNameController.setVariants(value?.item.variants || []);
	}

	#onClick(event: Event & { target: UUIButtonElement }) {
		event.preventDefault();
		event.stopPropagation();
		window.history.pushState(null, '', event.target.href);
	}

	#variantNameController = new UmbActiveVariantItemNameController(this);

	@state()
	_name: string | undefined;

	constructor() {
		super();

		this.observe(
			this.#variantNameController.name,
			(value) => {
				this._name = value;
			},
			'',
		);
	}

	render() {
		if (!this.value) return nothing;
		return html`
			<uui-button
				compact
				href=${this.value.editPath}
				label=${ifDefined(this._name)}
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
