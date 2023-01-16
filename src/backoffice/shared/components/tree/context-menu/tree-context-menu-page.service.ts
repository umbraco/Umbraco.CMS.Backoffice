import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, nothing, PropertyValueMap } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import UmbTreeItemActionElement, { ActionPageEntity } from '../action/tree-item-action.element';
import { UmbLitElement } from '@umbraco-cms/element';
import { UniqueBehaviorSubject } from '@umbraco-cms/observable-api';

// TODO: Refactor this, its not a service and the data should be handled by a context api.
@customElement('umb-tree-context-menu-page-service')
export class UmbTreeContextMenuPageService extends UmbLitElement {
	static styles = [UUITextStyles, css``];

	@property({ type: Object })
	public actionEntity: ActionPageEntity = { key: '', name: '' };

	#entity = new UniqueBehaviorSubject({ key: '', name: '' } as ActionPageEntity);
	public readonly entity = this.#entity.asObservable();

	@state()
	private _pages: Array<HTMLElement> = [];

	connectedCallback() {
		super.connectedCallback();
		this.provideContext('umbTreeContextMenuPageService', this);
		this.openFreshPage('umb-tree-context-menu-page-action-list');
	}

	protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
		super.updated(_changedProperties);

		if (_changedProperties.has('actionEntity')) {
			this.#entity.next(this.actionEntity);
			//TODO: Move back to first page
			this.openFreshPage('umb-tree-context-menu-page-action-list');
		}
	}

	public openPage(elementName: string) {
		const element = document.createElement(elementName) as UmbTreeItemActionElement;
		this._pages.push(element);
		this.requestUpdate('_pages');
	}

	public openFreshPage(elementName: string) {
		this._pages = [];
		this.openPage(elementName);
	}

	public closeTopPage() {
		this._pages.pop();
		this.requestUpdate('_pages');
	}

	private _renderTopPage() {
		if (this._pages.length === 0) {
			return nothing;
		}

		return this._pages[this._pages.length - 1];
	}

	render() {
		return this._renderTopPage();
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-tree-context-menu-page-service': UmbTreeContextMenuPageService;
	}
}
