import { expect, fixture, html } from '@open-wc/testing';
import { UmbPropertyEditorUICollectionViewLayoutConfigurationElement } from './layout-configuration.element.js';
import { type UmbTestRunnerWindow, defaultA11yConfig } from '@umbraco-cms/internal/test-utils';

describe('UmbPropertyEditorUICollectionViewLayoutConfigurationElement', () => {
	let element: UmbPropertyEditorUICollectionViewLayoutConfigurationElement;

	beforeEach(async () => {
		element = await fixture(html`
			<umb-property-editor-ui-collection-view-layout-configuration></umb-property-editor-ui-collection-view-layout-configuration>
		`);
	});

	it('is defined with its own instance', () => {
		expect(element).to.be.instanceOf(UmbPropertyEditorUICollectionViewLayoutConfigurationElement);
	});

	if ((window as UmbTestRunnerWindow).__UMBRACO_TEST_RUN_A11Y_TEST) {
		it('passes the a11y audit', async () => {
			await expect(element).shadowDom.to.be.accessible(defaultA11yConfig);
		});
	}
});
