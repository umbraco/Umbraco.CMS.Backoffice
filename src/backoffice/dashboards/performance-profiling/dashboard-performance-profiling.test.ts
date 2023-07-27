import { expect, fixture, html } from '@open-wc/testing';
import { defaultA11yConfig } from '@umbraco-cms/internal/test-utils';
import { UmbDashboardPerformanceProfilingElement } from './dashboard-performance-profiling.element.js';

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
