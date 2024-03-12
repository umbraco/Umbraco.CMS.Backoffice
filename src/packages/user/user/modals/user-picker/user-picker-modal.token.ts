import type { UmbUserDetailModel } from '@umbraco-cms/backoffice/user';
import type { UmbPickerModalData, UmbPickerModalValue } from '@umbraco-cms/backoffice/modal';
import { UmbModalToken } from '@umbraco-cms/backoffice/modal';

export type UmbUserPickerModalData = UmbPickerModalData<UmbUserDetailModel>;

export interface UmbUserPickerModalValue extends UmbPickerModalValue {}

export const UMB_USER_PICKER_MODAL = new UmbModalToken<UmbUserPickerModalData, UmbUserPickerModalValue>(
	'Umb.Modal.User.Picker',
	{
		modal: {
			type: 'sidebar',
			size: 'small',
		},
	},
);
