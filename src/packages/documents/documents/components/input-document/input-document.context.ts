import { UMB_DOCUMENT_ITEM_REPOSITORY_ALIAS } from '../../repository/index.js';
import type { UmbDocumentItemModel } from '../../repository/index.js';
import { UMB_DOCUMENT_PICKER_MODAL } from '../../modals/index.js';
import { UmbPickerInputContext } from '@umbraco-cms/backoffice/picker-input';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';

export class UmbDocumentPickerContext extends UmbPickerInputContext<UmbDocumentItemModel> {
	constructor(host: UmbControllerHost) {
		super(host, UMB_DOCUMENT_ITEM_REPOSITORY_ALIAS, UMB_DOCUMENT_PICKER_MODAL, (entry) => entry.unique);
	}
}
