import { expect, fixture, html } from '@open-wc/testing';
import { UmbDocumentWorkspaceElement } from './document-workspace.element.js';
import { defaultA11yConfig } from '@umbraco-cms/internal/test-utils';

describe('UmbDocumentWorkspaceElement', () => {
	let element: UmbDocumentWorkspaceElement;

	beforeEach(async () => {
		element = await fixture(html`<umb-document-workspace></umb-document-workspace>`);
	});

	it('is defined with its own instance', () => {
		expect(element).to.be.instanceOf(UmbDocumentWorkspaceElement);
	});

	if ((window as any).__UMBRACO_TEST_RUN_A11Y_TEST) {
		it('passes the a11y audit', async () => {
			// TODO: should we use shadowDom here?
			await expect(element).to.be.accessible(defaultA11yConfig);
		});
	}
});
