import { UmbData } from './data';
import type { UmbEntityBase } from '@umbraco-cms/backoffice/models';

// Temp mocked database
export class UmbEntityData<T extends UmbEntityBase> extends UmbData<T> {
	constructor(data: Array<T>) {
		super(data);
	}

	getList(skip: number, take: number) {
		return this.data.slice(skip, skip + take);
	}

	getById(id: string) {
		return this.data.find((item) => item.id === id);
	}

	getByIds(ids: Array<string>) {
		return this.data.filter((item) => {
			if (!item.id) throw new Error('Item has no id');
			ids.includes(item.id);
		});
	}

	insert(item: T) {
		const exits = this.data.find((i) => i.id === item.id);

		if (exits) {
			throw new Error(`Item with key ${item.id} already exists`);
		}

		this.data.push(item);
	}

	save(saveItem: T) {
		const foundIndex = this.data.findIndex((item) => item.id === saveItem.id);
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

	trash(ids: Array<string>) {
		const trashedItems: Array<T> = [];

		ids.forEach((id) => {
			const item = this.getById(id);
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

	delete(ids: Array<string>) {
		const deletedKeys = this.data
			.filter((item) => {
				if (!item.id) throw new Error('Item has no id');
				ids.includes(item.id);
			})
			.map((item) => item.id);

		this.data = this.data.filter((item) => {
			if (!item.id) throw new Error('Item has no id');
			ids.indexOf(item.id) === -1;
		});

		return deletedKeys;
	}

	updateData(updateItem: T) {
		const itemIndex = this.data.findIndex((item) => item.id === updateItem.id);
		const item = this.data[itemIndex];
		if (!item) return;

		// TODO: revisit this code, seems like something we can solve smarter/type safer now:
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
