import type { UmbCollectionBulkActionPermissions, UmbCollectionConfiguration } from '../../../collection/types.js';
import { customElement, html, nothing, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbDataTypeDetailRepository } from '@umbraco-cms/backoffice/data-type';
import { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';
import { UMB_COLLECTION_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/workspace';
import type { UmbDataTypeDetailModel } from '@umbraco-cms/backoffice/data-type';
import type { UmbWorkspaceViewElement } from '@umbraco-cms/backoffice/extension-registry';

// TODO: clean up this code and make it more generic
/* Be aware this code has been duplicated in the UmbContentCollectionWorkspaceViewElement as is should only be specific for collections based on a content type.
This element is currently no longer in use in the code base but we will need it in the future with a different implementation without knowledge of content and data types */
@customElement('umb-workspace-view-collection')
export class UmbWorkspaceViewCollectionElement extends UmbLitElement implements UmbWorkspaceViewElement {
	@state()
	private _loading = true;

	@state()
	private _config?: UmbCollectionConfiguration;

	@state()
	private _collectionAlias?: string;

	@state()
	private _documentUnique?: string;

	#dataTypeDetailRepository = new UmbDataTypeDetailRepository(this);

	constructor() {
		super();
		this.#observeConfig();
	}

	async #observeConfig() {
		this.consumeContext(UMB_COLLECTION_WORKSPACE_CONTEXT, (workspaceContext) => {
			this._collectionAlias = workspaceContext.getCollectionAlias();
			this._documentUnique = workspaceContext.getUnique() ?? '';

			this.observe(
				workspaceContext.structure.ownerContentType,
				async (contentType) => {
					if (!contentType || !contentType.collection) return;

					const dataTypeUnique = contentType.collection.unique;

					if (dataTypeUnique) {
						await this.#dataTypeDetailRepository.requestByUnique(dataTypeUnique);
						this.observe(
							await this.#dataTypeDetailRepository.byUnique(dataTypeUnique),
							(dataType) => {
								if (!dataType) return;
								this._config = this.#mapDataTypeConfigToCollectionConfig(dataType);
								this._loading = false;
							},
							'_observeConfigDataType',
						);
					}
				},
				'_observeConfigContentType',
			);
		});
	}

	#mapDataTypeConfigToCollectionConfig(dataType: UmbDataTypeDetailModel): UmbCollectionConfiguration {
		const config = new UmbPropertyEditorConfigCollection(dataType.values);
		const pageSize = Number(config.getValueByAlias('pageSize'));
		return {
			unique: this._documentUnique,
			allowedEntityBulkActions: config?.getValueByAlias<UmbCollectionBulkActionPermissions>('bulkActionPermissions'),
			layouts: config?.getValueByAlias('layouts'),
			orderBy: config?.getValueByAlias('orderBy') ?? 'updateDate',
			orderDirection: config?.getValueByAlias('orderDirection') ?? 'asc',
			pageSize: isNaN(pageSize) ? 50 : pageSize,
			userDefinedProperties: config?.getValueByAlias('includeProperties'),
		};
	}

	override render() {
		if (this._loading) return nothing;
		return html`<umb-collection .alias=${this._collectionAlias} .config=${this._config}></umb-collection>`;
	}
}

export default UmbWorkspaceViewCollectionElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-workspace-view-collection': UmbWorkspaceViewCollectionElement;
	}
}
