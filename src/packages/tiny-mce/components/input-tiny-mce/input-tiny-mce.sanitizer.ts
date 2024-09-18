// TODO: clean up this file
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Editor } from '@umbraco-cms/backoffice/external/tinymce';

/**
 * Setup sanitization for preventing injecting arbitrary JavaScript execution in attributes:
 * https://github.com/advisories/GHSA-w7jx-j77m-wp65
 * https://github.com/advisories/GHSA-5vm8-hhgr-jcjp
 * @param editor
 */
export const uriAttributeSanitizer = (editor: Editor) => {
	const uriAttributesToSanitize = ['src', 'href', 'data', 'background', 'action', 'formaction', 'poster', 'xlink:href'];

	const parseUri = (function () {
		// Encapsulated JS logic.
		const safeSvgDataUrlElements = ['img', 'video'];
		const scriptUriRegExp = /((java|vb)script|mhtml):/i;
		// eslint-disable-next-line no-control-regex
		const trimRegExp = /[\s\u0000-\u001F]+/g;

		const isInvalidUri = (uri: string, tagName: string) => {
			if (/^data:image\//i.test(uri)) {
				return safeSvgDataUrlElements.indexOf(tagName) !== -1 && /^data:image\/svg\+xml/i.test(uri);
			} else {
				return /^data:/i.test(uri);
			}
		};

		return function parseUri(uri: string, tagName: string) {
			uri = uri.replace(trimRegExp, '');
			try {
				// Might throw malformed URI sequence
				uri = decodeURIComponent(uri);
			} catch (ex) {
				// Fallback to non UTF-8 decoder
				uri = unescape(uri);
			}

			if (scriptUriRegExp.test(uri)) {
				return;
			}

			if (isInvalidUri(uri, tagName)) {
				return;
			}

			return uri;
		};
	})();

	// TODO: sanitizeTinyMce is not defined in the global scope, so this will not work. Instead we need to get this setting from somewhere else:
	/*
	if (window.Umbraco?.Sys.ServerVariables.umbracoSettings.sanitizeTinyMce) {
		uriAttributesToSanitize.forEach((attribute) => {
			editor.serializer.addAttributeFilter(attribute, (nodes: AstNode[]) => {
				nodes.forEach((node: AstNode) => {
					node.attributes?.forEach((attr) => {
						if (uriAttributesToSanitize.includes(attr.name.toLowerCase())) {
							attr.value = parseUri(attr.value, node.name) ?? '';
						}
					});
				});
			});
		});
	}
	*/
};
