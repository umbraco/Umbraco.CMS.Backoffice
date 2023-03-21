import { expect, fixture, html } from '@open-wc/testing';

import { UmbInstallerInstallingElement } from './installer-installing.element';
import { defaultA11yConfig } from '@umbraco-cms/internal/test-utils';

// TODO: Write tests
describe('UmbInstallerInstallingElement', () => {
	let element: UmbInstallerInstallingElement;

	beforeEach(async () => {
		element = await fixture(html`<umb-installer-installing></umb-installer-installing>`);
	});

	it('is defined with its own instance', () => {
		expect(element).to.be.instanceOf(UmbInstallerInstallingElement);
	});

	it('passes the a11y audit', async () => {
		await expect(element).to.be.accessible(defaultA11yConfig);
	});
});
