import type { UmbInputDocumentElement } from '../../../documents/documents/components/input-document/input-document.element.js';
import type { UmbInputMediaElement } from '../../../media/media/components/input-media/input-media.element.js';
import type { UmbInputLanguageElement } from '../../../language/components/input-language/input-language.element.js';
import type { UUIBooleanInputEvent, UUIInputElement, UUIInputEvent } from '@umbraco-cms/backoffice/external/uui';
import {
	css,
	html,
	nothing,
	customElement,
	property,
	query,
	state,
	ifDefined,
} from '@umbraco-cms/backoffice/external/lit';
// TODO: update to module imports when ready
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { PackageDefinitionResponseModel } from '@umbraco-cms/backoffice/external/backend-api';
import { PackageResource } from '@umbraco-cms/backoffice/external/backend-api';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';
import type { UmbNotificationContext } from '@umbraco-cms/backoffice/notification';
import { UMB_NOTIFICATION_CONTEXT } from '@umbraco-cms/backoffice/notification';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';

@customElement('umb-workspace-package-builder')
export class UmbWorkspacePackageBuilderElement extends UmbLitElement {
	@property()
	entityId?: string;

	@state()
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	private _package: PackageDefinitionResponseModel = {};

	@query('#package-name-input')
	private _packageNameInput!: UUIInputElement;

	private _notificationContext?: UmbNotificationContext;

	constructor() {
		super();
		this.consumeContext(UMB_NOTIFICATION_CONTEXT, (instance) => {
			this._notificationContext = instance;
		});
	}

	connectedCallback(): void {
		super.connectedCallback();
		if (this.entityId) this.#getPackageCreated();
	}

