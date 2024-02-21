import type { UmbMediaTypeWorkspaceContext } from '../../media-type-workspace.context.js';
import type { UmbInputMediaTypeElement } from '../../../components/input-media-type/input-media-type.element.js';
import { css, html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import type { UUIToggleElement } from '@umbraco-cms/backoffice/external/uui';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UMB_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/workspace';
import type { UmbWorkspaceViewElement } from '@umbraco-cms/backoffice/extension-registry';
import type { UmbContentTypeSortModel } from '@umbraco-cms/backoffice/content-type';

@customElement('umb-media-type-workspace-view-structure')
export class UmbMediaTypeWorkspaceViewStructureElement extends UmbLitElement implements UmbWorkspaceViewElement {
	#workspaceContext?: UmbMediaTypeWorkspaceContext;

	@state()
	private _allowedAsRoot?: boolean;

	@state()
	private _allowedContentTypeIDs?: Array<string>;

	constructor() {
		super();

		// TODO: Figure out if this is the best way to consume the context or if it can be strongly typed with an UmbContextToken
		this.consumeContext(UMB_WORKSPACE_CONTEXT, (mediaTypeContext) => {
			this.#workspaceContext = mediaTypeContext as UmbMediaTypeWorkspaceContext;
			this._observeMediaType();
		});
	}

	private _observeMediaType() {
		if (!this.#workspaceContext) return;
		this.observe(this.#workspaceContext.allowedAsRoot, (allowedAsRoot) => (this._allowedAsRoot = allowedAsRoot));
		this.observe(this.#workspaceContext.allowedContentTypes, (allowedContentTypes) => {
			const oldValue = this._allowedContentTypeIDs;
			this._allowedContentTypeIDs = allowedContentTypes
				?.map((x) => x.contentType.unique)
				.filter((x) => x !== undefined) as Array<string>;
			this.requestUpdate('_allowedContentTypeIDs', oldValue);
		});
	}

	render() {
		return html`
			<uui-box headline="Structure">
				<umb-property-layout alias="Root" label="Allow as Root">
					<div slot="description">${this.localize.term('contentTypeEditor_allowAsRootDescription')}</div>
					<div slot="editor">
						<uui-toggle
							label=${this.localize.term('contentTypeEditor_allowAsRootHeading')}
							?checked=${this._allowedAsRoot}
							@change=${(e: CustomEvent) => {
								this.#workspaceContext?.updateProperty('allowedAsRoot', (e.target as UUIToggleElement).checked);
							}}></uui-toggle>
					</div>
				</umb-property-layout>
				<umb-property-layout alias="ChildNodeType" label="Allowed child node types">
					<div slot="description">
						Allow content of the specified types to be created underneath content of this type.
					</div>
					<div slot="editor">
						<!-- TODO: maybe we want to somehow display the hierarchy, but not necessary in the same way as old backoffice? -->
						<umb-input-media-type
							.selectedIds=${this._allowedContentTypeIDs ?? []}
							@change="${(e: CustomEvent) => {
								const sortedContentTypesList: Array<UmbContentTypeSortModel> = (
									e.target as UmbInputMediaTypeElement
								).selectedIds.map((id, index) => ({
									contentType: { unique: id },
									sortOrder: index,
								}));
								this.#workspaceContext?.updateProperty('allowedContentTypes', sortedContentTypesList);
							}}">
						</umb-input-media-type>
					</div>
				</umb-property-layout>
			</uui-box>
			<uui-box headline="Presentation">
				<umb-property-layout alias="Root" label="Collection view">
					<div slot="description">Provides an overview of child content and hides it in the tree.</div>
					<div slot="editor"><uui-toggle label="Display children in a Collection view"></uui-toggle></div>
				</umb-property-layout>
			</uui-box>
		`;
	}

	static styles = [
		UmbTextStyles,
		css`
			:host {
				display: block;
				margin: var(--uui-size-layout-1);
				padding-bottom: var(--uui-size-layout-1); // To enforce some distance to the bottom of the scroll-container.
			}
			uui-box {
				margin-top: var(--uui-size-layout-1);
			}
			uui-label,
			umb-property-editor-ui-number {
				display: block;
			}

			// TODO: is this necessary?
			uui-toggle {
				display: flex;
			}
		`,
	];
}

export default UmbMediaTypeWorkspaceViewStructureElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-media-type-workspace-view-structure': UmbMediaTypeWorkspaceViewStructureElement;
	}
}
