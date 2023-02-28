import { css, html } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, state } from 'lit/decorators.js';
import { UmbWorkspaceEntityContextInterface } from '../../../workspace-context/workspace-entity-context.interface';
import type { DocumentModel } from '@umbraco-cms/backend-api';
import { UmbLitElement } from '@umbraco-cms/element';

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

			uui-tag uui-icon {
				margin-right: var(--uui-size-space-1);
			}
		`,
	];

	@state()
	private _nodeName = '';

	private _workspaceContext?: UmbWorkspaceEntityContextInterface<DocumentModel>;

	constructor() {
		super();

		// TODO: Figure out how to get the magic string for the workspace context.
		this.consumeContext<UmbWorkspaceEntityContextInterface<DocumentModel>>('umbWorkspaceContext', (nodeContext) => {
			this._workspaceContext = nodeContext;
			this._observeContent();
		});
	}

	private _observeContent() {
		if (!this._workspaceContext) return;

		this._nodeName = 'TBD, with variants this is not as simple.';
		/*
		this.observe(this._workspaceContext.name, (name) => {
			this._nodeName = name || '';
		});
		*/
	}

	render() {
		return html`<div class="container">
				<uui-box headline="Links"> Info Workspace View for ${this._nodeName} </uui-box>
				<uui-box headline="History">
					<umb-history-ui-list>
						<umb-history-ui-node name="Lone Iversen" detail="December 5, 2022 2:59 PM">
							<span><uui-tag look="secondary" label="Cleanup">Save</uui-tag>Content saved</span>
							<uui-button look="secondary" slot="actions"><uui-icon name="umb:undo"></uui-icon> Rollback</uui-button>
						</umb-history-ui-node>
						<umb-history-ui-node name="Umbraco HQ" detail="December 5, 2022 2:59 PM">
							<span><uui-tag look="secondary" label="Cleanup">Save</uui-tag>Content saved</span>
							<uui-button look="secondary" slot="actions"><uui-icon name="umb:undo"></uui-icon> Rollback</uui-button>
						</umb-history-ui-node>
						<umb-history-ui-node name="Umbraco HQ" detail="December 5, 2022 2:59 PM">
							<span><uui-tag look="secondary" label="Cleanup">Save</uui-tag>Content saved</span>
							<uui-button look="secondary" slot="actions"><uui-icon name="umb:undo"></uui-icon> Rollback</uui-button>
						</umb-history-ui-node>
					</umb-history-ui-list>
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
