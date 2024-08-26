import type { ManifestBlockEditorCustomView } from '../index.js';
import type { UUIModalSidebarSize } from '@umbraco-cms/backoffice/external/uui';
// Shared with the Property Editor
export interface UmbBlockTypeBaseModel {
	contentElementTypeKey: string;
	settingsElementTypeKey?: string;
	label?: string;
	thumbnail?: string;
	iconColor?: string;
	backgroundColor?: string;
	editorSize?: UUIModalSidebarSize;
	forceHideContentEditorInOverlay: boolean;
}

// Shared with the Property Editor
export interface UmbBlockLayoutBaseModel {
	contentUdi: string;
	settingsUdi?: string | null;
}

// Shared with the Property Editor
export interface UmbBlockDataType {
	udi: string;
	contentTypeKey: string;
	[key: string]: unknown;
}

export interface UmbBlockEditorCustomViewConfiguration {
	editContentPath?: string;
	editSettingsPath?: string;
	showContentEdit: boolean;
	showSettingsEdit: boolean;
}

export interface UmbBlockEditorCustomViewProperties<
	LayoutType extends UmbBlockLayoutBaseModel = UmbBlockLayoutBaseModel,
	BlockType extends UmbBlockTypeBaseModel = UmbBlockTypeBaseModel,
> {
	manifest?: ManifestBlockEditorCustomView;
	config?: Partial<UmbBlockEditorCustomViewConfiguration>;
	blockType?: BlockType;
	contentUdi?: string;
	label?: string;
	icon?: string;
	index?: number;
	layout?: LayoutType;
	content?: UmbBlockDataType;
	settings?: UmbBlockDataType;
	contentInvalid?: boolean;
	settingsInvalid?: boolean;
}

export interface UmbBlockEditorCustomViewElement<
	LayoutType extends UmbBlockLayoutBaseModel = UmbBlockLayoutBaseModel,
	BlockType extends UmbBlockTypeBaseModel = UmbBlockTypeBaseModel,
> extends UmbBlockEditorCustomViewProperties<LayoutType, BlockType>,
		HTMLElement {}
