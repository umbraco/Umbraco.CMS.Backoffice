import { UmbAppElement } from './app/app.element';
import { startMockServiceWorker } from './core/mocks/browser';

if (import.meta.env.VITE_UMBRACO_USE_MSW === 'on') {
	startMockServiceWorker();
}

const appElement = new UmbAppElement();
const isMocking = import.meta.env.VITE_UMBRACO_USE_MSW === 'on';

const config = {
	serverUrl: isMocking ? '' : import.meta.env.VITE_UMBRACO_API_URL,
	backofficePath: '/umbraco',
	bypassAuth: isMocking,
};

appElement.config = config;

document.body.appendChild(appElement);
