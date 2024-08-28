import { nothing, property, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbExtensionsApiInitializer } from '@umbraco-cms/backoffice/extension-api';
import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { ManifestUfmFilter } from '@umbraco-cms/backoffice/extension-registry';
import type { UmbExtensionApiInitializer } from '@umbraco-cms/backoffice/extension-api';

// eslint-disable-next-line local-rules/enforce-element-suffix-on-element-class-name
export abstract class UmbUfmElementBase extends UmbLitElement {
	#filterFuncArgs?: Array<{ key: string; args: Array<string> }>;
	#functions?: Record<string, (...args: Array<unknown>) => string>;

	@property()
	public set filters(value: string | undefined) {
		this.#filters = value;

		this.#filterFuncArgs = value
			?.split('|')
			.filter((item) => item)
			.map((item) => {
				const [key, ...args] = item.split(':').map((x) => x.trim());
				return { key, args };
			});
	}
	public get filters(): string | undefined {
		return this.#filters;
	}
	#filters?: string;

	@state()
	value?: unknown;

	@state()
	private _initialized = false;

	constructor() {
		super();

		// TODO: [LK] Review if this could be initialized elsewhere (upwards, in a context),
		// as it's called mulitple times, and often not all the filters are loaded.
		new UmbExtensionsApiInitializer(this, umbExtensionsRegistry, 'ufmFilter', [], undefined, (controllers) => {
			this.#functions = Object.fromEntries(
				controllers
					.map((controller) => {
						const ctrl = controller as unknown as UmbExtensionApiInitializer<ManifestUfmFilter>;
						if (!ctrl.manifest || !ctrl.api) return [];
						return [ctrl.manifest.meta.alias, ctrl.api.filter];
					})
					.filter((x) => x),
			);

			this._initialized = true;
		});
	}

	override render() {
		if (!this._initialized) return nothing;
		let values = Array.isArray(this.value) ? this.value : [this.value];
		if (this.#functions && this.#filterFuncArgs) {
			for (const item of this.#filterFuncArgs) {
				const func = this.#functions[item.key];
				if (func) {
					values = values.map((value) => func(value, ...item.args));
				}
			}
		}

		return values.join(', ');
	}
}
