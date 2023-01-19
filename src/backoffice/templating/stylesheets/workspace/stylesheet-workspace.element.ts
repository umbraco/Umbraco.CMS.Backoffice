import { UUIInputElement, UUIInputEvent } from '@umbraco-ui/uui';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { UmbStylesheetDetailsStoreItem } from '../stylesheet.store';
import { UmbStylesheetWorkspaceContext } from './stylesheet-workspace.context';
import { UmbLitElement } from '@umbraco-cms/element';

/**
 * @element umb-stylesheet-workspace
 * @description - Element for displaying a Stylesheet Workspace
 */
@customElement('umb-stylesheet-workspace')
export class UmbStylesheetWorkspaceElement extends UmbLitElement {
	static styles = [UUITextStyles, css``];

	// TODO: change to unique
	private _unique!: string;
	@property()
	public get entityKey(): string {
		return this._unique;
	}
	public set entityKey(value: string) {
		this._unique = value;
		if (this._unique) {
			this._workspaceContext.load(this._unique);
		}
	}

	@property()
	public set create(parentUnique: string | null) {
		this._workspaceContext.create(parentUnique);
	}

	private _workspaceContext = new UmbStylesheetWorkspaceContext(this);

	@state()
	private _stylesheet?: UmbStylesheetDetailsStoreItem;

	constructor() {
		super();
		this.provideContext('umbWorkspaceContext', this._workspaceContext);
		this.observe(this._workspaceContext.data, (stylesheet) => {
			// TODO. we get the wrong type from the context context
			this._stylesheet = stylesheet as UmbStylesheetDetailsStoreItem;
		});
	}

	render() {
		return html`
			<umb-workspace-layout alias="Umb.Workspace.Stylesheet"><h1>${this._stylesheet?.name}</h1></umb-workspace-layout>
		`;
	}
}

export default UmbStylesheetWorkspaceElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-stylesheet-workspace': UmbStylesheetWorkspaceElement;
	}
}
