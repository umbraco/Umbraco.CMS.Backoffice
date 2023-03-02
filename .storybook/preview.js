import '@umbraco-ui/uui-css/dist/uui-css.css';
import '../libs/css/custom-properties.css';

import '@umbraco-ui/uui';
import '@umbraco-ui/uui-modal';
import '@umbraco-ui/uui-modal-container';
import '@umbraco-ui/uui-modal-dialog';
import '@umbraco-ui/uui-modal-sidebar';

import { html } from 'lit-html';
import { initialize, mswDecorator } from 'msw-storybook-addon';
import { setCustomElements } from '@storybook/web-components';

import { UmbDataTypeStore } from '../src/backoffice/settings/data-types/repository/data-type.store.ts';
import { UmbDocumentTypeStore } from '../src/backoffice/documents/document-types/repository/document-type.store.ts';
import { UmbDocumentStore } from '../src/backoffice/documents/documents/repository/document.store.ts';
import { UmbDocumentTreeStore } from '../src/backoffice/documents/documents/repository/document.tree.store.ts';

import customElementManifests from '../custom-elements.json';
import { UmbIconStore } from '../libs/store/icon/icon.store';
import { onUnhandledRequest } from '../src/core/mocks/browser';
import { handlers } from '../src/core/mocks/browser-handlers';
import { LitElement } from 'lit';
import { UMB_MODAL_SERVICE_CONTEXT_TOKEN, UmbModalService } from '../src/core/modal';

import { umbExtensionsRegistry } from '../libs/extensions-api';

import '../libs/element/context-provider.element';
import '../src/backoffice/shared/components';

import { manifests as documentManifests } from '../src/backoffice/documents';

class UmbStoryBookElement extends LitElement {
	_umbIconStore = new UmbIconStore();

	constructor() {
		super();
		this._umbIconStore.attach(this);
		this._registerExtensions(documentManifests);
	}

	_registerExtensions(manifests) {
		manifests.forEach((manifest) => {
			if (umbExtensionsRegistry.isRegistered(manifest.alias)) return;
			umbExtensionsRegistry.register(manifest);
		});
	}

	render() {
		return html`<slot></slot>`;
	}
}

customElements.define('umb-storybook', UmbStoryBookElement);

const storybookProvider = (story) => html` <umb-storybook>${story()}</umb-storybook> `;

const dataTypeStoreProvider = (story) => html`
	<umb-controller-host-test .create=${(host) => new UmbDataTypeStore(host)}>${story()}</umb-controller-host-test>
`;

const documentTypeStoreProvider = (story) => html`
	<umb-controller-host-test .create=${(host) => new UmbDocumentTypeStore(host)}>${story()}</umb-controller-host-test>
`;

const documentStoreProvider = (story) => html`
	<umb-controller-host-test .create=${(host) => new UmbDocumentStore(host)}>${story()}</umb-controller-host-test>
`;

const documentTreeStoreProvider = (story) => html`
	<umb-controller-host-test .create=${(host) => new UmbDocumentTreeStore(host)}>${story()}</umb-controller-host-test>
`;

const modalServiceProvider = (story) => html`
	<umb-context-provider
		style="display: block; padding: 32px;"
		key="${UMB_MODAL_SERVICE_CONTEXT_TOKEN}"
		.value=${new UmbModalService()}>
		${story()}
		<umb-backoffice-modal-container></umb-backoffice-modal-container>
	</umb-context-provider>
`;

// Initialize MSW
initialize({ onUnhandledRequest });

// Provide the MSW addon decorator globally
export const decorators = [
	mswDecorator,
	storybookProvider,
	documentStoreProvider,
	documentTreeStoreProvider,
	dataTypeStoreProvider,
	documentTypeStoreProvider,
	modalServiceProvider,
];

export const parameters = {
	options: {
		storySort: {
			method: 'alphabetical',
			includeNames: true,
			order: ['Guides', ['Getting Started'], '*'],
		},
	},
	actions: { argTypesRegex: '^on.*' },
	controls: {
		expanded: true,
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
	msw: {
		handlers: {
			global: handlers,
		},
	},
};

setCustomElements(customElementManifests);
