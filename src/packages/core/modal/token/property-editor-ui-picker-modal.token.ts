import { UmbModalToken } from './modal-token.js';

export interface UmbPropertyEditorUIPickerModalData {
	submitLabel?: string;
}

export type UmbPropertyEditorUIPickerModalValue = {
	selection: Array<string>;
};

export const UMB_PROPERTY_EDITOR_UI_PICKER_MODAL = new UmbModalToken<
	UmbPropertyEditorUIPickerModalData,
	UmbPropertyEditorUIPickerModalValue
>('Umb.Modal.PropertyEditorUiPicker', {
	modal: {
		type: 'sidebar',
		size: 'small',
	},
});
