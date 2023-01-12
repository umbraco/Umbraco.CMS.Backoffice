import type { ManifestPropertyEditorUI } from '@umbraco-cms/models';

export const manifest: ManifestPropertyEditorUI = {
	type: 'propertyEditorUI',
	alias: 'Umb.PropertyEditorUI.NumberRange',
	name: 'Number Range Property Editor UI',
	loader: () => import('./property-editor-ui-number-range.element'),
	meta: {
		label: 'Number Range',
		propertyEditorModel: '',
		icon: 'umb:autofill',
		group: 'common',
	},
};
