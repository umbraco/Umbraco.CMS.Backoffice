import type { ManifestPropertyEditorSchema } from '@umbraco-cms/backoffice/extension-registry';

export const manifest: ManifestPropertyEditorSchema = {
	type: 'propertyEditorSchema',
	name: 'Multi Node Tree Picker',
	alias: 'Umbraco.MultiNodeTreePicker',
	meta: {
		defaultPropertyEditorUiAlias: 'Umb.PropertyEditorUi.TreePicker',
		settings: {
			properties: [
				{
					alias: 'minNumber',
					label: 'Minimum number of items',
					description: '',
					propertyEditorUiAlias: 'Umb.PropertyEditorUi.Number',
				},
				{
					alias: 'maxNumber',
					label: 'Maximum number of items',
					description: '',
					propertyEditorUiAlias: 'Umb.PropertyEditorUi.Number',
				},
				{
					alias: 'ignoreUserStartNodes',
					label: 'Ignore user start nodes',
					description: 'Selecting this option allows a user to choose nodes that they normally dont have access to.',
					propertyEditorUiAlias: 'Umb.PropertyEditorUi.Toggle',
				},
				{
					alias: 'startNode',
					label: 'Node type',
					description: '',
					propertyEditorUiAlias: 'Umb.PropertyEditorUi.TreePicker.SourcePicker',
				},
			],
			defaultData: [
				{
					alias: 'minNumber',
					value: 0,
				},
				{
					alias: 'maxNumber',
					value: 0,
				},
			],
		},
	},
};
