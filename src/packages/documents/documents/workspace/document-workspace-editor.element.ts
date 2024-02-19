import { UmbDocumentWorkspaceSplitViewElement } from './document-workspace-split-view.element.js';
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from './document-workspace.context-token.js';
import { customElement, state, css, html } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { UmbVariantId } from '@umbraco-cms/backoffice/variant';
import type { ActiveVariant } from '@umbraco-cms/backoffice/workspace';
import type { UmbRoute, UmbRouterSlotInitEvent } from '@umbraco-cms/backoffice/router';
import type { UmbVariantModel } from '@umbraco-cms/backoffice/variant';

@customElement('umb-document-workspace-editor')
export class UmbDocumentWorkspaceEditorElement extends UmbLitElement {
	//private _defaultVariant?: VariantViewModelBaseModel;

	// TODO: Refactor: when having a split view/variants context token, we can rename the split view/variants component to a generic and make this component generic as well.
	private splitViewElement = new UmbDocumentWorkspaceSplitViewElement();

	@state()
	_routes?: Array<UmbRoute>;

	@state()
	_availableVariants: Array<UmbVariantModel> = [];

	@state()
	_workspaceSplitViews: Array<ActiveVariant> = [];

	#workspaceContext?: typeof UMB_DOCUMENT_WORKSPACE_CONTEXT.TYPE;

	constructor() {
		super();

		this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (instance) => {
			this.#workspaceContext = instance;
			this.#observeVariants();
			this.#observeSplitViews();
		});
	}

	#observeVariants() {
		if (!this.#workspaceContext) return;
		this.observe(
			this.#workspaceContext.variants,
			(variants) => {
				this._availableVariants = variants;
				this._generateRoutes();
			},
			'_observeVariants',
		);
	}

	#observeSplitViews() {
		if (!this.#workspaceContext) return;
		this.observe(
			this.#workspaceContext.splitView.activeVariantsInfo,
			(variants) => {
				this._workspaceSplitViews = variants;
			},
			'_observeSplitViews',
		);
	}

	private _handleVariantFolderPart(index: number, folderPart: string) {
		const variantSplit = folderPart.split('_');
		const culture = variantSplit[0];
		const segment = variantSplit[1];
		this.#workspaceContext?.splitView.setActiveVariant(index, culture, segment);
	}

	private _generateRoutes() {
		if (!this._availableVariants || this._availableVariants.length === 0) return;

		// Generate split view routes for all available routes
		const routes: Array<UmbRoute> = [];

		// Split view routes:
		this._availableVariants.forEach((variantA) => {
			this._availableVariants.forEach((variantB) => {
				routes.push({
					path: new UmbVariantId(variantA).toString() + '_&_' + new UmbVariantId(variantB).toString(),
					component: this.splitViewElement,
					setup: (_component, info) => {
						// Set split view/active info..
						const variantSplit = info.match.fragments.consumed.split('_&_');
						variantSplit.forEach((part, index) => {
							this._handleVariantFolderPart(index, part);
						});
					},
				});
			});
		});

		// Single view:
		this._availableVariants.forEach((variant) => {
			routes.push({
				path: new UmbVariantId(variant).toString(),
				component: this.splitViewElement,
				setup: (_component, info) => {
					// cause we might come from a split-view, we need to reset index 1.
					this.#workspaceContext?.splitView.removeActiveVariant(1);
					this._handleVariantFolderPart(0, info.match.fragments.consumed);
				},
			});
		});

		if (routes.length !== 0) {
			// Using first single view as the default route for now (hence the math below):
			routes.push({
				path: '',
				redirectTo: routes[this._availableVariants.length * this._availableVariants.length]?.path,
			});
		}

		this._routes = routes;
	}

	private _gotWorkspaceRoute = (e: UmbRouterSlotInitEvent) => {
		this.#workspaceContext?.splitView.setWorkspaceRoute(e.target.absoluteRouterPath);
	};

	render() {
		return this._routes && this._routes.length > 0
			? html`<umb-router-slot .routes=${this._routes} @init=${this._gotWorkspaceRoute}></umb-router-slot>`
			: '';
	}

	static styles = [
		UmbTextStyles,
		css`
			:host {
				display: block;
				width: 100%;
				height: 100%;
			}
		`,
	];
}

export default UmbDocumentWorkspaceEditorElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-document-workspace-editor': UmbDocumentWorkspaceEditorElement;
	}
}
