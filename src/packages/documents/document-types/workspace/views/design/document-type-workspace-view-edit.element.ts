import { UmbDocumentTypeWorkspaceContext } from '../../document-type-workspace.context.js';
import type { UmbDocumentTypeWorkspaceViewEditTabElement } from './document-type-workspace-view-edit-tab.element.js';
import { css, html, customElement, state, repeat } from '@umbraco-cms/backoffice/external/lit';
import { UUIInputElement, UUITextStyles } from '@umbraco-cms/backoffice/external/uui';
import { UmbContentTypeContainerStructureHelper } from '@umbraco-cms/backoffice/content-type';
import { encodeFolderName, UmbRouterSlotChangeEvent, UmbRouterSlotInitEvent } from '@umbraco-cms/backoffice/router';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { PropertyTypeContainerModelBaseModel } from '@umbraco-cms/backoffice/backend-api';
import { UMB_ENTITY_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/workspace';
import type { UmbRoute } from '@umbraco-cms/backoffice/router';
import { UmbWorkspaceEditorViewExtensionElement } from '@umbraco-cms/backoffice/extension-registry';
import { UMB_CONFIRM_MODAL, UMB_MODAL_MANAGER_CONTEXT_TOKEN, UmbConfirmModalData } from '@umbraco-cms/backoffice/modal';

@customElement('umb-document-type-workspace-view-edit')
export class UmbDocumentTypeWorkspaceViewEditElement
	extends UmbLitElement
	implements UmbWorkspaceEditorViewExtensionElement
{
	//private _hasRootProperties = false;
	private _hasRootGroups = false;

	@state()
	private _routes: UmbRoute[] = [];

	@state()
	_tabs?: Array<PropertyTypeContainerModelBaseModel>;

	@state()
	private _routerPath?: string;

	@state()
	private _activePath = '';

	private _workspaceContext?: UmbDocumentTypeWorkspaceContext;

	private _tabsStructureHelper = new UmbContentTypeContainerStructureHelper(this);

	private _modalManagerContext?: typeof UMB_MODAL_MANAGER_CONTEXT_TOKEN.TYPE;

	constructor() {
		super();

		this._tabsStructureHelper.setIsRoot(true);
		this._tabsStructureHelper.setContainerChildType('Tab');
		this.observe(this._tabsStructureHelper.containers, (tabs) => {
			this._tabs = tabs;
			this._createRoutes();
		});

		// _hasRootProperties can be gotten via _tabsStructureHelper.hasProperties. But we do not support root properties currently.

		this.consumeContext(UMB_ENTITY_WORKSPACE_CONTEXT, (workspaceContext) => {
			this._workspaceContext = workspaceContext as UmbDocumentTypeWorkspaceContext;
			this._tabsStructureHelper.setStructureManager((workspaceContext as UmbDocumentTypeWorkspaceContext).structure);
			this._observeRootGroups();
		});

		this.consumeContext(UMB_MODAL_MANAGER_CONTEXT_TOKEN, (context) => {
			this._modalManagerContext = context;
		});
	}

	private _observeRootGroups() {
		if (!this._workspaceContext) return;

		this.observe(
			this._workspaceContext.structure.hasRootContainers('Group'),
			(hasRootGroups) => {
				this._hasRootGroups = hasRootGroups;
				this._createRoutes();
			},
			'_observeGroups'
		);
	}

	private _createRoutes() {
		if (!this._workspaceContext || !this._tabs) return;
		const routes: UmbRoute[] = [];

		if (this._tabs.length > 0) {
			this._tabs?.forEach((tab) => {
				const tabName = tab.name ?? '';
				routes.push({
					path: `tab/${encodeFolderName(tabName).toString()}`,
					component: () => import('./document-type-workspace-view-edit-tab.element.js'),
					setup: (component) => {
						(component as UmbDocumentTypeWorkspaceViewEditTabElement).tabName = tabName;
						(component as UmbDocumentTypeWorkspaceViewEditTabElement).ownerTabId =
							this._workspaceContext?.structure.isOwnerContainer(tab.id!) ? tab.id : undefined;
					},
				});
			});
		}

		routes.push({
			path: 'root',
			component: () => import('./document-type-workspace-view-edit-tab.element.js'),
			setup: (component) => {
				(component as UmbDocumentTypeWorkspaceViewEditTabElement).noTabName = true;
				(component as UmbDocumentTypeWorkspaceViewEditTabElement).ownerTabId = null;
			},
		});

		if (this._hasRootGroups) {
			routes.push({
				path: '',
				redirectTo: 'root',
			});
		} else if (routes.length !== 0) {
			routes.push({
				path: '',
				redirectTo: routes[0]?.path,
			});
		}

		this._routes = routes;
	}

	#requestRemoveTab(tab: PropertyTypeContainerModelBaseModel | undefined) {
		const LocalMessage: UmbConfirmModalData = {
			headline: 'Delete tab',
			content: html`Are you sure you want to delete the tab (${tab?.name || tab?.id})?
				<div style="color:var(--uui-color-danger-emphasis)">
					This will delete all items that doesn't belong to a composition.
				</div>`,
			confirmLabel: 'Delete',
			color: 'danger',
		};

		const ComposedMessage: UmbConfirmModalData = {
			headline: 'Remove composed tab',
			content: html`This tab is a composed tab. Are you sure you want to remove the composed tab
			(${tab?.name || tab?.id})?`,
			confirmLabel: 'Remove',
			color: 'danger',
		};

		// TODO: If this tab is composed of other tabs, then notify that it will only delete the local tab.
		const modalHandler = this._tabsStructureHelper?.isOwnerContainer(tab?.id)
			? this._modalManagerContext?.open(UMB_CONFIRM_MODAL, LocalMessage)
			: this._modalManagerContext?.open(UMB_CONFIRM_MODAL, ComposedMessage);

		modalHandler?.onSubmit().then(() => {
			this.#remove(tab?.id);
		});
	}
	#remove(tabId?: string) {
		if (!tabId) return;
		this._workspaceContext?.structure.removeContainer(null, tabId);
		this._tabsStructureHelper?.isOwnerContainer(tabId)
			? window.history.replaceState(null, '', this._routerPath + this._routes[0]?.path ?? '/root')
			: '';
	}
	async #addTab() {
		if (
			(this.shadowRoot?.querySelector('uui-tab[active] uui-input') as UUIInputElement) &&
			(this.shadowRoot?.querySelector('uui-tab[active] uui-input') as UUIInputElement).value === ''
		) {
			this.#focusInput();
			return;
		}

		const tab = await this._workspaceContext?.structure.createContainer(null, null, 'Tab');
		if (tab) {
			const path = this._routerPath + '/tab/' + encodeFolderName(tab.name || '');
			window.history.replaceState(null, '', path);
			this.#focusInput();
		}
	}

	async #focusInput() {
		setTimeout(() => {
			(this.shadowRoot?.querySelector('uui-tab[active] uui-input') as UUIInputElement | undefined)?.focus();
		}, 100);
	}

	async #tabNameChanged(event: InputEvent, tab: PropertyTypeContainerModelBaseModel) {
		let newName = (event.target as HTMLInputElement).value;

		if (newName === '') {
			newName = 'Unnamed';
			(event.target as HTMLInputElement).value = 'Unnamed';
		}

		const changedName = this._workspaceContext?.structure.makeContainerNameUniqueForOwnerDocument(
			newName,
			'Tab',
			tab.id
		);

		// Check if it collides with another tab name of this same document-type, if so adjust name:
		if (changedName) {
			newName = changedName;
			(event.target as HTMLInputElement).value = newName;
		}

		this._tabsStructureHelper.partialUpdateContainer(tab.id!, {
			name: newName,
		});

		// Update the current URL, so we are still on this specific tab:
		window.history.replaceState(null, '', this._routerPath + '/tab/' + encodeFolderName(newName));
	}

	renderTabsNavigation() {
		if (!this._tabs) return;
		const rootTabPath = this._routerPath + '/root';
		const rootTabActive = rootTabPath === this._activePath;
		return html`<uui-tab-group>
				<uui-tab
					class=${this._hasRootGroups || rootTabActive ? '' : 'content-tab-is-empty'}
					label="Content"
					.active=${rootTabActive}
					href=${rootTabPath}>
					Content
				</uui-tab>
				${repeat(
					this._tabs,
					(tab) => tab.id! + tab.name,
					(tab) => {
						const path = this._routerPath + '/tab/' + encodeFolderName(tab.name || '');
						const tabActive = path === this._activePath;
						return html`<uui-tab label=${tab.name ?? 'unnamed'} .active=${tabActive} href=${path}>
							<div class="tab-wrapper">
								${tabActive && this._tabsStructureHelper.isOwnerContainer(tab.id!)
									? html`
											<uui-input
												id="input"
												label="Tab name"
												look="placeholder"
												value="${tab.name!}"
												placeholder="Enter a name"
												@change=${(e: InputEvent) => this.#tabNameChanged(e, tab)}
												@blur=${(e: InputEvent) => this.#tabNameChanged(e, tab)}
												auto-width>
												<uui-button
													label="Remove tab"
													class="trash"
													slot="append"
													@click=${() => this.#requestRemoveTab(tab)}
													compact>
													<uui-icon name="umb:trash"></uui-icon>
												</uui-button>
											</uui-input>
									  `
									: html` <span class="no-edit">
												${!this._tabsStructureHelper.isOwnerContainer(tab.id!)
													? html`<uui-icon name="umb:merge"></uui-icon>`
													: ''}
												${tab.name}
											</span>
											<uui-button class="trash" label="Remove tab" @click=${() => this.#requestRemoveTab(tab)} compact>
												<uui-icon name="umb:trash"></uui-icon>
											</uui-button>`}
							</div>
						</uui-tab>`;
					}
				)}
			</uui-tab-group>
			<uui-button id="add-tab" @click="${this.#addTab}" label="Add tab" compact>
				<uui-icon name="umb:add"></uui-icon>
				Add tab
			</uui-button>`;
	}

	renderActions() {
		return html`<div class="tab-actions">
			<uui-button label="Compositions" compact>
				<uui-icon name="umb:merge"></uui-icon>
				Compositions
			</uui-button>
			<uui-button label="Recorder" compact>
				<uui-icon name="umb:navigation"></uui-icon>
				Recorder
			</uui-button>
		</div>`;
	}

	render() {
		return html`
			<umb-body-layout header-fit-height>
				<div id="header" slot="header">
					<div id="tabs-wrapper">${this._routerPath ? this.renderTabsNavigation() : ''}</div>
					${this.renderActions()}
				</div>
				<umb-router-slot
					.routes=${this._routes}
					@init=${(event: UmbRouterSlotInitEvent) => {
						this._routerPath = event.target.absoluteRouterPath;
					}}
					@change=${(event: UmbRouterSlotChangeEvent) => {
						this._activePath = event.target.absoluteActiveViewPath || '';
					}}>
				</umb-router-slot>
			</umb-body-layout>
		`;
	}

	static styles = [
		UUITextStyles,
		css`
			:host {
				position: relative;
				display: flex;
				flex-direction: column;
				height: 100%;
				--uui-tab-background: var(--uui-color-surface);
			}

			/* TODO: This should be replaced with a general workspace bar — naming is hard */
			#header {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-wrap: nowrap;
			}

			#tabs-wrapper {
				display: flex;
			}

			.content-tab-is-empty {
				align-self: center;
				border-radius: 3px;
				--uui-tab-text: var(--uui-color-text-alt);
				border: dashed 1px var(--uui-color-border-emphasis);
			}

			uui-tab {
				border-left: 1px solid transparent;
				border-right: 1px solid var(--uui-color-border);
			}

			.no-edit {
				padding: 0 var(--uui-size-space-3);
				border: 1px solid transparent;
			}

			.no-edit uui-icon {
				vertical-align: sub;
			}

			uui-input:not(:focus, :hover) {
				border: 1px solid transparent;
			}

			.trash {
				opacity: 1;
				transition: opacity 120ms;
			}

			uui-tab:not(:hover, :focus) .trash {
				opacity: 0;
				transition: opacity 120ms;
			}
		`,
	];
}

export default UmbDocumentTypeWorkspaceViewEditElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-document-type-workspace-view-edit': UmbDocumentTypeWorkspaceViewEditElement;
	}
}
