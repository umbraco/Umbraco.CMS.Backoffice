import { css, html, LitElement } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, property } from 'lit/decorators.js';
import { PropertyTypeResponseModelBaseModel } from '@umbraco-cms/backoffice/backend-api';

/**
 *  @element document-type-workspace-view-edit-property
 *  @description - Element for displaying a property in an workspace.
 *  @slot editor - Slot for rendering the Property Editor
 */
@customElement('document-type-workspace-view-edit-property')
export class UmbDocumentTypeWorkspacePropertyElement extends LitElement {
	/**
	 * Property, the data object for the property.
	 * @type {string}
	 * @attr
	 * @default ''
	 */
	@property({ type: Object })
	public property?: PropertyTypeResponseModelBaseModel;

	_firePartialUpdate(propertyName: string, value: string | number | boolean | null | undefined) {
		const partialObject = {} as any;
		partialObject[propertyName] = value;

		this.dispatchEvent(new CustomEvent('partial-property-update', { detail: partialObject }));
	}

	render() {
		// TODO: Only show alias on label if user has access to DocumentType within settings:
		return this.property
			? html`
					<div id="header">
						<uui-input
							.value=${this.property.name}
							@input=${(e: CustomEvent) => {
								if (e.target) this._firePartialUpdate('name', (e.target as HTMLInputElement).value);
							}}></uui-input>
						<uui-input-lock
							.value=${this.property.alias}
							@input=${(e: CustomEvent) => {
								if (e.target) this._firePartialUpdate('alias', (e.target as HTMLInputElement).value);
							}}></uui-input-lock>
						<slot name="property-action-menu"></slot>
						<p>
							<uui-textarea
								.value=${this.property.description}
								@input=${(e: CustomEvent) => {
									if (e.target) this._firePartialUpdate('description', (e.target as HTMLInputElement).value);
								}}></uui-textarea>
						</p>
					</div>
					<div></div>
			  `
			: '';
	}

	static styles = [
		UUITextStyles,
		css`
			:host {
				display: grid;
				grid-template-columns: 200px auto;
				column-gap: var(--uui-size-layout-2);
				border-bottom: 1px solid var(--uui-color-divider);
				padding: var(--uui-size-layout-1) 0;
				container-type: inline-size;
			}

			:host > div {
				grid-column: span 2;
			}

			@container (width > 600px) {
				:host(:not([orientation='vertical'])) > div {
					grid-column: span 1;
				}
			}

			:host(:last-of-type) {
				border-bottom: none;
			}

			:host-context(umb-variantable-property:first-of-type) {
				padding-top: 0;
			}

			p {
				margin-bottom: 0;
			}

			#header {
				position: sticky;
				top: var(--uui-size-space-4);
				height: min-content;
				z-index: 2;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'document-type-workspace-view-edit-property': UmbDocumentTypeWorkspacePropertyElement;
	}
}
