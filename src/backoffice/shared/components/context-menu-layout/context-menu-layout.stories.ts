import './context-menu-layout.element';

import { Meta, Story } from '@storybook/web-components';
import { html } from 'lit-html';

import type { UmbContextMenuLayout } from './context-menu-layout.element';

export default {
	title: 'Workspaces/Shared/Workspace Layout',
	component: 'umb-body-layout',
	id: 'umb-body-layout',
} as Meta;

export const AAAOverview: Story<UmbContextMenuLayout> = () => html` <umb-body-layout>
	<div slot="header"><uui-button color="" look="placeholder">Header slot</uui-button></div>
	<uui-button color="" look="placeholder">Main slot</uui-button>
	<div slot="footer"><uui-button color="" look="placeholder">Footer slot</uui-button></div>
</umb-body-layout>`;
AAAOverview.storyName = 'Overview';
