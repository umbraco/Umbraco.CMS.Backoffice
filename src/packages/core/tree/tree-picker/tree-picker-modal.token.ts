import { UMB_TREE_PICKER_MODAL_ALIAS } from './constants.js';
import type { UmbPickerModalData, UmbPickerModalValue, UmbWorkspaceModalData } from '@umbraco-cms/backoffice/modal';
import { UmbModalToken } from '@umbraco-cms/backoffice/modal';
import type { UmbPathPattern, UmbPathPatternParamsType } from '@umbraco-cms/backoffice/router';

export interface UmbTreePickerModalCreateActionData<PathPatternParamsType extends UmbPathPatternParamsType> {
	label: string;
	modalData: UmbWorkspaceModalData;
	modalToken?: UmbModalToken;
	extendWithPathPattern: UmbPathPattern;
	extendWithPathParams: PathPatternParamsType;
}

export interface UmbTreePickerModalData<
	TreeItemType,
	PathPatternParamsType extends UmbPathPatternParamsType = UmbPathPatternParamsType,
> extends UmbPickerModalData<TreeItemType> {
	treeAlias?: string;
	// Consider if it makes sense to move this into the UmbPickerModalData interface, but for now this is a TreePicker feature. [NL]
	createAction?: UmbTreePickerModalCreateActionData<PathPatternParamsType>;
}

export interface UmbTreePickerModalValue extends UmbPickerModalValue {}

export const UMB_TREE_PICKER_MODAL = new UmbModalToken<UmbTreePickerModalData<unknown>, UmbTreePickerModalValue>(
	UMB_TREE_PICKER_MODAL_ALIAS,
	{
		modal: {
			type: 'sidebar',
			size: 'small',
		},
	},
);
