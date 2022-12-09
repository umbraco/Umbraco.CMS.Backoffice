import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IRoute, IRoutingInfo, PageComponent, RouterSlot } from 'router-slot';
import { map } from 'rxjs';

import { UmbObserverMixin } from '@umbraco-cms/observable-api';
import { createExtensionElement } from '@umbraco-cms/extensions-api';
import { umbExtensionsRegistry } from '@umbraco-cms/extensions-registry';
import { UmbContextConsumerMixin } from '@umbraco-cms/context-api';
import type { ManifestEditorAction, ManifestEditorView } from '@umbraco-cms/models';

import '../../../components/body-layout/body-layout.element';
import '../editor-action-extension/editor-action-extension.element';

/**
 * @element umb-editor-content-layout
 * @description
 * @slot icon - Slot for rendering the entity icon
 * @slot name - Slot for rendering the entity name
 * @slot footer - Slot for rendering the entity footer
 * @slot actions - Slot for rendering the entity actions
 * @slot default - slot for main content
 * @export
 * @class UmbEditorContentLayout
 * @extends {UmbContextConsumerMixin(LitElement)}
 */
@customElement('umb-editor-content-layout')
export class UmbEditorNodeLayout extends UmbContextConsumerMixin(UmbObserverMixin(LitElement)) {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
				width: 100%;
				height: 100%;
			}

			#header {
				display: flex;
				gap: 16px;
				align-items: center;
				min-height: 60px;
			}

			#name {
				display: block;
				flex: 1 1 auto;
			}

			#footer {
				display: flex;
				height: 100%;
				align-items: center;
				gap: 16px;
				flex: 1 1 auto;
			}

			#actions {
				display: block;
				margin-left: auto;
			}

			uui-input {
				width: 100%;
			}

			uui-tab-group {
				--uui-tab-divider: var(--uui-color-border);
				border-left: 1px solid var(--uui-color-border);
				border-right: 1px solid var(--uui-color-border);
			}
		`,
	];

	/**
	 * Alias of the editor. The Layout will render the editor views that are registered for this editor alias.
	 * @public
	 * @type {string}
	 * @attr
	 * @default ''
	 */
	@property()
	public headline = '';

	@property()
	public alias = '';

	@state()
	private _editorViews: Array<ManifestEditorView> = [];

	@state()
	private _editorActions: Array<ManifestEditorAction> = [];

	@state()
	private _currentView = '';

	@state()
	private _routes: Array<IRoute> = [];

	private _routerFolder = '';

	connectedCallback(): void {
		super.connectedCallback();

		this._observeEditorViews();
		this._observeEditorActions();

		/* TODO: find a way to construct absolute urls */
		this._routerFolder = window.location.pathname.split('/view')[0];
	}

	private _observeEditorViews() {
		this.observe<ManifestEditorView[]>(
			umbExtensionsRegistry
				.extensionsOfType('editorView')
				.pipe(map((extensions) => extensions.filter((extension) => extension.meta.editors.includes(this.alias)))),
			(editorViews) => {
				this._editorViews = editorViews;
				this._createRoutes();
			}
		);
	}

	private _observeEditorActions() {
		this.observe(
			umbExtensionsRegistry
				?.extensionsOfType('editorAction')
				.pipe(map((extensions) => extensions.filter((extension) => extension.meta.editors.includes(this.alias)))),
			(editorActions) => {
				this._editorActions = editorActions;
			}
		);
	}

	private async _createRoutes() {
		if (this._editorViews.length > 0) {
			this._routes = [];

			this._routes = this._editorViews.map((view) => {
				return {
					path: `view/${view.meta.pathname}`,
					component: () => createExtensionElement(view) as unknown as PageComponent,
					setup: (_element: HTMLElement, info: IRoutingInfo) => {
						this._currentView = info.match.route.path;
					},
				};
			});

			this._routes.push({
				path: '**',
				redirectTo: `view/${this._editorViews?.[0].meta.pathname}`,
			});

			this.requestUpdate();
			await this.updateComplete;

			this._forceRouteRender();
		}
	}

	// TODO: Figure out why this has been necessary for this case. Come up with another case
	private _forceRouteRender() {
		const routerSlotEl = this.shadowRoot?.querySelector('router-slot') as RouterSlot;
		if (routerSlotEl) {
			routerSlotEl.render();
		}
	}

	private _renderTabs() {
		return html`
			${this._editorViews?.length > 0
				? html`
						<uui-tab-group slot="views">
							${this._editorViews.map(
								(view: ManifestEditorView) => html`
									<uui-tab
										.label="${view.meta.label || view.name}"
										href="${this._routerFolder}/view/${view.meta.pathname}"
										?active="${this._currentView.includes(view.meta.pathname)}">
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

	render() {
		return html`
			<umb-body-layout>
				<div id="header" slot="header">
					<!-- Niels thoughts, TODO: maybe this is too specific for this spot. Lets consider extracting this into the document editor. As this seems/potentially should be unique for each editor -->
					<slot id="icon" name="icon"></slot>
					<div id="name">
						${this.headline ? html`<h3>${this.headline}</h3>` : nothing}
						<slot id="name" name="name"></slot>
					</div>
					${this._renderTabs()}
				</div>

				<router-slot .routes="${this._routes}"></router-slot>
				<slot></slot>

				<div id="footer" slot="footer">
					<slot name="footer"></slot>
					<div id="actions">
						${this._editorActions.map(
							(action) => html`<umb-editor-action-extension .editorAction=${action}></umb-editor-action-extension>`
						)}
						<slot name="actions"></slot>
					</div>
				</div>
			</umb-body-layout>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-editor-node-layout': UmbEditorNodeLayout;
	}
}
