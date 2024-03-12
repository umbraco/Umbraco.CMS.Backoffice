import type { UmbMemberItemModel } from '../../repository/index.js';
import type { UmbPickerModalValue } from '@umbraco-cms/backoffice/modal';
import { UmbModalToken } from '@umbraco-cms/backoffice/modal';

export interface UmbMemberPickerModalData {
	multiple?: boolean;
	filter?: (member: UmbMemberItemModel) => boolean;
}

export interface UmbMemberPickerModalValue extends UmbPickerModalValue {}

export const UMB_MEMBER_PICKER_MODAL = new UmbModalToken<UmbMemberPickerModalData, UmbMemberPickerModalValue>(
	'Umb.Modal.MemberPicker',
	{
		modal: {
			type: 'sidebar',
			size: 'small',
		},
	},
);
