import type { UmbDocumentTreeItemModel, UmbDocumentTreeItemVariantModel } from '../types.js';
import { css, html, nothing, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import type { UmbAppLanguageContext } from '@umbraco-cms/backoffice/language';
import { UMB_APP_LANGUAGE_CONTEXT } from '@umbraco-cms/backoffice/language';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { UmbTreeItemElementBase } from '@umbraco-cms/backoffice/tree';

@customElement('umb-document-tree-item')
export class UmbDocumentTreeItemElement extends UmbTreeItemElementBase<UmbDocumentTreeItemModel> {
	#appLanguageContext?: UmbAppLanguageContext;

	@state()
	_currentCulture?: string;

	@state()
	_defaultCulture?: string;

	@state()
	_variant?: UmbDocumentTreeItemVariantModel;

	constructor() {
		super();

		this.consumeContext(UMB_APP_LANGUAGE_CONTEXT, (instance) => {
			this.#appLanguageContext = instance;
			this.#observeAppCulture();
			this.#observeDefaultCulture();
		});
	}

	#observeAppCulture() {
		this.observe(this.#appLanguageContext!.appLanguageCulture, (value) => {
			this._currentCulture = value;
			this._variant = this.#getVariant(value);
		});
	}

	#observeDefaultCulture() {
		this.observe(this.#appLanguageContext!.appDefaultLanguage, (value) => {
			this._defaultCulture = value?.unique;
		});
	}

	#getVariant(culture: string | undefined) {
		return this.item?.variants.find((x) => x.culture === culture);
	}

	#getLabel() {
		const fallbackName = this.#getVariant(this._defaultCulture)?.name ?? this._item?.variants[0].name ?? 'Unknown';
		return this._variant?.name ?? `(${fallbackName})`;
	}

	// TODO: implement correct status symbol
	renderIconContainer() {
		return html`
			<span id="icon-container" slot="icon">
				${this.item?.documentType.icon
					? html`
							<umb-icon id="icon" slot="icon" name="${this.item.documentType.icon}"></umb-icon>
							<span id="status-symbol"></span>
						`
					: nothing}
			</span>
		`;
	}

	// TODO: lower opacity if item is not published
	renderLabel() {
		return html`<span id="label" slot="label">${this.#getLabel()}</span> `;
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
