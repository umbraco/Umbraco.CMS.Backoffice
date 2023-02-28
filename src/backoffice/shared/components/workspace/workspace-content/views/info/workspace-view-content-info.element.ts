import { css, html, nothing } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, state } from 'lit/decorators.js';
import { UmbWorkspaceEntityContextInterface } from '../../../workspace-context/workspace-entity-context.interface';
import type { DocumentModel } from '@umbraco-cms/backend-api';
import { UmbLitElement } from '@umbraco-cms/element';

interface HistoryNode {
	userId?: number;
	userAvatars?: [];
	userName?: string;
	timestamp?: string;
	comment?: string;
	entityType?: string;
	logType?: HistoryLogType;
	nodeId?: string;
	parameters?: string;
}

type HistoryLogType = 'Publish' | 'Save' | 'Unpublish' | 'ContentVersionEnableCleanup' | 'ContentVersionPreventCleanup';

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

			.log-type {
				display: flex;
				gap: var(--uui-size-space-2);
			}
		`,
	];

	@state()
	private _nodeName = '';

	private _workspaceContext?: UmbWorkspaceEntityContextInterface<DocumentModel>;

	@state()
	private _historyList: HistoryNode[] = [
		{
			userId: -1,
			userAvatars: [],
			userName: 'Lone Iversen',
			timestamp: 'December 5, 2022 2:59 PM',
			comment: undefined,
			entityType: 'Document',
			logType: 'Save',
			nodeId: '1058',
			parameters: undefined,
		},
		{
			userId: -1,
			userAvatars: [],
			userName: 'Lone Iversen',
			timestamp: 'December 5, 2022 2:59 PM',
			comment: undefined,
			entityType: 'Document',
			logType: 'Unpublish',
			nodeId: '1058',
			parameters: undefined,
		},
		{
			userId: -1,
			userAvatars: [],
			userName: 'Lone Iversen',
			timestamp: 'December 5, 2022 2:59 PM',
			comment: undefined,
			entityType: 'Document',
			logType: 'Publish',
			nodeId: '1058',
			parameters: undefined,
		},

		{
			userId: -1,
			userAvatars: [],
			userName: 'Lone Iversen',
			timestamp: 'December 5, 2022 2:59 PM',
			comment: undefined,
			entityType: 'Document',
			logType: 'Save',
			nodeId: '1058',
			parameters: undefined,
		},

		{
			userId: -1,
			userAvatars: [],
			userName: 'Lone Iversen',
			timestamp: 'December 5, 2022 2:59 PM',
			comment: undefined,
			entityType: 'Document',
			logType: 'Save',
			nodeId: '1058',
			parameters: undefined,
		},
	];

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
						${repeat(
							this._historyList,
							(item) => item.timestamp,
							(item) => this.renderHistory(item)
						)}
					</umb-history-ui-list>
				</uui-box>
			</div>
			<div class="container">
				<uui-box headline="General"></uui-box>
			</div>`;
	}
	renderHistory(history: HistoryNode) {
		return html` <umb-history-ui-node .name="${history.userName}" .detail="${history.timestamp}">
			<span class="log-type">${this.renderTag(history.logType)} ${this.renderTagDescription(history.logType)}</span>
			<uui-button look="secondary" slot="actions"><uui-icon name="umb:undo"></uui-icon> Rollback</uui-button>
		</umb-history-ui-node>`;
	}

	renderTag(type?: HistoryLogType) {
		switch (type) {
			case 'Publish':
				return html`<uui-tag look="primary" color="positive" label="Publish">Publish</uui-tag>`;
			case 'Unpublish':
				return html`<uui-tag look="primary" color="warning" label="Unpublish">Unpublish</uui-tag>`;
			case 'Save':
				return html`<uui-tag look="primary" label="Save">Save</uui-tag>`;
			case 'ContentVersionEnableCleanup':
				return html`<uui-tag look="secondary" label="Content Version Enable Cleanup">Save</uui-tag>`;
			case 'ContentVersionPreventCleanup':
				return html`<uui-tag look="secondary" label="Content Version Prevent Cleanup">Save</uui-tag>`;
			default:
				return 'Could not detech log type';
		}
	}

	renderTagDescription(type?: HistoryLogType, params?: string) {
		switch (type) {
			case 'Publish':
				return html`Content published`;
			case 'Unpublish':
				return html`Content unpublished`;
			case 'Save':
				return html`Content saved`;
			case 'ContentVersionEnableCleanup':
				return html`Cleanup enabled for version: ${params}`;
			case 'ContentVersionPreventCleanup':
				return html`Cleanup disabled for version: ${params}`;
			default:
				return 'Could not detech log type';
		}
	}
}

export default UmbWorkspaceViewContentInfoElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-workspace-view-content-info': UmbWorkspaceViewContentInfoElement;
	}
}
