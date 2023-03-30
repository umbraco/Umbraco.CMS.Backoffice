import { css, html } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { UmbWorkspaceContainerPropertiesManager } from '../../../../../shared/components/workspace/workspace-context/workspace-container-properties-manager.class';
import { PropertyContainerTypes } from '../../../../../shared/components/workspace/workspace-context/workspace-property-structure-manager.class';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { DocumentTypePropertyTypeResponseModel } from '@umbraco-cms/backoffice/backend-api';

@customElement('umb-document-workspace-view-edit-properties')
export class UmbDocumentWorkspaceViewEditPropertiesElement extends UmbLitElement {
	static styles = [
		UUITextStyles,
		css`
			.property {
				border-bottom: 1px solid var(--uui-color-divider);
			}
			.property:last-child {
				border-bottom: 0;
			}
		`,
	];

	@property({ type: String, attribute: 'container-name', reflect: false })
	public get containerName(): string | undefined {
		return this._propertyStructureManager.getContainerName();
	}
	public set containerName(value: string | undefined) {
		this._propertyStructureManager.setContainerName(value);
	}

	@property({ type: String, attribute: 'container-type', reflect: false })
	public get containerType(): PropertyContainerTypes | undefined {
		return this._propertyStructureManager.getContainerType();
	}
	public set containerType(value: PropertyContainerTypes | undefined) {
		this._propertyStructureManager.setContainerType(value);
	}

	_propertyStructureManager = new UmbWorkspaceContainerPropertiesManager(this);

	@state()
	_propertyStructure: Array<DocumentTypePropertyTypeResponseModel> = [];

	constructor() {
		super();

		this.observe(this._propertyStructureManager.propertyStructure, (propertyStructure) => {
			this._propertyStructure = propertyStructure;
		});
	}

	render() {
		return repeat(
			this._propertyStructure,
			(property) => property.alias,
			(property) => html`<umb-variantable-property class="property" .property=${property}></umb-variantable-property> `
		);
	}
}

export default UmbDocumentWorkspaceViewEditPropertiesElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-document-workspace-view-edit-properties': UmbDocumentWorkspaceViewEditPropertiesElement;
	}
}
