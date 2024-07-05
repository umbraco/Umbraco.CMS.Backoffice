import type { UmbBlockWorkspaceElementManagerNames } from '../../block-workspace.context.js';
import { UMB_BLOCK_WORKSPACE_CONTEXT } from '../../block-workspace.context-token.js';
import { css, html, customElement, property, state, repeat } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import type { UmbContentTypeModel, UmbPropertyTypeModel } from '@umbraco-cms/backoffice/content-type';
import { UmbContentTypePropertyStructureHelper } from '@umbraco-cms/backoffice/content-type';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbDataTypeItemRepository } from '@umbraco-cms/backoffice/data-type';

@customElement('umb-block-workspace-view-edit-properties')
export class UmbBlockWorkspaceViewEditPropertiesElement extends UmbLitElement {
	#managerName?: UmbBlockWorkspaceElementManagerNames;
	#blockWorkspace?: typeof UMB_BLOCK_WORKSPACE_CONTEXT.TYPE;
	#propertyStructureHelper = new UmbContentTypePropertyStructureHelper<UmbContentTypeModel>(this);
	#dataTypeItemRepository = new UmbDataTypeItemRepository(this);

	@state()
	disallowed: Array<{ uiAlias: string; unique: string }> = [];

	@property({ attribute: false })
	public get managerName(): UmbBlockWorkspaceElementManagerNames | undefined {
		return this.#managerName;
	}
	public set managerName(value: UmbBlockWorkspaceElementManagerNames | undefined) {
		this.#managerName = value;
		this.#setStructureManager();
	}

	@property({ type: String, attribute: 'container-name', reflect: false })
	public get containerId(): string | null | undefined {
		return this.#propertyStructureHelper.getContainerId();
	}
	public set containerId(value: string | null | undefined) {
		this.#propertyStructureHelper.setContainerId(value);
	}

	@state()
	_propertyStructure: Array<UmbPropertyTypeModel> = [];

	constructor() {
		super();

		this.consumeContext(UMB_BLOCK_WORKSPACE_CONTEXT, (workspaceContext) => {
			this.#blockWorkspace = workspaceContext;
			this.#setStructureManager();
		});
	}

	#setStructureManager() {
		if (!this.#blockWorkspace || !this.#managerName) return;
		this.#propertyStructureHelper.setStructureManager(this.#blockWorkspace[this.#managerName].structure);
		this.observe(
			this.#propertyStructureHelper.propertyStructure,
			async (propertyStructure) => {
				await this.#checkForDisallowed(propertyStructure);
				this._propertyStructure = propertyStructure;
			},
			'observePropertyStructure',
		);
	}

	async #checkForDisallowed(properties: Array<UmbPropertyTypeModel>) {
		const { data } = await this.#dataTypeItemRepository.requestItems(
			properties.map((property) => property.dataType.unique),
		);

		if (!data) {
			this.disallowed = [];
			return;
		}

		for (const datatype of data) {
			// Are there any other property editors that are not supported in blocks?
			if (datatype.propertyEditorUiAlias === 'Umb.PropertyEditorUi.ImageCropper') {
				this.disallowed.push({ unique: datatype.unique, uiAlias: datatype.propertyEditorUiAlias });
			}
		}
	}

	override render() {
		return repeat(
			this._propertyStructure,
			(property) => property.alias,
			(property) => {
				const disallowed = this.disallowed.find((disallowed) => disallowed.unique === property.dataType.unique);
				if (disallowed) {
					return html`<umb-property-type-based-property
						.property=${property}
						.notSupportedMessage=${this.localize.term(
							'blockEditor_propertyEditorNotSupported',
							property.alias,
							disallowed?.uiAlias,
						)}
						notSupported></umb-property-type-based-property>`;
				} else {
					return html`<umb-property-type-based-property .property=${property}></umb-property-type-based-property>`;
				}
			},
		);
	}

	static override styles = [
		UmbTextStyles,
		css`
			umb-property-type-based-property {
				border-bottom: 1px solid var(--uui-color-divider);
			}
			umb-property-type-based-property:last-child {
				border-bottom: 0;
			}
		`,
	];
}

export default UmbBlockWorkspaceViewEditPropertiesElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-block-workspace-view-edit-properties': UmbBlockWorkspaceViewEditPropertiesElement;
	}
}
