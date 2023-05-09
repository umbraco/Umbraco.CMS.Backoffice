import type { ManifestPropertyEditorUI } from '@umbraco-cms/backoffice/extensions-registry';

export const manifest: ManifestPropertyEditorUI = {
	type: 'propertyEditorUI',
	alias: 'Umb.PropertyEditorUI.TextArea',
	name: 'Text Area Property Editor UI',
	loader: () => import('./property-editor-ui-textarea.element'),
	meta: {
		label: 'Text Area',
		propertyEditorModel: 'Umbraco.TextArea',
		icon: 'umb:edit',
		group: 'common',
		config: {
			properties: [
				{
					alias: 'rows',
					label: 'Number of rows',
					description: 'If empty the textarea is set to autoheight',
					propertyEditorUI: 'Umb.PropertyEditorUI.Number',
				},
				{
					alias: 'minHeight',
					label: 'Min height (pixels)',
					description: 'Sets the minimum height of the textarea',
					propertyEditorUI: 'Umb.PropertyEditorUI.Number',
				},
				{
					alias: 'maxHeight',
					label: 'Max height (pixels)',
					description: 'Sets the maximum height of the textarea',
					propertyEditorUI: 'Umb.PropertyEditorUI.Number',
				},
			],
			defaultData: [
				{
					alias: 'rows',
					value: 10,
				},
			],
		},
	},
};
