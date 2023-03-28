import { expect, fixture, html } from '@open-wc/testing';

import { UmbUpgraderView } from './upgrader-view.element';
import { defaultA11yConfig } from '@umbraco-cms/internal/test-utils';

describe('UmbUpgraderView', () => {
	let element: UmbUpgraderView;

	beforeEach(async () => {
		element = await fixture(html`<umb-upgrader-view></umb-upgrader-view>`);
	});

	it('is defined with its own instance', () => {
		expect(element).to.be.instanceOf(UmbUpgraderView);
	});

	it('passes the a11y audit', async () => {
		await expect(element).to.be.accessible(defaultA11yConfig);
	});
});
