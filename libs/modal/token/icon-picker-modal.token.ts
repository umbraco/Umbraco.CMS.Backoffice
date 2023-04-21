import { UmbModalToken } from '@umbraco-cms/backoffice/modal';

export interface UmbIconPickerModalData {
	color: string | undefined;
	icon: string | undefined;
}

export interface UmbIconPickerModalResult {
	color: string | undefined;
	icon: string | undefined;
}

export const UMB_ICON_PICKER_MODAL = new UmbModalToken<UmbIconPickerModalData, UmbIconPickerModalResult>(
	'Umb.Modal.IconPicker',
	{
		type: 'sidebar',
		size: 'small',
	}
);
