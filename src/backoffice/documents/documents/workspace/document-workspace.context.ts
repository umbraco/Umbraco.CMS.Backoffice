import { UmbWorkspaceContext } from '../../../shared/components/workspace/workspace-context/workspace-context';
import { UmbDocumentRepository } from '../repository/document.repository';
import { UmbDocumentTypeRepository } from '../../document-types/repository/document-type.repository';
import { UmbWorkspaceVariableEntityContextInterface } from '../../../shared/components/workspace/workspace-context/workspace-variable-entity-context.interface';
import { UmbVariantId } from '../../../shared/variants/variant-id.class';
import { UmbWorkspacePropertyStructureManager } from '../../../shared/components/workspace/workspace-context/workspace-property-structure-manager.class';
import type { DocumentModel } from '@umbraco-cms/backend-api';
import { partialUpdateFrozenArray, ObjectState, ArrayState, UmbObserverController } from '@umbraco-cms/observable-api';
import { UmbControllerHostInterface } from '@umbraco-cms/controller';

// TODO: should this context be called DocumentDraft instead of workspace? or should the draft be part of this?

export type ActiveVariant = {
	index: number;
	culture: string | null;
	segment: string | null;
};
// TODO: Should we have a DocumentStructureContext and maybe even a DocumentDraftContext?

