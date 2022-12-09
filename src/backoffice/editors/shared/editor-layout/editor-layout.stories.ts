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
	<div slot="header">
		<uui-button color="" look="placeholder">Icon slot</uui-button>
		<uui-button color="" look="placeholder">Name slot</uui-button>
	</div>
	<div slot="footer"><uui-button color="" look="placeholder">Footer slot</uui-button></div>
	<uui-button slot="actions" color="" look="placeholder">Actions slot</uui-button>
	<uui-button slot="actions" color="" look="placeholder">Default slot</uui-button>
</umb-editor-layout>`;
AAAOverview.storyName = 'Overview';
