import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { UmbModalService, UMB_MODAL_SERVICE_CONTEXT_TOKEN } from '@umbraco-cms/modal';
import { UmbLitElement } from '@umbraco-cms/element';
import '../../../shared/property-editors/uis/document-picker/property-editor-ui-document-picker.element';
import '../../../shared/property-editors/uis/media-picker/property-editor-ui-media-picker.element';
import '../../../shared/property-editors/uis/checkbox-list/property-editor-ui-checkbox-list.element';

//temp
interface Package {
	key?: string;
	name?: string;
	packageGuid?: string;
	contentLoadChildNodes?: boolean;
	contentNodeId?: string;
	dataTypes?: string[];
	dictionaryItems?: string[];
	documentTypes?: string[];
	languages?: string[];
	macros?: string[];
	mediaLoadChildNodes?: boolean;
	mediaTypes?: string[];
	mediaUdis?: string[];
	scripts?: string[];
	stylesheet?: string[];
	templates?: string[];
}

@customElement('umb-workspace-package-builder')
export class UmbWorkspacePackageBuilderElement extends UmbLitElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
				height: 100%;
			}

			.header {
				margin: 0 var(--uui-size-layout-1);
			}

			uui-box {
				margin: var(--uui-size-layout-1);
			}

			uui-checkbox {
				display: block; //temp
			}
			uui-box uui-button {
				width: 100%; //temp
			}
		`,
	];

	@property()
	entityKey?: string;

	@state()
	private _package?: Package;

	private _modalService?: UmbModalService;

	constructor() {
		super();
		this.consumeContext(UMB_MODAL_SERVICE_CONTEXT_TOKEN, (_instance) => {
			this._modalService = _instance;
		});
	}

	connectedCallback(): void {
		super.connectedCallback();
		if (this.entityKey) this._getPackageData();
	}

	private _getPackageData() {
		//TODO
		this._package = {
			key: '2a0181ec-244b-4068-a1d7-2f95ed7e6da6',
			name: 'A created package',
		};
	}

	private _navigateBack() {
		window.history.pushState({}, '', '/section/packages/view/created');
	}

	render() {
		return html`
			<umb-workspace-layout alias="Umb.Workspace.PackageBuilder">
				${this._renderHeader()}
				<uui-box class="wrapper" headline="Package Content"> ${this._renderEditors()} </uui-box>
				${this._renderActions()}
			</umb-workspace-layout>
		`;
	}

	private _renderEditors() {
		return html`<umb-workspace-property-layout label="Content" description="">
				<div slot="editor">
					<umb-property-editor-ui-document-picker></umb-property-editor-ui-document-picker>
				</div>
			</umb-workspace-property-layout>
			<umb-workspace-property-layout label="Media" description="">
				<div slot="editor">
					<umb-property-editor-ui-media-picker></umb-property-editor-ui-media-picker>
				</div>
			</umb-workspace-property-layout>
			<umb-workspace-property-layout label="Document Types" description="">
				<div slot="editor">
					<umb-property-editor-ui-checkbox-list></umb-property-editor-ui-checkbox-list>
				</div>
			</umb-workspace-property-layout>`;
	}

	private _renderHeader() {
		return html`<div class="header" slot="header">
			<uui-button compact @click="${this._navigateBack}">
				<uui-icon name="umb:arrow-left"></uui-icon>
			</uui-button>
			<uui-input
				label="Name of the package"
				placeholder="Enter a name"
				.value="${this._package?.name || ''}"></uui-input>
		</div>`;
	}

	private _renderActions() {
		return html`<div slot="actions">
			<uui-button color="" look="secondary" label="Download package">Download</uui-button>
			<uui-button color="positive" look="primary" label="Save changes to package">Save</uui-button>
		</div>`;
	}
}

export default UmbWorkspacePackageBuilderElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-workspace-package-builder': UmbWorkspacePackageBuilderElement;
	}
}
