import { expect, fixture, html } from '@open-wc/testing';
import { UmbPropertyEditorUICollectionViewElement } from './property-editor-ui-collection-view.element.js';
import { type UmbTestRunnerWindow, defaultA11yConfig } from '@umbraco-cms/internal/test-utils';

describe('UmbPropertyEditorUICollectionViewElement', () => {
	let element: UmbPropertyEditorUICollectionViewElement;

	beforeEach(async () => {
		element = await fixture(html` <umb-property-editor-ui-collection-view></umb-property-editor-ui-collection-view> `);
	});

	it('is defined with its own instance', () => {
		expect(element).to.be.instanceOf(UmbPropertyEditorUICollectionViewElement);
	});

	if ((window as UmbTestRunnerWindow).__UMBRACO_TEST_RUN_A11Y_TEST) {
		it('passes the a11y audit', async () => {
			await expect(element).shadowDom.to.be.accessible(defaultA11yConfig);
		});
	}
});
