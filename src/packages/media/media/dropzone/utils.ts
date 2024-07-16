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
