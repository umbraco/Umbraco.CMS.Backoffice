import { expect, fixture, html } from '@open-wc/testing';
import { UmbDashboardMediaManagementElement } from './dashboard-media-management.element';
import { defaultA11yConfig } from '@umbraco-cms/test-utils';

describe('umb-dashboard-media-management', () => {
	let element: UmbDashboardMediaManagementElement;

	beforeEach(async () => {
		element = await fixture(html` <umb-dashboard-media-management></umb-dashboard-media-management> `);
	});

	it('is defined with its own instance', () => {
		expect(element).to.be.instanceOf(UmbDashboardMediaManagementElement);
	});

	it('passes the a11y audit', async () => {
		await expect(element).shadowDom.to.be.accessible(defaultA11yConfig);
	});
});