	async #getPackageCreated() {
		if (!this.entityId) return;
		const { data } = await tryExecuteAndNotify(this, PackageResource.getPackageCreatedById({ id: this.entityId }));
		if (!data) return;
		this._package = data as PackageDefinitionResponseModel;
	}

	async #download() {
		if (!this._package?.id) return;
		await tryExecuteAndNotify(this, PackageResource.getPackageCreatedByIdDownload({ id: this._package.id }));
	}

	#nameDefined() {
		const valid = this._packageNameInput.checkValidity();
		if (!valid) this._notificationContext?.peek('danger', { data: { message: 'Package missing a name' } });
		return valid;
	}

	async #save() {
		if (!this.#nameDefined()) return;
		const response = await tryExecuteAndNotify(
			this,
			PackageResource.postPackageCreated({ requestBody: this._package }),
		);
		if (!response.data || response.error) return;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		this._package = response.data as PackageDefinitionResponseModel;
		this.#navigateBack();
	}

	async #update() {
		if (!this.#nameDefined()) return;
		if (!this._package?.id) return;
		const response = await tryExecuteAndNotify(
			this,
			PackageResource.putPackageCreatedById({ id: this._package.id, requestBody: this._package }),
		);

		if (response.error) return;
		this.#navigateBack();
	}

	#navigateBack() {
		window.history.pushState({}, '', 'section/packages/view/created');
	}

	render() {
		return html`
			<umb-workspace-editor alias="Umb.Workspace.PackageBuilder">
				${this.#renderHeader()}
				<uui-box class="wrapper" headline="Package Content"> ${this.#renderEditors()} </uui-box>
				${this.#renderActions()}
			</umb-workspace-editor>
		`;
	}

	#renderHeader() {
		return html`<div class="header" slot="header">
			<uui-button compact @click="${this.#navigateBack}" label="Back to created package overview">
				<uui-icon name="icon-arrow-left"></uui-icon>
			</uui-button>
			<uui-input
				required
				id="package-name-input"
				label="Name of the package"
				placeholder="Enter a name"
				value="${ifDefined(this._package?.name)}"
				@change="${(e: UUIInputEvent) => (this._package.name = e.target.value as string)}"></uui-input>
		</div>`;
	}

	#renderActions() {
		return html`<div slot="actions">
			${this._package?.id
				? html`<uui-button @click="${this.#download}" color="" look="secondary" label="Download package">
						Download
					</uui-button>`
				: nothing}
			<uui-button
				@click="${this._package.id ? this.#update : this.#save}"
				color="positive"
				look="primary"
				label="Save changes to package">
				Save
			</uui-button>
		</div>`;
	}

	#renderEditors() {
		return html`<umb-property-layout label="Content" description="">
				${this.#renderContentSection()}
			</umb-property-layout>

			<umb-property-layout label="Media" description="">${this.#renderMediaSection()} </umb-property-layout>

			<umb-property-layout label="Document Types" description="">
				${this.#renderDocumentTypeSection()}
			</umb-property-layout>

			<umb-property-layout label="Media Types" description=""> ${this.#renderMediaTypeSection()} </umb-property-layout>

			<umb-property-layout label="Languages" description=""> ${this.#renderLanguageSection()} </umb-property-layout>

			<umb-property-layout label="Dictionary" description=""> ${this.#renderDictionarySection()} </umb-property-layout>

			<umb-property-layout label="Data Types" description=""> ${this.#renderDataTypeSection()} </umb-property-layout>

			<umb-property-layout label="Templates" description=""> ${this.#renderTemplateSection()} </umb-property-layout>

			<umb-property-layout label="Stylesheets" description="">
				${this.#renderStylesheetsSection()}
			</umb-property-layout>

			<umb-property-layout label="Scripts" description=""> ${this.#renderScriptsSection()} </umb-property-layout>

			<umb-property-layout label="Partial Views" description="">
				${this.#renderPartialViewSection()}
			</umb-property-layout>`;
	}

	#renderContentSection() {
		return html`
			<div slot="editor">
				<umb-input-document
					.value=${this._package.contentNodeId ?? ''}
					max="1"
					@change="${(e: CustomEvent) =>
						(this._package.contentNodeId = (e.target as UmbInputDocumentElement).selection[0])}">
				</umb-input-document>
				<uui-checkbox
					label="Include child nodes"
					.checked="${this._package.contentLoadChildNodes ?? false}"
					@change="${(e: UUIBooleanInputEvent) => (this._package.contentLoadChildNodes = e.target.checked)}">
					Include child nodes
				</uui-checkbox>
			</div>
		`;
	}

	#renderMediaSection() {
		return html`
			<div slot="editor">
				<umb-input-media
					.selection=${this._package.mediaIds ?? []}
					@change="${(e: CustomEvent) =>
						(this._package.mediaIds = (e.target as UmbInputMediaElement).selection)}"></umb-input-media>
				<uui-checkbox
					label="Include child nodes"
					.checked="${this._package.mediaLoadChildNodes ?? false}"
					@change="${(e: UUIBooleanInputEvent) => (this._package.mediaLoadChildNodes = e.target.checked)}">
					Include child nodes
				</uui-checkbox>
			</div>
		`;
	}

	#renderDocumentTypeSection() {
		return html`<div slot="editor">
			<umb-input-checkbox-list></umb-input-checkbox-list>
		</div>`;
	}

	#renderMediaTypeSection() {
		return html`<div slot="editor">
			<umb-input-checkbox-list></umb-input-checkbox-list>
		</div>`;
	}

	#renderLanguageSection() {
		return html`<div slot="editor">
			<umb-input-language
				.value="${this._package.languages?.join(',') ?? ''}"
				@change="${(e: CustomEvent) => {
					this._package.languages = (e.target as UmbInputLanguageElement).selection;
				}}"></umb-input-language>
		</div>`;
	}

	#renderDictionarySection() {
		return html`<div slot="editor">
			<umb-input-checkbox-list></umb-input-checkbox-list>
		</div>`;
	}

	#renderDataTypeSection() {
		return html`<div slot="editor">
			<umb-data-type-input></umb-data-type-input>
		</div>`;
	}

	#renderTemplateSection() {
		return html`<div slot="editor">
			<umb-input-checkbox-list></umb-input-checkbox-list>
		</div>`;
	}

	#renderStylesheetsSection() {
		return html`<div slot="editor">
			<umb-input-checkbox-list></umb-input-checkbox-list>
		</div>`;
	}

	#renderScriptsSection() {
		return html`<div slot="editor">
			<umb-input-checkbox-list></umb-input-checkbox-list>
		</div>`;
	}

	#renderPartialViewSection() {
		return html`<div slot="editor">
			<umb-input-checkbox-list></umb-input-checkbox-list>
		</div>`;
	}

	static styles = [
		UmbTextStyles,
		css`
			:host {
				display: block;
				height: 100%;
			}

			.header {
				margin: 0 var(--uui-size-layout-1);
				display: flex;
				gap: var(--uui-size-space-4);
			}

			uui-box {
				margin: var(--uui-size-layout-1);
			}

			uui-checkbox {
				margin-top: var(--uui-size-space-4);
			}
		`,
	];
}

export { UmbWorkspacePackageBuilderElement as element };

declare global {
	interface HTMLElementTagNameMap {
		'umb-workspace-package-builder': UmbWorkspacePackageBuilderElement;
	}
}
