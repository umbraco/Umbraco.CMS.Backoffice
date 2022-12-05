import { expect, fixture, html } from '@open-wc/testing';
import { UmbDashboardHealthCheckElement } from './dashboard-health-check.element';
import { defaultA11yConfig } from '@umbraco-cms/test-utils';

describe('umb-dashboard-health-check', () => {
	let element: UmbDashboardHealthCheckElement;

	beforeEach(async () => {
		element = await fixture(html` <umb-dashboard-health-check></umb-dashboard-health-check> `);
	});

	it('is defined with its own instance', () => {
		expect(element).to.be.instanceOf(UmbDashboardHealthCheckElement);
	});

	it('passes the a11y audit', async () => {
		await expect(element).shadowDom.to.be.accessible(defaultA11yConfig);
	});
});
