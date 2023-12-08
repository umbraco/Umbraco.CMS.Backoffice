import { defaultExtendedValidElements, defaultFallbackConfig, defaultStyleFormats } from './input-tiny-mce.defaults.js';
import { pastePreProcessHandler, uploadImageHandler } from './input-tiny-mce.handlers.js';
import { availableLanguages } from './input-tiny-mce.languages.js';
import { uriAttributeSanitizer } from './input-tiny-mce.sanitizer.js';
import { FormControlMixin } from '@umbraco-cms/backoffice/external/uui';
import {
	type Editor,
	type EditorEvent,
	type RawEditorOptions,
	renderEditor,
} from '@umbraco-cms/backoffice/external/tinymce';
import { UMB_CURRENT_USER_CONTEXT, UmbCurrentUser } from '@umbraco-cms/backoffice/current-user';
import { TinyMcePluginArguments, UmbTinyMcePluginBase } from '@umbraco-cms/backoffice/components';
import { ClassConstructor, hasDefaultExport, loadManifestApi } from '@umbraco-cms/backoffice/extension-api';
import { ManifestTinyMcePlugin, umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';
import {
	PropertyValueMap,
	css,
	customElement,
	html,
	property,
	query,
	state,
} from '@umbraco-cms/backoffice/external/lit';
import { firstValueFrom } from '@umbraco-cms/backoffice/external/rxjs';
import { UmbMediaHelper } from '@umbraco-cms/backoffice/utils';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';
import { UMB_APP_CONTEXT } from '@umbraco-cms/backoffice/app';
import { UmbStylesheetRepository } from '@umbraco-cms/backoffice/stylesheet';

// TODO => integrate macro picker, update stylesheet fetch when backend CLI exists (ref tinymce.service.js in existing backoffice)
@customElement('umb-input-tiny-mce')
export class UmbInputTinyMceElement extends FormControlMixin(UmbLitElement) {
	@property({ attribute: false })
	configuration?: UmbPropertyEditorConfigCollection;

	@state()
	private _tinyConfig: RawEditorOptions = {};

	#mediaHelper = new UmbMediaHelper();
	#currentUser?: UmbCurrentUser;
	#currentUserContext?: typeof UMB_CURRENT_USER_CONTEXT.TYPE;
	#plugins: Array<new (args: TinyMcePluginArguments) => UmbTinyMcePluginBase> = [];
	#editorRef?: Editor | null = null;
	#stylesheetRepository?: UmbStylesheetRepository;
	#serverUrl?: string;

	protected getFormElement() {
		return this._editorElement?.querySelector('iframe') ?? undefined;
	}

	@query('#editor', true)
	private _editorElement?: HTMLElement;

	constructor() {
		super();

		this.consumeContext(UMB_APP_CONTEXT, (instance) => {
			this.#serverUrl = instance.getServerUrl();
		});

		this.#stylesheetRepository = new UmbStylesheetRepository(this);

		// TODO => this breaks tests, removing for now will ignore user language
		// and fall back to tinymce default language
		// this.consumeContext(UMB_AUTH, (instance) => {
		// 	this.#auth = instance;
		// 	this.#observeCurrentUser();
		// });
	}

	async #observeCurrentUser() {
		if (!this.#currentUserContext) return;

		this.observe(this.#currentUserContext.currentUser, (currentUser) => (this.#currentUser = currentUser));
	}

	protected async firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): Promise<void> {
		super.firstUpdated(_changedProperties);
		await this.#loadPlugins();
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
		const observable = umbExtensionsRegistry?.extensionsOfType('tinyMcePlugin');
		const manifests = (await firstValueFrom(observable)) as ManifestTinyMcePlugin[];

		for (const manifest of manifests) {
			const plugin = manifest.js
				? await loadManifestApi(manifest.js)
				: manifest.api
				? await loadManifestApi(manifest.api)
				: undefined;
			if (plugin) {
				this.#plugins.push(plugin);
			}
		}
	}

	async getFormatStyles(stylesheetPath: Array<string>) {
		const rules: any[] = [];

		stylesheetPath.forEach((path) => {
			//TODO => Legacy path?
			/**
			 * if (val.indexOf(Umbraco.Sys.ServerVariables.umbracoSettings.cssPath + "/") === 0) {
				// current format (full path to stylesheet)
				stylesheets.push(val);
			  }
			  else {
				// legacy format (stylesheet name only) - must prefix with stylesheet folder and postfix with ".css"
				stylesheets.push(Umbraco.Sys.ServerVariables.umbracoSettings.cssPath + "/" + val + ".css");
			  }
			 */
			this.#stylesheetRepository?.getStylesheetRules(path).then(({ data }) => {
				data?.rules?.forEach((rule) => {
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

					rules.push(r);
				});
			});
		});

		return rules;
	}

	async #setTinyConfig() {
		// create an object by merging the configuration onto the fallback config
		// TODO: Seems like a too tight coupling between DataTypeConfigCollection and TinyMceConfig, I would love it begin more explicit what we take from DataTypeConfigCollection and parse on, but I understand that this gives some flexibility. Is this flexibility on purpose?
		const configurationOptions: Record<string, any> = {
			...defaultFallbackConfig,
			...(this.configuration ? this.configuration?.toObject() : {}),
		};

		// Map the stylesheets with server url
		const stylesheets = configurationOptions.stylesheets.map(
			(stylesheetPath: string) => `${this.#serverUrl}/css/${stylesheetPath.replace(/\\/g, '/')}`,
		);
		const styleFormats = await this.getFormatStyles(configurationOptions.stylesheets);

		// no auto resize when a fixed height is set
		if (!configurationOptions.dimensions?.height) {
			configurationOptions.plugins ??= [];
			configurationOptions.plugins.splice(configurationOptions.plugins.indexOf('autoresize'), 1);
		}

		// set the default values that will not be modified via configuration
		this._tinyConfig = {
			autoresize_bottom_margin: 10,
			body_class: 'umb-rte',
			//see https://www.tiny.cloud/docs/tinymce/6/editor-important-options/#cache_suffix
			cache_suffix: '?umb__rnd=' + window.Umbraco?.Sys.ServerVariables.application.cacheBuster, // TODO: Cache buster
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
		};

		// extend with configuration values
		this._tinyConfig = {
			...this._tinyConfig,
			content_css: stylesheets,
			style_formats: styleFormats || defaultStyleFormats,
			extended_valid_elements: defaultExtendedValidElements,
			height: configurationOptions.height ?? 500,
			invalid_elements: configurationOptions.invalidElements,
			plugins: configurationOptions.plugins.map((x: any) => x.name),
			toolbar: configurationOptions.toolbar.join(' '),
			valid_elements: configurationOptions.validElements,
			width: configurationOptions.width,
		};

		// Need to check if we are allowed to UPLOAD images
		// This is done by checking if the insert image toolbar button is available
		if (this.#isMediaPickerEnabled()) {
			this._tinyConfig = {
				...this._tinyConfig,
				// Update the TinyMCE Config object to allow pasting
				images_upload_handler: uploadImageHandler,
				automatic_uploads: false,
				images_replace_blob_uris: false,
				// This allows images to be pasted in & stored as Base64 until they get uploaded to server
				paste_data_images: true,
			};
		}

		this.#setLanguage();

		if (this.#editorRef) {
			this.#editorRef.destroy();
		}

		const editors = await renderEditor(this._tinyConfig);
		this.#editorRef = editors.pop();
	}

	/**
	 * Sets the language to use for TinyMCE */
	#setLanguage() {
		const localeId = this.#currentUser?.languageIsoCode;
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

		// register custom option maxImageSize
		editor.options.register('maxImageSize', { processor: 'number', default: defaultFallbackConfig.maxImageSize });

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
		editor.on('SetContent', () => this.#mediaHelper.uploadBlobImages(editor));

		editor.on('focus', () => this.dispatchEvent(new CustomEvent('umb-rte-focus', { composed: true, bubbles: true })));

		editor.on('blur', () => {
			this.#onChange(editor.getContent());
			this.dispatchEvent(new CustomEvent('umb-rte-blur', { composed: true, bubbles: true }));
		});

		editor.on('ObjectResized', (e) => {
			this.#mediaHelper.onResize(e);
			this.#onChange(editor.getContent());
		});

		editor.on('init', () => editor.setContent(this.value?.toString() ?? ''));

		// If we can not find the insert image/media toolbar button
		// Then we need to add an event listener to the editor
		// That will update native browser drag & drop events
		// To update the icon to show you can NOT drop something into the editor
		if (this._tinyConfig.toolbar && !this.#isMediaPickerEnabled()) {
			// Wire up the event listener
			editor.on('dragstart dragend dragover draggesture dragdrop drop drag', (e: EditorEvent<InputEvent>) => {
				e.preventDefault();
				if (e.dataTransfer) {
					e.dataTransfer.effectAllowed = 'none';
					e.dataTransfer.dropEffect = 'none';
				}
				e.stopPropagation();
			});
		}
	}

	#onInit(editor: Editor) {
		//enable browser based spell checking
		editor.getBody().setAttribute('spellcheck', 'true');
		uriAttributeSanitizer(editor);
	}

	#onChange(value: string) {
		super.value = value;
		this.dispatchEvent(new CustomEvent('change'));
	}

	#isMediaPickerEnabled() {
		const toolbar = this._tinyConfig.toolbar;
		if (Array.isArray(toolbar) && (toolbar as string[]).includes('umbmediapicker')) {
			return true;
		} else if (typeof toolbar === 'string' && toolbar.includes('umbmediapicker')) {
			return true;
		}

		return false;
	}

	/**
	 * Nothing rendered by default - TinyMCE initialisation creates
	 * a target div and binds the RTE to that element
	 * @returns
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
		`,
	];
}

export default UmbInputTinyMceElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-input-tiny-mce': UmbInputTinyMceElement;
	}
}
