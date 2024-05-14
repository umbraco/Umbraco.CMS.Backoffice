import { UMB_DATA_TYPE_ITEM_REPOSITORY_ALIAS } from '../../repository/index.js';
import type { UmbDataTypeItemModel } from '../../repository/item/types.js';
import type { UmbDataTypePickerModalData } from '../../modals/index.js';
import { UMB_DATA_TYPE_PICKER_MODAL } from '../../modals/index.js';
import type { UmbDataTypeTreeItemModel } from '../../tree/types.js';
import { UmbPickerInputContext } from '@umbraco-cms/backoffice/picker-input';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';

export class UmbDataTypePickerContext extends UmbPickerInputContext<
	UmbDataTypeItemModel,
	UmbDataTypeTreeItemModel,
	UmbDataTypePickerModalData
> {
	constructor(host: UmbControllerHost) {
		super(host, UMB_DATA_TYPE_ITEM_REPOSITORY_ALIAS, UMB_DATA_TYPE_PICKER_MODAL);
	}
}
