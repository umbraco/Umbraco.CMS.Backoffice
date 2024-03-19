import { html, property } from '@umbraco-cms/backoffice/external/lit';
import type { UUIModalSidebarSize } from '@umbraco-cms/backoffice/external/uui';
import type { UmbModalToken, UmbModalType, UmbPickerModalValue } from '@umbraco-cms/backoffice/modal';
import { UMB_MODAL_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/modal';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

/** TODO: Make use of UUI FORM Mixin, to make it easily take part of a form. */
export class UmbInputListBaseElement extends UmbLitElement {
	@property({ type: Array })
	public value: Array<string> = [];

	@property({ type: Boolean })
	public multiple = true;

	@property({ type: String })
	public modalType: UmbModalType = 'sidebar';

	@property({ type: String })
	public modalSize: UUIModalSidebarSize = 'small';

	// TODO: not great that we use any, any here. Investigate if we can have some interface or base modal token for this type.
	protected pickerToken?: UmbModalToken<any, any>;

	async #openPicker() {
		if (!this.pickerToken) return;

		const modalManager = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
		const modalContext = modalManager.open(this, this.pickerToken, {
			data: {
				multiple: this.multiple,
				selection: this.value,
			},
		});

		modalContext?.onSubmit().then((data: UmbPickerModalValue) => {
			if (data) {
				this.value = data.selection?.filter((id) => id !== null && id !== undefined) as Array<string>;
				this.selectionUpdated();
			}
		});
	}

	protected removeFromSelection(id?: string | null) {
		this.value = this.value.filter((k) => k !== id);
		this.selectionUpdated();
	}

	protected selectionUpdated() {
		// override this method to react to selection changes
	}

	protected renderButton() {
		return html`<uui-button id="add-button" look="placeholder" @click=${this.#openPicker} label="open">
			${this.localize.term('general_add')}
		</uui-button>`;
	}
	protected renderContent() {
		return html``;
	}

	render() {
		return html`${this.renderContent()}${this.renderButton()}`;
	}
}
