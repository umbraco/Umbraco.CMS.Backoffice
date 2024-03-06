import { umbExtensionsRegistry } from './registry.js';
import { property, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { ManifestElementAndApi } from '@umbraco-cms/backoffice/extension-api';
import { UmbExtensionElementAndApiInitializer } from '@umbraco-cms/backoffice/extension-api';

// TODO: Eslint: allow abstract element class to end with "ElementBase" instead of "Element"
// eslint-disable-next-line local-rules/enforce-element-suffix-on-element-class-name
export abstract class UmbExtensionElementAndApiSlotElementBase<
	ManifestType extends ManifestElementAndApi,
> extends UmbLitElement {
	_alias?: string;
	@property({ type: String, reflect: true })
	get alias() {
		return this._alias;
	}
	set alias(newVal) {
		this._alias = newVal;
		this.#observeManifest();
	}

	@property({ type: Object, attribute: false })
	set props(newVal: Record<string, unknown> | undefined) {
		// TODO, compare changes since last time. only reset the ones that changed. This might be better done by the controller is self:
		this.#props = newVal;
		if (this.#extensionController) {
			this.#extensionController.elementProps = newVal;
		}
	}
	get props() {
		return this.#props;
	}

	#props?: Record<string, unknown> = {};

	#extensionController?: UmbExtensionElementAndApiInitializer<ManifestType>;

	@state()
	_element: ManifestType['ELEMENT_TYPE'] | undefined;

	abstract getExtensionType(): string;
	abstract getDefaultElementName(): string;

	#observeManifest() {
		if (!this._alias) return;

		this.#extensionController = new UmbExtensionElementAndApiInitializer<ManifestType>(
			this,
			umbExtensionsRegistry,
			this._alias,
			[this],
			this.#extensionChanged,
			this.getDefaultElementName(),
		);
		this.#extensionController.elementProps = this.#props;
	}

	#extensionChanged = (isPermitted: boolean, controller: UmbExtensionElementAndApiInitializer<ManifestType>) => {
		this._element = isPermitted ? controller.component : undefined;
		this.requestUpdate('_element');
	};

	protected render() {
		return this._element;
	}

	/**
	 * Disable the Shadow DOM for this element. This is needed because this is a wrapper element and should not stop the event propagation.
	 */
	protected createRenderRoot() {
		return this;
	}
}
