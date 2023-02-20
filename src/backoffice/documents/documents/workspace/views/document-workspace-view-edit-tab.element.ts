import { css, html } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { UmbDocumentWorkspaceContext } from '../document-workspace.context';
import { UmbLitElement } from '@umbraco-cms/element';
import { PropertyTypeContainerViewModelBaseModel } from '@umbraco-cms/backend-api';
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

			uui-box {
				margin-bottom: var(--uui-size-layout-1);
			}
		`,
	];

	private _tabName?: string | undefined;

	@property({ type: String })
	public get tabName(): string | undefined {
		return this._tabName;
	}
	public set tabName(value: string | undefined) {
		const oldValue = this._tabName;
		if (oldValue === value) return;
		this._tabName = value;
		this._observeTabContainers();
		this.requestUpdate('tabName', oldValue);
	}

	private _noTabName = false;

	@property({ type: Boolean })
	public get noTabName(): boolean {
		return this._noTabName;
	}
	public set noTabName(value: boolean) {
		const oldValue = this._noTabName;
		if (oldValue === value) return;
		this._noTabName = value;
		if (this._noTabName) {
			this._tabName = undefined;
		}
		this._observeTabContainers();
		this.requestUpdate('noTabName', oldValue);
	}

	@state()
	_tabContainers: PropertyTypeContainerViewModelBaseModel[] = [];

	@state()
	_hasTabProperties = false;

	@state()
	_groups: Array<PropertyTypeContainerViewModelBaseModel> = [];

	private _workspaceContext?: UmbDocumentWorkspaceContext;

	constructor() {
		super();

		// TODO: Figure out how to get the magic string for the workspace context.
		this.consumeContext<UmbDocumentWorkspaceContext>('umbWorkspaceContext', (workspaceContext) => {
			this._workspaceContext = workspaceContext;
			this._observeTabContainers();
		});
	}

	private _observeHasTabProperties() {
		if (!this._workspaceContext) return;

		this._tabContainers.forEach((container) => {
			this.observe(
				this._workspaceContext!.hasPropertyStructuresOf(container.key!),
				(hasTabProperties) => {
					this._hasTabProperties = hasTabProperties;
				},
				'_observeHasTabProperties_' + container.key
			);
		});
	}

	private _observeTabContainers() {
		if (!this._workspaceContext) return;

		if (this._tabName) {
			this._groups = [];
			this.observe(
				this._workspaceContext.containersByNameAndType(this._tabName, 'Tab'),
				(tabContainers) => {
					this._tabContainers = tabContainers || [];
					if (this._tabContainers.length > 0) {
						this._observeHasTabProperties();
						this._observeGroups();
					}
				},
				'_observeTabContainers'
			);
		} else if (this._noTabName) {
			this._groups = [];
			this._observeRootGroups();
		}
	}

	private _observeGroups() {
		if (!this._workspaceContext || !this._tabName) return;

		this._tabContainers.forEach((container) => {
			this.observe(
				this._workspaceContext!.containersOfParentKey(container.key, 'Group'),
				this._insertGroupContainers,
				'_observeGroupsOf_' + container.key
			);
		});
	}

	private _observeRootGroups() {
		if (!this._workspaceContext || !this._noTabName) return;

		// This is where we potentially could observe root properties as well.
		this.observe(this._workspaceContext!.rootContainers('Group'), this._insertGroupContainers, '_observeRootGroups');
	}

	private _insertGroupContainers = (groupContainers: PropertyTypeContainerViewModelBaseModel[]) => {
		groupContainers.forEach((group) => {
			if (group.name) {
				if (!this._groups.find((x) => x.name === group.name)) {
					this._groups.push(group);
					this._groups.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
				}
			}
		});
	};

	render() {
		// TODO: only show tab properties if there was any. We need some event? to tell us when the properties is empty.
		return html`
			${this._hasTabProperties
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
