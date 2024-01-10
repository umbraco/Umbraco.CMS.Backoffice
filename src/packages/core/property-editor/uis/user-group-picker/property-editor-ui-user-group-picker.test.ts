import { expect, fixture, html } from '@open-wc/testing';
import { UmbPropertyEditorUIUserGroupPickerElement } from './property-editor-ui-user-group-picker.element.js';
import { defaultA11yConfig } from '@umbraco-cms/internal/test-utils';

describe('UmbPropertyEditorUIUserGroupPickerElement', () => {
	let element: UmbPropertyEditorUIUserGroupPickerElement;

	beforeEach(async () => {
		element = await fixture(html`
			<umb-property-editor-ui-user-group-picker></umb-property-editor-ui-user-group-picker>
		`);
	});

	it('is defined with its own instance', () => {
		expect(element).to.be.instanceOf(UmbPropertyEditorUIUserGroupPickerElement);
	});

	if ((window as any).__UMBRACO_TEST_RUN_A11Y_TEST) {
		it('passes the a11y audit', async () => {
			await expect(element).shadowDom.to.be.accessible(defaultA11yConfig);
		});
	}
});
