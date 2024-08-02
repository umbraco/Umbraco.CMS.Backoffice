export type UmbEntityUnique = string | null;

export interface UmbEntityModel {
	entityType: string;
	unique: UmbEntityUnique;
}
