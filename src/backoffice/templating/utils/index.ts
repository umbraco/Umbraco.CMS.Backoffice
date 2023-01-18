// TODO: maybe the server could just return the parent path?
export const fileParentPath = (path: string | null | undefined): string => {
	if (!path) return '';
	return path.split('/').slice(0, -1).join('/');
};

// TODO: we can try and make pretty urls if we want to
export const fileUniqueFromServerPath = (path: string | null | undefined): string => {
	if (!path) return '';
	return encodeURIComponent(path).replace('.', '-');
};

// TODO: we can try and make pretty urls if we want to
export const serverPathFromFileUnique = (unique: string): string => {
	if (!unique) return '';
	return decodeURIComponent(unique.replace('-', '.'));
};
