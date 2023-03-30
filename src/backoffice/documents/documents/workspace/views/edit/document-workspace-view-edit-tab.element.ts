import { css, html } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { UmbWorkspaceContainerManager } from '../../../../../shared/components/workspace/workspace-context/workspace-container-manager.class';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { PropertyTypeContainerResponseModelBaseModel } from '@umbraco-cms/backoffice/backend-api';
import './document-workspace-view-edit-properties.element';

@customElement('umb-document-workspace-view-edit-tab')
export class UmbDocumentWorkspaceViewEditTabElement extends UmbLitElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
				margin: var(--uui-size-layout-1);
			}

			uui-box + uui-box {
				margin-top: var(--uui-size-layout-1);
			}
		`,
	];

	private _tabName?: string | undefined;

	@property({ type: String })
	public get tabName(): string | undefined {
		return this._structureManager.getContainerName();
	}
	public set tabName(value: string | undefined) {
		if (value === this._tabName) return;
		const oldValue = this._tabName;
		this._tabName = value;
		this._structureManager.setContainerName(value);
		this.requestUpdate('tabName', oldValue);
	}

	@property({ type: Boolean })
	public get noTabName(): boolean {
		return this._structureManager.getIsRoot();
	}
	public set noTabName(value: boolean) {
		this._structureManager.setIsRoot(value);
	}

	_structureManager = new UmbWorkspaceContainerManager(this);

	@state()
	_hasProperties = false;

	@state()
	_groups: Array<PropertyTypeContainerResponseModelBaseModel> = [];

	constructor() {
		super();

		this.observe(this._structureManager.groups, (groups) => {
			this._groups = groups;
		});
		this.observe(this._structureManager.hasProperties, (hasProperties) => {
			this._hasProperties = hasProperties;
		});
	}

	render() {
		return html`
			${this._hasProperties
				? html`
						<uui-box>
							<umb-document-workspace-view-edit-properties
								container-type="Tab"
								container-name=${this.tabName || ''}></umb-document-workspace-view-edit-properties>
						</uui-box>
				  `
				: ''}
			${repeat(
				this._groups,
				(group) => group.name,
				(group) => html`<uui-box .headline=${group.name || ''}>
					<umb-document-workspace-view-edit-properties
						container-type="Group"
						container-name=${group.name || ''}></umb-document-workspace-view-edit-properties>
				</uui-box>`
			)}
		`;
	}
}

export default UmbDocumentWorkspaceViewEditTabElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-document-workspace-view-edit-tab': UmbDocumentWorkspaceViewEditTabElement;
	}
}
