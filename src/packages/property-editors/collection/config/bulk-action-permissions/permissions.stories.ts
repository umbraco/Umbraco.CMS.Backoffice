import type { Meta, Story } from '@storybook/web-components';
import type { UmbPropertyEditorUICollectionPermissionsElement } from './permissions.element.js';
import { html } from '@umbraco-cms/backoffice/external/lit';

import './permissions.element.js';

export default {
	title: 'Property Editor UIs/Collection Bulk Action Permissions',
	component: 'umb-property-editor-ui-collection-permissions',
	id: 'umb-property-editor-ui-collection-permissions',
} as Meta;

export const AAAOverview: Story<UmbPropertyEditorUICollectionPermissionsElement> = () =>
	html`<umb-property-editor-ui-collection-permissions></umb-property-editor-ui-collection-permissions>`;
AAAOverview.storyName = 'Overview';
