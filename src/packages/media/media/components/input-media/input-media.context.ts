import { UMB_MEDIA_PICKER_MODAL, type UmbMediaCardItemModel } from '../../modals/index.js';
import { UMB_MEDIA_ITEM_REPOSITORY_ALIAS } from '../../repository/index.js';
import type { UmbMediaItemModel } from '../../repository/item/types.js';
import type { UmbMediaTreeItemModel } from '../../tree/index.js';
import type {
	UmbMediaTreePickerModalData,
	UmbMediaTreePickerModalValue,
} from '../../tree/media-tree-picker-modal.token.js';
import { UmbPickerInputContext } from '@umbraco-cms/backoffice/picker-input';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbArrayState } from '@umbraco-cms/backoffice/observable-api';
import { UmbImagingRepository } from '@umbraco-cms/backoffice/imaging';
import { ImageCropModeModel } from '@umbraco-cms/backoffice/external/backend-api';

export class UmbMediaPickerContext extends UmbPickerInputContext<
	UmbMediaItemModel,
	UmbMediaTreeItemModel,
	UmbMediaTreePickerModalData,
	UmbMediaTreePickerModalValue
> {
	#imagingRepository: UmbImagingRepository;

	#cardItems = new UmbArrayState<UmbMediaCardItemModel>([], (x) => x.unique);
	readonly cardItems = this.#cardItems.asObservable();

	constructor(host: UmbControllerHost) {
		super(host, UMB_MEDIA_ITEM_REPOSITORY_ALIAS, UMB_MEDIA_PICKER_MODAL);
		this.#imagingRepository = new UmbImagingRepository(host);

		this.observe(this.selectedItems, async (selectedItems) => {
			if (!selectedItems?.length) {
				this.#cardItems.setValue([]);
				return;
			}
			const { data } = await this.#imagingRepository.requestResizedItems(
				selectedItems.map((x) => x.unique),
				{ height: 400, width: 400, mode: ImageCropModeModel.MIN },
			);

			this.#cardItems.setValue(
				selectedItems.map((item) => {
					const url = data?.find((x) => x.unique === item.unique)?.url;
					return {
						icon: item.mediaType.icon,
						name: item.name,
						unique: item.unique,
						isTrashed: item.isTrashed,
						entityType: item.entityType,
						url,
					};
				}),
			);
		});
	}
}
