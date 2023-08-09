import { createExtensionElement } from '../create-extension-element.function.js';
import { UmbExtensionRegistry } from '../registry/extension.registry.js';
import { isManifestElementableType } from '../type-guards/is-manifest-elementable-type.function.js';
import { ManifestCondition, ManifestWithDynamicConditions } from '../types.js';
import { UmbBaseExtensionController } from './base-extension-controller.js';
import { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';

export class UmbExtensionElementController<
	ManifestType extends ManifestWithDynamicConditions = ManifestWithDynamicConditions,
	ControllerType extends UmbExtensionElementController<ManifestType> = any
> extends UmbBaseExtensionController<ManifestType, ControllerType> {
	_defaultElement?: string;
	_component?: HTMLElement;

	/**
	 * The component that is created for this extension.
	 * @readonly
	 * @type {(HTMLElement | undefined)}
	 */
	public get component() {
		return this._component;
	}

	/**
	 * The props that are passed to the component.
	 * @type {Record<string, any>}
	 * @memberof UmbElementExtensionController
	 * @example
	 * ```ts
	 * const controller = new UmbElementExtensionController(host, extensionRegistry, alias, onPermissionChanged);
	 * controller.props = { foo: 'bar' };
	 * ```
	 * Is equivalent to:
	 * ```ts
	 * controller.component.foo = 'bar';
	 * ```
	 */
	#properties?: Record<string, unknown>;
	get properties() {
		return this.#properties;
	}
	set properties(newVal) {
		this.#properties = newVal;
		// TODO: we could optimize this so we only re-set the changed props.
		this.#assignProperties();
	}

	constructor(
		host: UmbControllerHost,
		extensionRegistry: UmbExtensionRegistry<ManifestCondition>,
		alias: string,
		onPermissionChanged: (isPermitted: boolean, controller: ControllerType) => void,
		defaultElement?: string
	) {
		super(host, extensionRegistry, alias, onPermissionChanged);
		this._defaultElement = defaultElement;
		this._init();
	}

	#assignProperties = () => {
		if (!this._component || !this.#properties) return;

		// TODO: we could optimize this so we only re-set the updated props.
		Object.keys(this.#properties).forEach((key) => {
			(this._component as any)[key] = this.#properties![key];
		});
	};

	protected async _conditionsAreGood() {
		const manifest = this.manifest!; // In this case we are sure its not undefined.

		if (isManifestElementableType(manifest)) {
			const newComponent = await createExtensionElement(manifest);
			if (!this._positive) {
				// We are not positive anymore, so we will back out of this creation.
				return false;
			}
			this._component = newComponent;
		} else if (this._defaultElement) {
			this._component = document.createElement(this._defaultElement);
		} else {
			this._component = undefined;
			// TODO: Lets make an console.error in this case? we could not initialize any component based on this manifest.
		}
		if (this._component) {
			this.#assignProperties();
			(this._component as any).manifest = manifest;
			return true; // we will confirm we have a component and are still good to go.
		}

		return false; // we will reject the state, we have no component, we are not good to be shown.
	}

	protected async _conditionsAreBad() {
		// Destroy the element:
		if (this._component) {
			if ('destroy' in this._component) {
				(this._component as unknown as { destroy: () => void }).destroy();
			}
			this._component = undefined;
		}
	}
}
