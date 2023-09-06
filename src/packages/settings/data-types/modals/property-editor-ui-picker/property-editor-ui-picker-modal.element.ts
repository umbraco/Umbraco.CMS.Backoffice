import { css, html, customElement, property, state, repeat } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import { groupBy } from '@umbraco-cms/backoffice/external/lodash';
import type { UUIInputEvent } from '@umbraco-cms/backoffice/external/uui';
import {
	UmbPropertyEditorUIPickerModalData,
	UmbPropertyEditorUIPickerModalResult,
	UmbModalContext,
} from '@umbraco-cms/backoffice/modal';
import { ManifestPropertyEditorUi, umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';

interface GroupedPropertyEditorUIs {
	[key: string]: Array<ManifestPropertyEditorUi>;
}
@customElement('umb-property-editor-ui-picker-modal')
export class UmbPropertyEditorUIPickerModalElement extends UmbLitElement {
	@property({ type: Object })
	data?: UmbPropertyEditorUIPickerModalData;

	@state()
	private _groupedPropertyEditorUIs: GroupedPropertyEditorUIs = {};

	@state()
	private _propertyEditorUIs: Array<ManifestPropertyEditorUi> = [];

	@state()
	private _selection: Array<string> = [];

	@state()
	private _submitLabel = 'Select';

	@property({ attribute: false })
	modalContext?: UmbModalContext<UmbPropertyEditorUIPickerModalData, UmbPropertyEditorUIPickerModalResult>;

	connectedCallback(): void {
		super.connectedCallback();

		this._selection = this.data?.selection ?? [];
		this._submitLabel = this.data?.submitLabel ?? this._submitLabel;

		this._usePropertyEditorUIs();
	}

	private _usePropertyEditorUIs() {
		if (!this.data) return;

		this.observe(umbExtensionsRegistry.extensionsOfType('propertyEditorUi'), (propertyEditorUIs) => {

			// Only include Property Editor UIs which has Property Editor Schema Alias
			this._propertyEditorUIs = propertyEditorUIs.filter((propertyEditorUi) => !!propertyEditorUi.meta.propertyEditorSchemaAlias);

			this._groupedPropertyEditorUIs = groupBy(this._propertyEditorUIs, 'meta.group');
		});
	}

	private _handleClick(propertyEditorUi: ManifestPropertyEditorUi) {
		this._select(propertyEditorUi.alias);
	}

	private _select(alias: string) {
		this._selection = [alias];
	}

	private _handleFilterInput(event: UUIInputEvent) {
		let query = (event.target.value as string) || '';
		query = query.toLowerCase();

		const result = !query
			? this._propertyEditorUIs
			: this._propertyEditorUIs.filter((propertyEditorUI) => {
					return (
						propertyEditorUI.name.toLowerCase().includes(query) || propertyEditorUI.alias.toLowerCase().includes(query)
					);
			  });

		this._groupedPropertyEditorUIs = groupBy(result, 'meta.group');
	}

	private _close() {
		this.modalContext?.reject();
	}

	private _submit() {
		this.modalContext?.submit({ selection: this._selection });
	}

	render() {
		return html`
			<umb-body-layout headline="Select Property Editor UI">
				<uui-box> ${this._renderFilter()} ${this._renderGrid()} </uui-box>
				<div slot="actions">
					<uui-button label="Close" @click=${this._close}></uui-button>
					<uui-button label="${this._submitLabel}" look="primary" color="positive" @click=${this._submit}></uui-button>
				</div>
			</umb-body-layout>
		`;
	}

	private _renderFilter() {
		return html` <uui-input
			id="filter"
			@input="${this._handleFilterInput}"
			placeholder="Type to filter..."
			label="Type to filter icons">
			<uui-icon name="search" slot="prepend" id="filter-icon"></uui-icon>
		</uui-input>`;
	}

	private _renderGrid() {
		return html` ${Object.entries(this._groupedPropertyEditorUIs).map(
			([key, value]) =>
				html` <h4>${key}</h4>
					${this._renderGroupItems(value)}`
		)}`;
	}

	private _renderGroupItems(groupItems: Array<ManifestPropertyEditorUi>) {
		return html` <ul id="item-grid">
			${repeat(
				groupItems,
				(propertyEditorUI) => propertyEditorUI.alias,
				(propertyEditorUI) => html` <li class="item" ?selected=${this._selection.includes(propertyEditorUI.alias)}>
					<button type="button" @click="${() => this._handleClick(propertyEditorUI)}">
						<uui-icon name="${propertyEditorUI.meta.icon}" class="icon"></uui-icon>
						${propertyEditorUI.meta.label || propertyEditorUI.name}
					</button>
				</li>`
			)}
		</ul>`;
	}

	static styles = [
		UmbTextStyles,
		css`
			#filter {
				width: 100%;
				margin-bottom: var(--uui-size-space-4);
			}

			#filter-icon {
				height: 100%;
				padding-left: var(--uui-size-space-2);
				display: flex;
				color: var(--uui-color-border);
			}

			#item-grid {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
				margin: 0;
				padding: 0;
				grid-gap: var(--uui-size-space-4);
			}

			#item-grid .item {
				display: flex;
				align-items: flex-start;
				justify-content: center;
				list-style: none;
				height: 100%;
				border: 1px solid transparent;
				border-radius: var(--uui-border-radius);
			}

			#item-grid .item:hover {
				background: var(--uui-color-surface-emphasis);
				color: var(--uui-color-interactive-emphasis);
				cursor: pointer;
			}

			#item-grid .item[selected] button {
				background: var(--uui-color-selected);
				color: var(--uui-color-selected-contrast);
			}

			#item-grid .item button {
				background: none;
				border: none;
				cursor: pointer;
				padding: var(--uui-size-space-3);
				display: flex;
				align-items: center;
				flex-direction: column;
				justify-content: center;
				font-size: 0.8rem;
				height: 100%;
				width: 100%;
				color: var(--uui-color-interactive);
				border-radius: var(--uui-border-radius);
			}

			#item-grid .item .icon {
				font-size: 2em;
				margin-bottom: var(--uui-size-space-2);
			}
		`,
	];
}

export default UmbPropertyEditorUIPickerModalElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-picker-modal': UmbPropertyEditorUIPickerModalElement;
	}
}
