import { css, customElement, html, property, query } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { debounce } from '@umbraco-cms/backoffice/utils';

export type UmbMasonryLayoutOptions = {
	maxWidth?: number;
	gap?: number;
};

const elementName = 'umb-masonry-layout';
@customElement(elementName)
export class UmbMasonryLayoutElement extends UmbLitElement {
	@query('#grid')
	private _grid!: HTMLElement;

	@property({ type: Object, attribute: false })
	options!: UmbMasonryLayoutOptions;

	private _slotElements: HTMLElement[] = [];

	override firstUpdated() {
		this.#layoutItems();
		window.addEventListener('resize', () => {
			this.#layoutItems();
		});
	}

	private _debouncedLayoutItems = debounce(() => {
		this.#layoutItems();
	}, 50);

	#layoutItems() {
		// Nothing to do if there are no items
		if (this._slotElements.length === 0) return;

		// Calculate number of columns
		const maxWidth = this.options.maxWidth ?? 200;
		const containerWidth = this._grid.getBoundingClientRect().width;
		const cols = Math.floor(containerWidth / maxWidth);

		// If there is only one column, reset all item styles
		if (cols === 1) {
			this._slotElements.forEach((el) => {
				el.style.marginTop = '';
				el.style.width = '100%';
				el.style.marginBottom = `${this.options.gap}px`;
			});
			return;
		}

		// Iterate over all items and calculate the layout
		this._slotElements.forEach((el, index) => {
			el.style.marginTop = '';
			el.style.width = `calc((100% - (${cols - 1} * ${this.options.gap}px)) / ${cols})`;
			el.style.marginBottom = `${this.options.gap}px`;

			// Don't process the first horizontal row
			if (cols > index) {
				return;
			}

			// Get the element immediately above
			const topEl = this._slotElements[index - cols];

			// Get the position of the element immediately above
			const topElPos = topEl.getBoundingClientRect().top;

			// Get the height of the element immediately above, including the bottom margin
			const topElHeight = this.#getHeightAndMarginBottom(topEl);

			// Get the bottom position of the element directly above it
			const topElBottomPos = topElPos + topElHeight;

			// Get the position of the display area
			const elPos = el.getBoundingClientRect().top;

			// Adjustment position acquisition
			const setPos = elPos - topElBottomPos;

			// Ignore if there is not position change
			if (setPos === 0) {
				return false;
			}

			// Reposition the item
			el.style.marginTop = `-${setPos}px`;
		});
	}

	#getHeightAndMarginBottom(el: HTMLElement) {
		const height = el.getBoundingClientRect().height;
		const styles = getComputedStyle(el);
		const bottom = parseFloat(styles.marginBottom);
		return height + bottom;
	}

	#onSlotChange(e) {
		this._slotElements = [...(e.target.assignedElements() as HTMLElement[])];
		this.#layoutItems();
	}

	override render() {
		return html`<div
			id="grid"
			style="column-gap: ${this.options.gap}px;"
			@masonry-item-updated=${this._debouncedLayoutItems}>
			<slot @slotchange=${this.#onSlotChange}></slot>
		</div>`;
	}

	static override styles = [
		css`
			:host {
				position: relative;
				width: 100%;
			}
			#grid {
				display: flex;
				flex-wrap: wrap;
				align-items: flex-start;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: UmbMasonryLayoutElement;
	}
}
