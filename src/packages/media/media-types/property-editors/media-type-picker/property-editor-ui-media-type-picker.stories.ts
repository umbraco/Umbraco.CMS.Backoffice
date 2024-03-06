import type { Meta, Story } from '@storybook/web-components';
import type { UmbPropertyEditorUIMediaTypePickerElement } from './property-editor-ui-media-type-picker.element.js';
import { html } from '@umbraco-cms/backoffice/external/lit';

import './property-editor-ui-media-type-picker.element.js';

export default {
	title: 'Property Editor UIs/Media Type Picker',
	component: 'umb-property-editor-ui-media-type-picker',
	id: 'umb-property-editor-ui-media-type-picker',
} as Meta;

export const AAAOverview: Story<UmbPropertyEditorUIMediaTypePickerElement> = () =>
	html` <umb-property-editor-ui-media-type-picker></umb-property-editor-ui-media-type-picker>`;
AAAOverview.storyName = 'Overview';
