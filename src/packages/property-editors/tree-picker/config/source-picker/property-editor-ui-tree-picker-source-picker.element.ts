import type { UmbInputTreePickerSourceElement, UmbTreePickerSource } from '@umbraco-cms/backoffice/components';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';
import { html, customElement, property } from '@umbraco-cms/backoffice/external/lit';
import {
	type UmbPropertyEditorConfigCollection,
	UmbPropertyValueChangeEvent,
} from '@umbraco-cms/backoffice/property-editor';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

/**
 * @element umb-property-editor-ui-tree-picker-source-picker
 */
@customElement('umb-property-editor-ui-tree-picker-source-picker')
export class UmbPropertyEditorUITreePickerSourcePickerElement
	extends UmbLitElement
	implements UmbPropertyEditorUiElement
{
	@property({ type: Object })
	value?: UmbTreePickerSource;

	@property({ type: Object, attribute: false })
	public config?: UmbPropertyEditorConfigCollection;

	#onChange(event: CustomEvent) {
		const target = event.target as UmbInputTreePickerSourceElement;

		this.value = {
			type: target.type,
			id: target.nodeId,
			dynamicRoot: target.dynamicRoot,
		};

		this.dispatchEvent(new UmbPropertyValueChangeEvent());
	}

	render() {
		return html`<umb-input-tree-picker-source
			@change=${this.#onChange}
			.type=${this.value?.type ?? 'content'}
			.nodeId=${this.value?.id}
			.dynamicRoot=${this.value?.dynamicRoot}></umb-input-tree-picker-source>`;
	}
}

export default UmbPropertyEditorUITreePickerSourcePickerElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-tree-picker-source-picker': UmbPropertyEditorUITreePickerSourcePickerElement;
	}
}
