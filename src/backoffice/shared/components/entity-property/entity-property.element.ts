import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html, PropertyValueMap } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { UmbWorkspacePropertyContext } from './workspace-property.context';
import { createExtensionElement } from '@umbraco-cms/extensions-api';
import { umbExtensionsRegistry } from '@umbraco-cms/extensions-registry';
import type { ManifestPropertyEditorUI, ManifestTypes } from '@umbraco-cms/models';

import '../../property-actions/shared/property-action-menu/property-action-menu.element';
import 'src/backoffice/shared/components/workspace/workspace-property-layout/workspace-property-layout.element';
import { UmbObserverController } from 'src/core/observable-api/observer.controller';
import { UmbLitElement } from '@umbraco-cms/element';

/**
 *  @element umb-entity-property
 *  @description - Component for displaying a entity property. The Element will render a Property Editor based on the Property Editor UI alias passed to the element.
 *  The element will also render all Property Actions related to the Property Editor.
 */

// TODO: get rid of the other mixins:
@customElement('umb-entity-property')
export class UmbEntityPropertyElement extends UmbLitElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
			}

			:host(:last-child) umb-workspace-property-layout {
				border-bottom:0;
			}

			p {
				color: var(--uui-color-text-alt);
			}

			#property-action-menu {
				opacity: 0;
			}

			#layout:focus-within #property-action-menu,
			#layout:hover #property-action-menu,
			#property-action-menu[open] {
				opacity: 1;
			}

			hr {
				border: 0;
				border-top: 1px solid var(--uui-color-border);
			}
		`,
	];

	/**
	 * Label. Name of the property
	 * @type {string}
	 * @attr
	 * @default ''
	 */
	@property({ type: String })
	public label = '';

	/**
	 * Description: render a description underneath the label.
	 * @type {string}
	 * @attr
	 * @default ''
	 */
	@property({ type: String })
	public description = '';

	/**
	 * Alias
	 * @public
	 * @type {string}
	 * @attr
	 * @default ''
	 */
	@property({ type: String })
	public alias = '';

	/**
	 * Property Editor UI Alias. Render the Property Editor UI registered for this alias.
	 * @public
	 * @type {string}
	 * @attr
	 * @default ''
	 */
	private _propertyEditorUIAlias = '';
	@property({ type: String, attribute: 'property-editor-ui-alias' })
	public get propertyEditorUIAlias(): string {
		return this._propertyEditorUIAlias;
	}
	public set propertyEditorUIAlias(value: string) {
		this._propertyEditorUIAlias = value;
		this._observePropertyEditorUI();
	}

	/**
	 * Property Editor UI Alias. Render the Property Editor UI registered for this alias.
	 * @public
	 * @type {string}
	 * @attr
	 * @default ''
	 */
	@property({ type: Object, attribute: false })
	public value?: any;

	/**
	 * Config. Configuration to pass to the Property Editor UI. This is also the configuration data stored on the Data Type.
	 * @public
	 * @type {string}
	 * @attr
	 * @default ''
	 */
	@property({ type: Object, attribute: false })
	public config?: any;

	// TODO: make interface for UMBPropertyEditorElement
	@state()
	private _element?: { value?: any; config?: any } & HTMLElement; // TODO: invent interface for propertyEditorUI.


	// TODO: How to get proper default value?
	private _propertyContext = new UmbWorkspacePropertyContext<string>("");

	private propertyEditorUIObserver?: UmbObserverController<ManifestTypes>;


	constructor() {
		super();

		this.provideContext('umbPropertyContext',  this._propertyContext);
		
		this._observePropertyEditorUI();
		this.addEventListener('property-editor-change', this._onPropertyEditorChange as any as EventListener);
	}

	private _observePropertyEditorUI() {
		this.propertyEditorUIObserver?.destroy();
		this.propertyEditorUIObserver = this.observe(umbExtensionsRegistry.getByTypeAndAlias('propertyEditorUI', this.propertyEditorUIAlias), (manifest) => {
			this._gotEditor(manifest);
		});
	}

	private _gotEditor(propertyEditorUIManifest?: ManifestPropertyEditorUI | null) {
		if (!propertyEditorUIManifest) {
			// TODO: if dataTypeKey didn't exist in store, we should do some nice UI.
			return;
		}

		createExtensionElement(propertyEditorUIManifest)
			.then((el) => {
				const oldValue = this._element;
				this._element = el;

				if (this._element) {
					this._element.value = this.value; // Be aware its duplicated code
					this._element.config = this.config; // Be aware its duplicated code
				}
				this.requestUpdate('element', oldValue);
			})
			.catch(() => {
				// TODO: loading JS failed so we should do some nice UI. (This does only happen if extension has a js prop, otherwise we concluded that no source was needed resolved the load.)
			});
	}

	private _onPropertyEditorChange = (e: CustomEvent) => {
		const target = e.composedPath()[0] as any;
		this.value = target.value;
		this.dispatchEvent(new CustomEvent('property-value-change', { bubbles: true, composed: true }));
		e.stopPropagation();
	};

	/** Lit does not currently handle dynamic tag names, therefor we are doing some manual rendering */
	// TODO: Refactor into a base class for dynamic-tag element? we will be using this a lot for extensions.
	// This could potentially hook into Lit and parse all properties defined in the specific class on to the dynamic-element. (see static elementProperties: PropertyDeclarationMap;)
	willUpdate(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
		super.willUpdate(changedProperties);

		if (changedProperties.has('value') && this._element) {
			this._element.value = this.value; // Be aware its duplicated code
		}

		if (changedProperties.has('config') && this._element) {
			this._element.config = this.config; // Be aware its duplicated code
		}
	}

	render() {
		return html`
			<umb-workspace-property-layout id="layout" label="${this.label}" description="${this.description}">
				${this._renderPropertyActionMenu()}
				<div slot="editor">${this._element}</div>
			</umb-workspace-property-layout>
		`;
	}

	private _renderPropertyActionMenu() {
		return html`${this.propertyEditorUIAlias
			? html`<umb-property-action-menu
					slot="property-action-menu"
					id="property-action-menu"
					.propertyEditorUIAlias="${this.propertyEditorUIAlias}"
					.value="${this.value}"></umb-property-action-menu>`
			: ''}`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-entity-property': UmbEntityPropertyElement;
	}
}
