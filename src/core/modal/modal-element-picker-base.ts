import { property } from 'lit/decorators.js';
import { UmbModalBaseElement } from './modal-element.element';
import { UmbPickerModalData, UmbPickerModalResult } from '@umbraco-cms/backoffice/modal';

// TODO: we should consider moving this into a class/context instead of an element.
// So we don't have to extend an element to get basic picker/selection logic
export class UmbModalElementPickerBase<T> extends UmbModalBaseElement<UmbPickerModalData<T>, UmbPickerModalResult> {
	@property()
	selection: Array<string> = [];

	connectedCallback(): void {
		super.connectedCallback();
		this.selection = this.data?.selection || [];
	}

	submit() {
		this.modalHandler?.submit({ selection: this.selection });
	}

	close() {
		this.modalHandler?.reject();
	}

	protected _handleKeydown(e: KeyboardEvent, key: string) {
		if (e.key === 'Enter') {
			this.handleSelection(key);
		}
	}

	/* TODO: Write test for this select/deselect method. */
	handleSelection(id: string | undefined) {
		if (!id) throw new Error('No key provided');

		if (this.data?.multiple) {
			if (this.isSelected(id)) {
				this.selection = this.selection.filter((selectedKey) => selectedKey !== id);
			} else {
				this.selection.push(id);
			}
		} else {
			this.selection = [id];
		}

		this.requestUpdate('_selection');
	}

	isSelected(key: string): boolean {
		return this.selection.includes(key);
	}
}
