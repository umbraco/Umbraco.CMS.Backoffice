import type { ManifestPropertyEditorUi } from '@umbraco-cms/backoffice/extension-registry';

export const manifest: ManifestPropertyEditorUi = {
	type: 'propertyEditorUi',
	alias: 'Umb.PropertyEditorUi.UserGroupPicker',
	name: 'User Group Picker Property Editor UI',
	js: () => import('./property-editor-ui-user-group-picker.element.js'),
	meta: {
		label: 'User Group Picker',
		propertyEditorSchemaAlias: 'Umbraco.UserGroupPicker',
		icon: 'icon-users-alt',
		group: 'people',
	},
};
