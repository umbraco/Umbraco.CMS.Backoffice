import type { ManifestPropertyEditorUI } from '@umbraco-cms/models';

// TODO: we don't really want this config value to be changed from the UI. We need a way to handle hidden config properties.
const allowDecimalsConfig = {
	alias: 'allowDecimals',
	label: 'Allow decimals',
	propertyEditorUI: 'Umb.PropertyEditorUI.Toggle',
};

export const manifests: Array<ManifestPropertyEditorUI> = [
	{
		type: 'propertyEditorUI',
		alias: 'Umb.PropertyEditorUI.Integer',
		name: 'Integer Property Editor UI',
		loader: () => import('./property-editor-ui-number.element'),
		meta: {
			label: 'Integer',
			propertyEditorModel: 'Umbraco.Integer',
			icon: 'umb:autofill',
			group: 'common',
			config: {
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
		type: 'propertyEditorUI',
		alias: 'Umb.PropertyEditorUI.Decimal',
		name: 'Decimal Property Editor UI',
		loader: () => import('./property-editor-ui-number.element'),
		meta: {
			label: 'Decimal',
			propertyEditorModel: 'Umbraco.Decimal',
			icon: 'umb:autofill',
			group: 'common',
			config: {
				properties: [allowDecimalsConfig],
				defaultData: [
					{
						alias: 'allowDecimals',
						value: true,
					},
				],
			},
		},
	},
];
