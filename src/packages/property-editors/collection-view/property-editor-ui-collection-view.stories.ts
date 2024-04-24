import type { Meta, Story } from '@storybook/web-components';
import type { UmbPropertyEditorUICollectionViewElement } from './property-editor-ui-collection-view.element.js';
import { html } from '@umbraco-cms/backoffice/external/lit';

import './property-editor-ui-collection-view.element.js';

export default {
	title: 'Property Editor UIs/Collection View',
	component: 'umb-property-editor-ui-collection-view',
	id: 'umb-property-editor-ui-collection-view',
} as Meta;

export const AAAOverview: Story<UmbPropertyEditorUICollectionViewElement> = () =>
	html`<umb-property-editor-ui-collection-view></umb-property-editor-ui-collection-view>`;
AAAOverview.storyName = 'Overview';
