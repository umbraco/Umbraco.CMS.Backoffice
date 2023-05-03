import { manifests as componentManifests } from './components';
import { manifests as propertyActionManifests } from './property-actions/manifests';
import { manifests as propertyEditorManifests } from './property-editors/manifests';
import { manifests as modalManifests } from './modals/manifests';
import { UmbBackofficeNotificationContainerElement } from './components/backoffice-frame/backoffice-notification-container.element';
import { UmbNotificationContext, UMB_NOTIFICATION_CONTEXT_TOKEN } from '@umbraco-cms/backoffice/notification';
import { UmbModalContext, UMB_MODAL_CONTEXT_TOKEN } from '@umbraco-cms/backoffice/modal';
import { UmbContextProviderController } from '@umbraco-cms/backoffice/context-api';
import type { UmbEntrypointOnInit } from '@umbraco-cms/backoffice/extensions-api';

import './notification';

export const manifests = [
	...componentManifests,
	...propertyActionManifests,
	...propertyEditorManifests,
	...modalManifests,
];

export const onInit: UmbEntrypointOnInit = (host, extensionRegistry) => {
	extensionRegistry.registerMany(manifests);

	const notificationContainerElement = new UmbBackofficeNotificationContainerElement();
	host.appendChild(notificationContainerElement);

	new UmbContextProviderController(host, UMB_MODAL_CONTEXT_TOKEN, new UmbModalContext(host));
	new UmbContextProviderController(host, UMB_NOTIFICATION_CONTEXT_TOKEN, new UmbNotificationContext());
};
