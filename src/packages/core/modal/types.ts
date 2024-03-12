import type { UmbEntitySelectModel } from '@umbraco-cms/backoffice/utils';

export interface UmbPickerModalData<TreeItemType> {
	multiple?: boolean;
	hideTreeRoot?: boolean;
	filter?: (item: TreeItemType) => boolean;
	pickableFilter?: (item: TreeItemType) => boolean;
}

export interface UmbTreePickerModalData<TreeItemType> extends UmbPickerModalData<TreeItemType> {
	treeAlias?: string;
}

export interface UmbPickerModalValue<ValueType = UmbEntitySelectModel> {
	selection: Array<ValueType>;
}
