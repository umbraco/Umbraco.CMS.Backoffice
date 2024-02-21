import { expect, fixture, html } from '@open-wc/testing';
import { UmbPropertyEditorUICollectionViewOrderByElement } from './property-editor-ui-collection-view-order-by.element.js';
import { type UmbTestRunnerWindow, defaultA11yConfig } from '@umbraco-cms/internal/test-utils';

describe('UmbPropertyEditorUICollectionViewOrderByElement', () => {
	let element: UmbPropertyEditorUICollectionViewOrderByElement;

	beforeEach(async () => {
		element = await fixture(html`
			<umb-property-editor-ui-collection-view-order-by></umb-property-editor-ui-collection-view-order-by>
		`);
	});

	it('is defined with its own instance', () => {
		expect(element).to.be.instanceOf(UmbPropertyEditorUICollectionViewOrderByElement);
	});

	if ((window as UmbTestRunnerWindow).__UMBRACO_TEST_RUN_A11Y_TEST) {
		it('passes the a11y audit', async () => {
			await expect(element).shadowDom.to.be.accessible(defaultA11yConfig);
		});
	}
});
