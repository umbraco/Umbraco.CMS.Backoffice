import type { ManifestPropertyEditorUi } from '@umbraco-cms/backoffice/extension-registry';

export const manifest: ManifestPropertyEditorUi = {
	type: 'propertyEditorUi',
	alias: 'Umb.PropertyEditorUi.CheckboxList',
	name: 'Checkbox List Property Editor UI',
	loader: () => import('./property-editor-ui-checkbox-list.element.js'),
	meta: {
		label: 'Checkbox List',
		propertyEditorSchemaAlias: 'Umbraco.CheckboxList',
		icon: 'icon-bulleted-list',
		group: 'lists',
		settings: {
			properties: [
				{
					alias: 'items',
					label: 'Add option',
					description: 'Add, remove or sort options for the list.',
					propertyEditorUiAlias: 'Umb.PropertyEditorUi.MultipleTextString',
				},
			],
		},
	},
};
