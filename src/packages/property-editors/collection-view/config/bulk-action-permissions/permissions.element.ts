import type { UmbCollectionBulkActionPermissions } from '../../../../core/collection/types.js';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';
import { html, customElement, property, css } from '@umbraco-cms/backoffice/external/lit';
import type { UUIBooleanInputEvent } from '@umbraco-cms/backoffice/external/uui';
import type { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';
import { UmbPropertyValueChangeEvent } from '@umbraco-cms/backoffice/property-editor';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

type BulkActionPermissionType =
	| 'allowBulkCopy'
	| 'allowBulkDelete'
	| 'allowBulkMove'
	| 'allowBulkPublish'
	| 'allowBulkUnpublish';

/**
 * @element umb-property-editor-ui-collection-view-permissions
 */
@customElement('umb-property-editor-ui-collection-view-permissions')
export class UmbPropertyEditorUICollectionViewPermissionsElement
	extends UmbLitElement
	implements UmbPropertyEditorUiElement
{
	private _value: UmbCollectionBulkActionPermissions = {
		allowBulkPublish: false,
		allowBulkUnpublish: false,
		allowBulkCopy: false,
		allowBulkDelete: false,
		allowBulkMove: false,
	};

	@property({ type: Object })
	public set value(obj: UmbCollectionBulkActionPermissions) {
		if (!obj) return;
		this._value = obj;
	}
	public get value() {
		return this._value;
	}

	@property({ type: Object, attribute: false })
	public config?: UmbPropertyEditorConfigCollection;

	#onChange(e: UUIBooleanInputEvent, type: BulkActionPermissionType) {
		switch (type) {
			case 'allowBulkPublish':
				this.value = { ...this.value, allowBulkPublish: e.target.checked };
				break;
			case 'allowBulkUnpublish':
				this.value = { ...this.value, allowBulkUnpublish: e.target.checked };
				break;
			case 'allowBulkMove':
				this.value = { ...this.value, allowBulkMove: e.target.checked };
				break;
			case 'allowBulkCopy':
				this.value = { ...this.value, allowBulkCopy: e.target.checked };
				break;
			case 'allowBulkDelete':
				this.value = { ...this.value, allowBulkDelete: e.target.checked };
				break;
		}

		this.dispatchEvent(new UmbPropertyValueChangeEvent());
	}

	render() {
		return html`<uui-toggle
				?checked=${this.value.allowBulkPublish}
				@change=${(e: UUIBooleanInputEvent) => this.#onChange(e, 'allowBulkPublish')}
				label="Allow bulk publish (content only)"></uui-toggle>
			<uui-toggle
				?checked=${this.value.allowBulkUnpublish}
				@change=${(e: UUIBooleanInputEvent) => this.#onChange(e, 'allowBulkUnpublish')}
				label="Allow bulk unpublish (content only)"></uui-toggle>
			<uui-toggle
				?checked=${this.value.allowBulkCopy}
				@change=${(e: UUIBooleanInputEvent) => this.#onChange(e, 'allowBulkCopy')}
				label="Allow bulk copy (content only)"></uui-toggle>
			<uui-toggle
				?checked=${this.value.allowBulkMove}
				@change=${(e: UUIBooleanInputEvent) => this.#onChange(e, 'allowBulkMove')}
				label="Allow bulk move"></uui-toggle>
			<uui-toggle
				?checked=${this.value.allowBulkDelete}
				@change=${(e: UUIBooleanInputEvent) => this.#onChange(e, 'allowBulkDelete')}
				label="Allow bulk delete"></uui-toggle>`;
	}

	static styles = [
		UmbTextStyles,
		css`
			:host {
				display: flex;
				flex-direction: column;
			}
		`,
	];
}

export default UmbPropertyEditorUICollectionViewPermissionsElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-collection-view-permissions': UmbPropertyEditorUICollectionViewPermissionsElement;
	}
}
