import { UmbUserCollectionRepository } from '../../collection/repository/user-collection.repository.js';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement, state, ifDefined, PropertyValueMap } from '@umbraco-cms/backoffice/external/lit';
import { UmbUserPickerModalData, UmbUserPickerModalValue, UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';
import { UmbSelectionManager } from '@umbraco-cms/backoffice/utils';
import { UserItemResponseModel } from '@umbraco-cms/backoffice/backend-api';

@customElement('umb-user-picker-modal')
export class UmbUserPickerModalElement extends UmbModalBaseElement<UmbUserPickerModalData, UmbUserPickerModalValue> {
	@state()
	private _users: Array<UserItemResponseModel> = [];

	#selectionManager = new UmbSelectionManager(this);
	#userCollectionRepository = new UmbUserCollectionRepository(this);

	connectedCallback(): void {
		super.connectedCallback();

		// TODO: in theory this config could change during the lifetime of the modal, so we could observe it
		this.#selectionManager.setMultiple(this.data?.multiple ?? false);
		this.#selectionManager.setSelection(this.value?.selection ?? []);
	}

	protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
		super.firstUpdated(_changedProperties);
		this.#requestUsers();
	}

	async #requestUsers() {
		if (!this.#userCollectionRepository) return;
		const { data } = await this.#userCollectionRepository.requestCollection();

		if (data) {
			this._users = data.items;
		}
	}

	#submit() {
		this.value = { selection: this.#selectionManager.getSelection() };
		this.modalContext?.submit();
	}

	#close() {
		this.modalContext?.reject();
	}

	render() {
		return html`
			<umb-body-layout headline="Select Users">
				<uui-box>
					${this._users.map(
						(user) => html`
							<uui-menu-item
								label=${ifDefined(user.name)}
								selectable
								@selected=${() => this.#selectionManager.select(user.id!)}
								@deselected=${() => this.#selectionManager.deselect(user.id!)}
								?selected=${this.#selectionManager.isSelected(user.id!)}>
								<uui-avatar slot="icon" name=${ifDefined(user.name)}></uui-avatar>
							</uui-menu-item>
						`,
					)}
				</uui-box>
				<div slot="actions">
					<uui-button label="Close" @click=${this.#close}></uui-button>
					<uui-button label="Submit" look="primary" color="positive" @click=${this.#submit}></uui-button>
				</div>
			</umb-body-layout>
		`;
	}

	static styles = [
		UmbTextStyles,
		css`
			uui-avatar {
				border: 2px solid var(--uui-color-surface);
				font-size: 12px;
			}
		`,
	];
}

export default UmbUserPickerModalElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-user-picker-modal': UmbUserPickerModalElement;
	}
}
