import { Meta } from '@storybook/web-components';
import { umbDataTypeData } from '../../../../../../../mocks/data/data-type.data.js';
import { html } from '@umbraco-cms/backoffice/external/lit';
import './property-editor-ui-tiny-mce-maximagesize-configuration.element.js';
import { UmbDataTypeDetailModel } from '@umbraco-cms/backoffice/data-type';

const dataTypeData = umbDataTypeData.getById('dt-richTextEditor') as UmbDataTypeDetailModel;

export default {
	title: 'Property Editor UIs/Tiny Mce Max Image Size Configuration',
	component: 'umb-property-editor-ui-tiny-mce-maximagesize-configuration',
	id: 'umb-property-editor-ui-tiny-mce-maximagesize-configuration',
} as Meta;

export const AAAOverview = ({ value }: any) =>
	html`<umb-property-editor-ui-tiny-mce-maximagesize-configuration
		.value=${value}></umb-property-editor-ui-tiny-mce-maximagesize-configuration>`;
AAAOverview.storyName = 'Overview';
AAAOverview.args = {
	value: dataTypeData?.values?.find((x) => x.alias === 'maxImageSize')?.value,
};
