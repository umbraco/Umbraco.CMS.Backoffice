import type { UmbBlockListLayoutModel, UmbBlockListTypeModel } from '../types.js';
import type { UmbBlockListWorkspaceOriginData } from '../index.js';
import type { UmbBlockDataType } from '../../block/types.js';
import { UmbBooleanState } from '@umbraco-cms/backoffice/observable-api';
import { UmbBlockManagerContext } from '@umbraco-cms/backoffice/block';

/**
 * A implementation of the Block Manager specifically for the Block List Editor.
 */
export class UmbBlockListManagerContext<
	BlockLayoutType extends UmbBlockListLayoutModel = UmbBlockListLayoutModel,
> extends UmbBlockManagerContext<UmbBlockListTypeModel, BlockLayoutType, UmbBlockListWorkspaceOriginData> {
	//
	#inlineEditingMode = new UmbBooleanState(undefined);
	readonly inlineEditingMode = this.#inlineEditingMode.asObservable();

	setInlineEditingMode(inlineEditingMode: boolean | undefined) {
		this.#inlineEditingMode.setValue(inlineEditingMode ?? false);
	}
	getInlineEditingMode(): boolean | undefined {
		return this.#inlineEditingMode.getValue();
	}

	create(
		contentElementTypeKey: string,
		partialLayoutEntry?: Omit<BlockLayoutType, 'contentUdi'>,
		// This property is used by some implementations, but not used in this.
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		originData?: UmbBlockListWorkspaceOriginData,
	) {
		return super.createBlockData(contentElementTypeKey, partialLayoutEntry);
	}

	insert(
		layoutEntry: BlockLayoutType,
		content: UmbBlockDataType,
		settings: UmbBlockDataType | undefined,
		originData: UmbBlockListWorkspaceOriginData,
	) {
		this._layouts.appendOneAt(layoutEntry, originData.index ?? -1);

		this.insertBlockData(layoutEntry, content, settings, originData);

		return true;
	}
}
