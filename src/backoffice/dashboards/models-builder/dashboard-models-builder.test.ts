import { expect, fixture, html } from '@open-wc/testing';
import { UmbDashboardModelsBuilderElement } from './dashboard-models-builder.element';
import { defaultA11yConfig } from '@umbraco-cms/test-utils';

describe('umb-dashboard-models-builder', () => {
	let element: UmbDashboardModelsBuilderElement;

	beforeEach(async () => {
		element = await fixture(html` <umb-dashboard-models-builder></umb-dashboard-models-builder> `);
	});

	it('is defined with its own instance', () => {
		expect(element).to.be.instanceOf(UmbDashboardModelsBuilderElement);
	});

	it('passes the a11y audit', async () => {
		await expect(element).shadowDom.to.be.accessible(defaultA11yConfig);
	});
});
