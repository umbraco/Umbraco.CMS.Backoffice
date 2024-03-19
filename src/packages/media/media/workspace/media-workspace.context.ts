import { UmbMediaTypeDetailRepository } from '../../media-types/repository/detail/media-type-detail.repository.js';
import { UmbMediaPropertyDataContext } from '../property-dataset-context/media-property-dataset-context.js';
import { UMB_MEDIA_ENTITY_TYPE } from '../entity.js';
import { UmbMediaDetailRepository } from '../repository/index.js';
import type { UmbMediaDetailModel, UmbMediaVariantModel, UmbMediaVariantOptionModel } from '../types.js';
import { UMB_INVARIANT_CULTURE, UmbVariantId } from '@umbraco-cms/backoffice/variant';
import { UmbContentTypeStructureManager } from '@umbraco-cms/backoffice/content-type';
import type {
	UmbWorkspaceCollectionContextInterface,
	UmbVariantableWorkspaceContextInterface,
} from '@umbraco-cms/backoffice/workspace';
import { UmbEditableWorkspaceContextBase, UmbWorkspaceSplitViewManager } from '@umbraco-cms/backoffice/workspace';
import {
	appendToFrozenArray,
	jsonStringComparison,
	mergeObservables,
	partialUpdateFrozenArray,
	UmbArrayState,
	UmbObjectState,
} from '@umbraco-cms/backoffice/observable-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbLanguageCollectionRepository, type UmbLanguageDetailModel } from '@umbraco-cms/backoffice/language';
import { UMB_ACTION_EVENT_CONTEXT } from '@umbraco-cms/backoffice/action';
import { UmbReloadTreeItemChildrenRequestEntityActionEvent } from '@umbraco-cms/backoffice/tree';
import { UmbRequestReloadStructureForEntityEvent } from '@umbraco-cms/backoffice/event';
import type { UmbMediaTypeDetailModel } from '@umbraco-cms/backoffice/media-type';

