export interface UmbDataTypeDetailModel {
	entityType: string;
	unique: string;
	parentUnique: string | null;
	name: string;
	editorAlias: string | undefined;
	editorUiAlias: string | null;
	values: Array<UmbDataTypePropertyModel>;
}

export interface UmbDataTypePropertyModel {
	alias: string;
	value: any;
}
