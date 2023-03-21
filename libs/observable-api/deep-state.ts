import { BehaviorSubject } from 'rxjs';
import { createObservablePart } from './create-observable-part.function';
import { deepFreeze } from './deep-freeze.function';
import type { MappingFunction } from './mapping-function';
import type { MemoizationFunction } from './memoization-function';
import { naiveObjectComparison } from './naive-object-comparison';

/**
 * @export
 * @class DeepState
 * @extends {BehaviorSubject<T>}
 * @description - A RxJS BehaviorSubject which deepFreezes the data to ensure its not manipulated from any implementations.
 * Additionally the Subject ensures the data is unique, not updating any Observes unless there is an actual change of the content.
 */
export class DeepState<T> extends BehaviorSubject<T> {
	constructor(initialData: T) {
		super(deepFreeze(initialData));
	}

	getObservablePart<ReturnType>(
		mappingFunction: MappingFunction<T, ReturnType>,
		memoizationFunction?: MemoizationFunction<ReturnType>
	) {
		return createObservablePart(this, mappingFunction, memoizationFunction);
	}

	next(newData: T): void {
		const frozenData = deepFreeze(newData);
		// Only update data if its different than current data.
		if (!naiveObjectComparison(frozenData, this.getValue())) {
			super.next(frozenData);
		}
	}
}
