import type { ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<ManifestTypes> = [
	{
		type: 'propertyEditorSchema',
		name: 'Multiple Text String',
		alias: 'Umbraco.MultipleTextstring',
		meta: {
			defaultPropertyEditorUiAlias: 'Umb.PropertyEditorUi.MultipleTextString',
			settings: {
				properties: [
					{
						alias: 'min',
						label: 'Minimum',
						description: 'Enter the minimum amount of text boxes to be displayed',
						propertyEditorUiAlias: 'Umb.PropertyEditorUi.Number',
					},
					{
						alias: 'max',
						label: 'Maximum',
						description: 'Enter the maximum amount of text boxes to be displayed, enter 0 for unlimited',
						propertyEditorUiAlias: 'Umb.PropertyEditorUi.Number',
					},
				],
				defaultData: [
					{
						alias: 'min',
						value: 0,
					},
					{
						alias: 'max',
						value: 0,
					},
				],
			},
		},
	},
];
