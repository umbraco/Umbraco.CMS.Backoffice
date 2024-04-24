import type { ManifestModal, ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';

const modals: Array<ManifestModal> = [
	{
		type: 'modal',
		alias: 'Umb.Modal.PropertyEditorUiPicker',
		name: 'Property Editor UI Picker Modal',
		element: () => import('./property-editor-ui-picker/property-editor-ui-picker-modal.element.js'),
	},
	{
		type: 'modal',
		alias: 'Umb.Modal.DataTypePickerFlow',
		name: 'Data Type Picker Flow Modal',
		element: () => import('./data-type-picker-flow/data-type-picker-flow-modal.element.js'),
	},
	{
		type: 'modal',
		alias: 'Umb.Modal.DataTypePickerFlowDataTypePicker',
		name: 'Data Type Picker Flow UI Picker Modal',
		element: () => import('./data-type-picker-flow/data-type-picker-flow-data-type-picker-modal.element.js'),
	},
];

export const manifests: Array<ManifestTypes> = [...modals];
