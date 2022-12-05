import { expect, fixture, html } from '@open-wc/testing';
import { UmbDashboardWelcomeElement } from './dashboard-welcome.element';
import { defaultA11yConfig } from '@umbraco-cms/test-utils';

describe('umb-dashboard-welcome', () => {
	let element: UmbDashboardWelcomeElement;

	beforeEach(async () => {
		element = await fixture(html` <umb-dashboard-welcome></umb-dashboard-welcome> `);
	});

	it('is defined with its own instance', () => {
		expect(element).to.be.instanceOf(UmbDashboardWelcomeElement);
	});

	it('passes the a11y audit', async () => {
		await expect(element).shadowDom.to.be.accessible(defaultA11yConfig);
	});
});
