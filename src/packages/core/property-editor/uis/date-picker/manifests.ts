import type { ManifestPropertyEditorUi } from '@umbraco-cms/backoffice/extension-registry';

export const manifest: ManifestPropertyEditorUi = {
	type: 'propertyEditorUi',
	alias: 'Umb.PropertyEditorUi.DatePicker',
	name: 'Date Picker Property Editor UI',
	loader: () => import('./property-editor-ui-date-picker.element.js'),
	meta: {
		label: 'Date Picker',
		propertyEditorSchemaAlias: 'Umbraco.DateTime',
		icon: 'icon-time',
		group: 'pickers',
		settings: {
			properties: [
				{
					alias: 'format',
					label: 'Date format',
					description: 'If left empty then the format is YYYY-MM-DD',
					propertyEditorUiAlias: 'Umb.PropertyEditorUi.TextBox',
				},
			],
			defaultData: [
				{
					alias: 'format',
					value: 'YYYY-MM-DD HH:mm:ss',
				},
			],
		},
	},
};
