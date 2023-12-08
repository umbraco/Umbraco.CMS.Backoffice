import { Meta, Story } from '@storybook/web-components';
import type { UmbWorkspacePropertyLayoutElement } from './workspace-property-layout.element.js';
import { html } from '@umbraco-cms/backoffice/external/lit';

import './workspace-property-layout.element.js';

export default {
	title: 'Workspaces/Shared/Editor Property Layout',
	component: 'umb-workspace-property-layout',
	id: 'umb-workspace-property-layout',
} as Meta;

export const AAAOverview: Story<UmbWorkspacePropertyLayoutElement> = () =>
	html` <umb-workspace-property-layout label="Label" description="Description">
		<div slot="property-action-menu"><uui-button color="" look="placeholder">Menu</uui-button></div>

		<div slot="editor"><uui-button color="" look="placeholder">Editor</uui-button></div>
	</umb-workspace-property-layout>`;
AAAOverview.storyName = 'Overview';
