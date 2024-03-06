import { umbExtensionsRegistry } from '../../extension-registry/index.js';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { TemplateResult } from '@umbraco-cms/backoffice/external/lit';
import { css, repeat, customElement, property, state, html } from '@umbraco-cms/backoffice/external/lit';
import {
	type UmbExtensionElementInitializer,
	UmbExtensionsElementInitializer,
} from '@umbraco-cms/backoffice/extension-api';

/**
 * @element umb-extension-slot
 * @description A element which renderers the extensions of a given type or types.
 * @slot default - slot for inserting additional things into this slot.
 * @export
 * @class UmbExtensionSlot
 * @extends {UmbLitElement}
 */

// TODO: Fire change event.
// TODO: Make property that reveals the amount of displayed/permitted extensions.
@customElement('umb-extension-slot')
export class UmbExtensionSlotElement extends UmbLitElement {
	#attached = false;
	#extensionsController?: UmbExtensionsElementInitializer;

	@state()
	private _permitted: Array<UmbExtensionElementInitializer> = [];

	/**
	 * The type or types of extensions to render.
	 * @type {string | string[]}
	 * @memberof UmbExtensionSlot
	 * @example
	 * <umb-extension-slot type="my-extension-type"></umb-extension-slot>
	 * or multiple:
	 * <umb-extension-slot .type=${['my-extension-type','another-extension-type']}></umb-extension-slot>
	 *
	 */
	@property({ type: String })
	public get type(): string | string[] | undefined {
		return this.#type;
	}
	public set type(value: string | string[] | undefined) {
		if (value === this.#type) return;
		this.#type = value;
		if (this.#attached) {
			this._observeExtensions();
		}
	}
	#type?: string | string[] | undefined;

	/**
	 * Filter method for extension manifests.
	 * This is an initial filter taking effect before conditions or overwrites, the extensions will still be filtered by the conditions defined in the manifest.
	 * @type {(manifest: any) => boolean}
	 * @memberof UmbExtensionSlot
	 * @example
	 * <umb-extension-slot type="my-extension-type" .filter=${(ext) => ext.meta.anyPropToFilter === 'foo'}></umb-extension-slot>
	 *
	 */
	@property({ type: Object, attribute: false })
	public get filter(): (manifest: any) => boolean {
		return this.#filter;
	}
	public set filter(value: (manifest: any) => boolean) {
		if (value === this.#filter) return;
		this.#filter = value;
		if (this.#attached) {
			this._observeExtensions();
		}
	}
	#filter: (manifest: any) => boolean = () => true;

	/**
	 * Properties to pass to the extensions elements.
	 * Notice: The individual manifest of the extension is parsed to each extension element no matter if this is set or not.
	 * @type {Record<string, any>}
	 * @memberof UmbExtensionSlot
	 * @example
	 * <umb-extension-slot type="my-extension-type" .props=${{foo: 'bar'}}></umb-extension-slot>
	 */
	@property({ type: Object, attribute: false })
	get props(): Record<string, unknown> | undefined {
		return this.#props;
	}
	set props(newVal: Record<string, unknown> | undefined) {
		// TODO, compare changes since last time. only reset the ones that changed. This might be better done by the controller is self:
		this.#props = newVal;
		if (this.#extensionsController) {
			this.#extensionsController.properties = newVal;
		}
	}
	#props?: Record<string, unknown> = {};

	@property({ type: String, attribute: 'default-element' })
	public defaultElement?: string;

	@property()
	public renderMethod?: (extension: UmbExtensionElementInitializer) => TemplateResult | HTMLElement | null | undefined;

	connectedCallback(): void {
		super.connectedCallback();
		this._observeExtensions();
		this.#attached = true;
	}

	private _observeExtensions(): void {
		this.#extensionsController?.destroy();
		if (this.#type) {
			this.#extensionsController = new UmbExtensionsElementInitializer(
				this,
				umbExtensionsRegistry,
				this.#type,
				this.filter,
				(extensionControllers) => {
					this._permitted = extensionControllers;
				},
				undefined, // We can leave the alias undefined as we destroy this our selfs.
				this.defaultElement,
			);
			this.#extensionsController.properties = this.#props;
		}
	}

	render() {
		return this._permitted.length > 0
			? repeat(
					this._permitted,
					(ext) => ext.alias,
					(ext) => (this.renderMethod ? this.renderMethod(ext) : ext.component),
			  )
			: html`<slot></slot>`;
	}

	static styles = css`
		:host {
			display: contents;
		}
	`;
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-extension-slot': UmbExtensionSlotElement;
	}
}
