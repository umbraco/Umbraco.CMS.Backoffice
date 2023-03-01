import './history-ui-list.element';
import './history-ui-node.element';

import { Meta, Story } from '@storybook/web-components';
import { html } from 'lit-html';

import type { UmbHistoryUIListElement } from './history-ui-list.element';
import type { UmbHistoryUINodeElement } from './history-ui-node.element';

export default {
	title: 'Components/History UI',
	component: 'umb-history-ui-node',
	id: 'umb-history-ui',
} as Meta;

export const AAAOverview: Story<UmbHistoryUIListElement> = () => html` <umb-history-ui-list>
	<umb-history-ui-node name="Name attribute" detail="Detail attribute">
		Default slot
		<uui-button slot="actions" label="action">Action slot</uui-button>
	</umb-history-ui-node>
	<umb-history-ui-node name="Name attribute" detail="Detail attribute">
		Default slot
		<uui-button slot="actions" label="action">Action slot</uui-button>
	</umb-history-ui-node>
	<umb-history-ui-node name="Name attribute" detail="Detail attribute">
		Default slot
		<uui-button slot="actions" label="action">Action slot</uui-button>
	</umb-history-ui-node>
</umb-history-ui-list>`;
AAAOverview.storyName = 'Overview';

export const Node: Story<UmbHistoryUINodeElement> = () => html`<umb-history-ui-node
	name="Name attribute"
	detail="Detail attribute">
	Default slot
	<uui-button slot="actions" label="action">Action slot</uui-button>
</umb-history-ui-node>`;
