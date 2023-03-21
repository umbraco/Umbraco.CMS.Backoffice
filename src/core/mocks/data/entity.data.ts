import { UmbData } from './data';
import type { Entity } from '@umbraco-cms/models';

// Temp mocked database
export class UmbEntityData<T extends Entity> extends UmbData<T> {
	constructor(data: Array<T>) {
		super(data);
	}

	getList(skip: number, take: number) {
		return this.data.slice(skip, skip + take);
	}

	getByKey(key: string) {
		return this.data.find((item) => item.key === key);
	}

	getByKeys(keys: Array<string>) {
		return this.data.filter((item) => keys.includes(item.key));
	}

	save(saveItem: T) {
		const foundIndex = this.data.findIndex((item) => item.key === saveItem.key);
		if (foundIndex !== -1) {
			// update
			this.data[foundIndex] = saveItem;
			this.updateData(saveItem);
		} else {
			// new
			this.data.push(saveItem);
		}

		return saveItem;
	}

	move(keys: Array<string>, destinationKey: string) {
		const items = this.getByKeys(keys);
		const movedItems = items.map((item) => {
			return {
				...item,
				parentKey: destinationKey,
			};
		});

		movedItems.forEach((movedItem) => this.updateData(movedItem));
		return movedItems;
	}

	trash(keys: Array<string>) {
		const trashedItems: Array<T> = [];

		keys.forEach((key) => {
			const item = this.getByKey(key);
			if (!item) return;

			// TODO: how do we handle trashed items?
			// TODO: remove ignore when we know how to handle trashed items.
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			item.isTrashed = true;
			this.updateData(item);
			trashedItems.push(item);
		});

		return trashedItems;
	}

	delete(keys: Array<string>) {
		const deletedKeys = this.data.filter((item) => keys.includes(item.key)).map((item) => item.key);
		this.data = this.data.filter((item) => keys.indexOf(item.key) === -1);
		return deletedKeys;
	}

	protected updateData(updateItem: T) {
		const itemIndex = this.data.findIndex((item) => item.key === updateItem.key);
		const item = this.data[itemIndex];
		if (!item) return;

		const itemKeys = Object.keys(item);
		const newItem = {};

		for (const [key] of Object.entries(updateItem)) {
			if (itemKeys.indexOf(key) !== -1) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				newItem[key] = updateItem[key];
			}
		}

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		this.data[itemIndex] = newItem;
	}
}
