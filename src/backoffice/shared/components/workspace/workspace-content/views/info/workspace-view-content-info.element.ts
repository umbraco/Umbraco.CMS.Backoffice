import { css, html } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, state } from 'lit/decorators.js';
import { UmbWorkspaceEntityContextInterface } from '../../../workspace-context/workspace-entity-context.interface';
import type { DocumentDetails, MediaDetails } from '@umbraco-cms/models';
import { UmbLitElement } from '@umbraco-cms/element';
import '../../../../history-ui-maker/history-ui-maker.element';

@customElement('umb-workspace-view-content-info')
export class UmbWorkspaceViewContentInfoElement extends UmbLitElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: grid;
				gap: var(--uui-size-layout-1);
				margin: var(--uui-size-layout-1);
				grid-template-columns: 1fr 350px;
			}

			div.container {
				display: flex;
				flex-direction: column;
				gap: var(--uui-size-layout-1);
			}

			/*TODO: Do we want to set up a layout element for this setup? (css styles of :host and div.container) */

			div.headline {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			div.headline h2 {
				font-size: var(--uui-type-h5-size);
				font-weight: bold;
				margin: 0;
			}
		`,
	];

	@state()
	private _nodeName = '';

	private _workspaceContext?: UmbWorkspaceEntityContextInterface<DocumentDetails | MediaDetails>;

	constructor() {
		super();

		// TODO: Figure out how to get the magic string for the workspace context.
		this.consumeContext<UmbWorkspaceEntityContextInterface<DocumentDetails | MediaDetails>>(
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
		return html`<div class="container">
				<uui-box headline="Links"> Info Workspace View for ${this._nodeName} </uui-box>
				<uui-box>
					<div class="headline" slot="headline">
						<h2>History</h2>
						<uui-button label="Rollback" look="outline">Rollback...</uui-button>
					</div>
					<umb-history-ui-maker></umb-history-ui-maker>
				</uui-box>
			</div>
			<div class="container">
				<uui-box headline="General"></uui-box>
			</div>`;
	}
}

export default UmbWorkspaceViewContentInfoElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-workspace-view-content-info': UmbWorkspaceViewContentInfoElement;
	}
}
