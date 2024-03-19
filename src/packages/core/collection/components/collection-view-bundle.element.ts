import type { UmbDefaultCollectionContext } from '../default/collection-default.context.js';
import { UMB_DEFAULT_COLLECTION_CONTEXT } from '../default/collection-default.context.js';
import type { ManifestCollectionView } from '../../extension-registry/models/collection-view.model.js';
import { css, html, customElement, state, nothing } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

@customElement('umb-collection-view-bundle')
export class UmbCollectionViewBundleElement extends UmbLitElement {
	@state()
	_views: Array<ManifestCollectionView> = [];

	@state()
	_currentView?: ManifestCollectionView;

	@state()
	private _collectionRootPathname?: string;

	#collectionContext?: UmbDefaultCollectionContext<any, any>;

	constructor() {
		super();

		this.consumeContext(UMB_DEFAULT_COLLECTION_CONTEXT, (context) => {
			this.#collectionContext = context;
			if (!this.#collectionContext) return;
			this.#observeRootPathname();
			this.#observeViews();
			this.#observeCurrentView();
		});
	}

	#observeRootPathname() {
		this.observe(
			this.#collectionContext!.view.rootPathname,
			(rootPathname) => {
				this._collectionRootPathname = rootPathname;
			},
			'umbCollectionRootPathnameObserver',
		);
	}

	#observeCurrentView() {
		this.observe(
			this.#collectionContext!.view.currentView,
			(view) => {
				//TODO: This is not called when the view is changed
				this._currentView = view;
			},
			'umbCurrentCollectionViewObserver',
		);
	}

	#observeViews() {
		this.observe(
			this.#collectionContext!.view.views,
			(views) => {
				this._views = views;
			},
			'umbCollectionViewsObserver',
		);
	}
	render() {
		if (!this._currentView) return nothing;
		if (this._views.length <= 1) return nothing;

		return html`
			<uui-button compact popovertarget="collection-view-bundle-popover" label="status">
				${this.#renderItemDisplay(this._currentView)}
			</uui-button>
			<uui-popover-container id="collection-view-bundle-popover" placement="bottom-end">
				<umb-popover-layout>
					<div class="filter-dropdown">${this._views.map((view) => this.#renderItem(view))}</div>
				</umb-popover-layout>
			</uui-popover-container>
		`;
	}

	#renderItem(view: ManifestCollectionView) {
		return html`
			<uui-button compact href="${this._collectionRootPathname}/${view.meta.pathName}">
				${this.#renderItemDisplay(view)} <span class="label">${view.meta.label}</span>
			</uui-button>
		`;
	}

	#renderItemDisplay(view: ManifestCollectionView) {
		return html`<umb-icon name=${view.meta.icon}></umb-icon>`;
	}

	static styles = [
		UmbTextStyles,
		css`
			:host {
				--uui-button-content-align: left;
			}
			.label {
				margin-left: var(--uui-size-space-1);
			}
			.filter-dropdown {
				display: flex;
				gap: var(--uui-size-space-3);
				flex-direction: column;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-collection-view-bundle': UmbCollectionViewBundleElement;
	}
}
