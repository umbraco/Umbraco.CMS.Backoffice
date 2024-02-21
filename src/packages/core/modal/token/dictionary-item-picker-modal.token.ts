import type { UmbUniqueTreeItemModel } from '../../tree/types.js';
import { UmbModalToken } from './modal-token.js';
import type { UmbPickerModalValue, UmbTreePickerModalData } from '@umbraco-cms/backoffice/modal';

export type UmbDictionaryItemPickerModalData = UmbTreePickerModalData<UmbUniqueTreeItemModel>;
export type UmbDictionaryItemPickerModalValue = UmbPickerModalValue;

export const UMB_DICTIONARY_ITEM_PICKER_MODAL = new UmbModalToken<
	UmbDictionaryItemPickerModalData,
	UmbDictionaryItemPickerModalValue
>('Umb.Modal.TreePicker', {
	modal: {
		type: 'sidebar',
		size: 'small',
	},
	data: {
		hideTreeRoot: true,
		treeAlias: 'Umb.Tree.Dictionary',
	},
});
