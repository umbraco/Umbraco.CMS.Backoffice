import '../confirm/confirm-modal.element.js';

import type { Meta, Story } from '@storybook/web-components';
import { html } from '@umbraco-cms/backoffice/external/lit';
import type { UmbCodeEditorModalData } from '@umbraco-cms/backoffice/modal';

export default {
	title: 'API/Modals/Layouts/Code Editor',
	component: 'umb-code-editor-modal',
	id: 'umb-code-editor-modal',
} as Meta;

const data: UmbCodeEditorModalData = {
	headline: 'Code editor modal example',
	content: `<b>This example</b> opens an HTML <i>string</i> in the Code Editor modal.`,
	language: 'html',
};

export const Overview: Story<UmbCodeEditorModalData> = () => html`
	<!-- TODO: figure out if generics are allowed for properties:
	https://github.com/runem/lit-analyzer/issues/149
	https://github.com/runem/lit-analyzer/issues/163 -->
	<umb-code-editor-modal .data=${data as any}></umb-code-editor-modal>
`;
