import type { Meta, Story } from '@storybook/web-components';
import type { UmbPropertyEditorUIDocumentPickerElement } from './property-editor-ui-document-picker.element.js';
import { html } from '@umbraco-cms/backoffice/external/lit';

import './property-editor-ui-document-picker.element.js';

export default {
	title: 'Property Editor UIs/Document Picker',
	component: 'umb-property-editor-ui-document-picker',
	id: 'umb-property-editor-ui-document-picker',
} as Meta;

export const AAAOverview: Story<UmbPropertyEditorUIDocumentPickerElement> = () =>
	html` <umb-property-editor-ui-document-picker></umb-property-editor-ui-document-picker>`;
AAAOverview.storyName = 'Overview';
