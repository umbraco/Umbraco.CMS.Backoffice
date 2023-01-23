import { css, html } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, state } from 'lit/decorators.js';
import type { UmbWorkspaceContentContext } from '../../workspace-content.context';
import type { DocumentDetails, MediaDetails } from '@umbraco-cms/models';
import { UmbLitElement } from '@umbraco-cms/element';

@customElement('umb-workspace-view-content-info')
export class UmbWorkspaceViewContentInfoElement extends UmbLitElement {
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
	private _nodeName = '';

	private _workspaceContext?: UmbWorkspaceContentContext<DocumentDetails | MediaDetails>;

	constructor() {
		super();

		// TODO: Figure out how to get the magic string for the workspace context.
		this.consumeContext<UmbWorkspaceContentContext<DocumentDetails | MediaDetails>>(
			'umbWorkspaceContext',
			(nodeContext) => {
				this._workspaceContext = nodeContext;
				this._observeContent();
			}
		);
	}

	private _observeContent() {
		if (!this._workspaceContext) return;

		this.observe(this._workspaceContext.name, (name) => {
			this._nodeName = name || '';
		});
	}

	render() {
		return html`<div>Info Workspace View for ${this._nodeName}</div>`;
	}
}

export default UmbWorkspaceViewContentInfoElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-workspace-view-content-info': UmbWorkspaceViewContentInfoElement;
	}
}
