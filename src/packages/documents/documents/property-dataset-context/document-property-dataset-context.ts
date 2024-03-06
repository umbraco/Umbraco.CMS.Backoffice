import type { UmbDocumentWorkspaceContext } from '../workspace/index.js';
import type { UmbNameablePropertyDatasetContext, UmbPropertyDatasetContext } from '@umbraco-cms/backoffice/property';
import { UMB_PROPERTY_DATASET_CONTEXT } from '@umbraco-cms/backoffice/property';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';
import { type Observable, map } from '@umbraco-cms/backoffice/external/rxjs';
import { UmbObjectState } from '@umbraco-cms/backoffice/observable-api';
import type { UmbVariantModel } from '@umbraco-cms/backoffice/variant';
import { UmbVariantId } from '@umbraco-cms/backoffice/variant';
import type { UmbPropertyTypeModel } from '@umbraco-cms/backoffice/content-type';

// TODO: This code can be split into a UmbContentTypePropertyDatasetContext, leaving just the publishing state and methods to this class.
export class UmbDocumentPropertyDataContext
	extends UmbContextBase<UmbPropertyDatasetContext>
	implements UmbPropertyDatasetContext, UmbNameablePropertyDatasetContext
{
	#workspace: UmbDocumentWorkspaceContext;
	#variantId: UmbVariantId;
	public getVariantId() {
		return this.#variantId;
	}

	#currentVariant = new UmbObjectState<UmbVariantModel | undefined>(undefined);
	currentVariant = this.#currentVariant.asObservable();

	name = this.#currentVariant.asObservablePart((x) => x?.name);
	culture = this.#currentVariant.asObservablePart((x) => x?.culture);
	segment = this.#currentVariant.asObservablePart((x) => x?.segment);

	// TODO: Refactor: Make a properties observable. (with such I think i mean a property value object array.. array with object with properties, alias, value, culture and segment)
	// TO make such happen I think we need to maintain all properties and their value of this object.
	// This will actually make it simpler if multiple are watching the same property.
	// But it will also mean that we wil watch all properties and their structure, for variantID, all the time for all of the properties.

	getEntityType(): string {
		return this.#workspace.getEntityType();
	}
	getUnique(): string | undefined {
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

	constructor(host: UmbControllerHost, workspace: UmbDocumentWorkspaceContext, variantId?: UmbVariantId) {
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
	}

	#createPropertyVariantId(property: UmbPropertyTypeModel) {
		return UmbVariantId.Create({
			culture: property.variesByCulture ? this.#variantId.culture : null,
			segment: property.variesBySegment ? this.#variantId.segment : null,
		});
	}

	/**
	 * TODO: Write proper JSDocs here.
	 * Ideally do not use these methods, its better to communicate directly with the workspace, but if you do not know the property variant id, then this will figure it out for you. So good for externals to set or get values of a property.
	 */
	async propertyVariantId(propertyAlias: string) {
		return (await this.#workspace.structure.propertyStructureByAlias(propertyAlias)).pipe(
			map((property) => (property ? this.#createPropertyVariantId(property) : undefined)),
		);
	}

	/**
	 * TODO: Write proper JSDocs here.
	 * Ideally do not use this method, its better to communicate directly with the workspace, but if you do not know the property variant id, then this will figure it out for you. So good for externals to set or get values of a property.
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
	async propertyValueByAliasAndCulture<ReturnType = unknown>(
		propertyAlias: string,
		propertyVariantId: UmbVariantId,
	): Promise<Observable<ReturnType | undefined> | undefined> {
		return this.#workspace.propertyValueByAlias<ReturnType>(propertyAlias, propertyVariantId);
	}

	/**
	 * TODO: Write proper JSDocs here.
	 * Ideally do not use these methods, its better to communicate directly with the workspace, but if you do not know the property variant id, then this will figure it out for you. So good for externals to set or get values of a property.
	 */
	async setPropertyValue(propertyAlias: string, value: unknown) {
		// This is not reacting to if the property variant settings changes while running.
		const property = await this.#workspace.structure.getPropertyStructureByAlias(propertyAlias);
		if (property) {
			const variantId = this.#createPropertyVariantId(property);

			// This is not reacting to if the property variant settings changes while running.
			this.#workspace.setPropertyValue(propertyAlias, value, variantId);
		}
	}
}
