import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IRoutingInfo } from 'router-slot';
import { map } from 'rxjs';
import { repeat } from 'lit/directives/repeat.js';

import type { UmbRouterSlotInitEvent, UmbRouterSlotChangeEvent } from '@umbraco-cms/router';
import { createExtensionElement, umbExtensionsRegistry } from '@umbraco-cms/extensions-api';
import type {
	ManifestWorkspaceAction,
	ManifestWorkspaceView,
	ManifestWorkspaceViewCollection,
} from '@umbraco-cms/models';

import '../../body-layout/body-layout.element';
import '../../extension-slot/extension-slot.element';
import { UmbLitElement } from '@umbraco-cms/element';

/**
 * @element umb-workspace-layout
 * @description
 * @slot icon - Slot for rendering the icon
 * @slot name - Slot for rendering the name
 * @slot footer - Slot for rendering the workspace footer
 * @slot actions - Slot for rendering the workspace actions
 * @slot default - slot for main content
 * @export
 * @class UmbWorkspaceLayout
 * @extends {UmbLitElement}
 */
// TODO: stop naming this something with layout. as its not just an layout. it hooks up with extensions.
@customElement('umb-workspace-layout')
export class UmbWorkspaceLayout extends UmbLitElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
				width: 100%;
				height: 100%;
			}

			uui-input {
				width: 100%;
			}

			uui-tab-group {
				--uui-tab-divider: var(--uui-color-border);
				border-left: 1px solid var(--uui-color-border);
				border-right: 1px solid var(--uui-color-border);
			}

			#router-slot {
				height: 100%;
			}

			umb-extension-slot[slot='actions'] {
				display: flex;
				gap: var(--uui-size-space-2);
			}
		`,
	];

	@property()
	public splitViewIndex?: string;

	@property()
	public headline = '';

	private _alias = '';
	/**
	 * Alias of the workspace. The Layout will render the workspace views that are registered for this workspace alias.
	 * @public
	 * @type {string}
	 * @attr
	 * @default ''
	 */
	@property()
	public get alias() {
		return this._alias;
	}
	public set alias(value) {
		const oldValue = this._alias;
		this._alias = value;
		if (oldValue !== this._alias) {
			this._observeWorkspaceViews();
			this.requestUpdate('alias', oldValue);
		}
	}

	@state()
	private _workspaceViews: Array<ManifestWorkspaceView | ManifestWorkspaceViewCollection> = [];

	@state()
	private _routes?: any[];

	@state()
	private _routerPath?: string;

	@state()
	private _activePath?: string;

	private _observeWorkspaceViews() {
		this.observe(
			umbExtensionsRegistry
				.extensionsOfTypes<ManifestWorkspaceView>(['workspaceView', 'workspaceViewCollection'])
				.pipe(map((extensions) => extensions.filter((extension) => extension.meta.workspaces.includes(this.alias)))),
			(workspaceViews) => {
				this._workspaceViews = workspaceViews;
				this._createRoutes();
			}
		);
	}

	private _createViewRoute(path, view: ManifestWorkspaceView | ManifestWorkspaceViewCollection) {
		return {
			path: path,
			component: () => {
				if (view.type === 'workspaceViewCollection') {
					return import(
						'../../../../shared/components/workspace/workspace-content/views/collection/workspace-view-collection.element'
					);
				}
				return createExtensionElement(view);
			},
			setup: (component: Promise<HTMLElement> | HTMLElement, info: IRoutingInfo) => {
				// When its using import, we get an element, when using createExtensionElement we get a Promise.
				if ((component as any).then) {
					(component as any).then((el: any) => (el.manifest = view));
				} else {
					(component as any).manifest = view;
				}
			},
		};
	}

	private _createRoutes() {
		this._routes = [];

		if (this._workspaceViews.length > 0) {
			this._routes = this._workspaceViews.map((view) => {
				return this._createViewRoute(`${this.splitViewIndex ? ':key/' : ''}view/${view.meta.pathname}`, view);

				/*{
					path: `${this.splitViewIndex ? ':key/' : ''}view/${view.meta.pathname}`,
					component: () => {
						if (view.type === 'workspaceViewCollection') {
							return import(
								'../../../../shared/components/workspace/workspace-content/views/collection/workspace-view-collection.element'
							);
						}
						return createExtensionElement(view);
					},
					setup: (component: Promise<HTMLElement> | HTMLElement, info: IRoutingInfo) => {
						// When its using import, we get an element, when using createExtensionElement we get a Promise.
						if ((component as any).then) {
							(component as any).then((el: any) => (el.manifest = view));
						} else {
							(component as any).manifest = view;
						}
					},
				};*/
			});

			// If we have a post fix then we need to add a direct from the empty url of the split-view-index:
			const firstView = this._workspaceViews[0];
			if (firstView) {
				// Add the first view with the specific split view index in its path, to provide something for the redirect code below:
				this._createViewRoute(
					`${this.splitViewIndex ? this.splitViewIndex + '/' : ''}view/${firstView.meta.pathname}`,
					firstView
				);

				if (this.splitViewIndex) {
					this._routes.push(this._createViewRoute(`:key`, firstView));
					this._routes.push(this._createViewRoute(`:key/`, firstView));

					if (this.splitViewIndex === '0') {
						//this._routes.push(this._createViewRoute('', firstView));
						this._routes.push({
							path: ``,
							redirectTo: `${this.splitViewIndex ? this.splitViewIndex + '/' : ''}view/${firstView.meta.pathname}`,
						});
					}
				}
				/*
				this._routes.push({
					path: `${this.splitViewIndex}`,
					redirectTo: `${this.splitViewIndex ? this.splitViewIndex + '/' : ''}view/${
						this._workspaceViews[0].meta.pathname
					}`,
				});

				// If we have a our index is 0, we also want to cover the situation of no index:

					this._routes.push({
						path: ``,
						redirectTo: `${this.splitViewIndex ? this.splitViewIndex + '/' : ''}view/${
							this._workspaceViews[0].meta.pathname
						}`,
					});

				}
				*/

				/*
				this._routes.push(
					this._createViewRoute(`${this.splitViewIndex ? this.splitViewIndex + '/' : ''}**`, firstView)
				);
				*/
				/*
				this._routes.push({
					path: `${this.splitViewIndex ? this.splitViewIndex + '/' : ''}**`,
					redirectTo: `${this.splitViewIndex ? this.splitViewIndex + '/' : ''}view/${
						this._workspaceViews[0].meta.pathname
					}`,
				});
				*/
			}
		}
	}

	render() {
		return html`
			<umb-body-layout .headline=${this.headline}>
				<slot name="header" slot="header"></slot>
				${this.#renderViews()}
				<slot name="action-menu" slot="action-menu"></slot>
				${this.#renderRoutes()}
				<slot></slot>
				<slot name="footer" slot="footer"></slot>
				${this.#renderWorkspaceActions()}
				<slot name="actions" slot="actions"></slot>
			</umb-body-layout>
		`;
	}

	#renderViews() {
		return html`
			${this._workspaceViews.length > 1
				? html`
						<uui-tab-group slot="tabs">
							${repeat(
								this._workspaceViews,
								(view) => view.alias,
								(view) => html`
									<uui-tab
										.label="${view.meta.label || view.name}"
										href="${this._routerPath + '/'}${this.splitViewIndex ? this.splitViewIndex + '/' : ''}view/${view
											.meta.pathname}"
										?active="${(this.splitViewIndex ? this.splitViewIndex + '/' : '') + 'view/' + view.meta.pathname ===
										this._activePath}">
										<uui-icon slot="icon" name="${view.meta.icon}"></uui-icon>
										${view.meta.label || view.name}
									</uui-tab>
								`
							)}
						</uui-tab-group>
				  `
				: nothing}
		`;
	}

	#renderRoutes() {
		return html`
			${this._routes && this._routes.length > 0
				? html`
						<umb-router-slot
							id="router-slot"
							.routes="${this._routes}"
							@init=${(event: UmbRouterSlotInitEvent) => {
								this._routerPath = event.target.absoluteRouterPath;
							}}
							@change=${(event: UmbRouterSlotChangeEvent) => {
								this._activePath = event.target.localActiveViewPath;
							}}></umb-router-slot>
				  `
				: nothing}
		`;
	}

	#renderWorkspaceActions() {
		return html`
			<umb-extension-slot
				slot="actions"
				type="workspaceAction"
				.filter=${(extension: ManifestWorkspaceAction) => extension.meta.workspaces.includes(this.alias)}
				default-element="umb-workspace-action"></umb-extension-slot>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-workspace-layout': UmbWorkspaceLayout;
	}
}
