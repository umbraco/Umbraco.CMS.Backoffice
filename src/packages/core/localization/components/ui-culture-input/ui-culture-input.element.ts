import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';
import { css, html, customElement, query, state, property } from '@umbraco-cms/backoffice/external/lit';
import type { UUIComboboxElement, UUIComboboxEvent } from '@umbraco-cms/backoffice/external/uui';
import { UUIFormControlMixin } from '@umbraco-cms/backoffice/external/uui';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type { ManifestLocalization } from '@umbraco-cms/backoffice/extension-registry';
import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';

interface UmbCultureInputOption {
	name: string;
	value: string;
}

@customElement('umb-ui-culture-input')
export class UmbUiCultureInputElement extends UUIFormControlMixin(UmbLitElement, '') {
	@state()
	private _options: Array<UmbCultureInputOption> = [];

	@query('uui-combobox')
	private _selectElement!: HTMLInputElement;

	@property({ type: String })
	override get value() {
		return super.value;
	}
	override set value(value: FormDataEntryValue | FormData) {
		if (typeof value === 'string') {
			const oldValue = super.value;
			super.value = value.toLowerCase();
			this.requestUpdate('value', oldValue);
		}
	}

	constructor() {
		super();
		this.#observeTranslations();
	}

	#observeTranslations() {
		this.observe(
			umbExtensionsRegistry.byType('localization'),
			(localizationManifests) => {
				this.#mapToOptions(localizationManifests);
			},
			'umbObserveLocalizationManifests',
		);
	}

	#mapToOptions(manifests: Array<ManifestLocalization>) {
		this._options = manifests
			.filter((isoCode) => isoCode !== undefined)
			.map((manifest) => ({
				name: manifest.name,
				value: manifest.meta.culture.toLowerCase(),
			}));
	}

	protected override getFormElement() {
		return this._selectElement;
	}

	#onChange(event: UUIComboboxEvent) {
		event.stopPropagation();
		const target = event.target as UUIComboboxElement;

		if (typeof target?.value === 'string') {
			this.value = target.value;
			this.dispatchEvent(new UmbChangeEvent());
		}
	}

	override render() {
		return html` <uui-combobox value="${this.value}" @change=${this.#onChange}>
			<uui-combobox-list>
				${this._options.map(
					(option) => html`<uui-combobox-list-option value="${option.value}">${option.name}</uui-combobox-list-option>`,
				)}
			</uui-combobox-list>
		</uui-combobox>`;
	}

	static override styles = [
		css`
			:host {
				display: block;
			}
		`,
	];
}

export default UmbUiCultureInputElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-ui-culture-input': UmbUiCultureInputElement;
	}
}
