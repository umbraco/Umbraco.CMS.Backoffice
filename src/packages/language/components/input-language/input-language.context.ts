import type { UmbLanguageItemModel } from '../../repository/index.js';
import { UMB_LANGUAGE_ITEM_REPOSITORY_ALIAS } from '../../repository/index.js';
import { UMB_LANGUAGE_PICKER_MODAL } from '../../modals/language-picker/index.js';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbPickerInputContext } from '@umbraco-cms/backoffice/picker-input';

export class UmbLanguagePickerContext extends UmbPickerInputContext<UmbLanguageItemModel> {
	constructor(host: UmbControllerHost) {
		super(host, UMB_LANGUAGE_ITEM_REPOSITORY_ALIAS, UMB_LANGUAGE_PICKER_MODAL);
	}
}
