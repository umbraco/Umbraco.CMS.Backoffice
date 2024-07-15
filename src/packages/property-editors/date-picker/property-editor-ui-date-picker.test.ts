import type { UmbInputDateElement } from '../../core/components/input-date/input-date.element.js';
import { UmbPropertyEditorUIDatePickerElement } from './property-editor-ui-date-picker.element.js';
import { expect, fixture, html } from '@open-wc/testing';
import { type UmbTestRunnerWindow, defaultA11yConfig } from '@umbraco-cms/internal/test-utils';
import { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';
import type { UUIInputElement } from '@umbraco-cms/backoffice/external/uui';

describe('UmbPropertyEditorUIDatePickerElement', () => {
	let element: UmbPropertyEditorUIDatePickerElement;
	let inputElement: UmbInputDateElement;

	beforeEach(async () => {
		element = await fixture(html` <umb-property-editor-ui-date-picker></umb-property-editor-ui-date-picker> `);
		inputElement = element.shadowRoot?.querySelector('umb-input-date') as UmbInputDateElement;
	});

	it('is defined with its own instance', () => {
		expect(element).to.be.instanceOf(UmbPropertyEditorUIDatePickerElement);
	});

	it('should have an input element', () => {
		expect(inputElement).to.exist;
	});

	it('should show a datetime-local input by default', async () => {
		await element.updateComplete;
		expect(inputElement.type).to.equal('datetime-local');
	});

	it('should show a type=date field if the format only contains a date', async () => {
		element.config = new UmbPropertyEditorConfigCollection([{ alias: 'format', value: 'YYYY-MM-dd' }]);
		await element.updateComplete;
		expect(inputElement.type).to.equal('date');
	});

	it('should show a type=time field if the format only contains a time', async () => {
		element.config = new UmbPropertyEditorConfigCollection([{ alias: 'format', value: 'HH:mm' }]);
		await element.updateComplete;
		expect(inputElement.type).to.equal('time');
	});

	if ((window as UmbTestRunnerWindow).__UMBRACO_TEST_RUN_A11Y_TEST) {
		it('passes the a11y audit', async () => {
			await expect(element).shadowDom.to.be.accessible(defaultA11yConfig);
		});
	}

	describe('input', () => {
		it('should format the value to a datetime-local', async () => {
			element.value = '2024-05-03 10:44:00';
			await element.updateComplete;
			expect(inputElement.value).to.equal('2024-05-03 10:44:00');
		});

		it('should format the value to a date', async () => {
			element.value = '2024-05-03 10:44:00';
			element.config = new UmbPropertyEditorConfigCollection([{ alias: 'format', value: 'YYYY-MM-dd' }]);
			await element.updateComplete;
			expect(inputElement.value).to.equal('2024-05-03');
		});

		it('should format the value to a time', async () => {
			element.value = '2024-05-03 10:44:00';
			element.config = new UmbPropertyEditorConfigCollection([{ alias: 'format', value: 'HH:mm' }]);
			await element.updateComplete;
			expect(inputElement.value).to.equal('10:44:00');
		});
	});

	describe('output', () => {
		let innerInput: UUIInputElement;

		beforeEach(async () => {
			innerInput = inputElement.shadowRoot?.querySelector('uui-input') as UUIInputElement;
		});

		it('should format the value to a datetime-local', async () => {
			innerInput.value = '2024-05-03T10:44:00';
			innerInput.dispatchEvent(new CustomEvent('change'));
			await element.updateComplete;
			expect(element.value).to.equal('2024-05-03 10:44:00');
		});

		it('should format the value to a date', async () => {
			element.config = new UmbPropertyEditorConfigCollection([{ alias: 'format', value: 'YYYY-MM-dd' }]);
			innerInput.value = '2024-05-03T10:44:00';
			innerInput.dispatchEvent(new CustomEvent('change'));
			await element.updateComplete;
			expect(element.value).to.equal('2024-05-03');
		});

		it('should format the value to a time', async () => {
			element.config = new UmbPropertyEditorConfigCollection([{ alias: 'format', value: 'HH:mm' }]);
			innerInput.value = '2024-05-03T10:44:00';
			innerInput.dispatchEvent(new CustomEvent('change'));
			await element.updateComplete;
			expect(element.value).to.equal('10:44:00');
		});
	});
});
