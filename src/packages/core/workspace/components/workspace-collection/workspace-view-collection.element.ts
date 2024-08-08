import { UMB_WORKSPACE_EDITOR_CONTEXT } from '../workspace-editor/workspace-editor.context.js';
import type { UmbCollectionBulkActionPermissions, UmbCollectionConfiguration } from '../../../collection/types.js';
import { customElement, html, nothing, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbDataTypeDetailRepository } from '@umbraco-cms/backoffice/data-type';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';
import { UMB_COLLECTION_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/workspace';
import type { UmbDataTypeDetailModel } from '@umbraco-cms/backoffice/data-type';
import type { ManifestWorkspaceView, UmbWorkspaceViewElement } from '@umbraco-cms/backoffice/extension-registry';

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

	manifest?: ManifestWorkspaceView;

	#dataTypeDetailRepository = new UmbDataTypeDetailRepository(this);

	#workspaceEditorContext?: typeof UMB_WORKSPACE_EDITOR_CONTEXT.TYPE;

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

		this.consumeContext(UMB_WORKSPACE_EDITOR_CONTEXT, (workspaceEditorContext) => {
			this.#workspaceEditorContext = workspaceEditorContext;
		});
	}

	#mapDataTypeConfigToCollectionConfig(dataType: UmbDataTypeDetailModel): UmbCollectionConfiguration {
		const config = new UmbPropertyEditorConfigCollection(dataType.values);
		const pageSize = Number(config.getValueByAlias('pageSize'));

		if (this.manifest?.alias) {
			const showContentFirst = Boolean(config?.getValueByAlias('showContentFirst'));
			const icon = config?.getValueByAlias<string>('icon');
			const label = config?.getValueByAlias<string>('tabName');
			this.#workspaceEditorContext?.setWorkspaceViewMeta(this.manifest.alias, icon, label, showContentFirst);
		}

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
