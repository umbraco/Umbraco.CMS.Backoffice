import { html, customElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import type { StartNode } from '@umbraco-cms/backoffice/components';
import type { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';
import type { UmbInputTreeElement } from '@umbraco-cms/backoffice/tree';
import type { UmbTreePickerSource } from '@umbraco-cms/backoffice/components';

/**
 * @element umb-property-editor-ui-tree-picker
 */

@customElement('umb-property-editor-ui-tree-picker')
export class UmbPropertyEditorUITreePickerElement extends UmbLitElement implements UmbPropertyEditorUiElement {
	@property()
	value = '';

	@state()
	type?: UmbTreePickerSource['type'];

	@state()
	startNodeId?: string | null;

	@state()
	min = 0;

	@state()
	max = 0;

	@state()
	filter?: string | null;

	@state()
	showOpenButton?: boolean;

	@state()
	ignoreUserStartNodes?: boolean;

	@property({ attribute: false })
	public set config(config: UmbPropertyEditorConfigCollection | undefined) {
		const startNode: UmbTreePickerSource | undefined = config?.getValueByAlias('startNode');
		if (startNode) {
			this.type = startNode.type;
			this.startNodeId = startNode.id;
		}

		this.min = config?.getValueByAlias('minNumber') || 0;
		this.max = config?.getValueByAlias('maxNumber') || 0;

		this.filter = config?.getValueByAlias('filter');
		this.showOpenButton = config?.getValueByAlias('showOpenButton');
		this.ignoreUserStartNodes = config?.getValueByAlias('ignoreUserStartNodes');
	}

	#onChange(e: CustomEvent) {
		this.value = (e.target as UmbInputTreeElement).value as string;
		this.dispatchEvent(new CustomEvent('property-value-change'));
	}

	render() {
		return html`<umb-input-tree
			.value=${this.value}
			.type=${this.type}
			.startNodeId=${this.startNodeId ?? ''}
			.min=${this.min}
			.max=${this.max}
			.filter=${this.filter ?? ''}
			?showOpenButton=${this.showOpenButton}
			?ignoreUserStartNodes=${this.ignoreUserStartNodes}
			@change=${this.#onChange}></umb-input-tree>`;
	}
	static styles = [UmbTextStyles];
}

export default UmbPropertyEditorUITreePickerElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-tree-picker': UmbPropertyEditorUITreePickerElement;
	}
}
