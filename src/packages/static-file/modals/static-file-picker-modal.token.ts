import { UMB_STATIC_FILE_TREE_ALIAS } from '@umbraco-cms/backoffice/static-file';
import { StaticFileItemResponseModel } from '@umbraco-cms/backoffice/backend-api';
import { UmbModalToken, UmbPickerModalValue, UmbTreePickerModalData } from '@umbraco-cms/backoffice/modal';

export type UmbStaticFilePickerModalData = UmbTreePickerModalData<StaticFileItemResponseModel>;
export type UmbStaticFilePickerModalValue = UmbPickerModalValue;

export const UMB_STATIC_FILE_PICKER_MODAL = new UmbModalToken<
	UmbStaticFilePickerModalData,
	UmbStaticFilePickerModalValue
>('Umb.Modal.TreePicker', {
	modal: {
		type: 'sidebar',
		size: 'small',
	},
	data: {
		treeAlias: UMB_STATIC_FILE_TREE_ALIAS,
	},
});
