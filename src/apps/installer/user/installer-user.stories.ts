import { Meta, Story } from '@storybook/web-components';

import { UmbContextStoryRenderElement, installerContextProvider } from '../shared/utils.story-helpers.js';
import type { UmbInstallerUserElement } from './installer-user.element.js';
import { html } from '@umbraco-cms/backoffice/external/lit';
import './installer-user.element.js';
import { UmbInstallerContext } from '../installer.context.js';

const contextProvider = new UmbContextStoryRenderElement()
new UmbInstallerContext(contextProvider);

export default {
	title: 'Apps/Installer/Steps',
	component: 'umb-installer-user',
	id: 'umb-installer-user',
	decorators: [(story) => html`${contextProvider.renderStory(story)}`],
} as Meta;

export const Step1User: Story<UmbInstallerUserElement> = () => html`<umb-installer-user></umb-installer-user>`;
Step1User.storyName = 'Step 1: User';
