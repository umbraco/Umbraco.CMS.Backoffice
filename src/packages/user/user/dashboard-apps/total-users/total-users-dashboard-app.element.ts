import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbUserCollectionRepository } from '@umbraco-cms/backoffice/user';
import { UmbMasonryItemUpdatedEvent } from '@umbraco-cms/backoffice/components';

const elementName = 'umb-total-users-dashboard-app';
@customElement(elementName)
export class UmbTotalUsersDashboardAppElement extends UmbLitElement {
	#userCollectionRepository = new UmbUserCollectionRepository(this);

	@state()
	private _userCount = 0;

	constructor() {
		super();
		this.#loadTotalUsers();
	}

	async #loadTotalUsers() {
		const { data } = await this.#userCollectionRepository.requestCollection({ take: 1 });
		this._userCount = data?.total ?? 0;
		this.dispatchEvent(new UmbMasonryItemUpdatedEvent());
	}

	override render() {
		return html`
			<uui-box headline="Total users">
				<span class="large">${this._userCount}</span>
			</uui-box>
		`;
	}

	static override styles = [
		UmbTextStyles,
		css`
			.large {
				font-size: 3rem;
				font-weight: bold;
			}
		`,
	];
}

export { UmbTotalUsersDashboardAppElement as element };

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbTotalUsersDashboardAppElement;
	}
}
