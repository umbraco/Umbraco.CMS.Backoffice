import { expect, fixture, html } from '@open-wc/testing';
import { UmbInputDocumentPickerElement } from './input-document-picker.element';
import { defaultA11yConfig } from '@umbraco-cms/test-utils';
describe('UmbPropertyEditorUINumberRangeElement', () => {
	let element: UmbInputDocumentPickerElement;

	beforeEach(async () => {
		element = await fixture(html` <umb-input-document-picker></umb-input-document-picker> `);
	});

	it('is defined with its own instance', () => {
		expect(element).to.be.instanceOf(UmbInputDocumentPickerElement);
	});

	it('passes the a11y audit', async () => {
		await expect(element).shadowDom.to.be.accessible(defaultA11yConfig);
	});
});
