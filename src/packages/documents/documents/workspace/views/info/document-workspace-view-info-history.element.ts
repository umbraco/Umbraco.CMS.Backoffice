import { HistoryTagStyleAndText, TimeOptions } from './utils.js';
import { UmbAuditLogRepository } from '@umbraco-cms/backoffice/audit-log';
import {
	css,
	html,
	customElement,
	state,
	property,
	nothing,
	repeat,
	ifDefined,
} from '@umbraco-cms/backoffice/external/lit';
import type { UUIPaginationEvent } from '@umbraco-cms/backoffice/external/uui';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import type { AuditLogWithUsernameResponseModel } from '@umbraco-cms/backoffice/external/backend-api';
import { DirectionModel } from '@umbraco-cms/backoffice/external/backend-api';

@customElement('umb-document-workspace-view-info-history')
export class UmbDocumentWorkspaceViewInfoHistoryElement extends UmbLitElement {
	#logRepository: UmbAuditLogRepository;
	#itemsPerPage = 10;

	@property()
	documentUnique = '';

	@state()
	private _total?: number;

	@state()
	private _items?: Array<AuditLogWithUsernameResponseModel>;

	@state()
	private _currentPage = 1;

	constructor() {
		super();
		this.#logRepository = new UmbAuditLogRepository(this);
	}

	protected firstUpdated(): void {
		this.#getLogs();
	}

	async #getLogs() {
		this._items = undefined; // Reset items to show loader
		if (!this.documentUnique) return;

		/*const { data } = await this.#logRepository.getAuditLogByUnique({
			id: this.documentUnique,
			orderDirection: DirectionModel.DESCENDING,
			skip: (this._currentPage - 1) * this.#itemsPerPage,
			take: this.#itemsPerPage,
		});

		if (!data) return;
		this._total = data.total;
		this._items = data.items;
		*/

		//TODO: I think there is an issue with the API (backend) - error with ID. Hacking for now.
		// Uncomment previous code and delete the following when issue fixed.
		// This should also make it load significantly faster

		const { data } = await this.#logRepository.getLog({
			orderDirection: DirectionModel.DESCENDING,
			skip: 0,
			take: 99999,
		});

		if (!data) return;

		// Hack list to only get the items for the current document
		const list = data.items.filter((item) => item.entity?.id === this.documentUnique);
		this._total = list.length;

		// Hack list to only get the items for the current page
		this._items = list.slice(
			(this._currentPage - 1) * this.#itemsPerPage,
			(this._currentPage - 1) * this.#itemsPerPage + this.#itemsPerPage,
		);
	}

	#onPageChange(event: UUIPaginationEvent) {
		if (this._currentPage === event.target.current) return;
		this._currentPage = event.target.current;

		this.#getLogs();
	}

	render() {
		return html`<uui-box>
				<div id="rollback" slot="header">
					<h2><umb-localize key="general_history">History</umb-localize></h2>
					<uui-button
						label=${this.localize.term('actions_rollback')}
						look="secondary"
						slot="actions"
						@click=${() => alert('TODO: Rollback Modal')}>
						<uui-icon name="icon-undo"></uui-icon>
						<umb-localize key="actions_rollback"></umb-localize>
					</uui-button>
				</div>
				${this._items ? this.#renderHistory() : html`<uui-loader-circle></uui-loader-circle> `}
			</uui-box>
			${this.#renderHistoryPagination()}`;
	}

	#renderHistory() {
		if (this._items && this._items.length) {
			return html`
				<umb-history-list>
					${repeat(
						this._items,
						(item) => item.timestamp,
						(item) => {
							const { text, style } = HistoryTagStyleAndText(item.logType);
							return html`<umb-history-item
								.name=${item.userName ?? 'Unknown'}
								src=${ifDefined(
									Array.isArray(item.userAvatars) ? item.userAvatars[item.userAvatars.length - 1] : undefined,
								)}
								detail=${this.localize.date(item.timestamp, TimeOptions)}>
								<span class="log-type">
									<uui-tag look=${style.look} color=${style.color}> ${this.localize.term(text.label)} </uui-tag>
									${this.localize.term(text.desc, item.parameters)}
								</span>
							</umb-history-item>`;
						},
					)}
				</umb-history-list>
			`;
		} else {
			return html`${this.localize.term('content_noItemsToShow')}`;
		}
	}

	#renderHistoryPagination() {
		if (!this._total) return nothing;

		const totalPages = Math.ceil(this._total / this.#itemsPerPage);

		if (totalPages <= 1) return nothing;

		return html`<div class="pagination">
			<uui-pagination .total=${totalPages} @change="${this.#onPageChange}"></uui-pagination>
		</div>`;
	}

	static styles = [
		UmbTextStyles,
		css`
			uui-loader-circle {
				font-size: 2rem;
			}

			#rollback {
				display: flex;
				width: 100%;
				align-items: center;
				justify-content: space-between;
			}

			#rollback h2 {
				font-size: var(--uui-type-h5-size);
				margin: 0;
			}

			uui-tag uui-icon {
				margin-right: var(--uui-size-space-1);
			}

			.log-type {
				flex-grow: 1;
				gap: var(--uui-size-space-2);
			}

			uui-pagination {
				flex: 1;
				display: inline-block;
			}
			.pagination {
				display: flex;
				justify-content: center;
				margin-top: var(--uui-size-space-4);
			}
		`,
	];
}

export default UmbDocumentWorkspaceViewInfoHistoryElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-document-workspace-view-info-history': UmbDocumentWorkspaceViewInfoHistoryElement;
	}
}
