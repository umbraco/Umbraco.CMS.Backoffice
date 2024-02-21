import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { UMB_CURRENT_USER_CONTEXT } from '@umbraco-cms/backoffice/current-user';
import { css, html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

@customElement('umb-umbraco-news-dashboard')
export class UmbUmbracoNewsDashboardElement extends UmbLitElement {
	#currentUserContext?: typeof UMB_CURRENT_USER_CONTEXT.TYPE;

	@state()
	private name = '';

	constructor() {
		super();
		this.consumeContext(UMB_CURRENT_USER_CONTEXT, (instance) => {
			this.#currentUserContext = instance;
			this.#observeCurrentUser();
		});
	}

	#observeCurrentUser(): void {
		if (!this.#currentUserContext) return;
		this.observe(this.#currentUserContext.currentUser, (user) => {
			this.name = user?.name ?? '';
		});
	}

	render() {
		return html`
			<uui-box class="uui-text">
				<h1 class="uui-h2" style="margin-top: var(--uui-size-layout-1);">Welcome, ${this.name}</h1>
				<p class="uui-lead">
					This is a preview version of Umbraco, where you can have a first-hand look at the new Backoffice.
				</p>
				<p>
					There is currently very limited functionality.<br />
					Please refer to the
					<a target="_blank" href="https://docs.umbraco.com/umbraco-backoffice/">documentation</a> to learn more about
					what is possible.
				</p>
			</uui-box>
		`;
	}

	static styles = [
		UmbTextStyles,
		css`
			:host {
				display: block;
				padding: var(--uui-size-layout-1);
			}
			p {
				position: relative;
			}
		`,
	];
}

export default UmbUmbracoNewsDashboardElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-umbraco-news-dashboard': UmbUmbracoNewsDashboardElement;
	}
}
