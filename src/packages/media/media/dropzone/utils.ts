/**
 * Get the file extension from the given mime type.
 * @param {string} mime - mime type
 * @returns {string} file extension
 */
export function getExtensionFromMime(mime: string): string | null {
	if (!mime) return null;
	const extension = mime.split('/')[1];

	if (extension === 'svg+xml') return 'svg';
	return extension;
}
