import { css, customElement, html, nothing, property, repeat, state, when } from '@umbraco-cms/backoffice/external/lit';
import { createExtensionElement, UmbExtensionsManifestInitializer } from '@umbraco-cms/backoffice/extension-api';
import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import type { ManifestWorkspaceView } from '@umbraco-cms/backoffice/extension-registry';
import type { UmbRoute, UmbRouterSlotInitEvent, UmbRouterSlotChangeEvent } from '@umbraco-cms/backoffice/router';

/**
 * @element umb-workspace-editor
 * @description
 * @slot icon - Slot for icon
 * @slot header - Slot for workspace header
 * @slot name - Slot for name
 * @slot footer - Slot for workspace footer
 * @slot actions - Slot for workspace footer actions
 * @slot default - slot for main content
 * @export
 * @class UmbWorkspaceEditor
 * @extends {UmbLitElement}
 */
// TODO: This element has a bug in the tabs. After the url changes - for example a new entity/file is chosen in the tree and loaded to the workspace the links in the tabs still point to the previous url and therefore views do not change correctly
@customElement('umb-workspace-editor')
export class UmbWorkspaceEditorElement extends UmbLitElement {
	@property()
	public headline = '';

	@property({ type: Boolean })
	public hideNavigation = false;

	@property({ type: Boolean })
	public enforceNoFooter = false;

	@property({ attribute: 'back-path' })
	public backPath?: string;

	@state()
	private _workspaceViews: Array<ManifestWorkspaceView> = [];

	@state()
	private _routes?: UmbRoute[];

	@state()
	private _routerPath?: string;

	@state()
	private _activePath?: string;

	constructor() {
		super();

		new UmbExtensionsManifestInitializer(this, umbExtensionsRegistry, 'workspaceView', null, (workspaceViews) => {
			this._workspaceViews = workspaceViews.map((view) => view.manifest);
			this._createRoutes();
		});
	}

	private _createRoutes() {
		let newRoutes: UmbRoute[] = [];

		if (this._workspaceViews.length > 0) {
			newRoutes = this._workspaceViews.map((manifest) => {
				return {
					path: `view/${manifest.meta.pathname}`,
					component: () => createExtensionElement(manifest),
					setup: (component) => {
						if (component) {
							(component as any).manifest = manifest;
						}
					},
				} as UmbRoute;
			});

			// If we have a post fix then we need to add a direct from the empty url of the split-view-index:
			// TODO: This is problematic, cause if a workspaceView appears later, then this takes over. And it is also a problem if it does not use redirect, but just a view defined with and empty path.
			const firstRoute = newRoutes[0];
			if (firstRoute) {
				newRoutes.push({
					path: ``,
					redirectTo: firstRoute.path,
				});
			}
		}

		this._routes = newRoutes;
	}

	override render() {
		return html`
			<umb-body-layout main-no-padding .headline=${this.headline}>
				${this.#renderBackButton()}
				<slot name="header" slot="header"></slot>
				${this.#renderViews()}
				<slot name="action-menu" slot="action-menu"></slot>
				${this.#renderRoutes()}
				<slot></slot>
				${when(
					!this.enforceNoFooter,
					() => html`
						<umb-workspace-footer slot="footer">
							<slot name="footer-info"></slot>
							<slot name="actions" slot="actions"></slot>
						</umb-workspace-footer>
					`,
				)}
			</umb-body-layout>
		`;
	}

	#renderViews() {
		return html`
			${!this.hideNavigation && this._workspaceViews.length > 1
				? html`
						<uui-tab-group slot="navigation">
							${repeat(
								this._workspaceViews,
								(view) => view.alias,
								(view) => html`
									<uui-tab
										href="${this._routerPath}/view/${view.meta.pathname}"
										.label="${view.meta.label ? this.localize.string(view.meta.label) : view.name}"
										?active=${'view/' + view.meta.pathname === this._activePath}>
										<umb-icon slot="icon" name=${view.meta.icon}></umb-icon>
										${view.meta.label ? this.localize.string(view.meta.label) : view.name}
									</uui-tab>
								`,
							)}
						</uui-tab-group>
					`
				: nothing}
		`;
	}

	#renderBackButton() {
		if (!this.backPath) return nothing;
		return html`
			<uui-button
				slot="header"
				class="back-button"
				compact
				href=${this.backPath}
				label=${this.localize.term('general_back')}>
				<uui-icon name="icon-arrow-left"></uui-icon>
			</uui-button>
		`;
	}

	#renderRoutes() {
		if (!this._routes || this._routes.length === 0) return nothing;
		return html`
			<umb-router-slot
				id="router-slot"
				.routes=${this._routes}
				@init=${(event: UmbRouterSlotInitEvent) => {
					this._routerPath = event.target.absoluteRouterPath;
				}}
				@change=${(event: UmbRouterSlotChangeEvent) => {
					this._activePath = event.target.localActiveViewPath;
				}}></umb-router-slot>
		`;
	}

	static override styles = [
		UmbTextStyles,
		css`
			:host {
				display: block;
				width: 100%;
				height: 100%;
			}

			#router-slot {
				display: flex;
				flex-direction: column;
				height: 100%;
			}

			.back-button {
				margin-right: var(--uui-size-space-4);
			}

			uui-input {
				width: 100%;
			}

			uui-tab-group {
				--uui-tab-divider: var(--uui-color-border);
				border-left: 1px solid var(--uui-color-border);
				border-right: 1px solid var(--uui-color-border);
			}

			umb-extension-slot[slot='actions'] {
				display: flex;
				gap: var(--uui-size-space-2);
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-workspace-editor': UmbWorkspaceEditorElement;
	}
}
