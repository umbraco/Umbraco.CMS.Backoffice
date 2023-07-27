import { UmbDocumentWorkspaceContext } from '../../../documents/documents/workspace/document-workspace.context.js';
import { UmbWorkspaceVariableEntityContextInterface } from '../workspace-context/workspace-variable-entity-context.interface.js';
import { UmbVariantId } from '@umbraco-cms/backoffice/variant';
import {
	UmbContextConsumerController,
	UmbContextProviderController,
	UmbContextToken,
} from '@umbraco-cms/backoffice/context-api';
import { UMB_ENTITY_WORKSPACE_CONTEXT, ActiveVariant } from '@umbraco-cms/backoffice/workspace';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';
import {
	UmbClassState,
	UmbNumberState,
	UmbObjectState,
	UmbObserverController,
} from '@umbraco-cms/backoffice/observable-api';
import { DocumentVariantResponseModel } from '@umbraco-cms/backoffice/backend-api';

//type EntityType = DocumentModel;

export class UmbWorkspaceVariantContext {
	#host: UmbControllerHostElement;

	#workspaceContext?: UmbWorkspaceVariableEntityContextInterface;
	public getWorkspaceContext() {
		return this.#workspaceContext;
	}

	#index = new UmbNumberState(undefined);
	index = this.#index.asObservable();

	#currentVariant = new UmbObjectState<DocumentVariantResponseModel | undefined>(undefined);
	currentVariant = this.#currentVariant.asObservable();

	name = this.#currentVariant.asObservablePart((x) => x?.name);
	culture = this.#currentVariant.asObservablePart((x) => x?.culture);
	segment = this.#currentVariant.asObservablePart((x) => x?.segment);

	#variantId = new UmbClassState<UmbVariantId | undefined>(undefined);
	variantId = this.#variantId.asObservable();

	constructor(host: UmbControllerHostElement) {
		this.#host = host;

		new UmbContextProviderController(host, UMB_WORKSPACE_VARIANT_CONTEXT_TOKEN.toString(), this);

		// How do we ensure this connects to a document workspace context? and not just any other context? (We could start providing workspace contexts twice, under the general name and under a specific name)
		// TODO: Figure out if this is the best way to consume the context or if it can be strongly typed with an UmbContextToken
		new UmbContextConsumerController(host, UMB_ENTITY_WORKSPACE_CONTEXT, (context) => {
			this.#workspaceContext = context as UmbDocumentWorkspaceContext;
			this._observeVariant();
		});

		new UmbObserverController(host, this.#index, () => {
			this._observeVariant();
		});
	}

	public switchVariant(variant: DocumentVariantResponseModel) {
		const index = this.#index.value;
		if (index === undefined) return;
		this.#workspaceContext?.splitView.switchVariant(index, new UmbVariantId(variant));
	}

	public closeSplitView() {
		const index = this.#index.value;
		if (index === undefined) return;
		this.#workspaceContext?.splitView.closeSplitView(index);
	}

	public openSplitView(variant: DocumentVariantResponseModel) {
		this.#workspaceContext?.splitView.openSplitView(new UmbVariantId(variant));
	}

	private _setVariantId(variantId: UmbVariantId) {
		this.#variantId.next(variantId);
		return variantId;
	}

	private _observeVariant() {
		if (!this.#workspaceContext) return;

		const index = this.#index.getValue();
		if (index === undefined) return;

		new UmbObserverController(
			this.#host,
			this.#workspaceContext.splitView.activeVariantByIndex(index),
			async (activeVariantInfo) => {
				if (!activeVariantInfo) return;
				const variantId = this._setVariantId(UmbVariantId.Create(activeVariantInfo));
				const currentVariant = await this.#workspaceContext?.getVariant(variantId);
				this.#currentVariant.next(currentVariant);
			},
			'_observeActiveVariant'
		);
	}

	public changeVariant(culture: string | null, segment: string | null) {
		const index = this.#index.getValue();
		if (index === undefined) return;
		this.#workspaceContext?.splitView.setActiveVariant(index, culture, segment);
	}

	public getSplitViewIndex() {
		return this.#index.getValue();
	}
	public setSplitViewIndex(index: number) {
		this.#index.next(index);
	}

	public setName(newName: string) {
		const variantId = this.#variantId.getValue();
		if (!this.#workspaceContext || !variantId) return;
		this.#workspaceContext.setName(newName, variantId);
	}

	/**
	 *
	 * concept this class could have methods to set and get the culture and segment of the active variant? just by using the index.
	 */

	/*
	public destroy(): void {

	}
	*/
}

export const UMB_WORKSPACE_VARIANT_CONTEXT_TOKEN = new UmbContextToken<UmbWorkspaceVariantContext>(
	'umbWorkspaceVariantContext'
);
