import { expect, fixture, html } from '@open-wc/testing';
import { UmbUserGridCollectionViewElement } from './user-grid-collection-view.element';
import { defaultA11yConfig } from '@umbraco-cms/internal/test-utils';

describe('UmbWorkspaceViewUsersCreateElement', () => {
	let element: UmbUserGridCollectionViewElement;
	beforeEach(async () => {
		element = await fixture(html`<umb-workspace-view-users-grid></umb-workspace-view-users-grid>`);
	});

	it('is defined with its own instance', () => {
		expect(element).to.be.instanceOf(UmbUserGridCollectionViewElement);
	});

	it('passes the a11y audit', async () => {
		await expect(element).shadowDom.to.be.accessible(defaultA11yConfig);
	});
});
