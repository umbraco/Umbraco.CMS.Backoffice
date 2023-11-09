import type { ManifestPropertyEditorUi } from '@umbraco-cms/backoffice/extension-registry';

export const manifest: ManifestPropertyEditorUi = {
	type: 'propertyEditorUi',
	alias: 'Umb.PropertyEditorUi.MultiUrlPicker',
	name: 'Multi URL Picker Property Editor UI',
	loader: () => import('./property-editor-ui-multi-url-picker.element.js'),
	meta: {
		label: 'Multi URL Picker',
		propertyEditorSchemaAlias: 'Umbraco.MultiUrlPicker',
		icon: 'icon-link',
		group: 'pickers',
		settings: {
			properties: [
				{
					alias: 'overlaySize',
					label: 'Overlay Size',
					description: 'Select the width of the overlay.',
					propertyEditorUiAlias: 'Umb.PropertyEditorUi.OverlaySize',
				},
				{
					alias: 'hideAnchor',
					label: 'Hide anchor/query string input',
					description: 'Selecting this hides the anchor/query string input field in the link picker overlay.',
					propertyEditorUiAlias: 'Umb.PropertyEditorUi.Toggle',
				},
			],
		},
	},
};
