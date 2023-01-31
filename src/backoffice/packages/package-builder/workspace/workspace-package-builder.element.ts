import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { UmbModalService, UMB_MODAL_SERVICE_CONTEXT_TOKEN } from '@umbraco-cms/modal';
import { UmbLitElement } from '@umbraco-cms/element';

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

			section {
				display: grid;
				padding: var(--uui-size-space-5);
			}

			section:not(:first-child) {
				margin-top: var(--uui-size-space-5);
				padding-top: var(--uui-size-space-5);
				border-top: 1px solid var(--uui-color-border);
			}
		`,
	];

	@property()
	entityKey?: string;

	@state()
	private _package?: Package;

	@state()
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
		this._package = {
			key: '2a0181ec-244b-4068-a1d7-2f95ed7e6da6',
			name: 'A created package',
		};
	}

	private _contentHandler() {
		const modalHandler = this._modalService?.contentPicker({ multiple: false });
		modalHandler?.onClose().then((saved) => {
			if (!saved) return;
			this._package!.contentNodeId = saved.selection[0];
			this.requestUpdate();
		});
	}

	private _mediaHandler() {
		const modalHandler = this._modalService?.mediaPicker();
		modalHandler?.onClose().then((saved) => {
			if (!saved) return;
			this._package!.mediaTypes = saved.selection;
			this.requestUpdate();
		});
	}

	render() {
		return html`<uui-button @click="${() => console.log(this._package)}"> Test button</uui-button>
			<umb-workspace-layout alias="Umb.Workspace.PackageBuilder">
				<div class="header" slot="header">
					<uui-input
						label="Name of the package"
						placeholder="Enter a name"
						.value="${this._package?.name || ''}"></uui-input>
				</div>

				<uui-box class="wrapper" headline="Package Content" style="--uui-box-default-padding:0;">
					<section>
						<uui-label>Content</uui-label>
						${this._package?.contentNodeId}
						<uui-button id="content" look="placeholder" label="Add content" @click="${this._contentHandler}">
							Add
						</uui-button>
						<uui-checkbox label="Include all child nodes for content"></uui-checkbox>
					</section>

					<section>
						<uui-label>Media</uui-label>
						${this._package?.mediaTypes?.map((media) => html`${media} <br />`)}
						<uui-button look="placeholder" label="Add media" @click="${this._mediaHandler}"> Add </uui-button>
						<uui-checkbox label="Include all child nodes for media"></uui-checkbox>
					</section>
					<section>
						<uui-label>Document Types</uui-label>
						<uui-checkbox label="dynamic"></uui-checkbox>
						<uui-checkbox label="dynamic"></uui-checkbox>
						<uui-checkbox label="dynamic"></uui-checkbox>
					</section>
					<section>
						<uui-label>Media Types</uui-label>
						<uui-checkbox label="dynamic"></uui-checkbox>
						<uui-checkbox label="dynamic"></uui-checkbox>
					</section>
				</uui-box>
				<div slot="actions">
					<uui-button color="" look="secondary" label="Download package">Download</uui-button>
					<uui-button color="positive" look="primary" label="Save changes to package">Save</uui-button>
				</div>
			</umb-workspace-layout> `;
	}
}

export default UmbWorkspacePackageBuilderElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-workspace-package-builder': UmbWorkspacePackageBuilderElement;
	}
}
