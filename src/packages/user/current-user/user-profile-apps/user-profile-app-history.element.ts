import {
	UmbCurrentUserHistoryItem,
	UmbCurrentUserHistoryStore,
	UMB_CURRENT_USER_HISTORY_STORE_CONTEXT,
} from '../current-user-history.store.js';
import { css, html, nothing, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';

@customElement('umb-user-profile-app-history')
export class UmbUserProfileAppHistoryElement extends UmbLitElement {
	@state()
	private _history: Array<UmbCurrentUserHistoryItem> = [];

	#currentUserHistoryStore?: UmbCurrentUserHistoryStore;

	constructor() {
		super();

		this.consumeContext(UMB_CURRENT_USER_HISTORY_STORE_CONTEXT, (instance) => {
			this.#currentUserHistoryStore = instance;
			this.#observeHistory();
		});
	}

	#observeHistory() {
		if (this.#currentUserHistoryStore) {
			this.observe(
				this.#currentUserHistoryStore.latestHistory,
				(history) => {
					this._history = history;
				},
				'umbCurrentUserHistoryObserver',
			);
		}
	}

	render() {
		return html`
			<uui-box>
				<b slot="headline">Recent History</b>
				<div id="recent-history-items">
					${this._history.reverse().map((item) => html` ${this.#renderHistoryItem(item)} `)}
				</div>
			</uui-box>
		`;
	}

	#renderHistoryItem(item: UmbCurrentUserHistoryItem) {
		return html`
			<a href=${item.path} class="history-item">
				<uui-icon name="icon-link"></uui-icon>
				<div>
					<b>${Array.isArray(item.label) ? item.label[0] : item.label}</b>
					<span>
						${Array.isArray(item.label)
							? item.label.map((label, index) => {
									if (index === 0) return;
									return html`
										<span>${label}</span>
										${index !== item.label.length - 1 ? html`<span>${'>'}</span>` : nothing}
									`;
							  })
							: nothing}
					</span>
				</div>
			</a>
		`;
	}

	static styles = [
		UmbTextStyles,
		css`
			#recent-history {
				display: flex;
				flex-direction: column;
				gap: var(--uui-size-space-3);
			}
			#recent-history-items {
				display: flex;
				flex-direction: column;
				gap: var(--uui-size-space-4);
			}
			.history-item {
				display: grid;
				grid-template-columns: 32px 1fr;
				grid-template-rows: 1fr;
				color: var(--uui-color-interactive);
				text-decoration: none;
			}
			.history-item uui-icon {
				margin-top: var(--uui-size-space-1);
			}
			.history-item:hover {
				color: var(--uui-color-interactive-emphasis);
			}
			.history-item > div {
				color: inherit;
				text-decoration: none;
				display: flex;
				flex-direction: column;
				line-height: 1.4em;
			}
			.history-item > div > span {
				font-size: var(--uui-size-4);
				opacity: 0.5;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
			}
		`,
	];
}

export default UmbUserProfileAppHistoryElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-user-dashboard-test': UmbUserProfileAppHistoryElement;
	}
}
