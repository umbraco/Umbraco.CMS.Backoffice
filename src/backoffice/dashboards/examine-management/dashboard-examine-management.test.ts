import { expect, fixture, html } from '@open-wc/testing';
import { defaultA11yConfig } from '@umbraco-cms/test-utils';
import { UmbDashboardExamineManagementElement } from './dashboard-examine-management.element.js';

describe('umb-dashboard-examine-management', () => {
	let element: UmbDashboardExamineManagementElement;

	beforeEach(async () => {
		element = await fixture(html` <umb-dashboard-examine-management></umb-dashboard-examine-management> `);
	});

	it('is defined with its own instance', () => {
		expect(element).to.be.instanceOf(UmbDashboardExamineManagementElement);
	});

	it('passes the a11y audit', async () => {
		await expect(element).shadowDom.to.be.accessible(defaultA11yConfig);
	});
});
