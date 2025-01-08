/**
 * Escapes HTML entities in a string.
 * @example escapeHTML('<script>alert("XSS")</script>'), // "&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;"
 * @param html The HTML string to escape.
 * @returns The sanitized HTML string.
 */
export function escapeHTML(html: unknown): string {
	if (typeof html !== 'string' && html instanceof String === false) {
		return html as string;
	}

	return html
		.toString()
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}
