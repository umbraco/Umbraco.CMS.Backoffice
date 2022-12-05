import { expect, fixture, html } from '@open-wc/testing';
import { UmbDashboardRedirectManagementElement } from './dashboard-redirect-management.element';
import { defaultA11yConfig } from '@umbraco-cms/test-utils';

describe('umb-dashboard-redirect-management', () => {
	let element: UmbDashboardRedirectManagementElement;

	beforeEach(async () => {
		element = await fixture(html` <umb-dashboard-redirect-management></umb-dashboard-redirect-management> `);
	});

	it('is defined with its own instance', () => {
		expect(element).to.be.instanceOf(UmbDashboardRedirectManagementElement);
	});

	it('passes the a11y audit', async () => {
		await expect(element).shadowDom.to.be.accessible(defaultA11yConfig);
	});
});
