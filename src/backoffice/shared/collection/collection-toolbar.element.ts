import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { map } from 'rxjs';
import { TooltipMenuItem } from '../components/tooltip-menu';
import '../components/tooltip-menu/tooltip-menu.element';
import type { ManifestCollectionView } from '@umbraco-cms/backoffice/extensions-registry';
import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extensions-api';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';

@customElement('umb-collection-toolbar')
export class UmbCollectionToolbarElement extends UmbLitElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: flex;
				gap: var(--uui-size-3);
				width: 100%;
				padding: var(--uui-size-space-4) var(--uui-size-space-6);
				align-items: center;
				box-sizing: border-box;
			}

			uui-popover {
				width: min-content;
			}
			#search {
				width: 100%;
			}
		`,
	];

	@property()
	public actions: Array<TooltipMenuItem> = [
		{
			label: 'File',
			icon: 'umb:document',
			action: () => {
				console.log('Create file');
			},
		},
		{
			label: 'Folder',
			icon: 'umb:folder',
			action: () => {
				console.log('create folder');
			},
		},
	];

	@property()
	public useSearch = true;

	@state()
	private _layouts: Array<ManifestCollectionView> = [];

	@state()
	private _currentLayout?: ManifestCollectionView;

	@state()
	private _search = '';
	@state()
	private _actionsOpen = false;
	@state()
	private _viewTypesOpen = false;

	constructor() {
		super();
		this._observeCollectionViews();
	}

	private _observeCollectionViews() {
		this.observe<ManifestCollectionView[]>(
			umbExtensionsRegistry.extensionsOfType('collectionView').pipe(
				map((extensions) => {
					return extensions.filter((extension) => extension.conditions.entityType === 'media');
				})
			),
			(layouts) => {
				this._layouts = layouts;

				if (!this._currentLayout) {
					//TODO: Find a way to figure out which layout it starts with and set _currentLayout to that instead of [0]. eg. '/table'
					this._currentLayout = layouts[0];
				}
			}
		);
	}

	private _changeLayout(path: string) {
		history.pushState(null, '', 'section/media/dashboard/media-management/' + path);
	}

	private _toggleViewType() {
		if (!this._currentLayout) return;

		const index = this._layouts.indexOf(this._currentLayout);
		this._currentLayout = this._layouts[(index + 1) % this._layouts.length];
		this._changeLayout(this._currentLayout.meta.pathName);
	}

	private _updateSearch(e: InputEvent) {
		this._search = (e.target as HTMLInputElement).value;

		this.dispatchEvent(
			new CustomEvent('search', {
				detail: this._search,
			})
		);
	}

	private _renderCreateButton() {
		if (this.actions.length === 0) return nothing;

		if (this.actions.length === 1) {
			return html`<uui-button @click=${() => this.actions[0].action()} look="outline">Create</uui-button>`;
		}
		if (this.actions.length > 1) {
			return html`<uui-popover margin="8" .open=${this._actionsOpen} @close=${() => (this._actionsOpen = false)}>
				<uui-button @click=${() => (this._actionsOpen = !this._actionsOpen)} slot="trigger" look="outline">
					Create
				</uui-button>
				<umb-tooltip-menu slot="popover" .items=${this.actions}></umb-tooltip-menu>
			</uui-popover>`;
		}

		return nothing;
	}

	private _renderLayoutButton() {
		if (!this._currentLayout) return;

		if (this._layouts.length < 2 || !this._currentLayout.meta.icon) return nothing;

		if (this._layouts.length === 2) {
			return html`<uui-button @click=${this._toggleViewType} look="outline" compact>
				<uui-icon .name=${this._currentLayout.meta.icon}></uui-icon>
			</uui-button>`;
		}
		if (this._layouts.length > 2) {
			return html`<uui-popover margin="8" .open=${this._viewTypesOpen} @close=${() => (this._viewTypesOpen = false)}>
				<uui-button @click=${() => (this._viewTypesOpen = !this._viewTypesOpen)} slot="trigger" look="outline" compact>
					<uui-icon .name=${this._currentLayout.meta.icon}></uui-icon>
				</uui-button>
				<umb-tooltip-menu
					icon-only
					slot="popover"
					.items=${this._layouts.map((layout) => ({
						label: layout.meta.label,
						icon: layout.meta.icon,
						action: () => {
							this._changeLayout(layout.meta.pathName);
							this._viewTypesOpen = false;
						},
					}))}></umb-tooltip-menu>
			</uui-popover>`;
		}

		return nothing;
	}

	render() {
		return html`
			${this._renderCreateButton()}
			<uui-input id="search" @input=${this._updateSearch}></uui-input>
			${this._renderLayoutButton()}
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-collection-toolbar': UmbCollectionToolbarElement;
	}
}
