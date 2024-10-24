import { UmbWorkspaceEditorContext } from './workspace-editor.context.js';
import type { UmbWorkspaceEditorView } from './workspace-editor.context.js';
import { css, customElement, html, nothing, property, repeat, state, when } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import type { UmbRoute, UmbRouterSlotInitEvent, UmbRouterSlotChangeEvent } from '@umbraco-cms/backoffice/router';

/**
 * @element umb-workspace-editor
 * @description
 * @slot icon - Slot for icon
 * @slot header - Slot for workspace header
 * @slot name - Slot for name
 * @slot footer - Slot for workspace footer
 * @slot actions - Slot for workspace footer actions
 * @slot - slot for main content
 * @class UmbWorkspaceEditor
 * @augments {UmbLitElement}
 */
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
	private _workspaceViews: Array<UmbWorkspaceEditorView> = [];

	@state()
	private _routes?: UmbRoute[];

	@state()
	private _routerPath?: string;

	@state()
	private _activePath?: string;

	#workspaceEditorContext = new UmbWorkspaceEditorContext(this);

	constructor() {
		super();

		this.observe(this.#workspaceEditorContext.views, (workspaceViews) => {
			this._workspaceViews = [...workspaceViews].sort((a, b) => b.weight - a.weight);
		});

		this.observe(this.#workspaceEditorContext.routes, (routes) => {
			this._routes = routes;
		});
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
								(view) => view,
								(view, index) => this.#renderView(view, index),
							)}
						</uui-tab-group>
					`
				: nothing}
		`;
	}

	#renderView(view: UmbWorkspaceEditorView, index: number) {
		// Notice how we use index 0 to determine which workspace that is active with empty path. [NL]
		return html`
			<uui-tab
				href="${this._routerPath}/view/${view.pathName}"
				?active=${'view/' + view.pathName === this._activePath || (index === 0 && this._activePath === '')}>
				<umb-icon slot="icon" name=${view.icon}></umb-icon>
				${this.localize.string(view.label)}
			</uui-tab>
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
