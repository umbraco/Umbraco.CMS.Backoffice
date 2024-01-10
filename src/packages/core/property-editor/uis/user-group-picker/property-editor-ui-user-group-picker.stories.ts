import { Meta, Story } from '@storybook/web-components';
import type { UmbPropertyEditorUIUserGroupPickerElement } from './property-editor-ui-user-group-picker.element.js';
import { html } from '@umbraco-cms/backoffice/external/lit';

import './property-editor-ui-user-group-picker.element.js';

export default {
	title: 'Property Editor UIs/User Group Picker',
	component: 'umb-property-editor-ui-user-group-picker',
	id: 'umb-property-editor-ui-user-group-picker',
} as Meta;

export const AAAOverview: Story<UmbPropertyEditorUIUserGroupPickerElement> = () =>
	html`<umb-property-editor-ui-user-group-picker></umb-property-editor-ui-user-group-picker>`;
AAAOverview.storyName = 'Overview';
