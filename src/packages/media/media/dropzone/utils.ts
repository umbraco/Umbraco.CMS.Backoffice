export function getExtensionFromMime(mime: string): string | undefined {
	if (!mime) return undefined;
	const extension = mime.split('/')[1];
	switch (extension) {
		case 'svg+xml':
			return 'svg';
		default:
			return extension;
	}
}
