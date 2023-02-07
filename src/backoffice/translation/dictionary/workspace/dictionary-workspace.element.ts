import { UUIInputElement, UUIInputEvent } from '@umbraco-ui/uui';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { distinctUntilChanged } from 'rxjs';
import { UmbWorkspaceEntityElement } from '../../../../backoffice/shared/components/workspace/workspace-entity-element.interface';
import { UmbWorkspaceDictionaryContext } from './dictionary-workspace.context';
import { UmbLitElement } from '@umbraco-cms/element';

@customElement('umb-workspace-dictionary')
export class UmbWorkspaceDictionaryElement extends UmbLitElement implements UmbWorkspaceEntityElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
				width: 100%;
				height: 100%;
			}

			#header {
				margin: 0 var(--uui-size-layout-1);
				flex: 1 1 auto;
			}
		`,
	];

	@state()
	private _dictionaryName!: string;

	private _workspaceContext: UmbWorkspaceDictionaryContext = new UmbWorkspaceDictionaryContext(this);

	public load(entityKey: string) {
		this._workspaceContext.load(entityKey);
	}

	public create(parentKey: string | null) {
		this._workspaceContext.create(parentKey);
	}

	constructor() {
		super();

		this.observe(this._workspaceContext.data.pipe(distinctUntilChanged()), (dictionary) => {
			if (dictionary && dictionary.name !== this._dictionaryName) {
				this._dictionaryName = dictionary.name ?? '';
			}
		});
	}

	// TODO. find a way where we don't have to do this for all workspaces.
	private _handleInput(event: UUIInputEvent) {
		if (event instanceof UUIInputEvent) {
			const target = event.composedPath()[0] as UUIInputElement;

			if (typeof target?.value === 'string') {
				this._workspaceContext?.setName(target.value);
			}
		}
	}

	render() {
		return html`
			<umb-workspace-layout alias="Umb.Workspace.Dictionary">
				<uui-input id="header" slot="header" .value=${this._dictionaryName} @input="${this._handleInput}">
				</uui-input>
			</umb-workspace-layout>
		`;
	}
}

export default UmbWorkspaceDictionaryElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-workspace-dictionary': UmbWorkspaceDictionaryElement;
	}
}
