import './member-group-workspace.element.js';

import { Meta, Story } from '@storybook/web-components';

import { data } from '../../../../mocks/data/member-group.data.js';

import type { UmbMemberGroupWorkspaceElement } from './member-group-workspace.element.js';
import { html } from '@umbraco-cms/backoffice/external/lit';

export default {
	title: 'Workspaces/Member Group',
	component: 'umb-member-group-workspace',
	id: 'umb-member-group-workspace',
} as Meta;

export const AAAOverview: Story<UmbMemberGroupWorkspaceElement> = () =>
	html` <umb-member-group-workspace id="${data[0].id}"></umb-member-group-workspace>`;
AAAOverview.storyName = 'Overview';
