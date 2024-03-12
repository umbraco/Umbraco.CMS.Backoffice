import { UmbEntityDeselectedEvent } from './entity-deselected.event.js';
import { UmbControllerBase } from '@umbraco-cms/backoffice/class-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbSelectionChangeEvent } from '@umbraco-cms/backoffice/event';
import { UmbArrayState, UmbBooleanState } from '@umbraco-cms/backoffice/observable-api';

export interface UmbEntitySelectModel {
	unique: string | null;
	entityType: string;
}

/**
 * Manages the selection of items.
 * @export
 * @class UmbSelectionManager
 */
export class UmbEntitySelectionManager<
	ValueType extends UmbEntitySelectModel = UmbEntitySelectModel,
> extends UmbControllerBase {
	#selectable = new UmbBooleanState(false);
	public readonly selectable = this.#selectable.asObservable();

	#selection = new UmbArrayState(<Array<ValueType>>[], (x) => x.unique);
	public readonly selection = this.#selection.asObservable();

	#multiple = new UmbBooleanState(false);
	public readonly multiple = this.#multiple.asObservable();

	constructor(host: UmbControllerHost) {
		super(host);
	}

	/**
	 * Returns whether items can be selected.
	 * @return {*}
	 * @memberof UmbSelectionManager
	 */
	public getSelectable() {
		return this.#selectable.getValue();
	}

	/**
	 * Sets whether items can be selected.
	 * @param {boolean} value
	 * @memberof UmbSelectionManager
	 */
	public setSelectable(value: boolean) {
		this.#selectable.setValue(value);
	}

	/**
	 * Returns the current selection.
	 * @return {*}
	 * @memberof UmbSelectionManager
	 */
	public getSelection() {
		return this.#selection.getValue();
	}

	/**
	 * Sets the current selection.
	 * @param {Array<ValueType>} items
	 * @memberof UmbSelectionManager
	 */
	public setSelection(items: Array<ValueType>) {
		if (this.getSelectable() === false) return;
		if (items === undefined) throw new Error('Value cannot be undefined');
		const newSelection = this.getMultiple() ? items : items.slice(0, 1);
		this.#selection.setValue(newSelection);
	}

	/**
	 * Returns whether multiple items can be selected.
	 * @return {*}
	 * @memberof UmbSelectionManager
	 */
	public getMultiple() {
		return this.#multiple.getValue();
	}

	/**
	 * Sets whether multiple items can be selected.
	 * @param {boolean} value
	 * @memberof UmbSelectionManager
	 */
	public setMultiple(value: boolean) {
		this.#multiple.setValue(value);

		/* If multiple is set to false, and the current selection is more than one,
		then we need to set the selection to the first item. */
		if (value === false && this.getSelection().length > 1) {
			const first = this.getSelection()[0];
			this.clearSelection();
			this.select(first);
		}
	}

	/**
	 * Toggles the given unique id in the current selection.
	 * @param {(ValueType)} item
	 * @memberof UmbSelectionManager
	 */
	public toggleSelect(item: ValueType) {
		if (this.getSelectable() === false) return;
		this.isSelected(item) ? this.deselect(item) : this.select(item);
	}

	/**
	 * Appends the given unique id to the current selection.
	 * @param {(ValueType)} item
	 * @memberof UmbSelectionManager
	 */
	public select(item: ValueType) {
		if (this.getSelectable() === false) return;
		if (this.isSelected(item)) return;
		const newSelection = this.getMultiple() ? [...this.getSelection(), item] : [item];
		this.#selection.setValue(newSelection);
		this.getHostElement().dispatchEvent(new UmbEntityDeselectedEvent(item));
		this.getHostElement().dispatchEvent(new UmbSelectionChangeEvent());
	}

	/**
	 * Removes the given unique id from the current selection.
	 * @param {(ValueType)} item
	 * @memberof UmbSelectionManager
	 */
	public deselect(item: ValueType) {
		if (this.getSelectable() === false) return;
		const newSelection = this.getSelection().filter((x) => x !== item);
		this.#selection.setValue(newSelection);
		this.getHostElement().dispatchEvent(new UmbEntityDeselectedEvent(item));
		this.getHostElement().dispatchEvent(new UmbSelectionChangeEvent());
	}

	/**
	 * Returns true if the given unique id is selected.
	 * @param {(ValueType)} unique
	 * @return {*}
	 * @memberof UmbSelectionManager
	 */
	public isSelected(unique: ValueType) {
		return this.getSelection().includes(unique);
	}

	/**
	 * Clears the current selection.
	 * @memberof UmbSelectionManager
	 */
	public clearSelection() {
		if (this.getSelectable() === false) return;
		this.#selection.setValue([]);
	}
}
