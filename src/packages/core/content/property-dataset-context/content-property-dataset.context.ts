import type { UmbContentWorkspaceContext } from '../workspace/index.js';
import type { UmbContentDetailModel } from '../types.js';
import type { UmbNameablePropertyDatasetContext, UmbPropertyDatasetContext } from '@umbraco-cms/backoffice/property';
import { UMB_PROPERTY_DATASET_CONTEXT } from '@umbraco-cms/backoffice/property';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';
import { type Observable, map } from '@umbraco-cms/backoffice/external/rxjs';
import { UmbBooleanState, UmbObjectState } from '@umbraco-cms/backoffice/observable-api';
import type { UmbEntityVariantModel } from '@umbraco-cms/backoffice/variant';
import { UmbVariantId } from '@umbraco-cms/backoffice/variant';
import type { UmbContentTypeModel, UmbPropertyTypeModel } from '@umbraco-cms/backoffice/content-type';
import type { UmbWorkspaceUniqueType } from '@umbraco-cms/backoffice/workspace';

export class UmbContentPropertyDatasetContext<
		ContentModel extends UmbContentDetailModel = UmbContentDetailModel,
		ContentTypeModel extends UmbContentTypeModel = UmbContentTypeModel,
		VariantModelType extends UmbEntityVariantModel = UmbEntityVariantModel,
	>
	extends UmbContextBase<UmbPropertyDatasetContext>
	implements UmbPropertyDatasetContext, UmbNameablePropertyDatasetContext
{
	#workspace: UmbContentWorkspaceContext<ContentModel, ContentTypeModel, VariantModelType>;
	#variantId: UmbVariantId;
	public getVariantId() {
		return this.#variantId;
	}

	#currentVariant = new UmbObjectState<UmbEntityVariantModel | undefined>(undefined);
	currentVariant = this.#currentVariant.asObservable();

	name = this.#currentVariant.asObservablePart((x) => x?.name);
	culture = this.#currentVariant.asObservablePart((x) => x?.culture);
	segment = this.#currentVariant.asObservablePart((x) => x?.segment);

	#readOnly = new UmbBooleanState(false);
	public readOnly = this.#readOnly.asObservable();

	getEntityType(): string {
		return this.#workspace.getEntityType();
	}
	getUnique(): UmbWorkspaceUniqueType | undefined {
		return this.#workspace.getUnique();
	}
	getName(): string | undefined {
		return this.#workspace.getName(this.#variantId);
	}
	setName(name: string) {
		this.#workspace.setName(name, this.#variantId);
	}
	getVariantInfo() {
		return this.#workspace.getVariant(this.#variantId);
	}

	getReadOnly() {
		return this.#readOnly.getValue();
	}

	constructor(
		host: UmbControllerHost,
		workspace: UmbContentWorkspaceContext<ContentModel, ContentTypeModel, VariantModelType>,
		variantId?: UmbVariantId,
	) {
		// The controller alias, is a very generic name cause we want only one of these for this controller host.
		super(host, UMB_PROPERTY_DATASET_CONTEXT);
		this.#workspace = workspace;
		this.#variantId = variantId ?? UmbVariantId.CreateInvariant();

		this.observe(
			this.#workspace.variantById(this.#variantId),
			async (variantInfo) => {
				if (!variantInfo) return;
				this.#currentVariant.setValue(variantInfo);
			},
			'_observeActiveVariant',
		);

		this.observe(
			this.#workspace.readOnlyState.states,
			(states) => {
				const isReadOnly = states.some((state) => state.variantId.equal(this.#variantId));
				this.#readOnly.setValue(isReadOnly);
			},
			'umbObserveReadOnlyStates',
		);
	}

	#createPropertyVariantId(property: UmbPropertyTypeModel) {
		return UmbVariantId.Create({
			culture: property.variesByCulture ? this.#variantId.culture : null,
			segment: property.variesBySegment ? this.#variantId.segment : null,
		});
	}

	/**
	 * @function propertyVariantId
	 * @param {string} propertyAlias
	 * @returns {Promise<Observable<UmbVariantId | undefined> | undefined>}
	 * @description Get an Observable for the variant id of this property.
	 */
	async propertyVariantId(propertyAlias: string) {
		return (await this.#workspace.structure.propertyStructureByAlias(propertyAlias)).pipe(
			map((property) => (property ? this.#createPropertyVariantId(property) : undefined)),
		);
	}

	/**
	 * @function propertyValueByAlias
	 * @param {string} propertyAlias
	 * @returns {Promise<Observable<ReturnType | undefined> | undefined>}
	 * @description Get an Observable for the value of this property.
	 */
	async propertyValueByAlias<ReturnType = unknown>(
		propertyAlias: string,
	): Promise<Observable<ReturnType | undefined> | undefined> {
		await this.#workspace.isLoaded();
		const structure = await this.#workspace.structure.getPropertyStructureByAlias(propertyAlias);
		if (structure) {
			return this.#workspace.propertyValueByAlias<ReturnType>(propertyAlias, this.#createPropertyVariantId(structure));
		}
		return;
	}

	// TODO: Refactor: Not used currently, but should investigate if we can implement this, to spare some energy.
	async propertyValueByAliasAndVariantId<ReturnType = unknown>(
		propertyAlias: string,
		propertyVariantId: UmbVariantId,
	): Promise<Observable<ReturnType | undefined> | undefined> {
		return this.#workspace.propertyValueByAlias<ReturnType>(propertyAlias, propertyVariantId);
	}

	/**
	 * @function setPropertyValueByVariant
	 * @param {string} propertyAlias
	 * @param {unknown} value - value can be a promise resolving into the actual value or the raw value it self.
	 * @param {UmbVariantId} propertyVariantId - The variant id for the value to be set for.
	 * @returns {Promise<unknown>}
	 * @description Get the value of this property.
	 */
	setPropertyValueByVariant(propertyAlias: string, value: unknown, propertyVariantId: UmbVariantId): Promise<void> {
		return this.#workspace.setPropertyValue(propertyAlias, value, propertyVariantId);
	}

	/**
	 * @function setPropertyValue
	 * @param {string} propertyAlias
	 * @param {PromiseLike<unknown>} value - value can be a promise resolving into the actual value or the raw value it self.
	 * @returns {Promise<void>}
	 * @description Set the value of this property.
	 */
	async setPropertyValue(propertyAlias: string, value: PromiseLike<unknown>) {
		this.#workspace.initiatePropertyValueChange();
		// This is not reacting to if the property variant settings changes while running.
		const property = await this.#workspace.structure.getPropertyStructureByAlias(propertyAlias);
		if (property) {
			const variantId = this.#createPropertyVariantId(property);

			// This is not reacting to if the property variant settings changes while running.
			this.#workspace.setPropertyValue(propertyAlias, await value, variantId);
		}
		this.#workspace.finishPropertyValueChange();
	}
}
