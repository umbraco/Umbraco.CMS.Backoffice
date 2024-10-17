import type { UmbCollectionBulkActionPermissions, UmbCollectionConfiguration } from '../../collection/types.js';
import { UMB_WORKSPACE_EDITOR_CONTEXT } from '../../workspace/components/workspace-editor/workspace-editor.context.js';
import { UMB_CONTENT_COLLECTION_WORKSPACE_CONTEXT } from './content-collection-workspace.context-token.js';
import { customElement, html, nothing, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbDataTypeDetailRepository } from '@umbraco-cms/backoffice/data-type';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';
import type { UmbDataTypeDetailModel } from '@umbraco-cms/backoffice/data-type';
import type { ManifestWorkspaceView, UmbWorkspaceViewElement } from '@umbraco-cms/backoffice/workspace';

@customElement('umb-content-collection-workspace-view')
export class UmbContentCollectionWorkspaceViewElement extends UmbLitElement implements UmbWorkspaceViewElement {
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
		this.consumeContext(UMB_CONTENT_COLLECTION_WORKSPACE_CONTEXT, (workspaceContext) => {
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
			const icon = config?.getValueByAlias<string>('icon');
			const label = config?.getValueByAlias<string>('tabName');

			// TODO: Review how `showContentFirst` is implemented, and how to re-route/redirect the path.
			const showContentFirst = Boolean(config?.getValueByAlias('showContentFirst'));
			const weight = showContentFirst ? 199 : (this.manifest.weight ?? 300);

			this.#workspaceEditorContext?.setWorkspaceViewMeta(this.manifest.alias, icon, label, weight);
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

export { UmbContentCollectionWorkspaceViewElement as element };

declare global {
	interface HTMLElementTagNameMap {
		'umb-content-collection-workspace-view': UmbContentCollectionWorkspaceViewElement;
	}
}
