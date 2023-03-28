import { Meta, StoryObj } from '@storybook/web-components';
import './tree-item.element';
import type { UmbTreeItemElement } from './tree-item.element';

const meta: Meta<UmbTreeItemElement> = {
	title: 'Components/Tree/Tree Item',
	component: 'umb-tree-item',
};

export default meta;
type Story = StoryObj<UmbTreeItemElement>;

export const Overview: Story = {
	args: {
		label: 'My Tree Item',
		icon: 'umb:home',
		hasChildren: false,
	},
};

export const WithChildren: Story = {
	args: {
		label: 'My Tree Item',
		icon: 'umb:home',
		hasChildren: true,
	},
};
