import type { UmbFileDropzoneDroppedItems } from './types.js';

export function getExtensionFromMime(mime: string | null): string | null {
	if (!mime) return null; //TODO folders
	const extension = mime.split('/')[1];
	switch (extension) {
		case 'svg+xml':
			return 'svg';
		default:
			return extension;
	}
}

export const countDropzoneItems = (items: UmbFileDropzoneDroppedItems, includeRoot = false) => {
	let count = includeRoot ? 1 : 0;
	count += items.files.length;

	for (const subfolder of items.folders) {
		count += countDropzoneItems(subfolder, true);
	}
	return count;
};
