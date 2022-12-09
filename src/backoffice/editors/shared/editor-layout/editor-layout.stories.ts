import './editor-layout.element';

import { Meta, Story } from '@storybook/web-components';
import { html } from 'lit-html';

import type { UmbEditorLayout } from './editor-layout.element';

export default {
	title: 'Editors/Shared/Editor Entity Layout',
	component: 'umb-editor-layout',
	id: 'umb-editor-layout',
} as Meta;

export const AAAOverview: Story<UmbEditorLayout> = () => html` <umb-editor-layout>
	<div slot="icon"><uui-button color="" look="placeholder">Icon slot</uui-button></div>
	<div slot="name"><uui-button color="" look="placeholder">Name slot</uui-button></div>
	<div slot="footer"><uui-button color="" look="placeholder">Footer slot</uui-button></div>
	<div slot="actions"><uui-button color="" look="placeholder">Actions slot</uui-button></div>
	<uui-button color="" look="placeholder">Default slot</uui-button>
</umb-editor-layout>`;
AAAOverview.storyName = 'Overview';
