import type { UmbPropertyValueData } from '../types/property-value-data.type.js';
import { UMB_PROPERTY_DATASET_CONTEXT } from './property-dataset-context.token.js';
import type { UmbPropertyDatasetContext } from './property-dataset-context.interface.js';
import type { UmbNameablePropertyDatasetContext } from './nameable-property-dataset-context.interface.js';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';
import { UmbArrayState, UmbStringState } from '@umbraco-cms/backoffice/observable-api';
import { UmbVariantId } from '@umbraco-cms/backoffice/variant';

/**
 * A base property dataset context implementation.
 * @class UmbPropertyDatasetContextBase
 * @extends {UmbContextBase}
 */
export class UmbPropertyDatasetContextBase
	extends UmbContextBase<typeof UMB_PROPERTY_DATASET_CONTEXT.TYPE>
	implements UmbPropertyDatasetContext, UmbNameablePropertyDatasetContext
{
	#name = new UmbStringState(undefined);
	name = this.#name.asObservable();

	#values = new UmbArrayState<UmbPropertyValueData>([], (x) => x.alias);
	public readonly values = this.#values.asObservable();
	private _entityType!: string;
	private _unique!: string;

	getEntityType() {
		return this._entityType;
	}
	getUnique() {
		return this._unique;
	}
	getName() {
		return this.#name.getValue();
	}
	setName(name: string | undefined) {
		this.#name.setValue(name);
	}
	getVariantId() {
		return UmbVariantId.CreateInvariant();
	}
	// variant id for a specific property?

	constructor(host: UmbControllerHost) {
		// The controller alias, is a very generic name cause we want only one of these for this controller host.
		super(host, UMB_PROPERTY_DATASET_CONTEXT);
	}

	/**
	 * TODO: Write proper JSDocs here.
	 */
	async propertyValueByAlias<ReturnType = unknown>(propertyAlias: string) {
		return this.#values.asObservablePart((values) => {
			const valueObj = values.find((x) => x.alias === propertyAlias);
			return valueObj ? (valueObj.value as ReturnType) : undefined;
		});
	}

	/**
	 * TODO: Write proper JSDocs here.
	 */
	setPropertyValue(alias: string, value: unknown) {
		this.#values.appendOne({ alias, value });
	}

	getValues() {
		return this.#values.getValue();
	}
	setValues(map: Array<UmbPropertyValueData>) {
		this.#values.setValue(map);
	}
}
