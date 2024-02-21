import { UMB_MEMBER_GROUP_COLLECTION_ALIAS } from '../collection/manifests.js';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbRoute } from '@umbraco-cms/backoffice/router';

@customElement('umb-member-group-section-view')
export class UmbMemberGroupSectionViewElement extends UmbLitElement {
	#routes: UmbRoute[] = [
		{
			path: 'collection',
			component: () => {
				const element = document.createElement('umb-collection');
				element.setAttribute('alias', UMB_MEMBER_GROUP_COLLECTION_ALIAS);
				return element;
			},
		},
		{
			path: 'member-group',
			component: () => import('../workspace/member-group-workspace.element.js'),
		},
		{
			path: '',
			redirectTo: 'collection',
		},
	];

	render() {
		return html`<umb-router-slot id="router-slot" .routes=${this.#routes}></umb-router-slot>`;
	}

	static styles = [
		UmbTextStyles,
		css`
			:host {
				height: 100%;
			}

			#router-slot {
				height: calc(100% - var(--umb-header-layout-height));
			}
		`,
	];
}

export default UmbMemberGroupSectionViewElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-member-group-section-view': UmbMemberGroupSectionViewElement;
	}
}
