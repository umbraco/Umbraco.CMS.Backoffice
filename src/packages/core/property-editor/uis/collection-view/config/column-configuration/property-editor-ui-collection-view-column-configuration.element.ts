import type { UmbCollectionColumnConfiguration } from '../../../../../collection/types.js';
import { html, customElement, property, repeat, css, state, nothing, when } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbPropertyValueChangeEvent } from '@umbraco-cms/backoffice/property-editor';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import type { UmbInputContentTypePropertyElement } from '@umbraco-cms/backoffice/components';
import type { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';
import type { UUIInputEvent } from '@umbraco-cms/backoffice/external/uui';

/**
 * @element umb-property-editor-ui-collection-view-column-configuration
 */
@customElement('umb-property-editor-ui-collection-view-column-configuration')
export class UmbPropertyEditorUICollectionViewColumnConfigurationElement
	extends UmbLitElement
	implements UmbPropertyEditorUiElement
{

	// TODO: [LK] Add sorting.

	@property({ type: Array })
	value?: Array<UmbCollectionColumnConfiguration> = [];

	@property({ type: Object, attribute: false })
	public config?: UmbPropertyEditorConfigCollection;

	@state()
	private _field?: UmbInputContentTypePropertyElement['selectedProperty'];

	#onAdd(e: CustomEvent) {
		const element = e.target as UmbInputContentTypePropertyElement;

		if (!element.selectedProperty) return;

		this._field = element.selectedProperty;

		const duplicate = this.value?.find((config) => this._field?.alias === config.alias);

		if (duplicate) {
			// TODO: Show error to user, can not add duplicate field/column. [LK]
			return;
		}

		const config: UmbCollectionColumnConfiguration = {
			alias: this._field.alias,
			header: this._field.label,
			isSystem: this._field.isSystem ? 1 : 0,
		};

		this.value = [...(this.value ?? []), config];

		this.dispatchEvent(new UmbPropertyValueChangeEvent());
	}

	#onChangeLabel(e: UUIInputEvent, configuration: UmbCollectionColumnConfiguration) {
		this.value = this.value?.map(
			(config): UmbCollectionColumnConfiguration =>
				config.alias === configuration.alias ? { ...config, header: e.target.value as string } : config,
		);

		this.dispatchEvent(new UmbPropertyValueChangeEvent());
	}

	#onRemove(unique: string) {
		const newValue: Array<UmbCollectionColumnConfiguration> = [];

		this.value?.forEach((config) => {
			if (config.alias !== unique) newValue.push(config);
		});

		this.value = newValue;
		this.dispatchEvent(new UmbPropertyValueChangeEvent());
	}

	render() {
		if (!this.value) return nothing;
		return html`
			<div id="layout-wrapper">
				${repeat(
					this.value,
					(column) => column.alias,
					(column) => this.#renderField(column),
				)}
			</div>
			<umb-input-content-type-property
				document-types
				media-types
				@change=${this.#onAdd}></umb-input-content-type-property>
		`;
	}

	#renderField(column: UmbCollectionColumnConfiguration) {
		return html`
			<div class="layout-item">
				<uui-icon name="icon-navigation"></uui-icon>

				<uui-input
					required
					label="label"
					placeholder="Enter a label..."
					.value=${column.header ?? ''}
					@change=${(e: UUIInputEvent) => this.#onChangeLabel(e, column)}></uui-input>

				<div class="alias">
					<code>${column.alias}</code>
				</div>

				<uui-input
					disabled
					label="template"
					placeholder="Enter a name template..."
					.value=${column.nameTemplate ?? ''}></uui-input>

				<div class="actions">
					<uui-button
						label=${this.localize.term('general_remove')}
						look="secondary"
						@click=${() => this.#onRemove(column.alias)}></uui-button>
				</div>
			</div>
		`;
	}

	static styles = [
		UmbTextStyles,
		css`
			#layout-wrapper {
				display: flex;
				flex-direction: column;
				gap: 1px;
				margin-bottom: var(--uui-size-1);
			}

			.layout-item {
				background-color: var(--uui-color-surface-alt);
				display: flex;
				align-items: center;
				gap: var(--uui-size-6);
				padding: var(--uui-size-3) var(--uui-size-6);
			}

			.layout-item > uui-icon {
				flex: 0 0 var(--uui-size-6);
			}

			.layout-item > uui-input,
			.layout-item > .alias {
				flex: 1;
			}

			.layout-item > .actions {
				flex: 0 0 auto;
				display: flex;
				justify-content: flex-end;
			}
		`,
	];
}

export default UmbPropertyEditorUICollectionViewColumnConfigurationElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-collection-view-column-configuration': UmbPropertyEditorUICollectionViewColumnConfigurationElement;
	}
}
