import type { UUIModalSidebarSize } from '@umbraco-cms/backoffice/external/uui';

export interface UmbBlockTypeBaseModel {
	contentElementTypeKey: string;
	settingsElementTypeKey?: string;
	label?: string;
	//view?: string; // TODO: remove/replace with custom element manifest type for block list.
	//stylesheet?: string; // TODO: remove/replace with custom element manifest type for block list.
	thumbnail?: string;
	iconColor?: string;
	backgroundColor?: string;
	editorSize?: UUIModalSidebarSize;
	forceHideContentEditorInOverlay: boolean;
}

export interface UmbBlockTypeGroup {
	name?: string;
	key: string;
}

export interface UmbBlockTypeWithGroupKey extends UmbBlockTypeBaseModel {
	groupKey?: string | null;
}
