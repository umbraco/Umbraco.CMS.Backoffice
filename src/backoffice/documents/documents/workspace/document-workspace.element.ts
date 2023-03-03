import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { IRoute, IRoutingInfo } from 'router-slot';
import type { UmbWorkspaceEntityElement } from '../../../shared/components/workspace/workspace-entity-element.interface';
import { ActiveVariant, UmbDocumentWorkspaceContext } from './document-workspace.context';
import { UmbLitElement } from '@umbraco-cms/element';
import '../../../shared/components/workspace/workspace-variant/workspace-variant.element';
import { DocumentModel, VariantViewModelBaseModel } from '@umbraco-cms/backend-api';
import { UmbRouterSlotInitEvent } from '@umbraco-cms/router';

@customElement('umb-document-workspace')
export class UmbDocumentWorkspaceElement extends UmbLitElement implements UmbWorkspaceEntityElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
				width: 100%;
				height: 100%;
			}
		`,
	];

	private _workspaceContext: UmbDocumentWorkspaceContext = new UmbDocumentWorkspaceContext(this);
	//private _defaultVariant?: VariantViewModelBaseModel;

	@state()
	_unique?: string;

	@state()
	_routes?: Array<IRoute>;

	@state()
	_availableVariants: Array<VariantViewModelBaseModel> = [];

	@state()
	_workspaceSplitViews: Array<ActiveVariant> = [];

	constructor() {
		super();

		this.observe(this._workspaceContext.variants, (variants) => {
			this._availableVariants = variants;
			this._generateRoutes();
		});
		this.observe(this._workspaceContext.activeVariantsInfo, (variants) => {
			this._workspaceSplitViews = variants;
		});
	}

	public async load(entityKey: string) {
		const data = await this._workspaceContext.load(entityKey);
		this._gotDocumentData(data);
	}

	public async create(parentKey: string | null) {
		const data = await this._workspaceContext.createScaffold(parentKey);
		this._gotDocumentData(data);
	}

	private _gotDocumentData(data: DocumentModel | undefined) {
		if (data && data.variants && data.variants.length > 0) {
			//this._defaultVariant = data.variants[0];
			this._unique = data.key;
			// Maybe we need to re-generate routes here?
		} else {
			// Fail beautifully?
		}
	}

	private _generateVariantURL(culture: string | null = 'invariant', segment?: string | null) {
		// TODO: make serialize and deserialize variant-string methods
		return culture + (segment ? '_' + segment : '');
	}

	private _handleVariantFolderPart(index: number, folderPart: string) {
		const variantSplit = folderPart.split('_');
		const culture = variantSplit[0];
		const segment = variantSplit[1];
		this._workspaceContext.setActiveVariant(index, culture, segment);
	}

	private _generateRoutes() {
		// Generate split view routes for all available routes
		const routes: Array<IRoute> = [];

		// Split view routes:
		this._availableVariants.forEach((variantA) => {
			this._availableVariants.forEach((variantB) => {
				routes.push({
					path:
						this._generateVariantURL(variantA.culture, variantA.segment) +
						'_split_' +
						this._generateVariantURL(variantB.culture, variantB.segment),
					component: () => import('./document-workspace-split-view.element'),
					setup: (component: HTMLElement | Promise<HTMLElement>, info: IRoutingInfo) => {
						// Set split view/active info..
						const variantSplit = info.match.fragments.consumed.split('_split_');
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
				path: this._generateVariantURL(variant.culture, variant.segment),
				component: () => import('./document-workspace-split-view.element'),
				setup: (component: HTMLElement | Promise<HTMLElement>, info: IRoutingInfo) => {
					// cause we might come from a split-view, we need to reset index 1.
					this._workspaceContext.closeSplitView();
					this._handleVariantFolderPart(0, info.match.fragments.consumed);
				},
			});
		});

		if (routes.length !== 0) {
			// Using first single view as the default route for now (hence the math below):
			routes.push({
				path: '**',
				redirectTo: routes[this._availableVariants.length * this._availableVariants.length]?.path,
			});
		}

		this._routes = routes;
	}

	private _gotWorkspaceRoute = (e: UmbRouterSlotInitEvent) => {
		this._workspaceContext.setWorkspaceRoute(e.target.absoluteRouterPath);
	};

	render() {
		return this._unique
			? html`<umb-router-slot .routes=${this._routes} @init=${this._gotWorkspaceRoute}></umb-router-slot>`
			: nothing;
	}
}

export default UmbDocumentWorkspaceElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-document-workspace': UmbDocumentWorkspaceElement;
	}
}
