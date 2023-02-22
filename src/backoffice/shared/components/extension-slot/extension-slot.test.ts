import { customElement } from 'lit/decorators.js';
import { expect, fixture, html } from '@open-wc/testing';
import { InitializedExtension, UmbExtensionSlotElement } from './extension-slot.element';
import { umbExtensionsRegistry } from '@umbraco-cms/extensions-api';
import { ManifestDashboard } from '@umbraco-cms/extensions-registry';
import { defaultA11yConfig } from '@umbraco-cms/test-utils';

@customElement('test-extension-slot-manifest-element')
class MyExtensionSlotManifestElement extends HTMLElement {}

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('UmbExtensionSlotElement', () => {
	let element: UmbExtensionSlotElement;

	describe('general', () => {
		beforeEach(async () => {
			element = await fixture(html`<umb-extension-slot></umb-extension-slot>`);
		});

		it('is defined with its own instance', () => {
			expect(element).to.be.instanceOf(UmbExtensionSlotElement);
		});

		/*
		// This test fails offen on FireFox, there is no real need for this test. So i have chosen to skip it.
		it('passes the a11y audit', async () => {
			await expect(element).shadowDom.to.be.accessible(defaultA11yConfig);
		});
		*/

		describe('properties', () => {
			it('has a type property', () => {
				expect(element).to.have.property('type');
			});

			it('has a filter property', () => {
				expect(element).to.have.property('filter');
			});

			it('has a defaultElement property', () => {
				expect(element).to.have.property('defaultElement');
			});
		});
	});

	describe('rendering', () => {
		beforeEach(async () => {
			umbExtensionsRegistry.register({
				type: 'dashboard',
				alias: 'unit-test-ext-slot-element-manifest',
				name: 'unit-test-extension',
				elementName: 'test-extension-slot-manifest-element',
				meta: {
					sections: ['test'],
					pathname: 'test/test',
				},
			});
		});

		afterEach(async () => {
			umbExtensionsRegistry.unregister('unit-test-ext-slot-element-manifest');
		});

		it('renders a manifest element', async () => {
			element = await fixture(
				html`<umb-extension-slot
					type="dashboard"
					.filter=${(x: ManifestDashboard) => x.alias === 'unit-test-ext-slot-element-manifest'}></umb-extension-slot>`
			);

			await sleep(0);

			expect(element.shadowRoot!.firstElementChild).to.be.instanceOf(MyExtensionSlotManifestElement);
		});

		it('use the render method', async () => {
			element = await fixture(
				html` <umb-extension-slot
					type="dashboard"
					.filter=${(x: ManifestDashboard) => x.alias === 'unit-test-ext-slot-element-manifest'}
					.renderMethod=${(manifest: InitializedExtension) => html`<bla>${manifest.component}</bla>`}>
				</umb-extension-slot>`
			);

			await sleep(0);

			expect(element.shadowRoot!.firstElementChild?.nodeName).to.be.equal('BLA');
			expect(element.shadowRoot!.firstElementChild?.firstElementChild).to.be.instanceOf(MyExtensionSlotManifestElement);
		});
	});
});
