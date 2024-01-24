import type { UmbBlockListLayoutModel, UmbBlockListTypeModel } from '../types.js';
import { UmbBlockManagerContext } from '../../block/manager/block-manager.context.js';
import type { UmbBlockListWorkspaceData } from '../index.js';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { UmbBooleanState } from '@umbraco-cms/backoffice/observable-api';

/**
 * A implementation of the Block Manager specifically for the Block List.
 */
export class UmbBlockListManagerContext<
	BlockLayoutType extends UmbBlockListLayoutModel = UmbBlockListLayoutModel,
> extends UmbBlockManagerContext<UmbBlockListTypeModel, BlockLayoutType> {
	//
	#inlineEditingMode = new UmbBooleanState(undefined);
	inlineEditingMode = this.#inlineEditingMode.asObservable();

	setInlineEditingMode(inlineEditingMode: boolean | undefined) {
		this.#inlineEditingMode.setValue(inlineEditingMode ?? false);
	}

	_createBlock(modalData: UmbBlockListWorkspaceData, layoutEntry: BlockLayoutType, contentElementTypeKey: string) {
		// Here is room to append some extra layout properties if needed for this type.

		this._layouts.appendOneAt(layoutEntry, modalData.originData.index ?? -1);

		return true;
	}
}

export const UMB_BLOCK_LIST_MANAGER_CONTEXT = new UmbContextToken<
	UmbBlockListManagerContext,
	UmbBlockListManagerContext
>('UmbBlockManagerContext');
