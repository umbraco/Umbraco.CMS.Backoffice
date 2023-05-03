import { startMockServiceWorker } from './core/mocks/browser';

if (import.meta.env.VITE_UMBRACO_USE_MSW === 'on') {
	startMockServiceWorker();
}

import('./app/app.element');
