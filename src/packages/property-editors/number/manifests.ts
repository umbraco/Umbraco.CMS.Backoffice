import type { ManifestPropertyEditorUi } from '@umbraco-cms/backoffice/extension-registry';

// TODO: we don't really want this config value to be changed from the UI. We need a way to handle hidden config properties.
const allowDecimalsConfig = {
	alias: 'allowDecimals',
	label: 'Allow decimals',
	propertyEditorUiAlias: 'Umb.PropertyEditorUi.Toggle',
};

export const manifests: Array<ManifestPropertyEditorUi> = [
	{
		type: 'propertyEditorUi',
		alias: 'Umb.PropertyEditorUi.Integer',
		name: 'Integer Property Editor UI',
		element: () => import('./property-editor-ui-number.element.js'),
		meta: {
			label: 'Integer',
			propertyEditorSchemaAlias: 'Umbraco.Integer',
			icon: 'icon-autofill',
			group: 'common',
			settings: {
				properties: [allowDecimalsConfig],
				defaultData: [
					{
						alias: 'allowDecimals',
						value: false,
					},
				],
			},
		},
	},
	{
		type: 'propertyEditorUi',
		alias: 'Umb.PropertyEditorUi.Decimal',
		name: 'Decimal Property Editor UI',
		element: () => import('./property-editor-ui-number.element.js'),
		meta: {
			label: 'Decimal',
			propertyEditorSchemaAlias: 'Umbraco.Decimal',
			icon: 'icon-autofill',
			group: 'common',
			settings: {
				properties: [allowDecimalsConfig],
				defaultData: [
					{
						alias: 'allowDecimals',
						value: true,
					},
					{
						alias: 'step',
						value: '0.01',
					},
				],
			},
		},
	},
	{
		type: 'propertyEditorUi',
		alias: 'Umb.PropertyEditorUi.Number',
		name: 'Number Property Editor UI',
		element: () => import('./property-editor-ui-number.element.js'),
		meta: {
			label: 'Number',
			icon: 'icon-autofill',
			group: 'common',
			propertyEditorSchemaAlias: 'Umbraco.Integer',
		},
	},
];
