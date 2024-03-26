import icons from '../../../icon-registry/icons/icons.json' assert { type: 'json' };
import type { UUIColorSwatchesEvent } from '@umbraco-cms/backoffice/external/uui';

import { css, html, customElement, state, repeat } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';

import type { UmbIconPickerModalData, UmbIconPickerModalValue } from '@umbraco-cms/backoffice/modal';
import { UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';
import { extractUmbColorVariable, umbracoColors } from '@umbraco-cms/backoffice/resources';

// TODO: Make use of UmbPickerLayoutBase
// TODO: to prevent element extension we need to move the Picker logic into a separate class we can reuse across all pickers
@customElement('umb-icon-picker-modal')
export class UmbIconPickerModalElement extends UmbModalBaseElement<UmbIconPickerModalData, UmbIconPickerModalValue> {
	private _iconList = icons.filter((icon) => !icon.legacy);

	@state()
	private _iconListFiltered: Array<(typeof icons)[0]> = [];

	@state()
	private _colorList = umbracoColors;

	@state()
	private _modalValue?: UmbIconPickerModalValue;

	@state()
	private _currentAlias = 'text';

	#changeIcon(e: { target: HTMLInputElement; type: string; key: unknown }) {
		if (e.type == 'click' || (e.type == 'keyup' && e.key == 'Enter')) {
			this.modalContext?.updateValue({ icon: e.target.id });
		}
	}

	#filterIcons(e: { target: HTMLInputElement }) {
		if (e.target.value) {
			this._iconListFiltered = this._iconList.filter((icon) =>
				icon.name.toLowerCase().includes(e.target.value.toLowerCase()),
			);
		} else {
			this._iconListFiltered = this._iconList;
		}
	}

	#onColorChange(e: UUIColorSwatchesEvent) {
		this.modalContext?.updateValue({ color: e.target.value });
		this._currentAlias = e.target.value;
	}

	connectedCallback() {
		super.connectedCallback();
		this._iconListFiltered = this._iconList;

		if (this.modalContext) {
			this.observe(
				this.modalContext?.value,
				(newValue) => {
					this._modalValue = newValue;
					this._currentAlias = newValue?.color ?? 'text';
				},
				'_observeModalContextValue',
			);
		}
	}

	render() {
		return html`
			<umb-body-layout headline="Select Icon">
				<div id="container">
					${this.renderSearchbar()}
					<hr />
					<uui-color-swatches
						.value="${this._modalValue?.color ?? ''}"
						label="Color switcher for icons"
						@change="${this.#onColorChange}">
						${
							// TODO: Missing translation for the color aliases.
							this._colorList.map(
								(color) => html`
									<uui-color-swatch
										label="${color.alias}"
										title="${color.alias}"
										value=${color.alias}
										style="--uui-swatch-color: var(${color.varName})"></uui-color-swatch>
								`,
							)
						}
					</uui-color-swatches>
					<hr />
					<uui-scroll-container id="icon-selection">${this.renderIconSelection()}</uui-scroll-container>
				</div>
				<uui-button
					slot="actions"
					label=${this.localize.term('general_close')}
					@click="${this._rejectModal}"></uui-button>
				<uui-button
					slot="actions"
					color="positive"
					look="primary"
					@click="${this._submitModal}"
					label=${this.localize.term('general_submit')}></uui-button>
			</umb-body-layout>
		`;
	}

	renderSearchbar() {
		return html` <uui-input
			type="search"
			placeholder=${this.localize.term('placeholders_filter')}
			label=${this.localize.term('placeholders_filter')}
			id="searchbar"
			@keyup="${this.#filterIcons}">
			<uui-icon name="search" slot="prepend" id="searchbar_icon"></uui-icon>
		</uui-input>`;
	}

	renderIconSelection() {
		return repeat(
			this._iconListFiltered,
			(icon) => icon.name,
			(icon) => html`
				<uui-icon
					tabindex="0"
					style="--uui-icon-color: var(${extractUmbColorVariable(this._currentAlias)})"
					class="icon ${icon.name === this._modalValue?.icon ? 'selected' : ''}"
					title="${icon.name}"
					name="${icon.name}"
					label="${icon.name}"
					id="${icon.name}"
					@click="${this.#changeIcon}"
					@keyup="${this.#changeIcon}">
				</uui-icon>
			`,
		);
	}

	static styles = [
		UmbTextStyles,
		css`
			:host {
				position: relative;
			}

			#container {
				display: flex;
				flex-direction: column;
				height: 100%;
				background-color: var(--uui-color-surface);
				box-shadow: var(--uui-shadow-depth-1, 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24));
				border-radius: var(--uui-border-radius);
				padding: var(--uui-size-space-5);
				box-sizing: border-box;
			}
			#container hr {
				height: 1px;
				border: none;
				background-color: var(--uui-color-divider);
				margin: 20px 0;
			}

			#searchbar {
				width: 100%;
				align-items: center;
			}
			#searchbar_icon {
				padding-left: var(--uui-size-space-2);
			}

			#icon-selection {
				line-height: 0;
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(40px, calc((100% / 12) - 10px)));
				gap: 10px;
				overflow-y: scroll;
				max-height: 100%;
				min-height: 0;
				padding: 2px;
			}

			#icon-selection .icon {
				display: inline-block;
				border-radius: var(--uui-border-radius);
				width: 100%;
				height: 100%;
				padding: var(--uui-size-space-3);
				box-sizing: border-box;
				cursor: pointer;
			}

			#icon-selection .icon-container {
				display: inline-block;
			}

			#icon-selection .icon:focus,
			#icon-selection .icon:hover,
			#icon-selection .icon.selected {
				outline: 2px solid var(--uui-color-selected);
			}

			uui-button {
				margin-left: var(--uui-size-space-4);
			}

			uui-color-swatches {
				margin: 0;
			}
		`,
	];
}

export default UmbIconPickerModalElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-icon-picker-modal': UmbIconPickerModalElement;
	}
}
