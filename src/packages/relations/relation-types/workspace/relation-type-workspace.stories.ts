import './relation-type-workspace.element.js';

import type { Meta, Story } from '@storybook/web-components';
import { data } from '../../../../mocks/data/relations/relation-type.data.js';
import type { UmbRelationTypeWorkspaceElement } from './relation-type-workspace.element.js';
import { html, ifDefined } from '@umbraco-cms/backoffice/external/lit';

export default {
	title: 'Workspaces/Relation Type',
	component: 'umb-relation-type-workspace',
	id: 'umb-relation-type-workspace',
} as Meta;

export const AAAOverview: Story<UmbRelationTypeWorkspaceElement> = () =>
	html` <umb-relation-type-workspace id="${ifDefined(data[0].id)}"></umb-relation-type-workspace>`;
AAAOverview.storyName = 'Overview';
