import type { ManifestPropertyEditorModel } from '@umbraco-cms/backoffice/extensions-registry';

export const manifest: ManifestPropertyEditorModel = {
	type: 'propertyEditorModel',
	name: 'Multiple Text String',
	alias: 'Umbraco.MultipleTextString',
	meta: {
		config: {
			properties: [
				{
					alias: 'min',
					label: 'Minimum',
					description: 'Enter the minimum amount of text boxes to be displayed',
					propertyEditorUI: 'Umb.PropertyEditorUI.Number',
				},
				{
					alias: 'max',
					label: 'Maximum',
					description: 'Enter the maximum amount of text boxes to be displayed, enter 0 for unlimited',
					propertyEditorUI: 'Umb.PropertyEditorUI.Number',
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
};
