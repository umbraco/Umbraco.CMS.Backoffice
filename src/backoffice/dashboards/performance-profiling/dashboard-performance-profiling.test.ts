import { expect, fixture, html } from '@open-wc/testing';
import { UmbDashboardPerformanceProfilingElement } from './dashboard-performance-profiling.element';
import { defaultA11yConfig } from '@umbraco-cms/test-utils';

describe('umb-dashboard-perfomance-profiling', () => {
	let element: UmbDashboardPerformanceProfilingElement;

	beforeEach(async () => {
		element = await fixture(html` <umb-dashboard-performance-profiling></umb-dashboard-performance-profiling> `);
	});

	it('is defined with its own instance', () => {
		expect(element).to.be.instanceOf(UmbDashboardPerformanceProfilingElement);
	});

	it('passes the a11y audit', async () => {
		await expect(element).shadowDom.to.be.accessible(defaultA11yConfig);
	});
});
