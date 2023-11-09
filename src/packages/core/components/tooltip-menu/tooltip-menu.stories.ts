import { Meta, StoryObj } from '@storybook/web-components';
import './tooltip-menu.element.js';
import type { UmbTooltipMenuElement, TooltipMenuItem } from './tooltip-menu.element.js';

const meta: Meta<UmbTooltipMenuElement> = {
	title: 'Components/Tooltip Menu',
	component: 'umb-tooltip-menu',
};

export default meta;
type Story = StoryObj<UmbTooltipMenuElement>;

const items: Array<TooltipMenuItem> = [
	{
		label: 'Item 1',
		icon: 'icon-document',
		action: () => alert('Item 1 clicked'),
	},
	{
		label: 'Item 2',
		icon: 'icon-home',
		action: () => alert('Item 2 clicked'),
	},
];

export const Overview: Story = {
	args: {
		items: items,
		iconOnly: false,
	},
};

export const WithIconsOnly: Story = {
	args: {
		items: items,
		iconOnly: true,
	},
};
