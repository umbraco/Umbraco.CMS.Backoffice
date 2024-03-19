import { pastePreProcessHandler } from './input-tiny-mce.handlers.js';
import { defaultFallbackConfig } from './input-tiny-mce.defaults.js';
import { availableLanguages } from './input-tiny-mce.languages.js';
import { uriAttributeSanitizer } from './input-tiny-mce.sanitizer.js';
import type { TinyMcePluginArguments, UmbTinyMcePluginBase } from './tiny-mce-plugin.js';
import { getProcessedImageUrl } from '@umbraco-cms/backoffice/utils';
import { FormControlMixin } from '@umbraco-cms/backoffice/external/uui';
import type { EditorEvent, Editor, RawEditorOptions } from '@umbraco-cms/backoffice/external/tinymce';
import { loadManifestApi } from '@umbraco-cms/backoffice/extension-api';
import { type ManifestTinyMcePlugin, umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';
import { css, customElement, html, property, query, state } from '@umbraco-cms/backoffice/external/lit';
import { firstValueFrom } from '@umbraco-cms/backoffice/external/rxjs';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';
import { UmbStylesheetDetailRepository, UmbStylesheetRuleManager } from '@umbraco-cms/backoffice/stylesheet';
import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';

/**
 * Handles the resize event
 */
// TODO: This does somehow not belong as a utility method as it is very specific to this implementation. [NL]
async function onResize(
	e: EditorEvent<{
		target: HTMLElement;
		width: number;
		height: number;
		origin: string;
	}>,
) {
	const srcAttr = e.target.getAttribute('src');

	if (!srcAttr) {
		return;
	}

	const path = srcAttr.split('?')[0];
	const resizedPath = await getProcessedImageUrl(path, {
		width: e.width,
		height: e.height,
		mode: 'max',
	});

	e.target.setAttribute('data-mce-src', resizedPath);
}

@customElement('umb-input-tiny-mce')
export class UmbInputTinyMceElement extends FormControlMixin(UmbLitElement) {
	@property({ attribute: false })
	configuration?: UmbPropertyEditorConfigCollection;

	@state()
	private _tinyConfig: RawEditorOptions = {};

	// eslint-disable-next-line @typescript-eslint/consistent-type-imports
	#renderEditor?: typeof import('@umbraco-cms/backoffice/external/tinymce').renderEditor;
	#plugins: Array<new (args: TinyMcePluginArguments) => UmbTinyMcePluginBase> = [];
	#editorRef?: Editor | null = null;
	#stylesheetRepository = new UmbStylesheetDetailRepository(this);
	#umbStylesheetRuleManager = new UmbStylesheetRuleManager();

	protected getFormElement() {
		return this._editorElement?.querySelector('iframe') ?? undefined;
	}

	set value(newValue: FormDataEntryValue | FormData) {
		super.value = newValue;
		const newContent = newValue?.toString() ?? '';

		if (this.#editorRef && this.#editorRef.getContent() != newContent) {
			this.#editorRef.setContent(newContent);
		}
	}

	get value(): FormDataEntryValue | FormData {
		return super.value;
	}

	@query('#editor', true)
	private _editorElement?: HTMLElement;

	protected async firstUpdated(): Promise<void> {
		// Here we want to start the loading of everything at first, not one at a time, which is why this code is not using await.
		const loadEditor = import('@umbraco-cms/backoffice/external/tinymce').then((tinyMce) => {
			this.#renderEditor = tinyMce.renderEditor;
		});
		await Promise.all([loadEditor, ...(await this.#loadPlugins())]);
		await this.#setTinyConfig();
	}

	disconnectedCallback() {
		super.disconnectedCallback();

		if (this.#editorRef) {
			// TODO: Test if there is any problems with destroying the RTE here, but not initializing on connectedCallback. (firstUpdated is only called first time the element is rendered, not when it is reconnected)
			this.#editorRef.destroy();
		}
	}

	/**
	 * Load all custom plugins - need to split loading and instantiating as these
	 * need the editor instance as a ctor argument. If we load them in the editor
	 * setup method, the asynchronous nature means the editor is loaded before
	 * the plugins are ready and so are not associated with the editor.
	 */
	async #loadPlugins() {
		const observable = umbExtensionsRegistry?.byType('tinyMcePlugin');
		const manifests = (await firstValueFrom(observable)) as ManifestTinyMcePlugin[];

		const promises = [];
		for (const manifest of manifests) {
			if (manifest.js) {
				promises.push(
					loadManifestApi(manifest.js).then((plugin) => {
						if (plugin) {
							this.#plugins.push(plugin);
						}
					}),
				);
			}
			if (manifest.api) {
				promises.push(
					loadManifestApi(manifest.api).then((plugin) => {
						if (plugin) {
							this.#plugins.push(plugin);
						}
					}),
				);
			}
		}
		return promises;
	}

	async getFormatStyles(stylesheetPaths: Array<string>) {
		if (!stylesheetPaths) return [];
		const formatStyles: any[] = [];

		const promises = stylesheetPaths.map((path) => this.#stylesheetRepository?.requestByUnique(path));
		const stylesheetResponses = await Promise.all(promises);

		stylesheetResponses.forEach(({ data }) => {
			if (!data) return;
			const rulesFromContent = this.#umbStylesheetRuleManager.extractRules(data.content);

			rulesFromContent.forEach((rule) => {
				const r: {
					title?: string;
					inline?: string;
					classes?: string;
					attributes?: Record<string, string>;
					block?: string;
				} = {
					title: rule.name,
				};

				if (!rule.selector) return;

				if (rule.selector.startsWith('.')) {
					r.inline = 'span';
					r.classes = rule.selector.substring(1);
				} else if (rule.selector.startsWith('#')) {
					r.inline = 'span';
					r.attributes = { id: rule.selector.substring(1) };
				} else if (rule.selector.includes('.')) {
					const [block, ...classes] = rule.selector.split('.');
					r.block = block;
					r.classes = classes.join(' ').replace(/\./g, ' ');
				} else if (rule.selector.includes('#')) {
					const [block, id] = rule.selector.split('#');
					r.block = block;
					r.classes = id;
				} else {
					r.block = rule.selector;
				}

				formatStyles.push(r);
			});
		});

		return formatStyles;
	}

	async #setTinyConfig() {
		const dimensions = this.configuration?.getValueByAlias<{ width?: number; height?: number }>('dimensions');

		const stylesheetPaths = this.configuration?.getValueByAlias<string[]>('stylesheets') ?? [];
		const styleFormats = await this.getFormatStyles(stylesheetPaths);

		// Map the stylesheets with server url
		const stylesheets =
			stylesheetPaths?.map((stylesheetPath: string) => `/css${stylesheetPath.replace(/\\/g, '/')}`) ?? [];

		stylesheets.push('/umbraco/backoffice/css/rte-content.css');

		// create an object by merging the configuration onto the fallback config
		const configurationOptions: RawEditorOptions = {
			...defaultFallbackConfig,
			height: dimensions?.height,
			width: dimensions?.width,
			content_css: stylesheets,
			style_formats: styleFormats,
		};

		// no auto resize when a fixed height is set
		if (!configurationOptions.height) {
			if (Array.isArray(configurationOptions.plugins) && configurationOptions.plugins.includes('autoresize')) {
				configurationOptions.plugins.splice(configurationOptions.plugins.indexOf('autoresize'), 1);
			}
		}

		// set the configured toolbar if any
		const toolbar = this.configuration?.getValueByAlias<string[]>('toolbar');
		if (toolbar) {
			configurationOptions.toolbar = toolbar.join(' ');
		}

		// set the configured inline mode
		const mode = this.configuration?.getValueByAlias<string>('mode');
		if (mode?.toLocaleLowerCase() === 'inline') {
			configurationOptions.inline = true;
		}

		// set the maximum image size
		const maxImageSize = this.configuration?.getValueByAlias<number>('maxImageSize');
		if (maxImageSize !== undefined) {
			configurationOptions.maxImageSize = maxImageSize;
		}

		// set the default values that will not be modified via configuration
		this._tinyConfig = {
			autoresize_bottom_margin: 10,
			body_class: 'umb-rte',
			contextMenu: false,
			inline_boundaries_selector: 'a[href],code,.mce-annotation,.umb-embed-holder,.umb-macro-holder',
			menubar: false,
			paste_remove_styles_if_webkit: true,
			paste_preprocess: pastePreProcessHandler,
			relative_urls: false,
			resize: false,
			statusbar: false,
			setup: (editor) => this.#editorSetup(editor),
			target: this._editorElement,
			paste_data_images: false,

			// Extend with configuration options
			...configurationOptions,
		};

		this.#setLanguage();

		if (this.#editorRef) {
			this.#editorRef.destroy();
		}

		if (!this.#renderEditor) {
			throw new Error('TinyMCE renderEditor is not loaded');
		}
		const editors = await this.#renderEditor(this._tinyConfig);
		this.#editorRef = editors.pop();
	}

	/**
	 * Sets the language to use for TinyMCE */
	#setLanguage() {
		const localeId = this.localize.lang();
		//try matching the language using full locale format
		let languageMatch = availableLanguages.find((x) => localeId?.localeCompare(x) === 0);

		//if no matches, try matching using only the language
		if (!languageMatch) {
			const localeParts = localeId?.split('_');
			if (localeParts) {
				languageMatch = availableLanguages.find((x) => x === localeParts[0]);
			}
		}

		// only set if language exists, will fall back to tiny default
		if (languageMatch) {
			this._tinyConfig.language = languageMatch;
		}
	}

	#editorSetup(editor: Editor) {
		editor.suffix = '.min';

		// instantiate plugins - these are already loaded in this.#loadPlugins
		// to ensure they are available before setting up the editor.
		// Plugins require a reference to the current editor as a param, so can not
		// be instantiated until we have an editor
		for (const plugin of this.#plugins) {
			new plugin({ host: this, editor });
		}

		// define keyboard shortcuts
		editor.addShortcut('Ctrl+S', '', () =>
			this.dispatchEvent(new CustomEvent('rte.shortcut.save', { composed: true, bubbles: true })),
		);

		editor.addShortcut('Ctrl+P', '', () =>
			this.dispatchEvent(new CustomEvent('rte.shortcut.saveAndPublish', { composed: true, bubbles: true })),
		);

		// bind editor events
		editor.on('init', () => this.#onInit(editor));
		editor.on('Change', () => this.#onChange(editor.getContent()));
		editor.on('Dirty', () => this.#onChange(editor.getContent()));
		editor.on('Keyup', () => this.#onChange(editor.getContent()));

		editor.on('focus', () => this.dispatchEvent(new CustomEvent('umb-rte-focus', { composed: true, bubbles: true })));

		editor.on('blur', () => {
			this.#onChange(editor.getContent());
			this.dispatchEvent(new CustomEvent('umb-rte-blur', { composed: true, bubbles: true }));
		});

		editor.on('ObjectResized', (e) => {
			onResize(e);
			this.#onChange(editor.getContent());
		});

		editor.on('SetContent', (e) => {
			/**
			 * Prevent injecting arbitrary JavaScript execution in on-attributes.
			 *
			 * TODO: This used to be toggleable through server variables with window.Umbraco?.Sys.ServerVariables.umbracoSettings.sanitizeTinyMce
			 */
			const allNodes = Array.from(editor.dom.doc.getElementsByTagName('*'));
			allNodes.forEach((node) => {
				for (let i = 0; i < node.attributes.length; i++) {
					if (node.attributes[i].name.startsWith('on')) {
						node.removeAttribute(node.attributes[i].name);
					}
				}
			});
		});

		editor.on('init', () => editor.setContent(this.value?.toString() ?? ''));
	}

	#onInit(editor: Editor) {
		//enable browser based spell checking
		editor.getBody().setAttribute('spellcheck', 'true');
		uriAttributeSanitizer(editor);
	}

	#onChange(value: string) {
		this.value = value;
		this.dispatchEvent(new UmbChangeEvent());
	}

	/**
	 * Nothing rendered by default - TinyMCE initialization creates
	 * a target div and binds the RTE to that element
	 */
	render() {
		return html`<div id="editor"></div>`;
	}

	static styles = [
		css`
			#editor {
				position: relative;
				min-height: 100px;
			}

			.tox-tinymce {
				border-radius: 0;
				border: var(--uui-input-border-width, 1px) solid var(--uui-input-border-color, var(--uui-color-border, #d8d7d9));
			}

			.tox-tinymce-aux {
				z-index: 9000;
			}

			.tox-tinymce-inline {
				z-index: 900;
			}

			.tox-tinymce-fullscreen {
				position: absolute;
			}

			/* FIXME: Remove this workaround when https://github.com/tinymce/tinymce/issues/6431 has been fixed */
			.tox .tox-collection__item-label {
				line-height: 1 !important;
			}

			/* Solves issue 1019 by lowering un-needed z-index on header.*/
			.tox.tox-tinymce .tox-editor-header {
				z-index: 0;
			}
		`,
	];
}

export default UmbInputTinyMceElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-input-tiny-mce': UmbInputTinyMceElement;
	}
}
