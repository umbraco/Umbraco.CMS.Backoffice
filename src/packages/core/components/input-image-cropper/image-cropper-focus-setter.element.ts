//import { clamp } from './mathUtils.js';
import { drag, clamp } from '@umbraco-ui/uui-base/lib/utils';
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
			this.focalPointElement.style.left = `calc(${this.focalPoint.left * 100}% - ${this.#DOT_RADIUS}px)`;
			this.focalPointElement.style.top = `calc(${this.focalPoint.top * 100}% - ${this.#DOT_RADIUS}px)`;
		}
	}

	protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
		super.firstUpdated(_changedProperties);

		this.style.setProperty('--dot-radius', `${this.#DOT_RADIUS}px`);
		this.focalPointElement.style.left = `calc(${this.focalPoint.left * 100}% - ${this.#DOT_RADIUS}px)`;
		this.focalPointElement.style.top = `calc(${this.focalPoint.top * 100}% - ${this.#DOT_RADIUS}px)`;

		this.imageElement.onload = () => {
			const imageAspectRatio = this.imageElement.naturalWidth / this.imageElement.naturalHeight;

			if (imageAspectRatio > 1) {
				this.imageElement.style.width = '100%';
				this.wrapperElement.style.width = '100%';
			} else {
				this.imageElement.style.height = '100%';
				this.wrapperElement.style.height = '100%';
			}

			this.imageElement.style.aspectRatio = `${imageAspectRatio}`;
			this.wrapperElement.style.aspectRatio = `${imageAspectRatio}`;
		};
	}

	async #addEventListeners() {
		await this.updateComplete; // Wait for the @query to be resolved
		//this.imageElement?.addEventListener('mousedown', this.#onStartDrag);
		//window.addEventListener('mouseup', this.#onEndDrag);
	}

	#removeEventListeners() {
		//this.imageElement?.removeEventListener('mousedown', this.#onStartDrag);
		//window.removeEventListener('mouseup', this.#onEndDrag);
	}

	/*#onStartDrag = (event: MouseEvent) => {
		event.preventDefault();
		window.addEventListener('mousemove', this.#onDrag);
	};

	#onEndDrag = (event: MouseEvent) => {
		event.preventDefault();
		window.removeEventListener('mousemove', this.#onDrag);
	};

	#onDrag = (event: MouseEvent) => {
		event.preventDefault();
		this.#onSetFocalPoint(event);
	};*/

	/*#onSetFocalPoint(event: MouseEvent) {
		event.preventDefault();

		const image = this.imageElement.getBoundingClientRect();

		const x = clamp(event.clientX - image.left, 0, image.width);
		const y = clamp(event.clientY - image.top, 0, image.height);

		const left = clamp(x / image.width, 0, 1);
		const top = clamp(y / image.height, 0, 1);

		this.focalPointElement.style.left = `calc(${left * 100}% - ${this.#DOT_RADIUS}px)`;
		this.focalPointElement.style.top = `calc(${top * 100}% - ${this.#DOT_RADIUS}px)`;

		this.dispatchEvent(
			new CustomEvent('change', {
				detail: { left, top },
				bubbles: true,
				composed: true,
			}),
		);
	}*/

	#setFocalPoint(x: number, y: number, width: number, height: number) {
		//const image = this.imageElement.getBoundingClientRect();

		//const x = clamp(event.clientX - image.left, 0, image.width);
		//const y = clamp(event.clientY - image.top, 0, image.height);

		//const left = clamp((x / width) * 100, 0, 100);
		//const top = clamp(100 - (y / height) * 100, 0, 100);
		const left = clamp((x / width), 0, 1);
		const top = clamp((y / height), 0, 1);

		this.focalPointElement.style.left = `calc(${left * 100}% - ${this.#DOT_RADIUS}px)`;
		this.focalPointElement.style.top = `calc(${top * 100}% - ${this.#DOT_RADIUS}px)`;

		this.dispatchEvent(
			new CustomEvent('change', {
				detail: { left, top },
				bubbles: true,
				composed: true,
			}),
		);
	}

	#handleGridDrag(event: PointerEvent) {
		if (this.disabled) return;
		const grid = this.wrapperElement; //this.shadowRoot!.querySelector<HTMLElement>('.color-area')!;
		const handle = this.focalPointElement; //grid.querySelector<HTMLElement>('.color-area__handle')!;
		const { width, height } = grid.getBoundingClientRect();
	
		handle.focus();
		event.preventDefault();
		event.stopPropagation();
	
		this.isDraggingGridHandle = true;
	
		drag(grid, {
		  onMove: (x, y) => {
			// check if coordinates are not NaN (can happen when dragging outside of the grid)
			if (isNaN(x) || isNaN(y)) return;

			this.#setFocalPoint(x, y, width, height);
			
		  },
		  onStop: () => (this.isDraggingGridHandle = false),
		  initialEvent: event,
		});
	  }
	
	  #handleGridKeyDown(event: KeyboardEvent) {
		if (this.disabled) return;
		const increment = event.shiftKey ? 10 : 1;
	
		if (event.key === 'ArrowLeft') {
		  event.preventDefault();
		  // Update focal point left position
		}
	
		if (event.key === 'ArrowRight') {
		  event.preventDefault();
		  // Update focal point left position
		}
	
		if (event.key === 'ArrowUp') {
		  event.preventDefault();
		  // Update focal point top position
		}
	
		if (event.key === 'ArrowDown') {
		  event.preventDefault();
		  // Update focal point top position
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
