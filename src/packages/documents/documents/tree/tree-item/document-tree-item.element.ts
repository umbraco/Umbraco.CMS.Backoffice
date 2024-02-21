import type { UmbDocumentTreeItemModel } from '../types.js';
import { UmbDocumentTreeItemContext } from './document-tree-item.context.js';
import { css, html, nothing, customElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbTreeItemElement } from '@umbraco-cms/backoffice/extension-registry';

@customElement('umb-document-tree-item')
export class UmbDocumentTreeItemElement extends UmbLitElement implements UmbTreeItemElement {
	private _item?: UmbDocumentTreeItemModel;
	@property({ type: Object, attribute: false })
	public get item() {
		return this._item;
	}
	public set item(value: UmbDocumentTreeItemModel | undefined) {
		this._item = value;
		this.#context.setTreeItem(value);
	}

	#context = new UmbDocumentTreeItemContext(this);

	render() {
		if (!this.item) return nothing;
		return html`
			<umb-tree-item-base> ${this.#renderIconWithStatusSymbol()} ${this.#renderLabel()} </umb-tree-item-base>
		`;
	}

	// TODO: implement correct status symbol
	#renderIconWithStatusSymbol() {
		return html`
			<span id="icon-container" slot="icon">
				${this.item?.documentType.icon
					? html`
							<uui-icon id="icon" slot="icon" name="${this.item.documentType.icon}"></uui-icon>
							<span id="status-symbol"></span>
					  `
					: nothing}
			</span>
		`;
	}

	// TODO: lower opacity if item is not published
	// TODO: get correct variant name
	#renderLabel() {
		return html` <span id="label" slot="label">${this.item?.variants[0].name}</span> `;
	}

	static styles = [
		UmbTextStyles,
		css`
			#icon-container {
				position: relative;
			}

			#icon {
				vertical-align: middle;
			}

			#status-symbol {
				width: 5px;
				height: 5px;
				border: 1px solid white;
				background-color: blue;
				display: block;
				position: absolute;
				bottom: 0;
				right: 0;
				border-radius: 100%;
			}
		`,
	];
}

export default UmbDocumentTreeItemElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-document-tree-item': UmbDocumentTreeItemElement;
	}
}
