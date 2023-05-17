import { Meta, StoryObj } from '@storybook/web-components';
import type { UmbUserGroupInputElement } from './user-group-input.element';
import './user-group-input.element';

const meta: Meta<UmbUserGroupInputElement> = {
	title: 'Components/Inputs/User Group',
	component: 'umb-user-group-input',
	argTypes: {
		// modalType: {
		// 	control: 'inline-radio',
		// 	options: ['dialog', 'sidebar'],
		// 	defaultValue: 'sidebar',
		// 	description: 'The type of modal to use when selecting user groups',
		// },
		// modalSize: {
		// 	control: 'select',
		// 	options: ['small', 'medium', 'large', 'full'],
		// 	defaultValue: 'small',
		// 	description: 'The size of the modal to use when selecting user groups, only applicable to sidebar not dialog',
		// },
	},
};

export default meta;
type Story = StoryObj<UmbUserGroupInputElement>;

export const Overview: Story = {
	args: {},
};
