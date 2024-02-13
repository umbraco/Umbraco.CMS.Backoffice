import type { UmbCollectionConfiguration } from '../../../../../core/collection/types.js';
import type { UmbDataTypePropertyModel } from '../../../../../core/data-type/types.js';
import { customElement, html, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbDataTypeDetailRepository } from '@umbraco-cms/backoffice/data-type';
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/document';
import type { UmbWorkspaceViewElement } from '@umbraco-cms/backoffice/extension-registry';

@customElement('umb-document-workspace-view-collection')
export class UmbDocumentWorkspaceViewCollectionElement extends UmbLitElement implements UmbWorkspaceViewElement {
	@state()
	private _config?: UmbCollectionConfiguration;

	#dataTypeDetailRepository = new UmbDataTypeDetailRepository(this);

	constructor() {
		super();

		this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (workspaceContext) => {
			this.observe(workspaceContext.structure.ownerContentType(), (documentType) => {
				if (!documentType) return;

				console.log('UmbDocumentWorkspaceViewCollectionElement.documentType', documentType);

				// TODO: [LK] Once the API is ready, wire up the data-type ID from the content-type.
				const dataTypeUnique = 'dt-collectionView';

				this.#observeDataType(dataTypeUnique);
			}, '_observeDocumentType');
		});
	}

	async #observeDataType(dataTypeUnique?: string) {
		if (dataTypeUnique) {
			await this.#dataTypeDetailRepository.requestByUnique(dataTypeUnique);

			this.observe(
				await this.#dataTypeDetailRepository.byUnique(dataTypeUnique),
				(dataType) => {
					if (!dataType) return;

					// TODO: [LK] Find out how to wire up the data-type configuration with the collection view.
					this._config = this.#mapDataTypeConfigToCollectionConfig(dataType.values);
					//console.log('UmbDocumentWorkspaceViewCollectionElement.dataType', dataTypeUnique, this._config);
				},
				'#observeDataType',
			);
		}
	}

	#mapDataTypeConfigToCollectionConfig(config: Array<UmbDataTypePropertyModel>): UmbCollectionConfiguration {
		return {
			pageSize: Number(config.find((x) => x.alias === 'pageSize')?.value) ?? 25,
		};
	}

	render() {
		return html`<umb-collection alias="Umb.Collection.Document" .config=${this._config}></umb-collection>`;
	}
}

export default UmbDocumentWorkspaceViewCollectionElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-document-workspace-view-collection': UmbDocumentWorkspaceViewCollectionElement;
	}
}
