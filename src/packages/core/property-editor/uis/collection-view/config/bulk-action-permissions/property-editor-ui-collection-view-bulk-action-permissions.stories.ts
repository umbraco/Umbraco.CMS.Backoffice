import type { Meta, Story } from '@storybook/web-components';
import type { UmbPropertyEditorUICollectionViewBulkActionPermissionsElement } from './property-editor-ui-collection-view-bulk-action-permissions.element.js';
import { html } from '@umbraco-cms/backoffice/external/lit';

import './property-editor-ui-collection-view-bulk-action-permissions.element.js';

export default {
	title: 'Property Editor UIs/Collection View Bulk Action Permissions',
	component: 'umb-property-editor-ui-collection-view-bulk-action-permissions',
	id: 'umb-property-editor-ui-collection-view-bulk-action-permissions',
} as Meta;

export const AAAOverview: Story<UmbPropertyEditorUICollectionViewBulkActionPermissionsElement> = () =>
	html`<umb-property-editor-ui-collection-view-bulk-action-permissions></umb-property-editor-ui-collection-view-bulk-action-permissions>`;
AAAOverview.storyName = 'Overview';
