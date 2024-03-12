import type { UmbLanguageItemModel } from '@umbraco-cms/backoffice/language';
import type { UmbPickerModalValue } from '@umbraco-cms/backoffice/modal';
import { UmbModalToken } from '@umbraco-cms/backoffice/modal';

export interface UmbLanguagePickerModalData {
	multiple?: boolean;
	filter?: (language: UmbLanguageItemModel) => boolean;
}

export interface UmbLanguagePickerModalValue extends UmbPickerModalValue {}

export const UMB_LANGUAGE_PICKER_MODAL = new UmbModalToken<UmbLanguagePickerModalData, UmbLanguagePickerModalValue>(
	'Umb.Modal.LanguagePicker',
	{
		modal: {
			type: 'sidebar',
			size: 'small',
		},
	},
);
