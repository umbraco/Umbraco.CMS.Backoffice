import { css, html } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { UmbDocumentWorkspaceContext } from '../document-workspace.context';
import { UmbLitElement } from '@umbraco-cms/element';
import { DocumentProperty } from '@umbraco-cms/backend-api';

@customElement('umb-workspace-view-document-edit')
export class UmbWorkspaceViewDocumentEditElement extends UmbLitElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
				margin: var(--uui-size-layout-1);
			}
		`,
	];

	@state()
	_properties: DocumentProperty[] = [];

	private _workspaceContext?: UmbDocumentWorkspaceContext;

	constructor() {
		super();

		// TODO: Figure out how to get the magic string for the workspace context.
		this.consumeContext<UmbDocumentWorkspaceContext>('umbWorkspaceContext', (workspaceContext) => {
			this._workspaceContext = workspaceContext;
			console.log('document workspaceContext', workspaceContext);
			this._observeContent();
		});
	}

	private _observeContent() {
		if (!this._workspaceContext) return;

		/*
		TODO: Property-Context: This observer gets all changes, We need to fix this. it should be simpler.
		An idea to optimize this would be for this to only care about layout, meaning to property data should be watched here.
		As the properties could handle their own data on their own?

		Should use a Observable for example: this._workspaceContext.properties
		*/
		this.observe(
			this._workspaceContext.properties,
			(content) => {
				this._properties = content?.properties || [];
				//this._data = content?.data || [];

				/*
				Maybe we should not give the value(Data), but the umb-content-property should get the context and observe its own data.
				This would become a more specific Observer therefor better performance?.. Note to self: Debate with Mads how he sees this perspective.
				*/
			},
			'observeWorkspaceContextData'
		);
		this.observe(
			this._workspaceContext.dataTypes,
			(content) => {
				this._dataTypes = content?.dataTypes || [];
			},
			'observeWorkspaceContextData'
		);
	}

	render() {
		return html`
			<uui-box>
				${repeat(
					this._properties,
					(property) => property.alias,
					(property) =>
						html`<umb-content-property .property=${property} .value=${property.value}></umb-content-property> `
				)}
			</uui-box>
		`;
	}
}

export default UmbWorkspaceViewDocumentEditElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-workspace-view-document-edit': UmbWorkspaceViewDocumentEditElement;
	}
}
