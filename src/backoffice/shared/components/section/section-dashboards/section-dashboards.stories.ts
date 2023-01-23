import { Meta, Story } from '@storybook/web-components';
import { html } from 'lit-html';
import { manifests } from '../../../../documents/section.manifests';
import { UmbSectionContext, UMB_SECTION_CONTEXT_TOKEN } from '../section.context';
import type { UmbSectionDashboardsElement } from './section-dashboards.element';
import type { ManifestSection } from '@umbraco-cms/models';
import './section-dashboards.element';

const contentSectionManifest = manifests.find((m) => m.alias === 'Umb.Section.Content') as ManifestSection;

export default {
	title: 'Sections/Shared/Section Dashboards',
	component: 'umb-section-dashboards',
	id: 'umb-section-dashboards',
	decorators: [
		(story) =>
			html` <umb-context-provider
				key=${UMB_SECTION_CONTEXT_TOKEN.toString()}
				.value=${new UmbSectionContext(contentSectionManifest)}>
				${story()}
			</umb-context-provider>`,
	],
} as Meta;

export const AAAOverview: Story<UmbSectionDashboardsElement> = () =>
	html` <umb-section-dashboards></umb-section-dashboards> `;
AAAOverview.storyName = 'Overview';
