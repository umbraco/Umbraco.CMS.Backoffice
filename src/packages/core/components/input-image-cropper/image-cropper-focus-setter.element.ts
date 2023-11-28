//import { clamp } from './mathUtils.js';
import { drag, clamp } from '@umbraco-cms/backoffice/external/uui';
import { UmbImageCropperFocalPoint } from './index.js';
import {
	LitElement,
	PropertyValueMap,
	css,
	html,
	nothing,
	customElement,
	property,
	state,
	query,
} from '@umbraco-cms/backoffice/external/lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

@customElement('umb-image-cropper-focus-setter')
export class UmbImageCropperFocusSetterElement extends LitElement {
	@query('#image') imageElement!: HTMLImageElement;
	@query('#wrapper') wrapperElement!: HTMLImageElement;
	@query('#focal-point') focalPointElement!: HTMLImageElement;

	@state() private isDraggingGridHandle = false;

	@state() private coords = { x: 0, y: 0 };

	@property({ type: String }) src?: string;
	@property({ attribute: false }) focalPoint: UmbImageCropperFocalPoint = { left: 0.5, top: 0.5 };

	@property({ type: Boolean, reflect: true }) disabled = false;

	#DOT_RADIUS = 8 as const;

	connectedCallback() {
		super.connectedCallback();
		this.#addEventListeners();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.#removeEventListeners();
	}

	protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
		super.updated(_changedProperties);

		if (_changedProperties.has('focalPoint')) {
			this.#setFocalPointStyle(this.focalPoint.left, this.focalPoint.top);

			// Reset coords if focal point change to center.
			if (this.#isCentered(this.focalPoint)) {
				this.#resetCoords();
			}
		}
	}

	protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
		super.firstUpdated(_changedProperties);

		this.style.setProperty('--dot-radius', `${this.#DOT_RADIUS}px`);
		this.#setFocalPointStyle(this.focalPoint.left, this.focalPoint.top);

		this.imageElement.onload = () => {
			const imageAspectRatio = this.imageElement.naturalWidth / this.imageElement.naturalHeight;

			if (imageAspectRatio > 1) {
				this.imageElement.style.width = '100%';
				this.wrapperElement.style.width = '100%';
			} else {
				this.imageElement.style.height = '100%';
				this.wrapperElement.style.height = '100%';
			}

			this.#resetCoords();

			this.imageElement.style.aspectRatio = `${imageAspectRatio}`;
			this.wrapperElement.style.aspectRatio = `${imageAspectRatio}`;
		};
	}

	async #addEventListeners() {
		await this.updateComplete; // Wait for the @query to be resolved
	}

	#removeEventListeners() {

	}

	#setFocalPoint(x: number, y: number) {

		const grid = this.wrapperElement;
		const { width, height } = grid.getBoundingClientRect();

		const left = clamp((x / width), 0, 1);
		const top = clamp((y / height), 0, 1);

		this.#setFocalPointStyle(left, top);

		this.dispatchEvent(
			new CustomEvent('change', {
				detail: { left, top },
				bubbles: true,
				composed: true,
			}),
		);
	}

	#setFocalPointStyle(left: number, top: number) {
		this.focalPointElement.style.left = `calc(${left * 100}% - ${this.#DOT_RADIUS}px)`;
		this.focalPointElement.style.top = `calc(${top * 100}% - ${this.#DOT_RADIUS}px)`;
	}

	#isCentered(focalPoint: UmbImageCropperFocalPoint) {
		return focalPoint.left === 0.5 && focalPoint.top === 0.5;
	}

	#resetCoords() {
		// Init x and y coords from half of rendered image size, which is equavalient to focal point { left: 0.5, top: 0.5 }.
		this.coords.x = this.imageElement.clientWidth / 2;
		this.coords.y = this.imageElement.clientHeight / 2;
	}

	#handleGridDrag(event: PointerEvent) {
		if (this.disabled) return;

		const grid = this.wrapperElement;
		const handle = this.focalPointElement;

		handle.focus();
		event.preventDefault();
		event.stopPropagation();

		this.isDraggingGridHandle = true;

		drag(grid, {
			onMove: (x, y) => {
				// check if coordinates are not NaN (can happen when dragging outside of the grid)
				if (isNaN(x) || isNaN(y)) return;

				this.coords.x = x;
				this.coords.y = y;

				this.#setFocalPoint(x, y);
			},
			onStop: () => (this.isDraggingGridHandle = false),
			initialEvent: event,
		});
	}

	#handleGridKeyDown(event: KeyboardEvent) {
		if (this.disabled) return;
		const increment = event.shiftKey ? 1 : 10;

		const grid = this.wrapperElement;
		const { width, height } = grid.getBoundingClientRect();

		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			this.coords.x = clamp(this.coords.x - increment, 0, width);
			this.#setFocalPoint(this.coords.x, this.coords.y);
		}

		if (event.key === 'ArrowRight') {
			event.preventDefault();
			this.coords.x = clamp(this.coords.x + increment, 0, width);
			this.#setFocalPoint(this.coords.x, this.coords.y);
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();
			this.coords.y = clamp(this.coords.y - increment, 0, height);
			this.#setFocalPoint(this.coords.x, this.coords.y);
		}

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			this.coords.y = clamp(this.coords.y + increment, 0, height);
			this.#setFocalPoint(this.coords.x, this.coords.y);
		}
	}

	render() {
		if (!this.src) return nothing;

		return html`
			<div id="wrapper"
				@mousedown=${this.#handleGridDrag}
        		@touchstart=${this.#handleGridDrag}>
				<img id="image" @keydown=${() => nothing} src=${this.src} alt="" />
				<span id="focal-point"
					class=${classMap({
			'focal-point--dragging': this.isDraggingGridHandle,
		})}
					tabindex=${ifDefined(this.disabled ? undefined : '0')}
					aria-label="Focal Point"
					@keydown=${this.#handleGridKeyDown}>
				</span>
			</div>
		`;
	}
	static styles = css`
		:host {
			display: flex;
			width: 100%;
			height: 100%;
			position: relative;
			user-select: none;
			background-color: var(--uui-color-surface);
			outline: 1px solid var(--uui-color-border);
		}
		/* Wrapper is used to make the focal point position responsive to the image size */
		#wrapper {
			position: relative;
			display: flex;
			margin: auto;
			max-width: 100%;
			max-height: 100%;
			box-sizing: border-box;
        	cursor: crosshair;
        	forced-color-adjust: none;
		}
		#image {
			margin: auto;
			position: relative;
		}
		#focal-point {
			content: '';
			display: block;
			position: absolute;
			width: calc(2 * var(--dot-radius));
			height: calc(2 * var(--dot-radius));
			top: 0;
			box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
        	border: solid 2px white;
			border-radius: 50%;
			pointer-events: none;
			background-color: var(--uui-palette-spanish-pink-light);
			transition: 150ms transform;
        	box-sizing: inherit;
		}
		.focal-point--dragging {
			cursor: none;
			transform: scale(1.5);
		}
	`;
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-image-cropper-focus-setter': UmbImageCropperFocusSetterElement;
	}
}
