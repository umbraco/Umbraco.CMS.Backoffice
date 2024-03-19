/** Tried to find a common base of our entities — used by Entity Workspace Context */
export type UmbEntityBase = {
	id?: string;
	name?: string;
};

export interface UmbSwatchDetails {
	label: string;
	value: string;
}
export interface ServertimeOffset {
	/**
	 * offset in minutes relative to UTC
	 */
	offset: number;
}

export interface NumberRangeValueType {
	min?: number;
	max?: number;
}

export interface UmbReferenceByUnique {
	unique: string;
}

export interface UmbReferenceByUniqueAndType {
	type: string;
	unique: string;
}