type EntityType = UmbMediaDetailModel;
export class UmbMediaWorkspaceContext
	extends UmbEditableWorkspaceContextBase<EntityType>
	implements UmbVariantableWorkspaceContextInterface, UmbWorkspaceCollectionContextInterface<UmbMediaTypeDetailModel>
{
	//
	public readonly repository = new UmbMediaDetailRepository(this);

	#parent?: { entityType: string; unique: string | null };

	/**
	 * The media is the current state/draft version of the media.
	 */
	#persistedData = new UmbObjectState<EntityType | undefined>(undefined);
	#currentData = new UmbObjectState<EntityType | undefined>(undefined);
	#getDataPromise?: Promise<any>;
	// TODo: Optimize this so it uses either a App Language Context? [NL]
	#languageRepository = new UmbLanguageCollectionRepository(this);
	#languages = new UmbArrayState<UmbLanguageDetailModel>([], (x) => x.unique);
	public readonly languages = this.#languages.asObservable();

	public isLoaded() {
		return this.#getDataPromise;
	}

	readonly unique = this.#currentData.asObservablePart((data) => data?.unique);
	readonly contentTypeUnique = this.#currentData.asObservablePart((data) => data?.mediaType.unique);
	readonly contentTypeHasCollection = this.#currentData.asObservablePart((data) => !!data?.mediaType.collection);

	readonly variants = this.#currentData.asObservablePart((data) => data?.variants || []);

	readonly urls = this.#currentData.asObservablePart((data) => data?.urls || []);

	readonly structure = new UmbContentTypeStructureManager(this, new UmbMediaTypeDetailRepository(this));
	readonly variesByCulture = this.structure.ownerContentTypePart((x) => x?.variesByCulture);
	//#variesByCulture?: boolean;
	readonly variesBySegment = this.structure.ownerContentTypePart((x) => x?.variesBySegment);
	//#variesBySegment?: boolean;
	readonly varies = this.structure.ownerContentTypePart((x) =>
		x ? x.variesByCulture || x.variesBySegment : undefined,
	);
	#varies?: boolean;

	readonly splitView = new UmbWorkspaceSplitViewManager();

	readonly variantOptions = mergeObservables(
		[this.varies, this.variants, this.languages],
		([varies, variants, languages]) => {
			// TODO: When including segments, when be aware about the case of segment varying when not culture varying. [NL]
			if (varies === true) {
				return languages.map((language) => {
					return {
						variant: variants.find((x) => x.culture === language.unique),
						language,
						// TODO: When including segments, this object should be updated to include a object for the segment. [NL]
						// TODO: When including segments, the unique should be updated to include the segment as well. [NL]
						unique: language.unique, // This must be a variantId string!
						culture: language.unique,
						segment: null,
					} as UmbMediaVariantOptionModel;
				});
			} else if (varies === false) {
				return [
					{
						variant: variants.find((x) => x.culture === null),
						language: languages.find((x) => x.isDefault),
						culture: null,
						segment: null,
						unique: UMB_INVARIANT_CULTURE, // This must be a variantId string!
					} as UmbMediaVariantOptionModel,
				];
			}
			return [] as Array<UmbMediaVariantOptionModel>;
		},
	);

	constructor(host: UmbControllerHost) {
		super(host, 'Umb.Workspace.Media');

		this.observe(this.contentTypeUnique, (unique) => this.structure.loadType(unique));
		this.observe(this.varies, (varies) => (this.#varies = varies));

		this.loadLanguages();
	}

	resetState() {
		super.resetState();
		this.#persistedData.setValue(undefined);
		this.#currentData.setValue(undefined);
	}

	async loadLanguages() {
		// TODO: If we don't end up having a Global Context for languages, then we should at least change this into using a asObservable which should be returned from the repository. [Nl]
		const { data } = await this.#languageRepository.requestCollection({});
		this.#languages.setValue(data?.items ?? []);
	}

	async load(unique: string) {
		this.resetState();
		this.#getDataPromise = this.repository.requestByUnique(unique);
		type GetDataType = Awaited<ReturnType<UmbMediaDetailRepository['requestByUnique']>>;
		const { data, asObservable } = (await this.#getDataPromise) as GetDataType;

		if (data) {
			this.setIsNew(false);
			this.#persistedData.update(data);
			this.#currentData.update(data);
		}

		this.observe(asObservable(), (entity) => this.#onStoreChange(entity), 'umbMediaStoreObserver');
	}

	#onStoreChange(entity: EntityType | undefined) {
		if (!entity) {
			//TODO: This solution is alright for now. But reconsider when we introduce signal-r
			history.pushState(null, '', 'section/media');
		}
	}

	async create(parent: { entityType: string; unique: string | null }, mediaTypeUnique: string) {
		this.resetState();
		this.#parent = parent;
		this.#getDataPromise = this.repository.createScaffold({ mediaType: { unique: mediaTypeUnique, collection: null } });
		const { data } = await this.#getDataPromise;
		if (!data) return undefined;

		this.setIsNew(true);
		this.#persistedData.setValue(data);
		this.#currentData.setValue(data);
		return data;
	}

	getCollectionAlias() {
		return 'Umb.Collection.Media';
	}

	getData() {
		return this.#currentData.getValue();
	}

	getUnique() {
		return this.getData()?.unique;
	}

	getEntityType() {
		return UMB_MEDIA_ENTITY_TYPE;
	}

	getContentTypeId() {
		return this.getData()?.mediaType.unique;
	}

	// TODO: Check if this is used:
	getVaries() {
		return this.#varies;
	}

	variantById(variantId: UmbVariantId) {
		return this.#currentData.asObservablePart((data) => data?.variants?.find((x) => variantId.compare(x)));
	}

	getVariant(variantId: UmbVariantId) {
		return this.#currentData.getValue()?.variants?.find((x) => variantId.compare(x));
	}

	getName(variantId?: UmbVariantId) {
		const variants = this.#currentData.getValue()?.variants;
		if (!variants) return;
		if (variantId) {
			return variants.find((x) => variantId.compare(x))?.name;
		} else {
			return variants[0]?.name;
		}
	}

	setName(name: string, variantId?: UmbVariantId) {
		// const oldVariants = this.#currentData.getValue()?.variants || [];
		// const variants = partialUpdateFrozenArray(
		// 	oldVariants,
		// 	{ name },
		// 	variantId ? (x) => variantId.compare(x) : () => true,
		// );
		// this.#currentData.update({ variants });

		this.#updateVariantData(variantId ?? UmbVariantId.CreateInvariant(), { name });
	}

	async propertyStructureById(propertyId: string) {
		return this.structure.propertyStructureById(propertyId);
	}

	async propertyValueByAlias<PropertyValueType = unknown>(propertyAlias: string, variantId?: UmbVariantId) {
		return this.#currentData.asObservablePart(
			(data) =>
				data?.values?.find((x) => x?.alias === propertyAlias && (variantId ? variantId.compare(x as any) : true))
					?.value as PropertyValueType,
		);
	}

	/**
	 * Get the current value of the property with the given alias and variantId.
	 * @param alias
	 * @param variantId
	 * @returns The value or undefined if not set or found.
	 */
	getPropertyValue<ReturnType = unknown>(alias: string, variantId?: UmbVariantId) {
		const currentData = this.#currentData.value;
		if (currentData) {
			const newDataSet = currentData.values?.find(
				(x) => x.alias === alias && (variantId ? variantId.compare(x as any) : true),
			);
			return newDataSet?.value as ReturnType;
		}
		return undefined;
	}
	async setPropertyValue<UmbMediaValueModel = unknown>(
		alias: string,
		value: UmbMediaValueModel,
		variantId?: UmbVariantId,
	) {
		if (!variantId) throw new Error('VariantId is missing');

		const entry = { ...variantId.toObject(), alias, value };
		const currentData = this.#currentData.value;
		if (currentData) {
			const values = appendToFrozenArray(
				currentData.values || [],
				entry,
				(x) => x.alias === alias && (variantId ? variantId.compare(x as any) : true),
			);
			this.#currentData.update({ values });

			// TODO: We should move this type of logic to the act of saving [NL]
			this.#updateVariantData(variantId);
		}
	}

	/* 	#calculateChangedVariants() {
		const persisted = this.#persistedData.getValue();
		const current = this.#currentData.getValue();
		if (!current) throw new Error('Current data is missing');

		const changedVariants = current?.variants.map((variant) => {
			const persistedVariant = persisted?.variants.find((x) => UmbVariantId.Create(variant).compare(x));
			return {
				culture: variant.culture,
				segment: variant.segment,
				equal: persistedVariant ? jsonStringComparison(variant, persistedVariant) : false,
			};
		});

		const changedProperties = current?.values.map((value) => {
			const persistedValues = persisted?.values.find((x) => UmbVariantId.Create(value).compare(x));
			return {
				culture: value.culture,
				segment: value.segment,
				equal: persistedValues ? jsonStringComparison(value, persistedValues) : false,
			};
		});

		// calculate the variantIds of those who either have a change in properties or in variants:
		return (
			changedVariants
				?.concat(changedProperties ?? [])
				.filter((x) => x.equal === false)
				.map((x) => new UmbVariantId(x.culture, x.segment)) ?? []
		);
	} */

	#updateVariantData(variantId: UmbVariantId, update?: Partial<UmbMediaVariantModel>) {
		const currentData = this.getData();
		if (!currentData) throw new Error('Data is missing');
		if (this.#varies === true) {
			// If variant Id is invariant, we don't to have the variant appended to our data.
			if (variantId.isInvariant()) return;
			const variant = currentData.variants.find((x) => variantId.compare(x));
			const newVariants = appendToFrozenArray(
				currentData.variants,
				{
					name: '',
					createDate: null,
					updateDate: null,
					...variantId.toObject(),
					...variant,
					...update,
				},
				(x) => variantId.compare(x),
			);
			this.#currentData.update({ variants: newVariants });
		} else if (this.#varies === false) {
			// TODO: Beware about segments, in this case we need to also consider segments, if its allowed to vary by segments.
			const invariantVariantId = UmbVariantId.CreateInvariant();
			const variant = currentData.variants.find((x) => invariantVariantId.compare(x));
			// Cause we are invariant, we will just overwrite all variants with this one:
			const newVariants = [
				{
					name: '',
					createDate: null,
					updateDate: null,
					...invariantVariantId.toObject(),
					...variant,
					...update,
				},
			];
			this.#currentData.update({ variants: newVariants });
		} else {
			throw new Error('Varies by culture is missing');
		}
	}

	async #createOrSave() {
		if (!this.#currentData.value?.unique) throw new Error('Unique is missing');

		if (this.getIsNew()) {
			if (!this.#parent) throw new Error('Parent is not set');
			const value = this.#currentData.value;

			if ((await this.repository.create(value, this.#parent.unique)).data !== undefined) {
				this.setIsNew(false);

				// TODO: this might not be the right place to alert the tree, but it works for now
				const eventContext = await this.getContext(UMB_ACTION_EVENT_CONTEXT);
				const event = new UmbReloadTreeItemChildrenRequestEntityActionEvent({
					entityType: this.#parent.entityType,
					unique: this.#parent.unique,
				});
				eventContext.dispatchEvent(event);
			}
		} else {
			await this.repository.save(this.#currentData.value);

			const actionEventContext = await this.getContext(UMB_ACTION_EVENT_CONTEXT);
			const event = new UmbRequestReloadStructureForEntityEvent({
				unique: this.getUnique()!,
				entityType: this.getEntityType(),
			});

			actionEventContext.dispatchEvent(event);
		}
	}

	async save() {
		const data = this.getData();
		if (!data) throw new Error('Data is missing');
		await this.#createOrSave();
		this.setIsNew(false);
		this.workspaceComplete(data);
	}

	async delete() {
		const id = this.getUnique();
		if (id) {
			await this.repository.delete(id);
		}
	}

	/*
	concept notes:

	public saveAndPreview() {

	}
	*/

	public createPropertyDatasetContext(host: UmbControllerHost, variantId: UmbVariantId) {
		return new UmbMediaPropertyDataContext(host, this, variantId);
	}

	public destroy(): void {
		this.#persistedData.destroy();
		this.#currentData.destroy();
		this.structure.destroy();
		super.destroy();
	}
}

export default UmbMediaWorkspaceContext;
