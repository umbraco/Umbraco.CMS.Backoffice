import type { UmbMemberGroupItemModel } from '../../repository/index.js';
import type { UmbPickerModalValue } from '@umbraco-cms/backoffice/modal';
import { UmbModalToken } from '@umbraco-cms/backoffice/modal';

export interface UmbMemberGroupPickerModalData {
	multiple?: boolean;
	filter?: (memberGroup: UmbMemberGroupItemModel) => boolean;
}

export interface UmbMemberGroupPickerModalValue extends UmbPickerModalValue {}

export const UMB_MEMBER_GROUP_PICKER_MODAL = new UmbModalToken<
	UmbMemberGroupPickerModalData,
	UmbMemberGroupPickerModalValue
>('Umb.Modal.MemberGroupPicker', {
	modal: {
		type: 'sidebar',
		size: 'small',
	},
});
