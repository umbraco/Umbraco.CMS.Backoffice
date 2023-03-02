export function hasDefaultExport<ConstructorType>(object: unknown): object is { default: ConstructorType } {
	return object !== null && typeof object === 'object' && 'default' in object;
}
