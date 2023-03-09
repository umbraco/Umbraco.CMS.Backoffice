import '../../../../backoffice/shared/components/body-layout/body-layout.element';
import './modal-layout-embedded-media.element';

import { Meta } from '@storybook/web-components';
import { html } from 'lit';
import { UmbModalEmbeddedMediaData } from './modal-layout-embedded-media.element';

export default {
	title: 'API/Modals/Layouts/Embedded Media',
	component: 'umb-modal-layout-embedded-media',
	id: 'modal-layout-embedded-media',
} as Meta;

const data: UmbModalEmbeddedMediaData = {
	constrain: true,
	success: false,
	supportsDimensions: false,
};

export const Overview = () => html`
	<!-- TODO: figure out if generics are allowed for properties:
	https://github.com/runem/lit-analyzer/issues/149
	https://github.com/runem/lit-analyzer/issues/163 -->
	<umb-modal-layout-embedded-media .data=${data as any}></umb-modal-layout-embedded-media>
`;
