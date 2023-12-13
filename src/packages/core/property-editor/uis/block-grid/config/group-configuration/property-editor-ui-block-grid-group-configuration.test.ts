import { expect, fixture, html } from '@open-wc/testing';
import { UmbPropertyEditorUIBlockGridGroupConfigurationElement } from './property-editor-ui-block-grid-group-configuration.element.js';
import { defaultA11yConfig } from '@umbraco-cms/internal/test-utils';

describe('UmbPropertyEditorUIBlockGridGroupConfigurationElement', () => {
	let element: UmbPropertyEditorUIBlockGridGroupConfigurationElement;

	beforeEach(async () => {
		element = await fixture(html`
			<umb-property-editor-ui-block-grid-group-configuration></umb-property-editor-ui-block-grid-group-configuration>
		`);
	});

	it('is defined with its own instance', () => {
		expect(element).to.be.instanceOf(UmbPropertyEditorUIBlockGridGroupConfigurationElement);
	});

	if ((window as any).__UMBRACO_TEST_RUN_A11Y_TEST) {
		it('passes the a11y audit', async () => {
			await expect(element).shadowDom.to.be.accessible(defaultA11yConfig);
		});
	}
});
