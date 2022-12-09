import './editor-content.element';

import { Meta, Story } from '@storybook/web-components';
import { html } from 'lit-html';

import { data } from '../../../../core/mocks/data/node.data';

import type { UmbEditorNodeElement } from './editor-content.element';

export default {
	title: 'Editors/Shared/Node',
	component: 'umb-editor-content',
	id: 'umb-editor-content',
} as Meta;

export const AAAOverview: Story<UmbEditorNodeElement> = () =>
	html` <umb-editor-content id="${data[0].key}"></umb-editor-content>`;
AAAOverview.storyName = 'Overview';
