import './dictionary-workspace.element';
import { Meta, Story } from '@storybook/web-components';
import { html } from 'lit-html';
import type { UmbWorkspaceDictionaryElement } from './dictionary-workspace.element';
import { data as dictionaryNodes } from 'src/core/mocks/data/dictionary.data';

export default {
	title: 'Workspaces/Dictionary',
	component: 'umb-dictionary-workspace',
	id: 'umb-dictionary-workspace',
} as Meta;

export const AAAOverview: Story<UmbWorkspaceDictionaryElement> = () =>
	html` <umb-dictionary-workspace id="${dictionaryNodes[0].key}"></umb-dictionary-workspace>`;

AAAOverview.storyName = 'Overview';
