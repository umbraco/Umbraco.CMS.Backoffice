import { UUIInputElement, UUIInputEvent } from '@umbraco-ui/uui';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { UmbWorkspaceDictionaryContext } from './dictionary-workspace.context';
import { UmbLitElement } from '@umbraco-cms/element';

@customElement('umb-dictionary-workspace')
export class UmbWorkspaceDictionaryElement extends UmbLitElement {
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

	load(entityKey: string) {
		this.#workspaceContext.load(entityKey);
	}

	create(parentKey: string | null) {
		this.#isNew = true;
		this.#workspaceContext.createScaffold(parentKey);
	}

	@state()
	private _name?: string | null = '';

	#workspaceContext = new UmbWorkspaceDictionaryContext(this);
	#isNew = false;

	async connectedCallback() {
		super.connectedCallback();

		this.provideContext('umbWorkspaceContext', this.#workspaceContext);

		this.observe(this.#workspaceContext.name, (name) => {
			this._name = name;
		});
	}


	// TODO. find a way where we don't have to do this for all workspaces.
	#handleInput(event: UUIInputEvent) {
		if (event instanceof UUIInputEvent) {
			const target = event.composedPath()[0] as UUIInputElement;

			if (typeof target?.value === 'string') {
				this.#workspaceContext?.setName(target.value);
			}
		}
	}

	render() {
		return html`
			<umb-workspace-layout alias="Umb.Workspace.Dictionary">
				<uui-input id="header" slot="header" .value=${this._name} @input="${this.#handleInput}">
				</uui-input>
			</umb-workspace-layout>
		`;
	}
}

export default UmbWorkspaceDictionaryElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-dictionary-workspace': UmbWorkspaceDictionaryElement;
	}
}
