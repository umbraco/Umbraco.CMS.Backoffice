import { css, html, nothing } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, property, state } from 'lit/decorators.js';
import { UmbLitElement } from '@umbraco-cms/element';

export interface logItem {
	userName: string;
	timestamp: string;
	logType: logType;
	parameters: string;
}

export type logType = 'Save' | 'Publish' | 'ContentVersionPreventCleanup' | 'ContentVersionEnableCleanup';

@customElement('umb-history-ui-maker')
export class UmbHistoryUIMaker extends UmbLitElement {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
				position: relative;
				--avatar-size: calc(2em + 4px);
			}

			#wrapper {
				display: grid;
				grid-template-columns: 1fr;
				gap: var(--uui-size-space-5);
			}

			#wrapper .row {
				display: grid;
				gap: calc(2 * var(--uui-size-space-5));
				grid-template-columns: auto 1fr;
			}

			#wrapper .row uui-avatar {
				position: relative;
			}
			#wrapper .row:not(:last-child) uui-avatar::after {
				content: '';
				border: 1px solid var(--uui-color-border);
				position: absolute;
				height: calc(1.5 * var(--avatar-size));
				top: var(--avatar-size);
				left: 50%;
				transform: translateX(-50%);
			}

			.user-info {
				display: flex;
				align-items: center;
				gap: var(--uui-size-space-5);
			}
			.user-info div {
				display: flex;
				flex-direction: column;
			}

			.alt {
				font-size: var(--uui-size-4);
				color: var(--uui-color-text-alt);
				line-height: 1;
			}

			.type {
				display: flex;
				align-items: center;
				gap: var(--uui-size-space-4);
			}
		`,
	];

	// TODO: Make properties to insert into UI
	@state()
	private _logData?: logItem[] = [
		{
			userName: 'Test User',
			timestamp: 'December 5, 2022 2:59 PM',
			logType: 'Publish',
		},
		{
			userName: 'Test User',
			timestamp: 'December 5, 2022 2:59 PM',
			logType: 'ContentVersionPreventCleanup',
			parameters: '2/8/2023 2:45:15 PM',
		},
		{
			userName: 'Test User',
			timestamp: 'December 5, 2022 2:59 PM',
			logType: 'ContentVersionEnableCleanup',
			parameters: '2/8/2023 2:45:15 PM',
		},
		{ userName: 'Test User', timestamp: 'December 5, 2022 2:59 PM', logType: 'Save' },
		{ userName: 'Test User', timestamp: 'December 5, 2022 2:59 PM', logType: 'Save' },
	].reverse() as logItem[];

	render() {
		return html`<div id="wrapper">
			${this._logData?.map((logItem) => {
				return this._renderLog(logItem);
			})}
		</div>`;
	}

	private _renderLog(log: logItem) {
		return html`<div class="row">
			<div class="user-info">
				<uui-avatar name="${log.userName}"></uui-avatar>
				<div>
					<span class="user">${log.userName}</span>
					<span class="alt">${log.timestamp}</span>
				</div>
			</div>
			<div class="type">
				${this._renderTag(log.logType)}
				<span class="alt">${this._renderDescription(log.logType, log.parameters)}</span>
			</div>
		</div>`;
	}

	private _renderTag(type: logType) {
		switch (type) {
			case 'Save':
				return html`<uui-tag look="primary" label="Save">Save</uui-tag>`;
			case 'Publish':
				return html`<uui-tag look="primary" color="positive" label="Publish">Publish</uui-tag> `;
			case 'ContentVersionPreventCleanup':
				return html`<uui-tag look="secondary" label="Cleanup">Save</uui-tag>`;
			case 'ContentVersionEnableCleanup':
				return html`<uui-tag look="secondary" label="Cleanup">Save</uui-tag>`;
			default:
				return nothing;
		}
	}

	private _renderDescription(type: logType, parameters?: string) {
		switch (type) {
			case 'Save':
				return html`Content saved`;
			case 'Publish':
				return html`Content published`;
			case 'ContentVersionPreventCleanup':
				return html`Cleanup disabled for version: ${parameters}`;
			case 'ContentVersionEnableCleanup':
				return html`Cleanup eanbled for version: ${parameters}`;
			default:
				return nothing;
		}
	}
}

export default UmbHistoryUIMaker;

declare global {
	interface HTMLElementTagNameMap {
		'umb-history-ui-maker': UmbHistoryUIMaker;
	}
}
