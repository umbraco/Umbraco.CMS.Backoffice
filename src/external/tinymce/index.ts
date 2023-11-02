/* eslint local-rules/ensure-no-external-imports: 0 */
/**
 * TinyMce is a CommonJS module, but in order to make @web/test-runner happy
 * we need to load it as a module and then manually register it in the browser
 * as a global variable, so that we can find it and use it in our tests.
 * We are also loading the default icons, so that we can use them outside of a TinyMce instance.
 *
 * TODO: Load the plugins that we want to use in the editor.
 */
import * as tiny from 'tinymce';

// Declare a global variable to hold the TinyMCE instance
declare global {
	interface Window {
		tinymce: typeof tiny.default;
	}
}

// Load default icons making them available to everyone
import 'tinymce/icons/default/icons.js';

const defaultConfig: tiny.RawEditorOptions = {
	base_url: '/umbraco/backoffice/tinymce',
};

/* Initialize TinyMCE */
export function renderEditor(userConfig?: tiny.RawEditorOptions) {
	const config = { ...defaultConfig, ...userConfig };
	return window.tinymce.init(config);
}

export { tiny as tinymce };