type EntityType = DocumentModel;
export class UmbDocumentWorkspaceContext
	extends UmbWorkspaceContext<UmbDocumentRepository>
	implements UmbWorkspaceVariableEntityContextInterface<EntityType | undefined>
{
	/**
	 * The document is the current stored version of the document.
	 * For now lets not share this publicly as it can become confusing.
	 * TODO: Use this to compare, for variants with changes.
	 */
	#document = new ObjectState<EntityType | undefined>(undefined);

	/**
	 * The document is the current state/draft version of the document.
	 */
	#draft = new ObjectState<EntityType | undefined>(undefined);
	unique = this.#draft.getObservablePart((data) => data?.key);
	documentTypeKey = this.#draft.getObservablePart((data) => data?.contentTypeKey);

	variants = this.#draft.getObservablePart((data) => data?.variants || []);
	urls = this.#draft.getObservablePart((data) => data?.urls || []);
	templateKey = this.#draft.getObservablePart((data) => data?.templateKey || null);

	#activeVariantsInfo = new ArrayState<ActiveVariant>([], (x) => x.index);
	activeVariantsInfo = this.#activeVariantsInfo.asObservable();

	readonly structure;

	constructor(host: UmbControllerHostInterface) {
		super(host, new UmbDocumentRepository(host));

		this.structure = new UmbWorkspacePropertyStructureManager(this.host, new UmbDocumentTypeRepository(this.host));

		new UmbObserverController(this.host, this.documentTypeKey, (key) => this.structure.loadType(key));
	}

	private _routeBase?: string;
	public getWorkspaceRoute(): string | undefined {
		return this._routeBase;
	}
	public setWorkspaceRoute(route: string | undefined) {
		this._routeBase = route;
	}

	async load(entityKey: string) {
		const { data } = await this.repository.requestByKey(entityKey);
		if (!data) return undefined;

		this.setIsNew(false);
		this.#document.next(data);
		this.#draft.next(data);
		return data || undefined;
	}

	async createScaffold(parentKey: string | null) {
		const { data } = await this.repository.createScaffold(parentKey);
		if (!data) return undefined;

		this.setIsNew(true);
		this.#document.next(data);
		this.#draft.next(data);
		return data || undefined;
	}

	getData() {
		return this.#draft.getValue() || {};
	}

	/*
	getUnique() {
		return this.#data.getKey();
	}
	*/

	getEntityKey() {
		return this.getData().key;
	}

	getEntityType() {
		return 'document';
	}

	setActiveVariant(index: number, culture: string | null, segment: string | null) {
		this.#activeVariantsInfo.appendOne({ index, culture, segment });
	}

	activeVariantsInfoByIndex(index: number) {
		return this.#activeVariantsInfo.getObservablePart((data) => data[index] || undefined);
	}

	getActiveVariantsInfo() {
		return this.#activeVariantsInfo.getValue();
	}

	closeSplitView() {
		// cause we currently only support two variants open, then we can just close index 1.
		this.#activeVariantsInfo.removeOne(1);
	}

	getVariant(variantId: UmbVariantId) {
		return this.#draft.getValue()?.variants?.find((x) => variantId.compare(x));
	}

	activeVariantInfoByIndex(index: number) {
		return this.#activeVariantsInfo.getObservablePart((data) => data[index] || undefined);
	}

	public switchVariant(index: number, variantId: UmbVariantId) {
		// TODO: remember current path and extend url with it.
		// TODO: construct URl with all active routes:
		// TODO: use method for generating variant url:
		const workspaceRoute = this.getWorkspaceRoute();
		if (workspaceRoute) {
			const activeVariants = this.getActiveVariantsInfo();
			if (activeVariants && index < activeVariants.length) {
				const newVariants = [...activeVariants];
				newVariants[index] = { index, culture: variantId.culture, segment: variantId.segment };

				const variantPart: string = newVariants
					.map((v) => new UmbVariantId(v.culture, v.segment).toString())
					.join('_split_');

				history.pushState(null, '', `${workspaceRoute}/${variantPart}`);
				return true;
			}
		}
		return false;
	}

	public openSplitView(newVariant: UmbVariantId) {
		// TODO: remember current path and extend url with it.
		// TODO: construct URl with all active routes:
		// TODO: use method for generating variant url:

		const currentVariant = this.getActiveVariantsInfo()[0];
		const workspaceRoute = this.getWorkspaceRoute();
		if (currentVariant && workspaceRoute) {
			history.pushState(
				null,
				'',
				`${workspaceRoute}/${new UmbVariantId(
					currentVariant.culture,
					currentVariant.segment
				)}_split_${newVariant.toString()}`
			);
			return true;
		}
		return false;
	}

	getName(variantId?: UmbVariantId) {
		const variants = this.#draft.getValue()?.variants;
		if (!variants) return;
		if (variantId) {
			return variants.find((x) => variantId.compare(x))?.name;
		} else {
			return variants[0]?.name;
		}
	}

	setName(name: string, variantId?: UmbVariantId) {
		const oldVariants = this.#draft.getValue()?.variants || [];
		const variants = partialUpdateFrozenArray(
			oldVariants,
			{ name },
			variantId ? (x) => variantId.compare(x) : () => true
		);
		this.#draft.update({ variants });
	}

	propertyValuesOf(variantId?: UmbVariantId) {
		return this.#draft.getObservablePart((data) =>
			variantId ? data?.values?.filter((x) => variantId.compare(x)) : data?.values
		);
	}

	propertyDataByAlias(propertyAlias: string, variantId?: UmbVariantId) {
		return this.#draft.getObservablePart((data) =>
			data?.values?.find((x) => x?.alias === propertyAlias && (variantId ? variantId.compare(x) : true))
		);
	}
	propertyValueByAlias(propertyAlias: string, variantId?: UmbVariantId) {
		return this.#draft.getObservablePart(
			(data) =>
				data?.values?.find((x) => x?.alias === propertyAlias && (variantId ? variantId.compare(x) : true))?.value
		);
	}

	getPropertyValue(alias: string, variantId?: UmbVariantId): void {
		const currentData = this.#draft.value;
		if (currentData) {
			const newDataSet = currentData.values?.find(
				(x) => x.alias === alias && (variantId ? variantId.compare(x) : true)
			);
			return newDataSet?.value;
		}
	}
	setPropertyValue(alias: string, value: unknown, variantId?: UmbVariantId) {
		const partialEntry = { value };
		const currentData = this.#draft.value;
		if (currentData) {
			const values = partialUpdateFrozenArray(
				currentData.values || [],
				partialEntry,
				(x) => x.alias === alias && (variantId ? variantId.compare(x) : true)
			);
			this.#draft.update({ values });
		}
	}

	async save() {
		if (!this.#draft.value) return;
		if (this.getIsNew()) {
			await this.repository.create(this.#draft.value);
		} else {
			await this.repository.save(this.#draft.value);
		}
		// If it went well, then its not new anymore?.
		this.setIsNew(false);
	}

	async delete(key: string) {
		await this.repository.delete(key);
	}

	/*
	concept notes:

	public saveAndPublish() {

	}

	public saveAndPreview() {

	}
	*/

	public destroy(): void {
		this.#draft.complete();
	}
}
