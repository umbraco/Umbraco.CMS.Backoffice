import { Meta, Story } from '@storybook/web-components';

import { UmbInstallerContext } from '../installer.context.js';
import { UmbContextStoryRenderElement } from '../shared/utils.story-helpers.js';
import type { UmbInstallerConsentElement } from './installer-consent.element.js';
import { html } from '@umbraco-cms/backoffice/external/lit';
import './installer-consent.element.js';

const contextProvider = new UmbContextStoryRenderElement();
new UmbInstallerContext(contextProvider);

export default {
	title: 'Apps/Installer/Steps',
	component: 'umb-installer-consent',
	id: 'umb-installer-consent',
	decorators: [(story) => html`${contextProvider.renderStory(story)}`],
} as Meta;

export const Step2Telemetry: Story<UmbInstallerConsentElement> = () =>
	html`<umb-installer-consent></umb-installer-consent>`;
Step2Telemetry.storyName = 'Step 2: Telemetry data';
