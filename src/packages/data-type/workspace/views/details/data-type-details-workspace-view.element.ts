import { UMB_DATA_TYPE_WORKSPACE_CONTEXT } from '../../data-type-workspace.context-token.js';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UMB_MODAL_MANAGER_CONTEXT, UMB_PROPERTY_EDITOR_UI_PICKER_MODAL } from '@umbraco-cms/backoffice/modal';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbWorkspaceViewElement } from '@umbraco-cms/backoffice/extension-registry';

@customElement('umb-data-type-details-workspace-view')
export class UmbDataTypeDetailsWorkspaceViewEditElement extends UmbLitElement implements UmbWorkspaceViewElement {
	@state()
	private _propertyEditorUiIcon?: string | null = null;

	@state()
	private _propertyEditorUiName?: string | null = null;

	@state()
	private _propertyEditorUiAlias?: string | null = null;

	@state()
	private _propertyEditorSchemaAlias?: string | null = null;

	private _workspaceContext?: typeof UMB_DATA_TYPE_WORKSPACE_CONTEXT.TYPE;

	constructor() {
		super();

		this.consumeContext(UMB_DATA_TYPE_WORKSPACE_CONTEXT, (_instance) => {
			this._workspaceContext = _instance;
			this._observeDataType();
		});
	}

	private _observeDataType() {
		if (!this._workspaceContext) {
			return;
		}

		this.observe(this._workspaceContext.propertyEditorUiAlias, (value) => {
			this._propertyEditorUiAlias = value;
		});

		this.observe(this._workspaceContext.propertyEditorSchemaAlias, (value) => {
			this._propertyEditorSchemaAlias = value;
		});

		this.observe(this._workspaceContext.propertyEditorUiName, (value) => {
			this._propertyEditorUiName = value;
		});

		this.observe(this._workspaceContext.propertyEditorUiIcon, (value) => {
			this._propertyEditorUiIcon = value;
		});
	}

	async #openPropertyEditorUIPicker() {
		const modalManager = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
		const value = await modalManager
			.open(this, UMB_PROPERTY_EDITOR_UI_PICKER_MODAL, {
				value: {
					selection: this._propertyEditorUiAlias ? [this._propertyEditorUiAlias] : [],
				},
			})
			.onSubmit()
			.catch(() => undefined);

		this._workspaceContext?.setPropertyEditorUiAlias(value?.selection[0]);
	}

	render() {
		return html`
			<uui-box> ${this.#renderPropertyEditorReference()} </uui-box>
			${this.#renderPropertyEditorConfig()} </uui-box>
		`;
	}

	#renderPropertyEditorReference() {
		return html`
			<umb-property-layout label="Property Editor" description="Select a property editor">
				${this._propertyEditorUiAlias && this._propertyEditorSchemaAlias
					? html`
							<umb-ref-property-editor-ui
								slot="editor"
								name=${this._propertyEditorUiName ?? ''}
								alias=${this._propertyEditorUiAlias}
								property-editor-schema-alias=${this._propertyEditorSchemaAlias}
								standalone>
								${this._propertyEditorUiIcon
									? html` <umb-icon name="${this._propertyEditorUiIcon}" slot="icon"></umb-icon> `
									: ''}
								<uui-action-bar slot="actions">
									<uui-button label="Change" @click=${this.#openPropertyEditorUIPicker}></uui-button>
								</uui-action-bar>
							</umb-ref-property-editor-ui>
						`
					: html`
							<uui-button
								slot="editor"
								label="Select Property Editor"
								look="placeholder"
								color="default"
								@click=${this.#openPropertyEditorUIPicker}></uui-button>
						`}
			</umb-property-layout>
		`;
	}

	#renderPropertyEditorConfig() {
		return html`<uui-box headline="Settings">
			<umb-property-editor-config></umb-property-editor-config>
		</uui-box> `;
	}

	static styles = [
		UmbTextStyles,
		css`
			:host {
				display: block;
				margin: var(--uui-size-layout-1);
				padding-bottom: var(--uui-size-layout-1);
			}

			uui-box {
				margin-top: var(--uui-size-layout-1);
			}
		`,
	];
}

export default UmbDataTypeDetailsWorkspaceViewEditElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-data-type-details-workspace-view': UmbDataTypeDetailsWorkspaceViewEditElement;
	}
}
