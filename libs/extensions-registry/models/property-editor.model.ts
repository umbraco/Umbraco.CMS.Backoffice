import type { UmbPropertyEditorExtensionElement } from '../interfaces';
import type { ManifestElement, ManifestBase } from '.';

export interface ManifestPropertyEditorUI extends ManifestElement<UmbPropertyEditorExtensionElement> {
	type: 'propertyEditorUI';
	meta: MetaPropertyEditorUI;
}

export interface MetaPropertyEditorUI {
	label: string;
	propertyEditorModel: string;
	icon: string;
	group: string;
	config?: PropertyEditorConfig;
	supportsReadOnly?: boolean;
}

// Model
export interface ManifestPropertyEditorModel extends ManifestBase {
	type: 'propertyEditorModel';
	meta: MetaPropertyEditorModel;
}

export interface MetaPropertyEditorModel {
	config?: PropertyEditorConfig;
}

// Config
export interface PropertyEditorConfig {
	properties: PropertyEditorConfigProperty[];
	defaultData?: PropertyEditorConfigDefaultData[];
}

export interface PropertyEditorConfigProperty {
	label: string;
	description?: string;
	alias: string;
	propertyEditorUI: string;
}

export interface PropertyEditorConfigDefaultData {
	alias: string;
	value: any;
}
