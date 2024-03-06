import { UmbDataTypeCollectionRepository } from '../../collection/index.js';
import type {
	UmbDataTypePickerFlowDataTypePickerModalData,
	UmbDataTypePickerFlowDataTypePickerModalValue,
} from './data-type-picker-flow-data-type-picker-modal.token.js';
import { css, html, customElement, state, repeat, when } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';
import type { UmbDataTypeItemModel } from '@umbraco-cms/backoffice/data-type';

@customElement('umb-data-type-picker-flow-data-type-picker-modal')
export class UmbDataTypePickerFlowDataTypePickerModalElement extends UmbModalBaseElement<
	UmbDataTypePickerFlowDataTypePickerModalData,
	UmbDataTypePickerFlowDataTypePickerModalValue
> {
	@state()
	private _dataTypes?: Array<UmbDataTypeItemModel>;

	private _propertyEditorUiAlias!: string;

	connectedCallback(): void {
		super.connectedCallback();

		if (!this.data) return;

		this._propertyEditorUiAlias = this.data.propertyEditorUiAlias;

		this._observeDataTypesOf(this._propertyEditorUiAlias);
	}

	private async _observeDataTypesOf(propertyEditorUiAlias: string) {
		if (!this.data) return;

		const dataTypeCollectionRepository = new UmbDataTypeCollectionRepository(this);

		const collection = await dataTypeCollectionRepository.requestCollection({
			skip: 0,
			take: 100,
			editorUiAlias: propertyEditorUiAlias,
		});

		this.observe(collection.asObservable(), (dataTypes) => {
			this._dataTypes = dataTypes;
		});
	}

	private _handleClick(dataType: UmbDataTypeItemModel) {
		if (dataType.unique) {
			this.value = { dataTypeId: dataType.unique };
			this.modalContext?.submit();
		}
	}

	private _handleCreate() {
		this.value = { createNewWithPropertyEditorUiAlias: this._propertyEditorUiAlias };
		this.modalContext?.submit();
	}

	private _close() {
		this.modalContext?.reject();
	}

	render() {
		return html`
			<umb-body-layout headline="Select a configuration">
				<uui-box> ${this._renderDataTypes()} ${this._renderCreate()}</uui-box>
				<div slot="actions">
					<uui-button label=${this.localize.term('general_close')} @click=${this._close}></uui-button>
				</div>
			</umb-body-layout>
		`;
	}

	private _renderDataTypes() {
		const shouldRender = this._dataTypes && this._dataTypes.length > 0;

		return when(
			shouldRender,
			() =>
				html`<ul id="item-grid">
					${repeat(
						this._dataTypes!,
						(dataType) => dataType.unique,
						(dataType) =>
							dataType.unique
								? html` <li class="item">
										<uui-button label="dataType.name" type="button" @click="${() => this._handleClick(dataType)}">
											<div class="item-content">
												<uui-icon name="${'icon-bug'}" class="icon"></uui-icon>
												${dataType.name}
											</div>
										</uui-button>
									</li>`
								: '',
					)}
				</ul>`,
		);
	}
	private _renderCreate() {
		return html`
			<uui-button id="create-button" type="button" look="placeholder" @click="${this._handleCreate}">
				<div class="content">
					<uui-icon name="icon-add" class="icon"></uui-icon>
					Create new
				</div>
			</uui-button>
		`;
	}

	static styles = [
		UmbTextStyles,
		css`
			uui-box {
				min-height: 100%;
			}
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
				grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
				margin: 0;
				padding: 0;
			}

			#item-grid:not(:last-child) {
				border-bottom: 1px solid var(--uui-color-divider);
				padding-bottom: var(--uui-size-space-5);
			}

			.item {
				list-style: none;
				height: 100%;
				width: 100%;
				border: 1px solid transparent;
				border-radius: var(--uui-border-radius);
				box-sizing: border-box;
				color: var(--uui-color-interactive);
			}

			.item:hover {
				background: var(--uui-color-surface-emphasis);
				color: var(--uui-color-interactive-emphasis);
				cursor: pointer;
			}

			.item uui-button {
				--uui-button-padding-left-factor: 0;
				--uui-button-padding-right-factor: 0;
				--uui-button-padding-top-factor: 0;
				--uui-button-padding-bottom-factor: 0;
				width: 100%;
				height: 100%;
			}

			.item .item-content {
				text-align: center;
				box-sizing: border-box;

				padding: var(--uui-size-space-2);

				display: grid;
				grid-template-rows: 40px 1fr;
				height: 100%;
				width: 100%;
			}
			.icon {
				font-size: 2em;
				margin: auto;
			}

			#category-name {
				text-align: center;
				display: block;
				text-transform: capitalize;
				font-size: 1.2rem;
			}
			#create-button {
				max-width: 100px;
				--uui-button-padding-left-factor: 0;
				--uui-button-padding-right-factor: 0;
				--uui-button-padding-top-factor: 0;
				--uui-button-padding-bottom-factor: 0;
				width: 100%;
				height: 100%;
			}
			#create-button .content {
				text-align: center;
				box-sizing: border-box;

				padding: var(--uui-size-space-2);

				display: grid;
				grid-template-rows: 40px 1fr;
				height: 100%;
				width: 100%;
			}
			#create-button:not(:first-child) {
				margin-top: var(--uui-size-layout-1);
			}
		`,
	];
}

export default UmbDataTypePickerFlowDataTypePickerModalElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-data-type-picker-flow-data-type-picker-modal': UmbDataTypePickerFlowDataTypePickerModalElement;
	}
}
