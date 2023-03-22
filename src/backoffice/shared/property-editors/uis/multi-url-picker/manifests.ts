import type { ManifestPropertyEditorUI } from '@umbraco-cms/backoffice/extensions-registry';

export const manifest: ManifestPropertyEditorUI = {
	type: 'propertyEditorUI',
	alias: 'Umb.PropertyEditorUI.MultiUrlPicker',
	name: 'Multi URL Picker Property Editor UI',
	loader: () => import('./property-editor-ui-multi-url-picker.element'),
	meta: {
		label: 'Multi URL Picker',
		propertyEditorModel: 'Umbraco.MultiUrlPicker',
		icon: 'umb:link',
		group: 'pickers',
		config: {
			properties: [
				{
					alias: 'overlaySize',
					label: 'Overlay Size',
					description: 'Select the width of the overlay.',
					propertyEditorUI: 'Umb.PropertyEditorUI.OverlaySize',
				},
				{
					alias: 'hideAnchor',
					label: 'Hide anchor/query string input',
					description: 'Selecting this hides the anchor/query string input field in the link picker overlay.',
					propertyEditorUI: 'Umb.PropertyEditorUI.Toggle',
				},
			],
		},
	},
};
