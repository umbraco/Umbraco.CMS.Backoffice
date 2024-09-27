import { UmbUserGroupCollectionRepository } from '../../collection/index.js';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

const elementName = 'umb-total-user-groups-dashboard-app';
@customElement(elementName)
export class UmbTotalUserGroupsDashboardAppElement extends UmbLitElement {
	#userGroupCollectionRepository = new UmbUserGroupCollectionRepository(this);

	@state()
	private _userGroupCount = 0;

	constructor() {
		super();
		this.#loadTotalUserGroups();
	}

	async #loadTotalUserGroups() {
		const { data } = await this.#userGroupCollectionRepository.requestCollection({ take: 1 });
		this._userGroupCount = data?.total ?? 0;
	}

	override render() {
		return html` <span class="large">${this._userGroupCount}</span> `;
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

export { UmbTotalUserGroupsDashboardAppElement as element };

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbTotalUserGroupsDashboardAppElement;
	}
}
