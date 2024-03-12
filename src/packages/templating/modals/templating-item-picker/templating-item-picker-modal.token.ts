import type { CodeSnippetType } from '../../types.js';
import type { UmbEntitySelectModel } from '@umbraco-cms/backoffice/utils';
import { UmbModalToken } from '@umbraco-cms/backoffice/modal';

export interface UmbTemplatingItemPickerModalData {
	hidePartialViews?: boolean;
}

export type UmbTemplatingItemPickerModalValue = {
	value: UmbEntitySelectModel;
	type: CodeSnippetType;
};

export const UMB_TEMPLATING_ITEM_PICKER_MODAL = new UmbModalToken<
	UmbTemplatingItemPickerModalData,
	UmbTemplatingItemPickerModalValue
>('Umb.Modal.TemplatingItemPicker', {
	modal: {
		type: 'sidebar',
		size: 'small',
	},
});
