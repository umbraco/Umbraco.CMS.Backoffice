import { css, html, nothing, customElement, property, query } from '@umbraco-cms/backoffice/external/lit';
import type { UUIInputElement, UUIInputEvent } from '@umbraco-cms/backoffice/external/uui';
import { UUIFormControlMixin } from '@umbraco-cms/backoffice/external/uui';
import { umbConfirmModal } from '@umbraco-cms/backoffice/modal';
import { UmbChangeEvent, UmbInputEvent, UmbDeleteEvent } from '@umbraco-cms/backoffice/event';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

/**
 * @element umb-input-multiple-text-string-item
 */
@customElement('umb-input-multiple-text-string-item')
export class UmbInputMultipleTextStringItemElement extends UUIFormControlMixin(UmbLitElement, '') {
	/**
	 * Disables the input
	 * @type {boolean}
	 * @attr
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	disabled = false;

	/**
	 * Disables the input
	 * @type {boolean}
	 * @attr
	 * @default false
	 */
	@property({ type: Boolean, reflect: true })
	readonly = false;

	@query('#input')
	protected _input?: UUIInputElement;

	async #onDelete() {
		await umbConfirmModal(this, {
			headline: `Delete ${this.value || 'item'}`,
			content: 'Are you sure you want to delete this item?',
			color: 'danger',
			confirmLabel: 'Delete',
		});

		this.dispatchEvent(new UmbDeleteEvent());
	}

	#onInput(event: UUIInputEvent) {
		event.stopPropagation();
		const target = event.currentTarget as UUIInputElement;
		this.value = target.value as string;
		this.dispatchEvent(new UmbInputEvent());
	}

	#onChange(event: UUIInputEvent) {
		event.stopPropagation();
		const target = event.currentTarget as UUIInputElement;
		this.value = target.value as string;
		this.dispatchEvent(new UmbChangeEvent());
	}

	// Prevent valid events from bubbling outside the message element
	#onValid(event: any) {
		event.stopPropagation();
	}

	// Prevent invalid events from bubbling outside the message element
	#onInvalid(event: any) {
		event.stopPropagation();
	}

	public async focus() {
		await this.updateComplete;
		this._input?.focus();
	}

	protected getFormElement() {
		return undefined;
	}

	render() {
		return html`
			${this.disabled || this.readonly ? nothing : html`<uui-icon name="icon-navigation"></uui-icon>`}
			<uui-form-validation-message id="validation-message" @invalid=${this.#onInvalid} @valid=${this.#onValid}>
				<uui-input
					id="input"
					label="Value"
					value="${this.value}"
					@input="${this.#onInput}"
					@change="${this.#onChange}"
					?disabled=${this.disabled}
					?readonly=${this.readonly}
					required="${this.required}"
					required-message="Value is missing"></uui-input>
			</uui-form-validation-message>

			${this.readonly
				? nothing
				: html`<uui-button
						label="Delete ${this.value}"
						look="primary"
						color="danger"
						@click="${this.#onDelete}"
						?disabled=${this.disabled}
						compact>
						<uui-icon name="icon-trash"></uui-icon>
					</uui-button>`}
		`;
	}

	static styles = [
		css`
			:host {
				display: flex;
				align-items: center;
				margin-bottom: var(--uui-size-space-3);
				gap: var(--uui-size-space-3);
			}

			#validation-message {
				flex: 1;
			}

			#input {
				width: 100%;
			}
		`,
	];
}

export default UmbInputMultipleTextStringItemElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-input-multiple-text-string-item': UmbInputMultipleTextStringItemElement;
	}
}
