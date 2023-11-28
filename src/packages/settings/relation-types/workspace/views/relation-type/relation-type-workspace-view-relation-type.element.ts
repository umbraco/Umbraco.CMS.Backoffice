import { UMB_RELATION_TYPE_WORKSPACE_CONTEXT } from '../../relation-type-workspace.context.js';
import {
	UUIBooleanInputEvent,
	UUIRadioGroupElement,
	UUIRadioGroupEvent,
	UUIToggleElement,
} from '@umbraco-cms/backoffice/external/uui';
import { css, html, customElement, state, ifDefined } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import type { RelationTypeResponseModel } from '@umbraco-cms/backoffice/backend-api';
import { UmbWorkspaceViewElement } from '@umbraco-cms/backoffice/extension-registry';

@customElement('umb-relation-type-workspace-view-relation-type')
export class UmbRelationTypeWorkspaceViewRelationTypeElement extends UmbLitElement implements UmbWorkspaceViewElement {
	@state()
	private _relationType?: RelationTypeResponseModel;

	#workspaceContext?: typeof UMB_RELATION_TYPE_WORKSPACE_CONTEXT.TYPE;

	constructor() {
		super();

		this.consumeContext(UMB_RELATION_TYPE_WORKSPACE_CONTEXT, (instance) => {
			this.#workspaceContext = instance;
			this._observeRelationType();
		});
	}

	private _observeRelationType() {
		if (!this.#workspaceContext) {
			return;
		}

		this.observe(this.#workspaceContext.data, (relationType) => {
			if (!relationType) return;

			this._relationType = relationType;
		});
	}

	#handleDirectionChange(event: UUIRadioGroupEvent) {
		const target = event.target as UUIRadioGroupElement;
		const value = target.value === 'true';
		this.#workspaceContext?.update('isBidirectional', value);
	}

	#handleIsDependencyChange(event: UUIBooleanInputEvent) {
		const target = event.target as UUIToggleElement;
		const value = target.checked;
		this.#workspaceContext?.update('isDependency', value);
	}

	render() {
		return html`
			<uui-box>
				<umb-workspace-property-layout label="Direction">
					<uui-radio-group
						value=${ifDefined(this._relationType?.isBidirectional)}
						@change=${this.#handleDirectionChange}
						slot="editor">
						<uui-radio label="Parent to child" value="false"></uui-radio>
						<uui-radio label="Bidirectional" value="true"></uui-radio>
					</uui-radio-group>
				</umb-workspace-property-layout>
				<umb-workspace-property-layout label="Parent">${this.#renderParentProperty()}</umb-workspace-property-layout>
				<umb-workspace-property-layout label="Child"> ${this.#renderChildProperty()} </umb-workspace-property-layout>
				<umb-workspace-property-layout label="Is dependency">
					<uui-toggle
						slot="editor"
						@change=${this.#handleIsDependencyChange}
						.checked=${this._relationType?.isDependency ?? false}></uui-toggle>
				</umb-workspace-property-layout>
			</uui-box>
		`;
	}

	#renderParentProperty() {
		if (this._relationType?.id) return html`<div slot="editor">${this._relationType.parentObjectTypeName}</div>`;

		return html`<uui-select slot="editor"></uui-select>`;
	}

	#renderChildProperty() {
		if (this._relationType?.id) return html`<div slot="editor">${this._relationType.parentObjectTypeName}</div>`;

		return html`<uui-select slot="editor"></uui-select>`;
	}

	static styles = [
		css`
			:host {
				display: block;
				margin: var(--uui-size-layout-1);
			}
		`,
	];
}

export default UmbRelationTypeWorkspaceViewRelationTypeElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-relation-type-workspace-view-relation-type': UmbRelationTypeWorkspaceViewRelationTypeElement;
	}
}
